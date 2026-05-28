// ── HOME (LANDING PAGE) ──────────────────────────────────────────────────────
// Default landing view for TraxStat — curated motorsport news feed.
// Site boots into HOME (init.js); RACE SCHEDULE is still routable from the
// series bar via switchSeries('schedule').
//
// Sections (top → bottom):
//   1. RECENT WINNERS   — horizontal scroll carousel; one card per series
//                         with completed results (F1 + NASCAR + N24), sorted
//                         most-recent first. HOMEPAGE_FEATURED pins one card
//                         to the leftmost slot.
//   2. CHAMPIONSHIPS    — F1 and NASCAR title leaders + gap to P2.
//   3. NEWS FEED        — 8 article cards from HOMEPAGE_ARTICLES.
//   4. VIDEO HIGHLIGHTS — TODO: Session 5 hook, intentionally not rendered.
//
// Upcoming races live on the RACE SCHEDULE tab only — removed from HOME on
// 2026-05-17 to avoid duplicating that view.
//
// Cardinal rule: featured + championship data read from existing verified
// constants (HARDCODED_RACES, HARDCODED_DRIVER_STANDINGS, NASCAR_CUP_RESULTS,
// NASCAR_CUP_STANDINGS, N24_2026_RESULTS). All 8 article entries below are
// real verified articles — Session 5's daily aggregator will replace/extend
// this list. Never substitute invented real-looking articles.

// ── HOME CONSTANTS ───────────────────────────────────────────────────────────
// HOMEPAGE_FEATURED: null = pure auto carousel. If set to a single
// winner-card payload (same shape getRecentWinnersAcrossAllSeries returns
// per entry), the object is prepended as the leftmost pinned card; the
// auto-derived cards still render after it. Future automation may write here.
const HOMEPAGE_FEATURED = null;

// HOMEPAGE_ARTICLES — 8 real verified articles seeded 2026-05-17. Session 5
// aggregator (.github/workflows/daily-news-aggregator.yml) replaces this list
// daily at 8am ET via PR. Cardinal rule: every entry must have a real,
// verifiable source URL + publication. Never invent headlines or substitute
// fake URLs.
// Shape:
//   { id, series, headline, source, url, publishedAt (ISO Z), excerpt,
//     imageUrl (optional, '' if no og:image), imageCredit (optional) }
// 'series' enum: f1 | nascar | n24 | motogp | wrc | indycar | wec
const HOMEPAGE_ARTICLES = [
  {
    id: 'a1',
    series: 'f1',
    headline: 'Why any 12th team project would face an uphill battle amid BYD rumours',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/why-any-12th-team-project-would-face-an-uphill-battle-amid-byd-rumours/10824934/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-28T15:39:25.000Z',
    excerpt: 'Record team valuations and the sheer complexity involved mean any potential path for Chinese giant BYD to join Formula 1 as a 12th team will be an uphill battle.The Chinese electric automotive giant has set its sights on Formula 1; Stella Li, BYD’s Executive Vice President and…',
    imageUrl: 'https://cdn-2.motorsport.com/images/amp/YP7rlnQ2/s6/lewis-hamilton-ferrari.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'How Mercedes has worked to solve its F1 weakness',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/f1-mercedes-solution-for-the-start-new-software-and-a-modified-clutch-lever-for-antonelli/10824770/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-28T15:12:16.000Z',
    excerpt: 'Mercedes had shown few weaknesses at the start of the season but without a doubt, its race-start performance has been one of them. On several occasions, particularly with Kimi Antonelli, the team had lost positions when the lights went out, to the extent that prior to Canada, it…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/68VWAPx2/s6/lando-norris-mclaren-george-ru.jpg',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: '\'Three second rule\' among reasons F1\'s dropped active aero for Monaco',
    source: 'The Race',
    url: 'https://www.the-race.com/formula-1/why-f1-cars-wont-run-active-aero-in-monaco/',
    publishedAt: '2026-05-28T17:35:29.000Z',
    excerpt: 'Formula 1 drivers will not run active aero over the Monaco Grand Prix weekend, with the FIA deciding that there will be no straight mode zones',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/05/XPB_1349959_HiRes.jpg',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Coca-Cola 600 does mega ratings for Amazon Prime, NASCAR',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/coca-cola-600-does-mega-ratings-for-amazon-prime-nascar-/10824980/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-28T17:52:57.000Z',
    excerpt: 'In the aftermath of the death of Kyle Busch, Prime Video earned its largest NASCAR Cup Series viewership number on Sunday for the Coca-Cola 600 at Charlotte Motor Speedway. According to the Nielsen Big Data + Panel measurement, Sunday averaged 3.06 million viewers, up 12 percent…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/6zoJ3X70/s6/kyle-larson-hendrick-motorspor.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Ricky Stenhouse Jr. to run Kyle Busch NOS scheme in Nashville tribute',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/ricky-stenhouse-jr-to-run-kyle-busch-nos-scheme-in-nashville-tribute/10824894/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-28T14:44:07.000Z',
    excerpt: 'Ricky Stenhouse Jr. and Kyle Busch didn\'t always get along, and they even came to blows at the 2024 All-Star Race. But this weekend, Stenhouse will race a paint scheme in honor of the fallen NASCAR legend.The 2x NASCAR Cup Series died suddenly of pneumonia that progressed into…',
    imageUrl: 'https://cdn-2.motorsport.com/images/amp/6x7Zpy1Y/s6/kyle-busch-no-18-joe-gibbs-rac.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'How to watch NASCAR at Nashville: Weekend schedule, weather, start time, TV',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-cup/news/how-to-watch-nascar-at-nashville-weekend-schedule-weather-start-time-tv/10824994/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-28T20:37:29.000Z',
    excerpt: 'NASCAR is heading to Nashville for the 14th round of the 2026 Cup season. Following a somber race weekend in Charlotte after the tragic passing of Kyle Busch, the NASCAR season continues on, and Nashville will host all three national divisions.Daniel Suarez earned a surprise win…',
    imageUrl: 'https://cdn-2.motorsport.com/images/amp/YpNRLDg0/s6/joey-logano-team-penske-ford-r.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'other',
    headline: 'Jake Dixon doubted full wrist recovery after WorldSBK test crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/wsbk/news/1096294/1/jake-dixon-doubted-full-wrist-recovery-after-worldsbk-test-crash',
    publishedAt: '2026-05-28T16:28:55.000Z',
    excerpt: 'Jake Dixon says his fitness is still “far from 100 per cent” ahead of his debut WorldSBK round this weekend.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/gng_1287627_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'motogp',
    headline: 'Marc Marquez was left \'frozen\' watching Alex\'s Barcelona MotoGP crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/motogp/news/marquez-explains-how-he-experienced-his-brother-alexs-dramatic-accident-while-paralyzed-at-home/10824940/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-28T16:21:08.000Z',
    excerpt: 'Marc Marquez has admitted he was left \'frozen\' by his brother Alex Marquez\'s horrific crash in MotoGP\'s Catalan Grand Prix.Factory Ducati rider Marc Marquez was sidelined from the Barcelona race after suffering a foot injury the previous weekend and getting double surgery that…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/2y7Ax9g6/s6/marc-marquez-ducati-team-2.jpg',
    imageCredit: ''
  }
];

