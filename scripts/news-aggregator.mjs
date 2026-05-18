#!/usr/bin/env node
// scripts/news-aggregator.mjs
//
// Daily racing news aggregator. Runs from
// .github/workflows/daily-news-aggregator.yml at 8am ET (12:00 UTC) plus
// manual workflow_dispatch. Fetches ~12 publisher RSS feeds, scores by
// recency + source tier + headline keywords, enforces series diversity,
// extracts og:image previews, and opens (or updates) an `auto/news-*`
// pull request proposing new values for HOMEPAGE_ARTICLES (8) +
// HOMEPAGE_ALTERNATES (4) in js/home.js.
//
// CARDINAL RULE: this script never invents data and never commits to main.
// Every headline + URL + date comes verbatim from the publisher's RSS feed;
// the aggregator NEVER paraphrases. The merge is the user's call.
//
// Modes (via env vars):
//   TEST_MODE=true  → write to scripts/.news-test-pr-marker.md only, open a
//                     [TEST] PR clearly labeled DO NOT MERGE.
//   DRY_RUN=true    → print proposed output to stdout, don't call gh or git
//                     push. Use for local development.
//   (neither)       → real cron / manual real run.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { XMLParser } from 'fast-xml-parser';
import { parse as parseHTML } from 'node-html-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const HOME_PATH = resolve(REPO_ROOT, 'js/home.js');
const TEST_MARKER_PATH = resolve(REPO_ROOT, 'scripts/.news-test-pr-marker.md');

const TEST_MODE = process.env.TEST_MODE === 'true';
const DRY_RUN = process.env.DRY_RUN === 'true';

const USER_AGENT = 'Mozilla/5.0 (compatible; TraxStat-Aggregator/1.0; +https://traxstat.com)';
const FEED_TIMEOUT_MS = 5000;
const OG_TIMEOUT_MS = 5000;
const OG_DELAY_MS = 200;
const FRESHNESS_WINDOW_HOURS = 48;

// ─── feed list ──────────────────────────────────────────────────────────────
// tier:    'official' (1.0) — direct from the series
//          'major'    (0.9) — mainstream sports outlets
//          'specialty'(0.8) — racing-focused brands
//          'niche'    (0.7) — smaller / aggregator sites
// series:  default classification when feed is single-series; multi-series
//          feeds use 'any' and rely on keyword classification.
const FEEDS = [
  { name: 'Formula1.com',          tier: 'official',  series: 'f1',     url: 'https://www.formula1.com/content/fom-website/en/latest/all.xml' },
  { name: 'ESPN F1',               tier: 'major',     series: 'f1',     url: 'https://www.espn.com/espn/rss/f1/news' },
  { name: 'Sky Sports F1',         tier: 'major',     series: 'f1',     url: 'https://www.skysports.com/rss/12433' },
  { name: 'Autosport',             tier: 'specialty', series: 'any',    url: 'https://www.autosport.com/rss/feed/all/' },
  { name: 'The Race',              tier: 'specialty', series: 'any',    url: 'https://the-race.com/feed/' },
  { name: 'Crash.net',             tier: 'specialty', series: 'any',    url: 'https://www.crash.net/rss' },
  { name: 'RacingNews365',         tier: 'specialty', series: 'f1',     url: 'https://www.racingnews365.com/feed/news.xml' },
  { name: 'Motorsport.com NASCAR', tier: 'specialty', series: 'nascar', url: 'https://www.motorsport.com/rss/nascar-cup/news/' },
  { name: 'Motorsport.com',        tier: 'specialty', series: 'any',    url: 'https://www.motorsport.com/rss/all/news/' },
  { name: 'Racer',                 tier: 'specialty', series: 'any',    url: 'https://racer.com/feed/' },
  { name: 'DailySportsCar',        tier: 'niche',     series: 'wec',    url: 'https://www.dailysportscar.com/feed/' },
  { name: 'Sportscar365',          tier: 'niche',     series: 'wec',    url: 'https://www.sportscar365.com/feed/' },
];

const TIER_WEIGHT = { official: 1.0, major: 0.9, specialty: 0.8, niche: 0.7 };

