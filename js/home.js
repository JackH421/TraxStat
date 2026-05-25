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
    headline: 'Antonelli wins Canadian GP as Russell retires after epic Mercedes battle',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/news/12433/13547569/canadian-gp-kimi-antonelli-wins-as-george-russell-retires-after-thrilling-mercedes-battle-in-montreal',
    publishedAt: '2026-05-24T21:57:00.000Z',
    excerpt: 'Kimi Antonelli won the Canadian Grand Prix as his Mercedes team-mate George Russell retired due to a power unit issue after an epic battle between the Silver Arrows.',
    imageUrl: 'https://e0.365dm.com/26/05/1600x900/skysports-f1-kimi-antonelli_7257768.jpg?20260525000210',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'George Russell shock retirement hands Kimi Antonelli record-breaking Canada win',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/george-russell-shock-retirement-hands-kimi-antonelli-record-breaking-canada-win',
    publishedAt: '2026-05-24T21:39:00.000Z',
    excerpt: 'Kimi Antonelli has extended his lead in the F1 drivers\' title after winning the Canadian GP, following a shock retirement for George Russell',
    imageUrl: 'https://cdn.racingnews365.com/2026/Antonelli/Antonelli-race-Canada.jpg?v=1779658023&width=1800&height=945&quality=75&crop=5185%2C2723%2C0%2C369',
    imageCredit: 'Antonelli race Canada'
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'George Russell facing stewards’ investigation after Canadian GP retirement',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/george-russell-facing-stewards-investigation-after-canadian-gp-retirement',
    publishedAt: '2026-05-24T21:12:00.000Z',
    excerpt: 'From bad to worse for George Russell who finds himself in trouble with the stewards.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Russell/Russell-Canadian-GP.png?v=1779656702&width=1200&height=630&quality=75&crop=1376%2C723%2C0%2C211',
    imageCredit: 'Russell Canadian GP screenshot'
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Daniel Suarez and Spire wins Coca-Cola 600 for Kyle Busch Motorsports',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/daniel-suarez-and-spire-wins-coca-cola-600-for-kyle-busch-motorsports/10824084/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-25T06:21:05.000Z',
    excerpt: 'The spoils of victory for winning the Coca-Cola 600 are heading back to Kyle Busch Motorsports.Technically, Daniel Suarez of Spire Motorsports won the rain-shortened classic on Sunday night at the Charlotte Motor Speedway on a gutsy two-tire call by crew chief Ryan Sparks but so…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/Y9lLMjq2/s6/daniel-suarez-spire-motorsport.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Suarez wins emotional, rain-shortened Coca-Cola 600',
    source: 'Racer',
    url: 'https://racer.com/2026/05/24/suarez-wins-emotional-rain-shortened-coca-cola-600',
    publishedAt: '2026-05-25T03:46:14.000Z',
    excerpt: 'At the drivers’ meeting before Sunday’s Coca-Cola 600 at Charlotte Motor Speedway, NASCAR Senior Vice President of Competition Elton Sawyer had some parting words for the NASCAR Cup Series drivers.“Let’s put on a race Kyle would be proud of,” Sawyer said, referring to two-time…',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Winners and losers from a somber and emotional Coca-Cola 600',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/winners-and-losers-from-a-somber-and-emotional-coca-cola-600/10824251/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-25T18:04:14.000Z',
    excerpt: 'Daniel Suarez is now a Coca-Cola 600 winner, coming out of seemingly nowhere to win the 67th running of NASCAR\'s longest race, with rain ending the event 27 laps short of the scheduled distance.It was a race dominated by Toyota, but won by Spire as the team is now equal with…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/0JXwQroY/s6/kurt-busch-chase-elliott-hendr.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'indycar',
    headline: 'Felix Rosenqvist wins dramatic Indy 500 in record-breaking finish',
    source: 'Crash.net',
    url: 'https://www.crash.net/indycar/news/1096073/1/felix-rosenqvist-wins-dramatic-indy-500-record-breaking-finish',
    publishedAt: '2026-05-24T20:20:00.000Z',
    excerpt: 'Felix Rosenqvist won his first Indianapolis 500 in dramatic fashion',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/felix-rosenqvist-miller-lite-carb-day-by-john-grainda_large-image-without-watermark_m155017.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'First day of Isle of Man TT 2026 cut short by red flag',
    source: 'The Race',
    url: 'https://www.the-race.com/tt/first-day-of-isle-of-man-tt-2026-cut-short-by-red-flag/',
    publishedAt: '2026-05-25T15:05:37.000Z',
    excerpt: 'The opening day of practice for the 2026 Isle of Man TT has been cut short, after an incident on the exit of Parliament Square in Ramsey brought out the red flag',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/05/img_0182.jpg',
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
    series: 'other',
    headline: '2026 Isle of Man TT: Qualifying delay expected after red flag in first practice',
    source: 'Crash.net',
    url: 'https://www.crash.net/rr/news/1096215/1/2026-isle-man-tt-qualifying-delay-expected-after-red-flag-first-practice',
    publishedAt: '2026-05-25T12:47:15.000Z',
    excerpt: 'Opening practice for the 2026 Isle of Man TT has been red-flagged',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/isle-of-man-tt-races-2024-hillberry-jpg_31546387.jpeg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'f1',
    headline: 'McLaren reveal cause of Lando Norris Canada F1 retirement',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/mclaren-reveal-cause-of-lando-norris-canada-f1-retirement',
    publishedAt: '2026-05-25T14:30:00.000Z',
    excerpt: 'McLaren boss Andrea Stella has explained all behind Lando Norris\'s retirement in Montreal.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Norris/XPB_1411600_HiRes.jpg?v=1779658047&width=1800&height=945&quality=75&crop=5185%2C2723%2C0%2C369',
    imageCredit: 'Norris Canada GP'
  },
  {
    id: 'a103',
    series: 'other',
    headline: '"Annoyed with myself": BMW driver van der Linde speaks out after Zandvoort victory',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/dtm/news/fed-up-with-myself-bmw-driver-van-der-linde-speaks-his-mind-after-victory/10824190/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-25T12:42:03.000Z',
    excerpt: 'The relief was written all over Kelvin van der Linde\'s face after his victory in the second DTM race at Zandvoort: The Schubert BMW driver had controlled the race with poise for long stretches before a mistake with about 20 minutes remaining momentarily cost him the lead."I was…',
    imageUrl: 'https://cdn-2.motorsport.com/images/amp/l0LkdwP6/s6/genervt-von-mir-selbst-bmw-pilot-van-der-linde-spricht-klartext-nach-sieg-26052405.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'wec',
    headline: 'Barwell’s Cook Holds Off Beechdean’s Gunn To Seal Race 1 Victory',
    source: 'DailySportsCar',
    url: 'https://www.dailysportscar.com/2026/05/25/barwells-cook-holds-off-beechdean-amrs-gunn-to-seal-race-1-victory.html?utm_source=rss&#038;utm_medium=rss&#038;utm_campaign=barwells-cook-holds-off-beechdean-amrs-gunn-to-seal-race-1-victory',
    publishedAt: '2026-05-25T13:06:03.000Z',
    excerpt: 'Barwell Motorsport’s Hugo Cook held off Ross Gunn in Beechdean&#8217;s #7 Aston Martin Vantage AMR GT3 Evo to secure the Race 1 victory today at Oulton Park. Cook and his teammate Collard won the first of two 60-minute bank holiday sprint races, from second place on the grid in…',
    imageUrl: 'https://www.dailysportscar.com/wp-content/uploads/2026/04/Optimum-Motorsport-1.jpg',
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