// HOMEPAGE_ALTERNATES — daily aggregator (Session 5) proposes 4 alternates
// alongside the 8 primary articles in HOMEPAGE_ARTICLES. Reviewer can swap
// any primary for an alternate by editing the PR before merge. Same shape
// as HOMEPAGE_ARTICLES entries. Not rendered on the page itself — exists
// purely as a write target for the aggregator.
const HOMEPAGE_ALTERNATES = [
  {
    id: 'a101',
    series: 'motogp',
    headline: 'Jack Miller blames ride-height device for Johann Zarco\'s Barcelona crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/motogp/news/jack-miller-blames-ride-height-device-for-johann-zarcos-barcelona-crash/10824945/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-28T16:14:24.000Z',
    excerpt: 'Jack Miller has blamed ride-height devices for the incident at the Catalan Grand Prix that has put Johann Zarco out of action for several races.The Australian\'s take on the first-corner accident went against the grain of some other riders in the paddock, including Francesco…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/0o5PGW7Y/s6/jack-miller-pramac-racing.jpg',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'other',
    headline: 'TT debutant Daniel Ingham dies after qualifying crash',
    source: 'The Race',
    url: 'https://www.the-race.com/tt/tt-debutant-daniel-ingham-dies-after-qualifying-crash/',
    publishedAt: '2026-05-28T13:45:52.000Z',
    excerpt: 'Organisers of the 2026 Isle of Man TT have announced the death of competitor Daniel Ingham following a qualifying crash',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/05/header_5bd35157.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'wec',
    headline: 'Inside Le Mans\' groundbreaking new Motorsport Museum',
    source: 'Autosport',
    url: 'https://www.autosport.com/general/news/inside-le-mans-groundbreaking-new-motorsport-museum/10824888/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-28T14:18:23.000Z',
    excerpt: 'The Motorsport Museum has opened its doors in Le Mans following a colossal construction project completed within an astonishingly short time frame.For just under a year, the former Le Mans 24 Hours Museum was closed. During this time, walls were moved, 45,000m³ of earth was…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/27NQxOX0/s6/ferrari-f2002-de-michael-schum.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'other',
    headline: 'Isle of Man TT racer Daniel Ingham dies in practice crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/rr/news/1096282/1/rider-dies-following-isle-man-tt-wednesday-practice-crash',
    publishedAt: '2026-05-28T13:38:00.000Z',
    excerpt: 'The Isle of Man TT has sadly confirmed the death of a rider following a crash',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/screenshot-2026-05-28-at-14.39.41.png?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  }
];

