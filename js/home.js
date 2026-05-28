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
    headline: 'Antonelli wins Canadian GP as Russell retires',
    source: 'ESPN F1',
    url: 'https://www.espn.com/f1/story/_/id/48865403/canadian-grand-prix-kimi-antonelli-wins-mercedes-teammate-george-russell-forced-retire',
    publishedAt: '2026-05-27T19:21:23.000Z',
    excerpt: 'Kimi Antonelli claimed a fourth successive win at the Canadian Grand Prix after his teammate George Russell was forced to retire amid a pulsating battle.',
    imageUrl: 'https://a4.espncdn.com/combiner/i?img=%2Fphoto%2F2026%2F0524%2Fr1663129_1296x729_16%2D9.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Michael Schumacher sparks Monaco outrage with controversial crash - Throwback',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/michael-schumacher-sparks-monaco-outrage-with-controversial-crash-throwback',
    publishedAt: '2026-05-27T14:40:00.000Z',
    excerpt: 'Michael Schumacher enjoyed great success with F1 during his career, but he had some controversial moments - including this one!',
    imageUrl: 'https://cdn.racingnews365.com/Schumacher-Monaco-2006.jpg?v=1779884880&width=1800&height=945&quality=75&crop=3500%2C1838%2C0%2C247',
    imageCredit: 'Schumacher Monaco 2006'
  },
  {
    id: 'a3',
    series: 'nascar',
    headline: 'NASCAR penalty to Ryan Preece upheld on appeal',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/nascar-penalty-to-ryan-preece-upheld-on-appeal/10824698/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-27T19:03:34.000Z',
    excerpt: 'The penalty issued by NASCAR to Ryan Preece was upheld on Wednesday following a hearing in front of the National Motorsports Appeals Panel. The incident in question occurred on May 3 at Texas Motor Speedway when Ty Gibbs crashed due to contact from Preece behind him. There was…',
    imageUrl: 'https://cdn-6.motorsport.com/images/amp/01Qd4nZ0/s6/ryan-preece-rfk-racing-ford.jpg',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Preece Texas penalty upheld on appeal',
    source: 'Racer',
    url: 'https://racer.com/2026/05/27/preece-texas-penalty-upheld-on-appeal',
    publishedAt: '2026-05-27T18:54:44.000Z',
    excerpt: 'The National Motorsports Appeals Panel has upheld the penalty levied against Ryan Preece for wrecking Ty Gibbs in the NASCAR Cup Series race at Texas Motor Speedway earlier this month.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'f1',
    headline: 'Do penalty points still serve any purpose in F1?',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/do-penalty-points-still-serve-any-purpose-in-f1/10824580/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-27T11:01:19.000Z',
    excerpt: 'It is fair to say that the 2026 Formula 1 season has so far generated more controversy off the track than on it, with the usual endless debates surrounding the regulations – and before that, Mercedes’ engine compression ratio.On track, however, matters have remained relatively…',
    imageUrl: 'https://cdn-3.motorsport.com/images/amp/2GdwQNzY/s6/charles-leclerc-ferrari-isack-.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Austin Hill will again drive Kyle Busch’s NASCAR Cup car this weekend at Nashville',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/austin-hill-will-again-kyle-buschs-nascar-cup-car-this-weekend/10824516/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-26T21:03:33.000Z',
    excerpt: 'Richard Childress Racing has announced that Austin Hill will again drive Kyle Busch’s NASCAR Cup Series entry following the tragic death of the 41-year-old NASCAR legend.Amid a sorrowful and rainy weekend at Charlotte Motor Speedway, Hill drove the car in the Coca-Cola 600 as…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/0R7wgWB2/s6/austin-hill-no-33-richard-chil.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'wec',
    headline: 'Tandy Could Complete Full Set of Current-Track Wins in Detroit',
    source: 'Sportscar365',
    url: 'https://sportscar365.com/imsa/iwsc/tandy-could-complete-full-set-of-imsa-current-track-wins-in-detroit/',
    publishedAt: '2026-05-27T19:30:01.000Z',
    excerpt: 'Nick Tandy could become first driver to win at every active WeatherTech Championship track if he emerges victorious this weekend...',
    imageUrl: 'https://sportscar365.com/wp-content/uploads/2026/05/333670_6000x4000.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'Maria Costello involved in red flag incident during 2026 Isle of Man TT qualifying',
    source: 'Crash.net',
    url: 'https://www.crash.net/rr/news/1096247/1/2026-isle-man-tt-qualifying-red-flagged-during-sidecar-session',
    publishedAt: '2026-05-26T20:58:00.000Z',
    excerpt: 'Maria Costello and Shaun Parker were involved in an incident during Sidecar qualifying at the 2026 Isle of Man TT that brought out the red flags.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/costello-2019-ctt.png?width=1600&aspect_ratio=16:9',
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
    series: 'f1',
    headline: 'Oscar Piastri apologises to Alex Albon as he reveals F1 Canadian GP crash cause',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1096250/1/oscar-piastri-apologises-alex-albon-he-reveals-f1-canadian-gp-crash-cause',
    publishedAt: '2026-05-27T09:14:36.000Z',
    excerpt: 'Oscar Piastri explains the reason for his crash with Alex Albon at the Canadian Grand Prix.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/xpb_1411513_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'f1',
    headline: 'Breaking: Alpine confirm global luxury icon as new F1 title partner',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/alpine-confirm-global-luxury-icon-as-new-f1-title-partner',
    publishedAt: '2026-05-27T12:06:00.000Z',
    excerpt: 'Alpine will enter the 2027 F1 season with a brand new title sponsor.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Gucci-Render-Watermark.png?v=1779872671&width=1200&height=630&quality=75&crop=1920%2C1008%2C0%2C36',
    imageCredit: 'Gucci Render Watermark'
  },
  {
    id: 'a103',
    series: 'f1',
    headline: 'The mysterious disappearance of F1’s penalty points in 2026',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/wednesday-do-penalty-points-still-serve-any-purpose-in-f1/10824575/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-27T11:01:07.000Z',
    excerpt: 'It is fair to say that the 2026 Formula 1 season has so far generated more controversy off the track than on it, with the usual endless debates surrounding the regulations – and before that, Mercedes’ engine compression ratio.On track, however, matters have remained relatively…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/0o5P9L1Y/s6/charles-leclerc-ferrari-isack--2.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'f1',
    headline: '\'This fight is on\': Mercedes will need to manage m...',
    source: 'ESPN F1',
    url: 'https://www.espn.com/racing/f1/story/_/id/48477679/formula-1-2026-canadian-grand-prix-kimi-antonelli-george-russell-mercedes-battles',
    publishedAt: '2026-05-27T19:21:23.000Z',
    excerpt: 'Russell has nothing to lose after a disappointing finish in Montreal. That might create a driver management problem for Mercedes.',
    imageUrl: 'https://a.espncdn.com/combiner/i?img=%2Fphoto%2F2026%2F0525%2Fr1663219_1296x729_16%2D9.jpg',
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
