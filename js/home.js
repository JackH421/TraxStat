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
    headline: 'Hungarian GP: Hamilton set to contend in wide-open pole battle LIVE!',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/live-blog/12433/13566060/f1-hungarian-gp-live-final-practice-and-qualifying-updates-results-stream-highlights-from-formula-1-race-weekend-at-hungaroring-in-budapest',
    publishedAt: '2026-07-25T13:13:00.000Z',
    excerpt: 'Follow live updates and watch the best video from the Hungarian Grand Prix on Saturday. Watch live on Sky Sports F1',
    imageUrl: 'https://e0.365dm.com/26/07/1600x900/skysports-f1-lewis-hamilton_7306472.jpg?20260725141330',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Strange Sergio Perez incident brings out red flag after sudden Cadillac failure',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/strange-sergio-perez-incident-brings-out-red-flag-after-sudden-cadillac-failure',
    publishedAt: '2026-07-25T10:58:00.000Z',
    excerpt: 'Sergio Perez\'s FP3 in Budapest lasted just one corner before a bizarre failure at the rear of his Cadillac.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Screenshot-2026-07-25-at-12.50.56_2026-07-25-105236_kdsc.png?v=1784976757&width=1200&height=630&quality=75&crop=1136%2C597%2C0%2C49',
    imageCredit: 'Screenshot 2026 07 25 at 12 50 56'
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'Norris puts upgraded McLaren on top from Hamilton in final practice',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/news/12433/13566869/hungarian-gp-lando-norris-fastest-in-final-practice-for-mclaren-ahead-of-lewis-hamilton-and-kimi-antonelli-at-hungaroring',
    publishedAt: '2026-07-25T11:38:00.000Z',
    excerpt: 'Lando Norris gave McLaren hope of challenging for their first Grand Prix pole position of the season in their upgraded car in Hungary by impressively outpacing Friday pacesetter Lewis Hamilton and Mercedes\' title-leading Kimi Antonelli in final practice.',
    imageUrl: 'https://e0.365dm.com/26/07/1600x900/skysports-lando-norris-mclaren_7306432.jpg?20260725123146',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'What next for Alex Bowman after NASCAR retirement in 2027?',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/what-next-for-alex-bowman-after-nascar-retirement-in-2027/10841499/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-07-24T17:16:38.000Z',
    excerpt: 'No, Alex Bowman doesn’t have a future in broadcasting after his retirement from full-time NASCAR Cup Series competition after the 2027 season.“I don\'t know that anybody wants to listen to me on the broadcast, if I\'m being honest,” said Bowman during a press conference on Friday…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/YWKw89kY/s6/alex-bowman-hendrick-motorspor.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Riggs dominates Truck Series race at IRP',
    source: 'Racer',
    url: 'https://racer.com/2026/07/25/riggs-dominates-truck-series-race-at-irp',
    publishedAt: '2026-07-25T11:58:08.000Z',
    excerpt: 'The driver of the No. 34 Front Row Motorsports Ford led 198 of 200 laps, swept both stages and took the checkered flag 1.148s ahead of persistent runner-up Connor Mosack to claim his second straight victory at Lucas Oil Indianapolis Raceway Park.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Layne Riggs dominates IRP to score fifth NASCAR Truck win of 2026',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-truck/news/layne-riggs-dominates-irp-to-score-fifth-nascar-truck-win-of-2026/10841593/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-07-25T02:28:45.000Z',
    excerpt: 'Layne Riggs now has 10 wins as a NASCAR Craftsman Truck Series driver, with half coming this season. Riggs was unstoppable at IRP, leading almost every lap (198 of 200) en route to a dominant victory over Connor Mosack, who earned a career-best finish in second.The victory also…',
    imageUrl: 'https://cdn-9.motorsport.com/images/amp/6lmADoL0/s6/layne-riggs-no-34-front-row-mo.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'other',
    headline: 'DTM Oschersleben: Preining wins, Thiim loses points lead to Engel',
    source: 'Autosport',
    url: 'https://www.autosport.com/dtm/news/dtm-oschersleben-preining-wins-thiim-loses-points-lead-to-engel/10841726/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-07-25T13:37:05.000Z',
    excerpt: 'Thomas Preining has clinched victory in Saturday\'s DTM race at Oschersleben, taking his second win of the season, in a dominant fashion from pole position The 2023 DTM champion took victory by 1.601s ahead of Abt Lamborghini\'s Luca Engstler, with Maro Engel in third for Winward…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/K6x4xW76/s6/dtm-rennen-oschersleben-1-preining-siegt-thiim-verliert-dtm-fuehrung-26072503.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'Formula E Tokyo E-Prix: Ticktum pulls off last-lap overtake on Dennis for victory',
    source: 'Autosport',
    url: 'https://www.autosport.com/formula-e/news/formula-e-tokyo-e-prix-dan-ticktum-pulls-off-last-lap-overtake-on-jake-dennis-for-victory/10841720/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-07-25T13:14:34.000Z',
    excerpt: 'Dan Ticktum stunned Jake Dennis with a last-lap overtake to clinch victory in the Formula E Tokyo opener, while Mitch Evans reclaimed the drivers’ championship lead as Pascal Wehrlein failed to finish.The Cupra Kiro driver outfoxed Dennis on the final lap, despite having…',
    imageUrl: 'https://cdn-3.motorsport.com/images/amp/YP7rD932/s6/dan-ticktum-cupra-kiro.jpg',
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
    headline: 'Formula E title favourites suffer shocker as Jake Dennis clinches Tokyo pole',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/formula-e-title-favourites-suffer-shocker-as',
    publishedAt: '2026-07-25T08:04:00.000Z',
    excerpt: 'Jake Dennis secured pole position for the opening race of Formula E\'s Tokyo E-Prix double-header.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Formula-E/Dennis-Tokyo-FP2.jpg?v=1784966556&width=1200&height=630&quality=75&crop=2048%2C1076%2C0%2C145',
    imageCredit: 'Dennis Tokyo FP2'
  },
  {
    id: 'a102',
    series: 'other',
    headline: 'DTM Oschersleben: Thomas Preining wins first race, Nicki Thiim loses DTM lead',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/dtm/news/dtm-race-oschersleben-1-preining-wins-thiim-loses-dtm-lead/10841715/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-07-25T13:12:26.000Z',
    excerpt: 'Thomas Preining (Manthey-Porsche) won Saturday\'s DTM race at Oschersleben, taking his second victory of the season. The 2023 DTM champion started from pole position and led the race from start to finish - pit-stop adjusted - across the entire race distance."Overall a perfect…',
    imageUrl: 'https://cdn-2.motorsport.com/images/amp/K6x4xW76/s6/dtm-rennen-oschersleben-1-preining-siegt-thiim-verliert-dtm-fuehrung-26072503.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'other',
    headline: 'Formula E Tokyo E-Prix: Dan Ticktum pulls off last-lap overtake on Jake Dennis for victory',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/formula-e/news/formula-e-tokyo-e-prix-dan-ticktum-pulls-off-last-lap-overtake-on-jake-dennis-for-victory/10841710/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-07-25T13:12:09.000Z',
    excerpt: 'Dan Ticktum stunned Jake Dennis with a last-lap overtake to clinch victory in the Formula E Tokyo opener, while Mitch Evans reclaimed the drivers’ championship lead as Pascal Wehrlein failed to finish.The Cupra Kiro driver outfoxed Dennis on the final lap, despite having…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/25d3Q4D0/s6/dan-ticktum-cupra-kiro-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'other',
    headline: 'DTM Oschersleben: Pole for Preining, anger for leader Thiim!',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/dtm/news/dtm-qualifying-oschersleben-1-pole-fur-preining-aerger-bei-leader-thiim/10841635/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-07-25T09:28:23.000Z',
    excerpt: 'An exciting starting position for the kickoff of the second half of the DTM season at Oschersleben: Thomas Preining, who had threatened to retire after a difficult Norisring weekend, secured pole position for Saturday\'s race with a 1:21.862. With this, Porsche strikes…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/N6VkMo70/s6/dtm-qualifying-oschersleben-1-pleite-fuer-dtm-leader-thiim-bei-porsche-pole-26072501-2.jpg',
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
