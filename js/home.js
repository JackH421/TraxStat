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
    headline: 'Charles Leclerc’s Ferrari SUV is up for sale with scars from his viral Monaco crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/culture/news/charles-leclercs-daily-driven-ferrari-purosangue-is-up-for-sale-complete-with-scars-from-his-viral-/10877490/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-11-24T17:06:09.000Z',
    excerpt: 'In the exotic-car market, buyers normally run the other way at the first hint of high mileage, kerbed wheels, or accident history. When the previous owner happens to be Ferrari\'s star Formula 1 driver, those red flags suddenly become the main selling point. Charles Leclerc\'s…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/6DGgOjwY/s6/charles-leclerc-ferrari-a10877490-b708-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Lewis Hamilton signs for McLaren F1 in seismic moment – On This Day',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/lewis-hamilton-signs-for-mclaren-f1-in-seismic-moment-on-this-day',
    publishedAt: '2026-11-24T07:20:00.000Z',
    excerpt: 'On this day in 2006, Lewis Hamilton was revealed as a 2007 McLaren F1 driver.',
    imageUrl: 'https://cdn.racingnews365.com/Hamilton-2006.jpg?v=1795449450&width=1800&height=945&quality=75&crop=3504%2C1840%2C0%2C248',
    imageCredit: 'Hamilton 2006'
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'What time is F1\'s 2026 Qatar Grand Prix? Full weekend schedule',
    source: 'The Race',
    url: 'https://www.the-race.com/promoted/what-time-is-f1s-2026-qatar-grand-prix-full-weekend-schedule/',
    publishedAt: '2026-11-24T21:27:10.000Z',
    excerpt: 'All the times you need to know for Formula 1\'s next race - the 2026 Qatar Grand Prix',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/11/XPB_1389214_HiRes.jpg',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Spire rejects Gibbs check to resolve counterclaim issues',
    source: 'Racer',
    url: 'https://racer.com/2026/11/24/spire-rejects-gibbs-check-to-resolve-counterclaim-issues',
    publishedAt: '2026-11-24T16:46:46.000Z',
    excerpt: 'Joe Gibbs Racing issue a check for over $100,000 to settle a "breach of contract" issue between it an Spire Motorsports amind their ongoing legal dispute but Spire has rejected it.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Spire returns check to Joe Gibbs Racing; rejects attempt to settle countersuit',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/spire-returns-check-to-joe-gibbs-racing-rejects-attempt-to-settle-countersuit/10877332/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-11-24T05:09:47.000Z',
    excerpt: 'Spire Motorsports has returned the check for over $100,000 that Joe Gibbs Racing wrote to satisfy a countersuit filed in the ongoing legal matter regarding Chris Gabehart and intellectual property misappropriation.Specifically, Spire countersued Joe Gibbs Racing on June 25 for…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/0JXRDrBY/s6/image20241015133134.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Dodge’s NASCAR Cup car unveil will include celebrity exhibition race during Snowball Derby',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/dodges-nascar-cup-car-unveil-will-include-celebrity-exhibition-race-during-snowball-derby/10877320/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-11-23T22:58:50.000Z',
    excerpt: 'As part of the unveil of the Dodge car that will race in the NASCAR Cup Series next season under the Kaulig Racing umbrella, a celebrity race has been scheduled for the Snowball Derby featuring celebrities driving Late Model Stock Cars around Five Flags Speedway.The new Cup…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/6lmAp3L0/s6/672030415-1760307632025829-573.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'motogp',
    headline: 'How a year-old crash impacted the Portugal MotoGP podium battle',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1110864/1/how-year-old-crash-impacted-portugal-motogp-podium-battle',
    publishedAt: '2026-11-24T12:38:46.000Z',
    excerpt: 'One rider was overly cautious in the fight for the podium in Portugal due to a crash from last year',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-11/gng_1365234_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'wec',
    headline: 'Robert Wickens Makes Full-Time IMSA GTD Debut With HMI',
    source: 'DailySportsCar',
    url: 'https://www.dailysportscar.com/2026/11/24/robert-wickens-makes-full-time-imsa-gtd-debut-with-hmi.html?utm_source=rss&#038;utm_medium=rss&#038;utm_campaign=robert-wickens-makes-full-time-imsa-gtd-debut-with-hmi',
    publishedAt: '2026-11-24T16:30:06.000Z',
    excerpt: 'IMSA newcomer Hanley Motorsports Incorporated (HMI) has announced that Robert Wickens and Mason Filippi will drive the team&#8217;s #42 BMW M4 GT3 EVO in the 2027 IMSA WeatherTech SportsCar Championship GTD class. This will mark Wickens&#8217; return to full-time racing and…',
    imageUrl: 'https://www.dailysportscar.com/wp-content/uploads/2026/11/Mason-Filippi-Robert-Wickens-Announcement.jpg',
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
    headline: 'Ford debuts new 5.4L V8 Hypercar engine spec at successful first endurance test',
    source: 'Racer',
    url: 'https://racer.com/2026/11/23/ford-debuts-new-5-4l-v8-hypercar-engine-spec-at-successful-first-endurance-test',
    publishedAt: '2026-11-24T12:30:14.000Z',
    excerpt: 'Ford debuted a new specification of its 5.4-liter V8 Hypercar engine during a successful first endurance test at Motorland Aragón, Spain last week as the testing phase for its FIA WEC-bound ORECA-based LMDh reached a major milestone.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'indycar',
    headline: 'What\'s next for Herta after F1 2027 snub?',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/whats-next-for-herta-after-f1-2027-snub/10877533/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-11-24T17:59:55.000Z',
    excerpt: 'Cadillac\'s decision to stick with veteran incumbent Valtteri Bottas to partner Sergio Perez is a choice for continuity and stability after a debut campaign plagued with issues for Formula 1\'s 11th team in 2026. It also raises key questions over what\'s next for Colton Herta.With…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/0arKWNy2/s6/colton-herta-hitech-gp-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'wrc',
    headline: 'Rovanpera: New 2027 WRC cars will see "everybody start from zero"',
    source: 'Autosport',
    url: 'https://www.autosport.com/wrc/news/rovanpera-new-2027-wrc-cars-will-see-everybody-start-from-zero/10877526/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-11-24T17:14:16.000Z',
    excerpt: 'Kalle Rovanpera expects the 2027 World Rally Championship to be a reset for the drivers with ‘everybody starting from zero’ as they adapt to all-new Rally1 cars.After a year on the sidelines, the two-time world champion will rejoin the WRC next season to contest a partial…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/6grQnexY/s6/kalle-rovanpera-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'f1',
    headline: 'Former F1 tester who suffered life-changing injuries in full-time racing return',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1110872/1/former-f1-tester-who-suffered-life-changing-injuries-full-time-racing-return',
    publishedAt: '2026-11-24T17:10:00.000Z',
    excerpt: 'A former Formula 1 test driver has secured a full-time seat in one of North America\'s leading motorsport championships for 2027',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-11/xpb_911638_hires.jpg?width=1600&aspect_ratio=16:9',
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
      <div class="home-champ-pts"><span style="color:var(--yellow);">${iL.points} PTS</span><span style="color:var(--muted);">  ·  ${indyCarSeasonComplete()?'🏆 CHAMPION':'+'+iGap}</span></div>
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
      <div class="home-champ-pts"><span style="color:var(--yellow);">${rL.points} PTS</span><span style="color:var(--muted);">  ·  ${wrcSeasonComplete()?'🏆 CHAMPION':'+'+rGap}</span></div>
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
