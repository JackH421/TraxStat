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
    headline: 'Arvid Lindblad critical of "extreme" Zandvoort F1 penalty',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1103149/1/arvid-lindblad-critical-extreme-zandvoort-f1-penalty',
    publishedAt: '2026-08-30T12:30:00.000Z',
    excerpt: 'Arvid Lindblad and Franco Colapinto both faced sanctions from the Formula 1 stewards at the Dutch Grand Prix.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-08/xpb_1429891_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Bernie Collins issues stark Williams warning after Alex Albon-Carlos Sainz Dutch GP crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/bernie-collins-issues-stark-williams-warning-after-alex-albon-carlos-sainz-dutch-gp-crash/10850753/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-30T13:16:18.000Z',
    excerpt: 'Sky Sports Formula 1 analyst Bernie Collins has warned that Williams is in no position to absorb the financial and developmental damage caused by the collision between Carlos Sainz and Alex Albon at the Dutch Grand Prix.During an appearance on the Sky Sports F1 Show, Collins…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/6AlvErvY/s6/alexander-albon-williams-carlo.jpg',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'Ralf Schumacher requires surgery after jet ski crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/ralf-schumacher-needs-surgery-after-jet-ski-crash-on-raab-tv-show/10850720/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-30T11:53:31.000Z',
    excerpt: 'What was supposed to be an entertaining evening ended in hospital for Ralf Schumacher on Saturday after the former Formula 1 driver was injured during TV entertainer Stefan Raab\'s celebrity jet ski world championship.Schumacher suffered a shoulder injury in a crash and will now…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/x27Vqov0/s6/schock-bei-raab-show-ralf-schumacher-muss-nach-sturz-operiert-werden-26083003.jpg',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Carson Hocevar surprised after losing control in late-race Daytona crash',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/carson-hocevar-confused-daytona-crash-overtime/10850607/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-08-30T03:48:08.000Z',
    excerpt: 'Carson Hocevar was once again in contention on Saturday night, pushing towards the front of the pack with just a few laps left to race at Daytona in the Coke Zero Sugar 400.But as has often been the case with Hocevar, one move, that was likely a tad too aggressive in retrospect,…',
    imageUrl: 'https://cdn-2.motorsport.com/images/amp/6zoDopw0/s6/carson-hocevar-no-77-spire-mot.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Van Gisbergen sees NASCAR Chase spot slip away due to last-lap crash',
    source: 'Racer',
    url: 'https://racer.com/2026/08/29/van-gisbergen-sees-nascar-chase-spot-slip-away-due-to-last-lap-crash',
    publishedAt: '2026-08-30T04:14:11.000Z',
    excerpt: 'The Trackhouse Racing driver\'s chance to make the Chase came down to the wire Saturday, but as he was collected in a crash on the final lap, rival Ryan Preece drove to victory lane and swung the points in his favor.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'NASCAR Cup Daytona starting lineup: Ross Chastain wins pole position',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/nascar-cup-daytona-starting-lineup-ross-chastain-wins-nascar-cup-pole/10850252/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-08-28T22:48:33.000Z',
    excerpt: 'With a 48.809s (184.396mph) lap, Ross Chastain snagged pole position at Daytona International Speedway in the No. 1 Trackhouse Racing Chevrolet. He will share the front row with Chris Buescher in the No. 17 RFK Racing Ford, who trailed Chastain by 0.051s in the final round of…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/6zoDo9a0/s6/ross-chastain-no-1-trackhouse--3.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'wrc',
    headline: 'WRC Paraguay: Penultimate stage cancelled after violent Katsuta crash',
    source: 'Autosport',
    url: 'https://www.autosport.com/wrc/news/wrc-paraguay-penultimate-stage-cancelled-after-violent-takamoto-katsuta-crash/10850820/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-08-30T16:00:01.000Z',
    excerpt: 'Takamoto Katsuta and co-driver Aaron Johnston have been taken to hospital for precautionary checks following a violent crash that forced organisers to cancel the penultimate stage at Rally Paraguay.Katsuta\'s GR Yaris went up onto two wheels while navigating through a fast left…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/YK151MO0/s6/takamoto-katsuta-aaron-johnsto-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'motogp',
    headline: '“I can’t imagine” - Pecco Bagnaia’s grim MotoGP outlook after Aragon crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1103327/1/i-cant-imagine-pecco-bagnaias-grim-motogp-outlook-after-aragon-crash',
    publishedAt: '2026-08-30T14:47:32.000Z',
    excerpt: 'Pecco Bagnaia is worried about his form after a crash at the Aragon GP',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-08/gng_1340156_hires.jpg?width=1600&aspect_ratio=16:9',
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
    headline: 'Marc Marquez wins Aragon MotoGP after stunning Marco Bezzecchi pass',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1103315/1/marc-marquez-wins-aragon-motogp-after-stunning-marco-bezzecchi-pass',
    publishedAt: '2026-08-30T12:50:43.000Z',
    excerpt: 'Marc Marquez has secured an Aragon double after winning the grand prix on Sunday',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-08/gng_1339379_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'wrc',
    headline: 'WRC Paraguay: Penultimate stage cancelled after violent Takamoto Katsuta crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/wrc/news/wrc-paraguay-penultimate-stage-cancelled-after-violent-takamoto-katsuta-crash/10850818/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-08-30T15:58:04.000Z',
    excerpt: 'Takamoto Katsuta and co-driver Aaron Johnston have been taken to hospital for precautionary checks following a violent crash that forced organisers to cancel the penultimate stage at Rally Paraguay.Katsuta\'s GR Yaris went up onto two wheels while navigating through a fast left…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/0kZXZV86/s6/takamoto-katsuta-aaron-johnsto.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'wec',
    headline: 'Comtoyou Wins At The Nürburgring As Winward Crowned Endurance Cup Champions',
    source: 'DailySportsCar',
    url: 'https://www.dailysportscar.com/2026/08/30/comtoyou-wins-at-the-nurburgring-as-winward-crowned-endurance-cup-champions.html?utm_source=rss&#038;utm_medium=rss&#038;utm_campaign=comtoyou-wins-at-the-nurburgring-as-winward-crowned-endurance-cup-champions',
    publishedAt: '2026-08-30T16:11:10.000Z',
    excerpt: 'Comtoyou Racing has scored its second win of the 2026 GT World Challenge Europe Endurance Cup season this afternoon at the Nürburgring, whilst fourth-place was enough for the #48 Winward Racing Mercedes-AMG GT3 EVO of Maro Engel, Luca Stolz and Lucas Auer to be crowned champions…',
    imageUrl: 'https://www.dailysportscar.com/wp-content/uploads/2030/01/PMW-2026-Expo-Banner.png',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'wec',
    headline: 'Comtoyou Aston Wins, Winward Mercedes-AMG Takes Title',
    source: 'Sportscar365',
    url: 'https://sportscar365.com/sro/world-challenge-europe/comtoyou-aston-wins-winward-mercedes-amg-takes-title/',
    publishedAt: '2026-08-30T16:20:01.000Z',
    excerpt: 'Second win of season for Aston crew at Nürburgring as Engel, Stolz, Auer do just enough to Endurance Cup glory...',
    imageUrl: 'https://sportscar365.com/wp-content/uploads/2026/08/Start-0Q3A6153.jpg',
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
