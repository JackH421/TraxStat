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
    headline: 'Aston Martin or Cadillac: Who wins the race to a first point?',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/aston-martin-or-cadillac-who-wins-the-race-to-a-first-point',
    publishedAt: '2026-05-30T12:00:00.000Z',
    excerpt: 'Just two teams remain without a point in the 2026 F1 season, but which will be the first to get off the mark?',
    imageUrl: 'https://cdn.racingnews365.com/2026/Bottas/Bottas-Stroll-Canada.jpg?v=1780123833&width=1800&height=945&quality=75&crop=5185%2C2723%2C0%2C369',
    imageCredit: 'Bottas Stroll Canada'
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Jamie Chadwick warns George Russell Canada GP retirement may have saved Mercedes from fallout',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/jamie-chadwick-warns-george-russell-canada-gp-retirement-may-have-saved-mercedes-fallout/10825173/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-30T13:30:47.000Z',
    excerpt: 'Three-time W Series champion and Sky Sports Formula 1 pundit Jamie Chadwick believes George Russell\'s untimely retirement from the Canadian Grand Prix likely saved Mercedes from bitter intra-team fallout.Russell and his team-mate Kimi Antonelli had been battling for the lead for…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/6lmdZPj0/s6/george-russell-mercedes.jpg',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'nascar',
    headline: 'Riggs delivers a masterclass with last-lap pass for Truck Series victory at Nashville',
    source: 'Racer',
    url: 'https://racer.com/2026/05/30/riggs-delivers-a-masterclass-with-last-lap-pass-for-truck-series-victory-at-nashville',
    publishedAt: '2026-05-30T10:11:02.000Z',
    excerpt: 'Layne Riggs pulled the No. 34 Ford into victory lane at Nashville Superspeedway late on Friday night after a rain delay.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'f1',
    headline: 'Mercedes handed \'several months\' setback as investigation delayed',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/mercedes-handed-several-months-setback-as-investigation-delayed',
    publishedAt: '2026-05-30T07:00:00.000Z',
    excerpt: 'Mercedes might be sitting comfortably at the top of both championships, but it must now dig deep into its data to understand exactly what went wrong for George Russell in Montreal.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Russell/XPB_1411766_HiRes.jpg?v=1779692561&width=1800&height=945&quality=75&crop=6000%2C3150%2C0%2C110',
    imageCredit: 'Russell Canada'
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Layne Riggs denies Rajah Caruth Nashville Truck win in thrilling last-lap pass',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-truck/news/layne-riggs-wins-nascar-truck-nashville-rajah-caurth/10825319/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-30T05:26:49.000Z',
    excerpt: 'Layne Riggs won the pole, swept the stages, and claimed victory in Friday\'s very late-night NASCAR Craftsman Truck Series (NCTS) race, but that doesn\'t even begin to tell the whole story.Riggs made a dramatic late-race charge, defeating Rajah Caruth in a full-contact battle at…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/0o5PZKPY/s6/layne-riggs-wins-no-34-front-r.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Connor Zilisch becomes NASCAR spotter in role reversal with Stefan Parsons',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-truck/news/connor-zilisch-becomes-nascar-spotter-in-role-reversal-with-stefan-parsons/10825314/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-30T00:38:42.000Z',
    excerpt: 'Every Sunday, Connor Zilisch has Stefan Parsons in his ear as his NASCAR Cup spotter, but this duo have switched roles for the NASCAR Craftsman Truck Series race at Nashville.Parsons is driving the No. 4 Niece Motorsports entry in his first start of the year, and Zilisch will be…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/Y9lLy9Z2/s6/connor-zilisch-trackhouse-raci.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'motogp',
    headline: 'Andrea Iannone wins on Bagger debut in MotoGP paddock return',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1096473/1/andrea-iannone-wins-bagger-debut-motogp-paddock-return',
    publishedAt: '2026-05-30T14:46:41.000Z',
    excerpt: 'Andrea Iannone scored a maiden win in his debut at the Bagger World Cup at Mugello',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/gng_1318169_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'wec',
    headline: 'Bamber wins Detroit IMSA pole for Whelen Cadillac',
    source: 'Racer',
    url: 'https://racer.com/2026/05/29/bamber-wins-detroit-imsa-pole-for-whelen-cadillac',
    publishedAt: '2026-05-29T21:35:28.000Z',
    excerpt: 'GM brands will start on both class pole positions in tomorrow’s Chevrolet Sports Car Classic in Detroit, led by the GTP pole-winning No. 31 Cadillac Whelen V-Series.R of Jack Aitken and Earl Bamber.',
    imageUrl: '',
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
    series: 'wrc',
    headline: 'Solberg denies taking too much risk before WRC Rally Japan crash',
    source: 'Autosport',
    url: 'https://www.autosport.com/wrc/news/solberg-denies-taking-too-much-risk-before-wrc-rally-japan-crash/10825458/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-30T12:48:02.000Z',
    excerpt: 'Oliver Solberg dismissed suggestions that he was taking too much risk ahead of his premature exit from the Rally Japan victory fight.The Toyota World Rally Championship driver had been reeling in rally leader Elfyn Evans when he slid wide in a left-hander in Stage 10. The loss…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/6x7Z1PjY/s6/oliver-solberg-elliott-edmonds-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'motogp',
    headline: 'Raul Fernandez hails “super emotional” Mugello Sprint victory amid uncertain MotoGP future',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1096475/1/raul-fernandez-hails-super-emotional-mugello-sprint-victory-amid-uncertain',
    publishedAt: '2026-05-30T15:05:16.000Z',
    excerpt: 'Raul Fernandez claimed his first Sprint victory as questions continue to surround his MotoGP future beyond 2026.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/gng_1319149_hires_1600x900.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'motogp',
    headline: '“Not a good manoeuvre”: KTM rider explains dramatic Mugello MotoGP Sprint crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1096471/1/not-good-manoeuvre-ktm-rider-explains-dramatic-mugello-motogp-sprint-crash',
    publishedAt: '2026-05-30T14:41:43.000Z',
    excerpt: 'Enea Bastianini explains the ‘not good manoeuvre’ that led to his crash in the Mugello MotoGP Sprint.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/gng_1319240_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'other',
    headline: 'Isle of Man TT crash involving spectators described as “terrifying”',
    source: 'Crash.net',
    url: 'https://www.crash.net/rr/news/1096445/1/isle-man-tt-crash-involving-spectators-described-terrifying',
    publishedAt: '2026-05-30T12:38:14.000Z',
    excerpt: 'A former nurse who helped casualties in an Isle of Man TT crash last week has described it as “terrifying”',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/isle-of-man-tt-races-2024-hillberry-jpg_31546387.jpeg?width=1600&aspect_ratio=16:9',
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
