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
    headline: 'Verstappen Racing wins after relentless streak of painful setbacks',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/verstappen-racing-wins-after-endless-streak-of-painful-setbacks',
    publishedAt: '2026-08-02T08:50:00.000Z',
    excerpt: 'A season defined by misfortune has finally delivered something to celebrate for Verstappen Racing.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Verstappen/GT3/Gounon-Juncadella-GTWCE-Magny-Cours-Win.jpg?v=1785652307&width=1200&height=630&quality=75&crop=1000%2C525%2C0%2C18',
    imageCredit: 'Gounon Juncadella GTWCE Magny Cours Win'
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Former Haas F1 boss calls out FIA over \'lenient\' Carlos Sainz Hungarian GP penalty',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/former-haas-f1-boss-calls-out-fia-over-lenient-carlos-sainz-hungarian-gp-penalty/10843692/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-02T11:59:19.000Z',
    excerpt: 'Former Haas Formula 1 team principal Guenther Steiner has argued that Carlos Sainz should have received a harsher penalty for his collision with Oscar Piastri at the Hungarian Grand Prix.During the race at the Hungaroring, Sainz made contact with Piastri\'s McLaren while being…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/6b8ZjXw2/s6/carlos-sainz-williams.jpg',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'McLaren "ready to challenge" Mercedes after upgrade, says Sky F1 commentator',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/mclaren-ready-to-challenge-mercedes-after-upgrade-says-sky-f1-commentator/10843408/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-02T12:00:05.000Z',
    excerpt: 'Sky Sports Formula 1 lead commentator David Croft believes McLaren\'s recent upgrade package has positioned the team to mount a genuine challenge against championship leader Mercedes over the remainder of the 2026 season. McLaren arrived at the Hungarian Grand Prix seeking to…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/0R7BdLV2/s6/oscar-piastri-mclaren-andrea-s.jpg',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'NASCAR penalizes Carl Long\'s Truck team, leaving MBM Motorsports with negative points',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-truck/news/nascar-penalizes-carl-longs-truck-team-leaving-mbm-motorsports-with-negative-points/10843428/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-07-31T19:20:02.000Z',
    excerpt: 'Almost a week after the NASCAR Craftsman Truck Series race at IRP, NASCAR has issued penalties to the No. 69 MBM Motorsports team, which fielded a Ram for the first time last weekend in Indianapolis. Jonathan Shafer drove the No. 69 Ram for MBM, but the team actually failed to…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/6b8ZK1B2/s6/jonathan-shafer-mbm-motorsport.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'other',
    headline: 'Supercars Perth: Payne outduels Feeney for victory',
    source: 'Autosport',
    url: 'https://www.autosport.com/supercars/news/supercars-perth-payne-outduels-feeney-for-victory/10843667/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-08-02T09:15:49.000Z',
    excerpt: 'Matt Payne and Broc Feeney left the field behind as Supercars\' elite drivers fought for the win in the third Supercars race at Wanneroo Raceway, Payne emerging victorious in the Kelly Racing Ford Mustang.Read Also:SupercarsSupercars Perth: Payne builds championship lead with…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/6DGgloOY/s6/matt-payne-grove-racing-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'wrc',
    headline: 'WRC champion Sébastien Ogier admitted to hospital after severe crash',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/wrc-champion-sebastien-ogier-admitted-to-hospital-after-severe-crash',
    publishedAt: '2026-08-02T07:55:00.000Z',
    excerpt: 'The Rally Finland ended dramatically for Sébastien Ogier and his co-driver Julien Ingrassia. The pair were involved in a terrifying crash and were taken to the hospital.',
    imageUrl: 'https://cdn.racingnews365.com/2026/XPB_1429607_HiRes.jpg?v=1785654356&width=1800&height=945&quality=75&crop=5568%2C2924%2C0%2C394',
    imageCredit: 'Ogier Ingrassia Rally Finland 2026'
  },
  {
    id: 'a7',
    series: 'wrc',
    headline: 'WRC Finland: Sami Pajari claims back-to-back WRC wins',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/wrc/news/wrc-finland-sami-pajari-claims-back-to-back-wrc-wins/10843694/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-02T11:59:34.000Z',
    excerpt: 'Sami Pajari claimed back-to-back World Rally Championship wins with an emotional home victory in a drama-filled 75th-anniversary edition of Rally Finland.After securing a maiden WRC win in Estonia two weeks ago, Pajari and co-driver Marko Salminen produced a faultless drive in…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/YBVjMeMY/s6/sami-pajari-marko-salminen-toy.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'Supercars Perth: Matt Payne outduels Broc Feeney for victory',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/v8supercars/news/supercars-perth-matt-payne-outduels-broc-feeney-for-victory/10843665/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-02T09:14:10.000Z',
    excerpt: 'Matt Payne and Broc Feeney left the field behind as Supercars\' elite drivers fought for the win in the third Supercars race at Wanneroo Raceway, Payne emerging victorious in the Grove Racing Ford Mustang.Read Also:SupercarsSupercars Perth: Matt Payne builds championship lead…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/YE9EeqpY/s6/matt-payne-grove-racing-2.jpg',
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
    series: 'wec',
    headline: 'Thiim Inherits Race 2 Pole At Magny-Cours After WRT Overboost (Updated)',
    source: 'DailySportsCar',
    url: 'https://www.dailysportscar.com/2026/08/02/van-der-linde-claims-race-2-pole-at-magny-cours.html?utm_source=rss&#038;utm_medium=rss&#038;utm_campaign=van-der-linde-claims-race-2-pole-at-magny-cours',
    publishedAt: '2026-08-02T09:42:45.000Z',
    excerpt: 'UPDATE: The #32 Team WRT has lost all of its lap times from Qualifying 2 due to being overboost by 10mbar several times during the session. Team WRT informed the stewards that this was due to a mistake when establishing atmospheric pressure. As such, the #7 Comtoyou Racing Aston…',
    imageUrl: 'https://www.dailysportscar.com/wp-content/uploads/2030/01/Control-Telemetry-Header-730px.jpeg',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'wec',
    headline: 'WRT BMW Loses Qualifying Lap Times, Aston Inherits Pole',
    source: 'Sportscar365',
    url: 'https://sportscar365.com/sro/world-challenge-europe/wrt-bmw-to-start-last-aston-inherits-pole/',
    publishedAt: '2026-08-02T12:55:18.000Z',
    excerpt: 'Championship leaders lose pole after using more boost than permitted in Magny-Cours Sprint Cup qualifying...',
    imageUrl: 'https://sportscar365.com/wp-content/uploads/2026/08/7-NT-0H5A6598.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'wec',
    headline: 'Points Leader Van der Linde Takes Pole for Race 2',
    source: 'Sportscar365',
    url: 'https://sportscar365.com/sro/world-challenge-europe/points-leader-van-der-linde-takes-pole-for-race-2/',
    publishedAt: '2026-08-02T09:29:48.000Z',
    excerpt: 'WRT BMW driver heads Thiim\'s Comtoyou Aston on grid for second Magny-Cours Sprint Cup race...',
    imageUrl: 'https://sportscar365.com/wp-content/uploads/2026/08/32-PZ8_4319.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'wec',
    headline: 'Acura MSR&#8217;s Yelloly Wins Pole For Road America Endurance Grand Prix',
    source: 'DailySportsCar',
    url: 'https://www.dailysportscar.com/2026/08/01/acura-msrs-yelloly-wins-pole-for-road-america-endurance-grand-prix.html?utm_source=rss&#038;utm_medium=rss&#038;utm_campaign=acura-msrs-yelloly-wins-pole-for-road-america-endurance-grand-prix',
    publishedAt: '2026-08-01T21:52:38.000Z',
    excerpt: 'Nick Yelloly powered the #93 Acura Meyer Shank Racing ARX-06 to the pole position for tomorrow’s IMSA Motul SportsCar Endurance Grand Prix. In Qualifying, Yelloly took the #93 Acura’s third pole of the year, his second individually, to lead an all-Acura front row of the grid for…',
    imageUrl: 'https://www.dailysportscar.com/wp-content/uploads/2026/08/22-United-Autosports-USA-ORECA-07-Gibson-2026-IMSA-Road-America-1.jpg',
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
  // New-series cards route straight into the Standings sub-tab; 'wec' is the
  // display key for the 'gt3' routing key.
  if(series==='indycar'||series==='motogp'||series==='wrc'||series==='wec'){
    const key=series==='wec'?'gt3':series;
    switchSeries(key);
    goToSubTab(key,'standings');
    return;
  }
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
  // New-series leaders (all-series buildout 2026-06-12). Each card reads its
  // module's verified standings constants; gaps derive from the P2 row.
  const iL=INDYCAR_STANDINGS[0],iGap=iL.points-INDYCAR_STANDINGS[1].points;
  const iDrv=INDYCAR_DRIVERS[iL.driver]||{};
  const mL=MOTOGP_STANDINGS[0],mGap=mL.points-MOTOGP_STANDINGS[1].points;
  const mRider=MOTOGP_RIDERS[mL.rider]||{};
  const wL=WEC_HYPERCAR_STANDINGS[0],wGap=wL.points-WEC_HYPERCAR_STANDINGS[1].points;
  const wMfr=(wL.team.match(/BMW|Toyota|Ferrari|Alpine|Peugeot|Cadillac|Genesis|Aston Martin/)||['default'])[0];
  const rL=WRC_STANDINGS[0],rGap=rL.points-WRC_STANDINGS[1].points;
  const rDrv=WRC_DRIVERS[rL.driver]||{};
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
    <div class="home-champ-card" onclick="openHomeChampionship('indycar')">
      <div class="home-champ-series" style="color:#37bedd;">INDYCAR</div>
      <div class="home-champ-name" style="color:${indyEngineColor(iDrv.engine)};">${iL.driver}</div>
      <div class="home-champ-team">${iDrv.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${iL.points} PTS</span><span style="color:var(--muted);">  ·  +${iGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('motogp')">
      <div class="home-champ-series" style="color:var(--orange);">MOTOGP</div>
      <div class="home-champ-name" style="color:${motogpBikeColor(mRider.bike)};">${mL.rider}</div>
      <div class="home-champ-team">${mRider.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${mL.points} PTS</span><span style="color:var(--muted);">  ·  +${mGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('wec')">
      <div class="home-champ-series" style="color:var(--green);">WEC</div>
      <div class="home-champ-name" style="color:${wecMfrColor(wMfr)};">${wL.crew}</div>
      <div class="home-champ-team">${wL.team}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${wL.points} PTS</span><span style="color:var(--muted);">  ·  +${wGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('wrc')">
      <div class="home-champ-series" style="color:#b0b0b0;">WRC</div>
      <div class="home-champ-name" style="color:${wrcTeamColor(rDrv.team)};">${rL.driver}</div>
      <div class="home-champ-team">${rDrv.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${rL.points} PTS</span><span style="color:var(--muted);">  ·  +${rGap}</span></div>
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