// Series keyword classification. Used as a fallback when no priority override
// fires. Order matters here — the loop returns the first match. F1 is checked
// last on purpose: "grand prix" appears in MotoGP / Indy headlines too.
const SERIES_KEYWORDS = {
  n24:     ['nürburgring 24', 'nurburgring 24', 'nordschleife 24', '24h nürburgring', '24h nurburgring'],
  motogp:  ['motogp', 'moto2', 'moto3', 'marc marquez', 'francesco bagnaia', 'jorge martin', 'bagnaia', 'di giannantonio', 'zarco', 'fabio quartararo', 'aleix espargar', 'binder'],
  indycar: ['indycar', 'indy 500', 'indianapolis 500', 'scott dixon', 'colton herta', 'alex palou', 'pato o\'ward', 'palou'],
  wec:     ['wec', 'world endurance', 'le mans', 'hypercar', 'lmgt3', 'lmp2', 'imsa', 'daytona 24', 'sebring 12', 'fia wec'],
  wrc:     ['wrc', 'world rally championship', 'rally finland', 'rally sweden', 'sebastien ogier', 'kalle rovanperä', 'kalle rovanpera', 'thierry neuville'],
  nascar:  ['nascar', 'cup series', 'xfinity series', 'truck series', 'daytona', 'talladega', 'martinsville', 'bristol', 'darlington', 'kyle larson', 'denny hamlin', 'chase elliott', 'tyler reddick', 'william byron', 'kyle busch', 'bubba wallace', 'joey logano', 'hendrick motorsports', 'joe gibbs racing', '23xi racing', 'team penske', 'coca-cola 600', 'all-star race'],
  f1:      ['formula 1', 'formula one', 'f1 grand prix', ' f1 ', 'verstappen', 'lewis hamilton', 'leclerc', 'lando norris', 'piastri', 'george russell', 'antonelli', 'fernando alonso', 'carlos sainz', 'mclaren f1', 'scuderia ferrari', 'mercedes f1', 'red bull racing', 'aston martin f1', 'fia formula 1', 'sprint qualifying', 'monza', 'silverstone', 'spa-francorchamps', 'imola gp', 'monaco gp', 'australian gp', 'canadian gp', 'miami gp', 'austrian gp', 'belgian gp', 'british gp', 'spanish gp', 'dutch gp', 'italian gp', 'singapore gp', 'japanese gp', 'us gp', 'mexican gp', 'sao paulo gp', 'qatar gp', 'abu dhabi gp', 'bahrain gp', 'saudi arabian gp', 'chinese gp'],
};

// Strong priority overrides. When any of these substrings appear in the
// headline+description, force the classification regardless of feed default
// or keyword order. Catches the common confusion modes: MotoGP / Formula E /
// WorldSBK / NHRA articles from F1-flagged or multi-series feeds.
function priorityOverrideSeries(hay) {
  if (hay.includes('motogp') || hay.includes('moto2') || hay.includes('moto3')) return 'motogp';
  if (hay.includes('worldsbk') || hay.includes('world superbike')) return 'other';
  if (hay.includes('formula e') || hay.includes('formula-e') || hay.includes('e-prix') || hay.includes('eprix')) return 'other';
  if (hay.includes('nhra ') || hay.includes(' nhra')) return 'other';
  if (hay.includes('wrc ') || hay.includes(' wrc') || hay.includes('world rally championship')) return 'wrc';
  if (hay.includes('nürburgring 24') || hay.includes('nurburgring 24') || hay.includes('24h nürburgring') || hay.includes('24h nurburgring')) return 'n24';
  if (hay.includes('indianapolis 500') || hay.includes('indy 500') || hay.includes('indycar')) return 'indycar';
  return null;
}

// Headline keyword boosts. High = breaking-news priority; medium = notable.
const KEYWORD_BOOSTS_HIGH = ['penalty', 'disqualif', 'dsq', 'breaking', 'crash', 'fired', 'signs', 'retires', 'retirement', 'banned', 'investigation', 'fia ruling', 'protest', 'red flag', 'wins', 'victory', 'pole', 'fastest lap'];
const KEYWORD_BOOSTS_MED  = ['contract', 'deal', 'championship', 'standings', 'extends', 'upgrade', 'engine', 'team principal', 'announcement', 'returns', 'replaces', 'debut'];