// N24 race-end metadata. Not present as a constant in n24.js, but the
// 16–17 May 2026 date is stated in that file's header comment (verified).
// Used by the featured-card path to compare N24's "most recent" date
// against F1 / NASCAR race dates.
const N24_META = { date:'2026-05-17', raceName:'Nürburgring 24 Hours 2026', circuit:'Nordschleife', country:'🇩🇪' };

// ── HOME HELPERS ─────────────────────────────────────────────────────────────
function getSeriesAccentColor(s){
  return s==='f1'      ? 'var(--red)'
       : s==='nascar'  ? 'var(--yellow)'
       : s==='n24'     ? '#c0c0c0'
       : s==='motogp'  ? 'var(--orange)'
       : s==='wrc'     ? '#888'
       : s==='indycar' ? '#37bedd'
       : s==='wec'     ? 'var(--green)'
       : 'var(--muted)';
}

function getSeriesLabel(s){
  const map={f1:'F1',nascar:'NASCAR',n24:'N24',motogp:'MOTOGP',wrc:'WRC',indycar:'INDYCAR',wec:'WEC'};
  return map[s]||s.toUpperCase();
}

function formatRelativeTime(iso){
  const t=new Date(iso).getTime();
  const now=Date.now();
  const diff=now-t;
  if(diff<0)return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const mins=Math.floor(diff/60000);
  if(mins<1)return'just now';
  if(mins<60)return mins===1?'1 minute ago':`${mins} minutes ago`;
  const hrs=Math.floor(mins/60);
  if(hrs<24)return hrs===1?'1 hour ago':`${hrs} hours ago`;
  const days=Math.floor(hrs/24);
  if(days===1)return'yesterday';
  if(days<7)return`${days} days ago`;
  return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

// Returns an array of winner-card payloads, one per series with completed
// results, sorted most-recent first. Sources: HARDCODED_RACES (F1),
// NASCAR_CUP_RESULTS (NASCAR), N24_META.date + N24_2026_RESULTS (N24).
// Each entry has shape:
//   { series, seriesLabel, raceName, circuit, country, date, round,
//     winnerDisplay, winnerSub, winnerColor, podium, ctaTab }
function getRecentWinnersAcrossAllSeries(){
  const out=[];
  // F1
  const f1All=Object.values(HARDCODED_RACES).sort((a,b)=>+b.round-+a.round);
  if(f1All.length){
    const r=f1All[0];
    const w=r.Results[0],p2=r.Results[1],p3=r.Results[2];
    out.push({
      series:'f1',seriesLabel:'F1',
      raceName:r.raceName,
      circuit:r.Circuit?.circuitName||'',
      country:r.Circuit?.Location?.country||'',
      date:r.date,
      round:+r.round,
      winnerDisplay:w?.Driver?.familyName||'—',
      winnerSub:w?.Constructor?.name||'—',
      winnerColor:tc(w?.Constructor?.name),
      podium:[
        p2&&{pos:'P2',name:p2.Driver.familyName,team:p2.Constructor.name},
        p3&&{pos:'P3',name:p3.Driver.familyName,team:p3.Constructor.name},
      ].filter(Boolean),
      ctaTab:'races',
    });
  }
  // NASCAR
  const nascarRounds=Object.keys(NASCAR_CUP_RESULTS).map(Number).sort((a,b)=>b-a);
  if(nascarRounds.length){
    const round=nascarRounds[0];
    const r=NASCAR_CUP_RESULTS[round];
    const sched=NASCAR_CUP_SCHEDULE.find(x=>x.round===round);
    if(sched){
      const drv=NASCAR_CUP_DRIVERS[r.winner]||{};
      const p2=r.p2?{pos:'P2',name:r.p2,team:(NASCAR_CUP_DRIVERS[r.p2]||{}).team||''}:null;
      const p3=r.p3?{pos:'P3',name:r.p3,team:(NASCAR_CUP_DRIVERS[r.p3]||{}).team||''}:null;
      out.push({
        series:'nascar',seriesLabel:'NASCAR',
        raceName:sched.race,
        circuit:sched.track,
        country:sched.country||'🇺🇸',
        date:sched.date,
        round,
        winnerDisplay:r.winner,
        winnerSub:`${drv.team||'—'} · ${drv.mfr||'—'}`,
        winnerColor:nascarMfrColor(drv.mfr),
        podium:[p2,p3].filter(Boolean),
        ctaTab:'races',
      });
    }
  }
  // N24
  if(typeof N24_2026_RESULTS!=='undefined'&&N24_2026_RESULTS.length){
    const t1=N24_2026_RESULTS[0],t2=N24_2026_RESULTS[1],t3=N24_2026_RESULTS[2];
    out.push({
      series:'n24',seriesLabel:'N24',
      raceName:N24_META.raceName,
      circuit:N24_META.circuit,
      country:N24_META.country,
      date:N24_META.date,
      round:null,
      winnerDisplay:`#${t1.car} ${t1.team}`,
      winnerSub:t1.drivers.join(' · '),
      winnerColor:'#c0c0c0',
      podium:[
        {pos:'P2',name:`#${t2.car} ${t2.team}`,team:t2.drivers.join(' · ')},
        {pos:'P3',name:`#${t3.car} ${t3.team}`,team:t3.drivers.join(' · ')},
      ],
      ctaTab:null,
    });
  }
  return out.sort((a,b)=>b.date.localeCompare(a.date));
}

// Returns the carousel feed: pinned card first if HOMEPAGE_FEATURED is set,
// then the auto-derived cards. Cards are de-duplicated by series so a pinned
// override replaces the auto card for that same series rather than doubling.
function getFeaturedFeed(){
  const auto=getRecentWinnersAcrossAllSeries();
  if(!HOMEPAGE_FEATURED)return auto;
  const filtered=auto.filter(c=>c.series!==HOMEPAGE_FEATURED.series);
  return[HOMEPAGE_FEATURED,...filtered];
}

// ── HOME ACTIONS ─────────────────────────────────────────────────────────────
function openHomeFeaturedCard(series){
  const feed=getFeaturedFeed();
  const card=feed.find(c=>c.series===series);
  if(!card)return;
  track('home:featured',{series});
  switchSeries(series);
  if(card.ctaTab){
    if(series==='f1')switchF1Tab(card.ctaTab);
    else if(series==='nascar')switchNascarTab(card.ctaTab);
  }
}

function openHomeChampionship(series){
  track('home:championship',{series});
  switchSeries(series);
  if(series==='f1')switchF1Tab('drivers');
  else if(series==='nascar')switchNascarTab('drivers');
}

function openHomeArticle(id){
  const art=HOMEPAGE_ARTICLES.find(a=>a.id===id);
  if(!art)return;
  track('home:article',{series:art.series,source:art.source});
  window.open(art.url,'_blank','noopener,noreferrer');
}

// ── HOME RENDERERS ───────────────────────────────────────────────────────────
function renderHomeFeaturedCard(f){
  const dateStr=fmtDate(f.date);
  const roundLabel=f.round?` · R${f.round}`:'';
  const accent=getSeriesAccentColor(f.series);
  const podiumHTML=f.podium.map(p=>`
    <div style="display:flex;gap:6px;align-items:baseline;margin-top:3px;">
      <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;min-width:20px;">${p.pos==='P2'?'🥈':'🥉'}</span>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:12px;color:var(--text);">${p.name}</span>
      <span style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);">${p.team}</span>
    </div>`).join('');
  return`<div class="home-featured-card" onclick="openHomeFeaturedCard('${f.series}')">
    <div class="home-featured-tag" style="color:${accent};border-color:${accent};">⬤ ${f.seriesLabel}${roundLabel} · ${dateStr}</div>
    <div class="home-featured-title">${f.country} ${f.raceName.toUpperCase()}</div>
    <div class="home-featured-circuit">${f.circuit}</div>
    <div class="home-featured-winner-label">🏆 WINNER</div>
    <div class="home-featured-winner" style="color:${f.winnerColor};">${f.winnerDisplay}</div>
    <div class="home-featured-winner-sub">${f.winnerSub}</div>
    ${podiumHTML?`<div class="home-featured-podium">${podiumHTML}</div>`:''}
    <div class="home-featured-cta">OPEN RESULTS →</div>
  </div>`;
}

function renderHomeFeaturedCarousel(){
  const feed=getFeaturedFeed();
  if(!feed.length)return'';
  const cards=feed.map(renderHomeFeaturedCard).join('');
  return`<div class="section-title"><span>Recent Winners · ${feed.length}</span><span>Swipe →</span></div>
    <div class="home-featured-carousel">${cards}</div>`;
}

function renderHomeChampionships(){
  const f1L=HARDCODED_DRIVER_STANDINGS[0],f1P2=HARDCODED_DRIVER_STANDINGS[1];
  const nL=NASCAR_CUP_STANDINGS[0],nP2=NASCAR_CUP_STANDINGS[1];
  const f1Gap=f1L&&f1P2?(+f1L.points-+f1P2.points):0;
  const nGap=nL&&nP2?(nL.points-nP2.points):0;
  const f1Team=f1L?.Constructors?.[0]?.name||'—';
  const nDrv=NASCAR_CUP_DRIVERS[nL?.driver]||{};
  return`<div class="section-title"><span>Championship Leaders</span><span>Tap to open</span></div>
  <div class="home-champ-grid">
    <div class="home-champ-card" onclick="openHomeChampionship('f1')">
      <div class="home-champ-series" style="color:var(--red);">F1</div>
      <div class="home-champ-name" style="color:${tc(f1Team)};">${f1L?.Driver?.familyName||'—'}</div>
      <div class="home-champ-team">${f1Team}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${f1L?.points||'0'} PTS</span><span style="color:var(--muted);">  ·  +${f1Gap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('nascar')">
      <div class="home-champ-series" style="color:var(--yellow);">NASCAR</div>
      <div class="home-champ-name" style="color:${nascarMfrColor(nDrv.mfr)};">${nL?.driver||'—'}</div>
      <div class="home-champ-team">${nDrv.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${nL?.points||0} PTS</span><span style="color:var(--muted);">  ·  +${nGap}</span></div>
    </div>
  </div>`;
}

function renderHomeArticles(){
  const sorted=[...HOMEPAGE_ARTICLES].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const rows=sorted.map(a=>{
    const accent=getSeriesAccentColor(a.series);
    const label=getSeriesLabel(a.series);
    const when=formatRelativeTime(a.publishedAt);
    // Image block is opt-in: only renders when imageUrl is a non-empty string.
    // onerror hides the <img> so a dead asset URL collapses the slot cleanly
    // instead of showing a broken-image icon.
    const imgHTML=a.imageUrl?`<img class="home-article-img" src="${a.imageUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling&&this.nextElementSibling.classList.contains('home-article-credit')&&(this.nextElementSibling.style.display='none');">${a.imageCredit?`<div class="home-article-credit">${a.imageCredit}</div>`:''}`:'';
    return`<div class="home-article" onclick="openHomeArticle('${a.id}')">
      <div class="home-article-stripe" style="background:${accent};"></div>
      <div>
        ${imgHTML}
        <div class="home-article-meta"><span style="color:${accent};">${label}</span><span>  ·  ${a.source}</span><span>  ·  ${when}</span></div>
        <div class="home-article-headline">${a.headline}</div>
        <div class="home-article-excerpt">${a.excerpt}</div>
      </div>
    </div>`;
  }).join('');
  return`<div class="section-title"><span>Latest News · ${sorted.length} Stories</span><span>Tap to read</span></div>${rows}`;
}

// TODO (Session 5): VIDEO HIGHLIGHTS section. Two slots — latest F1 video
// (read from HARDCODED_QUALI_VIDEOS or future RECAP_VIDEOS) and latest
// NASCAR video. Intentionally not rendered until source constants exist;
// adding empty visual scaffolding now would either show nothing or require
// invented data. Deferred per cardinal rule.

function renderHomeFooter(){
  const feed=getFeaturedFeed();
  const newest=feed[0];
  const dateStr=newest?fmtDate(newest.date):'—';
  return`<div class="home-footer">Updated ${dateStr}  ·  Cards: ${feed.length}  ·  Feed v1</div>`;
}

function renderHome(){
  const feed=getFeaturedFeed();
  const top=feed[0];
  track('home:render',{cardCount:feed.length,topSeries:top?.series||'none'});
  document.getElementById('main-content').innerHTML=
    renderHomeFeaturedCarousel()
    +renderHomeChampionships()
    +renderHomeArticles()
    +renderHomeFooter();
  if(top){
    setStats(top.seriesLabel,top.winnerDisplay.length>10?top.winnerDisplay.slice(0,10):top.winnerDisplay,'HOME','—');
  }else{
    setStats('—','—','HOME','—');
  }
}
// ── END HOME ─────────────────────────────────────────────────────────────────
