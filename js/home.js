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
    series: 'nascar',
    headline: 'Driving Kyle Busch\'s Truck entry, Corey Day okay after shock airborne crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-truck/news/driving-kyle-buschs-truck-entry-corey-day-okay-after-shock-airborne-crash/10823844/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-24T15:19:14.000Z',
    excerpt: 'Near the end of Stage 2 of the thrice-postponed NASCAR Craftsman Truck Series race, Corey Day was involved in a scary and unusual crash on the backstretch. Day was brought into this race to drive the No. 7 Spire Motorsports entry following the shocking death of NASCAR legend…',
    imageUrl: 'https://cdn-6.motorsport.com/images/amp/YXypQzR6/s6/damage-to-the-truck-of-corey-d.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'PETA demands F1 Canadian GP action after Alex Albon\'s groundhog crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1096009/1/peta-demands-f1-canadian-gp-action-after-alex-albons-groundhog-crash',
    publishedAt: '2026-05-24T08:00:00.000Z',
    excerpt: 'Animal rights organisation PETA issues statement after Alex Albon hit a groundhog.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/xpb_1282829_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'One F1 team\'s major Canada upgrade package has left it "chasing our tails"',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1096013/1/one-f1-teams-major-canada-upgrade-package-has-left-it-chasing-our-tails',
    publishedAt: '2026-05-24T10:30:00.000Z',
    excerpt: 'The significant Haas upgrade package has been difficult to optimise during the Canadian Grand Prix so far',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/xpb_1410537_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'f1',
    headline: 'Russell snatches pole from Antonelli in Canada',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/news/12433/13547292/canadian-gp-george-russell-snatches-pole-from-kimi-antonelli-as-battle-between-mercedes-drivers-intensifies',
    publishedAt: '2026-05-23T21:00:00.000Z',
    excerpt: 'George Russell snatched pole position for the Canadian Grand Prix from his Mercedes team-mate Kimi Antonelli in a thrilling finale to qualifying in Montreal.',
    imageUrl: 'https://e0.365dm.com/26/05/1600x900/skysports-george-russell-mercedes_7256847.jpg?20260523230740',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Ross Chastain wins strange NASCAR O\'Reilly Charlotte race, marred by rain, fog, oil slick',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-os/news/ross-chastain-wins-marathon-nascar-oreilly-charlotte-race-marred-by-rain-fog-oil-slick/10823567/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-24T03:47:30.000Z',
    excerpt: 'The NASCAR O\'Reilly Auto Parts Series race ended under caution after Stage 2 at Charlotte Motor Speedway.It was a strange and bizarre race, hindered by rain and later fog. It took over six hours to run the first 90 laps, and the final half of the race never happened. A total of…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/6n7ARZo0/s6/ross-chastain-no-9-jr-motorspo.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'NASCAR race days won’t be as exciting without Busch, drivers say',
    source: 'Racer',
    url: 'https://racer.com/2026/05/24/nascar-race-days-won-t-be-as-exciting-without-busch-drivers-say',
    publishedAt: '2026-05-24T13:49:52.000Z',
    excerpt: 'The personal stories and opinions on the life and legacy of Kyle Busch have not been hard to find since Thursday, and will undoubtedly continue to be shared for the foreseeable future.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'other',
    headline: 'DTM Zandvoort: Van der Linde grabs victory for BMW as Dorr takes maiden podium',
    source: 'Autosport',
    url: 'https://www.autosport.com/dtm/news/dtm-zandvoort-race-2-bmw-victory-for-kelvin-van-der-linde-dorr-on-podium/10823818/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-24T13:59:47.000Z',
    excerpt: 'Kelvin van der Linde has claimed his first DTM victory for BMW, fighting back against Thierry Vermeulen to take victory by an eventual comfortable margin at Zandvoort.The Schubert BMW driver was considered a hot contender for the win before the race after the Balance of…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/86Aml1w6/s6/dtm-rennen-zandvoort-2-bmw-sieg-von-kelvin-van-der-linde-doerr-podium-26052403.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'DTM Zandvoort Race 2: BMW victory for Kelvin van der Linde, Dörr on podium',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/dtm/news/dtm-race-at-zandvoort-2-kelvin-van-der-linde-wins-for-bmw-dorr-on-the-podium/10823815/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-05-24T13:35:20.000Z',
    excerpt: 'Kelvin van der Linde has claimed his first DTM victory for BMW. The South African, who started the race from pole position, temporarily lost the lead to Thierry Vermeulen (Emil Frey Ferrari) after a mistake. However, he fought his way back to the front after the second pit stop…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/86Aml1w6/s6/dtm-rennen-zandvoort-2-bmw-sieg-von-kelvin-van-der-linde-doerr-podium-26052403.jpg',
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
    series: 'indycar',
    headline: 'Adjusted full starting grid for 2026 Indy 500 after disqualifications',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/adjusted-full-starting-grid-for-2026-indy-500-after-disqualifications',
    publishedAt: '2026-05-24T04:00:00.000Z',
    excerpt: 'Find out the full starting grid for the 110th running of the Indy 500!',
    imageUrl: 'https://cdn.racingnews365.com/2026/IndyCar/Indianapolis-500-Front-Row-Photoshoot-Monday_-May-18_-2026_Ref-Image-Without-Watermark_m154370.jpg?v=1779120761&width=1200&height=630&quality=75&crop=1080%2C567%2C0%2C76',
    imageCredit: 'Indianapolis 500 Front Row Photoshoot Monday May 18 2026 Ref Image Without Watermark m154370'
  },
  {
    id: 'a102',
    series: 'other',
    headline: 'Chastain wins rain-shortened O\'Reilly Series race at Charlotte',
    source: 'Racer',
    url: 'https://racer.com/2026/05/23/chastain-wins-rain-shortened-o-reilly-series-race-at-charlotte',
    publishedAt: '2026-05-24T04:40:35.000Z',
    excerpt: 'Chastain drove through a succession of challenges to win Saturday night’s rain-shortened Charbroil 300 at Charlotte Motor Speedway.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'other',
    headline: 'Menard claims Trans Am Memorial Day Classic victory for third straight year',
    source: 'Racer',
    url: 'https://racer.com/2026/05/24/menard-claims-trans-am-memorial-day-classic-victory-for-third-straight-year',
    publishedAt: '2026-05-24T06:52:40.000Z',
    excerpt: 'Paul Menard (No. 3 Pittsburgh Paints/Menards Ford Mustang) had won the Trans Am Memorial Day Classic at Lime Rock Park twice before, in 2024 and 2025, but the Eau Claire, Wis., native probably didn’t expect to be grabbing his first win of 2026 on Memorial Day Weekend.Menard has…',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'f1',
    headline: 'Russell wins Canada Sprint as Antonelli fumes after going off track in battle',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/news/12433/13547290/canadian-gp-sprint-george-russell-wins-as-mercedes-team-mate-kimi-antonelli-left-fuming-after-going-off-track-in-battle',
    publishedAt: '2026-05-23T16:30:00.000Z',
    excerpt: 'George Russell claimed victory in a thrilling Canadian Grand Prix Sprint after coming out on top of a controversial battle with his Mercedes team-mate Kimi Antonelli.',
    imageUrl: 'https://e0.365dm.com/26/05/1600x900/skysports-george-russell-kimi_7256516.jpg?20260523172431',
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