// URL-path blacklist — substring matches reject the item before scoring.
const URL_BLACKLIST = ['/betting/', '/odds/', '/predictions/', '/fantasy/', '/tickets/', '/podcast/', '/forum/', '/horoscope', '/quiz/', '/poll/', '/shop/', '/store/', '/preview/standings', '/schedule-faq'];
// Headline blacklist — case-insensitive substring matches.
const HEADLINE_BLACKLIST = ['sponsored:', 'partner content:', 'live blog:', 'live: ', 'live updates:', 'photos:', 'photo gallery'];

// ─── logging ────────────────────────────────────────────────────────────────
function log(...args) { console.log('[news]', ...args); }
function logErr(...args) { console.error('[news]', ...args); }

// ─── fetch with timeout ─────────────────────────────────────────────────────
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.5' },
      signal: controller.signal,
      redirect: 'follow',
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

// ─── RSS / Atom parsing ─────────────────────────────────────────────────────
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  textNodeName: '#text',
  trimValues: true,
});

function stripHTML(s) {
  if (!s) return '';
  return String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function flat(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return flat(node[0]);
  if (typeof node === 'object') {
    if (node.__cdata) return flat(node.__cdata);
    if (node['#text']) return flat(node['#text']);
    if (node['@_href']) return node['@_href'];
  }
  return '';
}

// JS Date can't parse military-style timezone abbreviations like BST/EST/CDT.
// Map the common ones to numeric offsets so feeds using them (e.g. Sky Sports)
// parse correctly.
const TZ_ABBR_TO_OFFSET = {
  'GMT': '+0000', 'UTC': '+0000', 'BST': '+0100',
  'CET': '+0100', 'CEST': '+0200', 'WET': '+0000', 'WEST': '+0100',
  'EST': '-0500', 'EDT': '-0400', 'CST': '-0600', 'CDT': '-0500',
  'MST': '-0700', 'MDT': '-0600', 'PST': '-0800', 'PDT': '-0700',
  'AEST': '+1000', 'AEDT': '+1100', 'JST': '+0900', 'IST': '+0530',
};
function parseDate(s) {
  if (!s) return null;
  let str = flat(s);
  // Replace trailing 3-4 letter TZ abbreviation with numeric offset.
  const m = str.match(/\s([A-Z]{2,4})\s*$/);
  if (m && TZ_ABBR_TO_OFFSET[m[1]]) {
    str = str.slice(0, m.index) + ' ' + TZ_ABBR_TO_OFFSET[m[1]];
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function parseFeedXML(xml, feed) {
  let parsed;
  try {
    parsed = xmlParser.parse(xml);
  } catch (e) {
    log(`  parse error in ${feed.name}: ${e.message}`);
    return [];
  }
  const items = [];
  // RSS 2.0: rss > channel > item[]
  const rssItems = parsed?.rss?.channel?.item;
  if (rssItems) {
    const arr = Array.isArray(rssItems) ? rssItems : [rssItems];
    for (const it of arr) {
      const title = stripHTML(flat(it.title));
      const link = flat(it.link);
      const pubDate = parseDate(it.pubDate || it['dc:date'] || it.date);
      const description = stripHTML(flat(it.description || it['content:encoded'] || ''));
      const guid = flat(it.guid) || link;
      if (title && link && pubDate) items.push({ title, link, pubDate, description, guid, feed });
    }
    return items;
  }
  // Atom: feed > entry[]
  const atomEntries = parsed?.feed?.entry;
  if (atomEntries) {
    const arr = Array.isArray(atomEntries) ? atomEntries : [atomEntries];
    for (const it of arr) {
      const title = stripHTML(flat(it.title));
      let link = '';
      if (it.link) {
        const lArr = Array.isArray(it.link) ? it.link : [it.link];
        const alt = lArr.find(l => !l['@_rel'] || l['@_rel'] === 'alternate') || lArr[0];
        link = alt?.['@_href'] || flat(alt);
      }
      const pubDate = parseDate(it.published || it.updated);
      const description = stripHTML(flat(it.summary || it.content || ''));
      const guid = flat(it.id) || link;
      if (title && link && pubDate) items.push({ title, link, pubDate, description, guid, feed });
    }
    return items;
  }
  log(`  no items found in ${feed.name} (unknown feed shape)`);
  return [];
}

async function fetchFeed(feed) {
  try {
    const res = await fetchWithTimeout(feed.url, FEED_TIMEOUT_MS);
    if (!res.ok) {
      log(`  ✗ ${feed.name}: HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const items = parseFeedXML(xml, feed);
    log(`  ✓ ${feed.name}: ${items.length} items`);
    return items;
  } catch (e) {
    log(`  ✗ ${feed.name}: ${e.message}`);
    return [];
  }
}

// ─── classification + filtering ─────────────────────────────────────────────
function classifySeries(item) {
  const hay = (item.title + ' ' + item.description).toLowerCase();
  // Priority overrides win even against single-series feed defaults — catches
  // cases like a MotoGP article on RacingNews365 (feed default 'f1').
  const override = priorityOverrideSeries(hay);
  if (override) return override;
  if (item.feed.series !== 'any') return item.feed.series;
  // Multi-series feed: keyword classification, motogp/indycar/wec/wrc/nascar
  // checked before F1 so "grand prix" doesn't false-positive into F1.
  for (const [series, kws] of Object.entries(SERIES_KEYWORDS)) {
    for (const kw of kws) {
      if (hay.includes(kw)) return series;
    }
  }
  return 'other';
}

function isBlacklisted(item) {
  const url = (item.link || '').toLowerCase();
  for (const sub of URL_BLACKLIST) if (url.includes(sub)) return `url:${sub}`;
  const title = (item.title || '').toLowerCase();
  for (const sub of HEADLINE_BLACKLIST) if (title.includes(sub)) return `title:${sub}`;
  if (!item.description) return 'empty-description';
  if (item.description.length < 30) return 'short-description';
  return null;
}

function withinFreshnessWindow(item, nowMs) {
  const age = nowMs - item.pubDate.getTime();
  return age >= 0 && age < FRESHNESS_WINDOW_HOURS * 3600 * 1000;
}

function dedupeByHeadline(items) {
  // Normalise headline: lowercase, strip punctuation, collapse whitespace, then
  // compare first ~80 chars. Keeps the first occurrence (which, after sorting
  // by score later, will be the highest-scoring duplicate).
  const seen = new Map();
  const out = [];
  for (const it of items) {
    const key = it.title.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (seen.has(key)) continue;
    seen.set(key, true);
    out.push(it);
  }
  return out;
}

// ─── scoring ────────────────────────────────────────────────────────────────
function recencyWeight(ageHours) {
  if (ageHours < 6)  return 1.0;
  if (ageHours < 12) return 0.85;
  if (ageHours < 24) return 0.7;
  if (ageHours < 36) return 0.55;
  return 0.4;
}

function keywordBoost(title) {
  const t = title.toLowerCase();
  let boost = 0;
  for (const kw of KEYWORD_BOOSTS_HIGH) if (t.includes(kw)) boost += 0.3;
  for (const kw of KEYWORD_BOOSTS_MED)  if (t.includes(kw)) boost += 0.1;
  return Math.min(boost, 0.6);
}

function scoreItem(item, nowMs) {
  const ageHours = (nowMs - item.pubDate.getTime()) / 3600000;
  const tier = TIER_WEIGHT[item.feed.tier] ?? 0.7;
  return recencyWeight(ageHours) + tier * 0.5 + keywordBoost(item.title);
}

// ─── series diversity quota ─────────────────────────────────────────────────
// Target primary slate of 8: 3 F1, 3 NASCAR, 2 wildcard. If a quota can't be
// filled (e.g. < 3 NASCAR articles in window), spill into wildcard. Alternates
// are 4 top-scored remaining (no quota).
function selectWithDiversity(scored) {
  const primary = [];
  const used = new Set();
  const quota = { f1: 3, nascar: 3, wildcard: 2 };
  const isWild = s => s !== 'f1' && s !== 'nascar';
  // Pass 1: fill F1 and NASCAR slots with their best items.
  for (const item of scored) {
    if (primary.length >= 8) break;
    if (used.has(item.guid)) continue;
    if (item.series === 'f1' && quota.f1 > 0) { primary.push(item); used.add(item.guid); quota.f1--; }
    else if (item.series === 'nascar' && quota.nascar > 0) { primary.push(item); used.add(item.guid); quota.nascar--; }
  }
  // Pass 2: fill wildcard slots with best non-F1, non-NASCAR.
  for (const item of scored) {
    if (primary.length >= 8) break;
    if (used.has(item.guid)) continue;
    if (isWild(item.series) && quota.wildcard > 0) { primary.push(item); used.add(item.guid); quota.wildcard--; }
  }
  // Pass 3: if quotas weren't filled, take next-best regardless of series.
  for (const item of scored) {
    if (primary.length >= 8) break;
    if (used.has(item.guid)) continue;
    primary.push(item); used.add(item.guid);
  }
  // Alternates: top 4 of what's left.
  const alternates = [];
  for (const item of scored) {
    if (alternates.length >= 4) break;
    if (used.has(item.guid)) continue;
    alternates.push(item); used.add(item.guid);
  }
  return { primary, alternates };
}

// ─── og:image extraction ────────────────────────────────────────────────────
async function fetchOgPreview(url) {
  try {
    const res = await fetchWithTimeout(url, OG_TIMEOUT_MS);
    if (!res.ok) return { imageUrl: '', imageCredit: '' };
    const html = await res.text();
    // node-html-parser is fast and tolerant — enough for og:* meta extraction.
    const root = parseHTML(html);
    const metas = root.querySelectorAll('meta');
    const meta = {};
    for (const m of metas) {
      const k = m.getAttribute('property') || m.getAttribute('name');
      const v = m.getAttribute('content');
      if (k && v && !meta[k]) meta[k] = v;
    }
    let imageUrl = meta['og:image'] || meta['og:image:secure_url'] || meta['twitter:image'] || '';
    if (imageUrl && imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
    if (imageUrl && imageUrl.startsWith('/')) {
      try {
        const u = new URL(url);
        imageUrl = u.origin + imageUrl;
      } catch { /* leave as-is */ }
    }
    const imageCredit = (meta['og:image:alt'] || '').trim();
    return { imageUrl: imageUrl.trim(), imageCredit };
  } catch (e) {
    return { imageUrl: '', imageCredit: '' };
  }
}

async function enrichWithImages(items) {
  const out = [];
  for (const item of items) {
    const og = await fetchOgPreview(item.link);
    out.push({ ...item, imageUrl: og.imageUrl, imageCredit: og.imageCredit });
    await new Promise(r => setTimeout(r, OG_DELAY_MS));
  }
  return out;
}

// ─── home.js extraction + serialisation ─────────────────────────────────────
function extractConst(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`);
  const m = src.match(re);
  if (!m) throw new Error(`Constant ${name} not found in home.js`);
  let i = m.index + m[0].length;
  const open = src[i];
  if (open !== '{' && open !== '[') throw new Error(`Expected { or [ after const ${name}=, got ${open}`);
  const close = open === '{' ? '}' : ']';
  let depth = 0, inString = null, escaped = false;
  const start = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (escaped) { escaped = false; continue; }
    if (inString) {
      if (c === '\\') { escaped = true; continue; }
      if (c === inString) inString = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inString = c; continue; }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return { text: src.slice(start, i + 1), start, end: i + 1 };
    }
  }
  throw new Error(`Unterminated literal for ${name}`);
}

function quoteString(s) {
  return "'" + String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

// Truncate excerpt to ~280 chars at a word boundary so the home page rows
// stay scannable.
function truncateExcerpt(s) {
  if (!s) return '';
  if (s.length <= 280) return s;
  const cut = s.slice(0, 280);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 200 ? cut.slice(0, lastSpace) : cut) + '…';
}

function serializeArticle(a, indent = '  ') {
  const ind = indent;
  const ind2 = ind + '  ';
  return `${ind}{
${ind2}id: ${quoteString(a.id)},
${ind2}series: ${quoteString(a.series)},
${ind2}headline: ${quoteString(a.headline)},
${ind2}source: ${quoteString(a.source)},
${ind2}url: ${quoteString(a.url)},
${ind2}publishedAt: ${quoteString(a.publishedAt)},
${ind2}excerpt: ${quoteString(a.excerpt)},
${ind2}imageUrl: ${quoteString(a.imageUrl || '')},
${ind2}imageCredit: ${quoteString(a.imageCredit || '')}
${ind}}`;
}

function serializeArticlesArray(arr) {
  if (!arr.length) return '[]';
  return '[\n' + arr.map(a => serializeArticle(a, '  ')).join(',\n') + '\n]';
}

// ─── shape mapping: scored item → HOMEPAGE_ARTICLES entry ──────────────────
function buildArticleEntry(item, index) {
  return {
    id: `a${index + 1}`,
    // 'other' is a classifier sentinel for series we don't dedicate a tab to
    // (Formula E, WorldSBK, NHRA, etc.). home.js renders it as a neutral
    // muted-grey badge labeled "OTHER" via getSeriesAccentColor fallback.
    series: item.series,
    headline: item.title,
    source: item.feed.name,
    url: item.link,
    publishedAt: item.pubDate.toISOString(),
    excerpt: truncateExcerpt(item.description),
    imageUrl: item.imageUrl || '',
    imageCredit: item.imageCredit || '',
  };
}

// ─── PR body builder ────────────────────────────────────────────────────────
function dateStampUTC() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function tsForBranch() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

function articleAsBullet(a, idx) {
  const img = a.imageUrl ? `\n  <img src="${a.imageUrl}" width="320" alt="${(a.imageCredit || a.headline).replace(/"/g, '&quot;')}">` : '';
  return `${idx + 1}. **[${a.series.toUpperCase()}]** [${a.headline}](${a.url})${img}
   · _${a.source}_ · ${new Date(a.publishedAt).toUTCString()}
   > ${a.excerpt.replace(/\n/g, ' ')}`;
}

function buildRealPRBody(primary, alternates, feedReport) {
  const fetched = new Date().toISOString();
  const primaryList = primary.map((a, i) => articleAsBullet(a, i)).join('\n\n');
  const altList = alternates.length
    ? alternates.map((a, i) => articleAsBullet(a, i)).join('\n\n')
    : '_(none — fewer than 4 alternates met the criteria)_';
  const feedSummary = feedReport.map(f => `- ${f.ok ? '✓' : '✗'} ${f.name} — ${f.count} item${f.count === 1 ? '' : 's'}${f.error ? ` (${f.error})` : ''}`).join('\n');
  return `Daily racing-news refresh for **${dateStampUTC()}** (08:00 ET / 12:00 UTC).

## Proposed primary slate (${primary.length}/8)

${primaryList || '_(none — fewer than 1 article met the criteria)_'}

## Proposed alternates (${alternates.length}/4)

${altList}

## Mobile review — what to do

- **Approve** → tap **Merge pull request**. Site updates within ~30 seconds of merge.
- **Swap one in** → use GitHub mobile's file editor on \`js/home.js\` to move an alternate up into \`HOMEPAGE_ARTICLES\`, then merge.
- **Skip today** → tap **Close pull request** without merging. The current home page articles stay as-is until tomorrow's run.

## How this was built

- **Feeds polled** (12-feed slate, ${feedReport.filter(f => f.ok).length} reachable this run):
${feedSummary}
- **Filters:** last ${FRESHNESS_WINDOW_HOURS}h only · blacklist (betting/odds/podcasts/forums/sponsored) · headline dedupe across feeds.
- **Scoring:** recency × tier (official > major > specialty > niche) × headline-keyword boost.
- **Diversity quota:** target 3 F1 + 3 NASCAR + 2 wildcard for the primary slate; alternates are top remaining.
- **Source attribution:** \`source\` field uses the feed's publisher name verbatim; headlines are the publisher's headline verbatim (no paraphrasing).
- **Images:** og:image extracted from each article URL (5s timeout per fetch); empty string when not available.

Fetched: ${fetched}

## Reviewer checklist

- [ ] **Cardinal rule:** every URL resolves to a real article on the publisher's site (spot-check 1–2).
- [ ] No paraphrased / synthesized headlines — each headline matches the publisher's headline.
- [ ] Series classifications look right (F1 articles tagged \`f1\`, NASCAR articles tagged \`nascar\`, etc.).
- [ ] No betting / odds / fantasy / podcast / forum links slipped through the blacklist.
- [ ] og:image previews aren't broken (open the PR on desktop if mobile renders odd).

_Generated by \`.github/workflows/daily-news-aggregator.yml\` running \`scripts/news-aggregator.mjs\`._
`;
}

function buildTestPRBody(ts) {
  return `**⚠️ TEST PR — DO NOT MERGE.** This PR was created by \`workflow_dispatch\` with \`test_mode=true\` to verify end-to-end PR creation. Close this PR without merging; delete the branch.

To close from your phone: GitHub mobile app → this PR → "Close pull request" → optional "Delete branch".

This PR only touches \`scripts/.news-test-pr-marker.md\` (a no-op marker file). No data, no logic, no styling is affected.

Test timestamp: ${ts}

_Generated by \`.github/workflows/daily-news-aggregator.yml\` running \`scripts/news-aggregator.mjs\` with \`TEST_MODE=true\`._
`;
}

// ─── shell helpers ──────────────────────────────────────────────────────────
function sh(cmd, opts = {}) {
  log(`$ ${cmd}`);
  if (DRY_RUN && !opts.allowInDryRun) return '';
  return execSync(cmd, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...opts,
  });
}

function ghPRListForNews() {
  try {
    const out = execSync(
      `gh pr list --state open --search "head:auto/news-" --json headRefName,number --jq '.[0]'`,
      { cwd: REPO_ROOT, encoding: 'utf8' }
    ).trim();
    if (!out || out === 'null') return null;
    return JSON.parse(out);
  } catch (e) {
    log('gh pr list failed (assuming no existing PR):', e.message);
    return null;
  }
}

// ─── modes ──────────────────────────────────────────────────────────────────
async function runTestMode() {
  const ts = new Date().toISOString();
  const branch = `auto/news-test-${tsForBranch()}-${Date.now()}`;
  const newMarkerContent = `# Daily News Aggregator — Test PR Marker

This file is touched by \`scripts/news-aggregator.mjs\` when invoked with \`TEST_MODE=true\`
(via \`workflow_dispatch\` from the GitHub Actions UI, or locally with the env var set).

It exists only to provide a non-data file the Action can modify to verify
end-to-end PR creation + mobile push notifications without touching the
real homepage article list in \`js/home.js\`.

**Do not merge any PR that touches only this file.** Close it without merging
and delete the branch.

Last test run: ${ts}
`;
  const body = buildTestPRBody(ts);
  const title = `[TEST] news: daily aggregator test PR — DO NOT MERGE`;

  if (DRY_RUN) {
    log('--- DRY_RUN test mode ---');
    log('Would create branch:', branch);
    log('Would write to:', TEST_MARKER_PATH);
    log('Would open PR title:', title);
    log('--- PR body ---');
    console.log(body);
    log('--- end DRY_RUN test mode ---');
    return;
  }

  writeFileSync(TEST_MARKER_PATH, newMarkerContent);
  sh(`git checkout -b ${branch}`);
  sh(`git add scripts/.news-test-pr-marker.md`);
  sh(`git commit -m "test: verify news aggregator auto-PR pipeline (${ts})"`);
  sh(`git push -u origin ${branch}`);
  const tmpDir = mkdtempSync(join(tmpdir(), 'traxstat-news-pr-'));
  const bodyFile = join(tmpDir, 'body.md');
  writeFileSync(bodyFile, body);
  sh(`gh pr create --base main --head ${branch} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(bodyFile)}`);
  log('Test PR opened.');
}

async function runRealMode() {
  const nowMs = Date.now();

  // 1. Fetch all feeds in parallel.
  log('Fetching feeds…');
  const feedResults = await Promise.all(FEEDS.map(async f => {
    const items = await fetchFeed(f);
    return { name: f.name, ok: items.length > 0, count: items.length, items, error: items.length === 0 ? 'no items' : '' };
  }));
  const feedReport = feedResults.map(({ items, ...rest }) => rest);
  const allItems = feedResults.flatMap(r => r.items);
  log(`Total items pre-filter: ${allItems.length}`);

  // 2. Freshness + blacklist + dedupe.
  const fresh = allItems.filter(it => withinFreshnessWindow(it, nowMs));
  log(`After freshness (last ${FRESHNESS_WINDOW_HOURS}h): ${fresh.length}`);
  const cleaned = fresh.filter(it => !isBlacklisted(it));
  log(`After blacklist: ${cleaned.length}`);

  // 3. Classify + score.
  for (const it of cleaned) {
    it.series = classifySeries(it);
    it.score = scoreItem(it, nowMs);
  }
  // Sort by score desc, then dedupe headlines (keeping highest score).
  cleaned.sort((a, b) => b.score - a.score);
  const deduped = dedupeByHeadline(cleaned);
  log(`After dedupe: ${deduped.length}`);

  // 4. If too few, exit clean — do NOT propose a thin/junk PR.
  if (deduped.length < 6) {
    log(`Only ${deduped.length} qualifying articles — exiting clean (no PR).`);
    return;
  }

  // 5. Series diversity selection.
  const { primary, alternates } = selectWithDiversity(deduped);
  log(`Selected: ${primary.length} primary + ${alternates.length} alternates`);
  log(`Primary series mix: ${primary.map(p => p.series).join(', ')}`);

  // 6. Enrich top 12 with og:images.
  log('Fetching og:image previews…');
  const enrichedPrimary = await enrichWithImages(primary);
  const enrichedAlts = await enrichWithImages(alternates);

  // 7. Build new HOMEPAGE_ARTICLES + HOMEPAGE_ALTERNATES.
  const newPrimaryEntries = enrichedPrimary.map((it, i) => buildArticleEntry(it, i));
  const newAltEntries = enrichedAlts.map((it, i) => buildArticleEntry(it, i + 100)); // ids a101.., distinct from primary

  // 8. Patch js/home.js.
  const src = readFileSync(HOME_PATH, 'utf8');
  const articlesSpan = extractConst(src, 'HOMEPAGE_ARTICLES');
  const alternatesSpan = extractConst(src, 'HOMEPAGE_ALTERNATES');
  const newArticlesText = serializeArticlesArray(newPrimaryEntries);
  const newAltText = serializeArticlesArray(newAltEntries);
  const replacements = [
    { span: articlesSpan, newText: newArticlesText },
    { span: alternatesSpan, newText: newAltText },
  ].sort((a, b) => b.span.start - a.span.start);
  let proposed = src;
  for (const { span, newText } of replacements) {
    proposed = proposed.slice(0, span.start) + newText + proposed.slice(span.end);
  }

  if (proposed === src) {
    log('No diff vs current home.js — exiting clean (no PR).');
    return;
  }

  // 9. PR upsert.
  const body = buildRealPRBody(newPrimaryEntries, newAltEntries, feedReport);
  const title = `news: daily article refresh — ${dateStampUTC()}`;

  if (DRY_RUN) {
    log('--- DRY_RUN real mode ---');
    log('PR title:', title);
    log('Proposed home.js size:', proposed.length, '(was', src.length, ')');
    log('--- PR body ---');
    console.log(body);
    log('--- end DRY_RUN real mode ---');
    return;
  }

  const existing = ghPRListForNews();
  let branch;
  if (existing) {
    branch = existing.headRefName;
    log(`Updating existing PR #${existing.number} on branch ${branch}`);
    sh(`git fetch origin ${branch}`);
    sh(`git checkout -B ${branch} origin/${branch}`);
    writeFileSync(HOME_PATH, proposed);
    let changed = true;
    try {
      execSync(`git diff --quiet js/home.js`, { cwd: REPO_ROOT });
      changed = false;
    } catch { /* exit 1 = changes present */ }
    if (!changed) {
      log('Existing PR already matches current proposal — no update needed.');
      return;
    }
    sh(`git add js/home.js`);
    sh(`git commit -m "news: refresh from RSS aggregator ${new Date().toISOString()}"`);
    sh(`git push --force-with-lease origin ${branch}`);
    log(`PR #${existing.number} updated.`);
  } else {
    branch = `auto/news-${tsForBranch()}`;
    log(`Creating new PR on branch ${branch}`);
    sh(`git checkout -b ${branch}`);
    writeFileSync(HOME_PATH, proposed);
    sh(`git add js/home.js`);
    sh(`git commit -m "news: daily article refresh (auto-detected)"`);
    sh(`git push -u origin ${branch}`);
    const tmpDir = mkdtempSync(join(tmpdir(), 'traxstat-news-pr-'));
    const bodyFile = join(tmpDir, 'body.md');
    writeFileSync(bodyFile, body);
    sh(`gh pr create --base main --head ${branch} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(bodyFile)}`);
    log('New PR opened.');
  }
}

// ─── main ───────────────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  log(`TraxStat daily news aggregator  (TEST_MODE=${TEST_MODE} DRY_RUN=${DRY_RUN})`);
  if (TEST_MODE) await runTestMode();
  else await runRealMode();
  log(`Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

main().catch(e => {
  logErr('FATAL', e?.stack ?? e);
  process.exit(1);
});
