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
    headline: 'Adjusted 2026 F1 championship standings after Monaco penalty rescinded',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/adjusted-2026-f1-championship-standings-after-monaco-penalty-rescinded',
    publishedAt: '2026-06-12T10:50:00.000Z',
    excerpt: 'There has been a change to the championship standings following Pierre Gasly\'s penalty being rescinded.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Monaco-start_2026-06-10-170838_yawk.jpg?v=1781111320&width=1800&height=945&quality=75&crop=5185%2C2723%2C0%2C369',
    imageCredit: 'Monaco start'
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Dramatic penalty strips former F1 driver of Le Mans 24 Hours pole',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/dramatic-penalty-strips-former-f1-driver-of-le-mans-24-hours-pole',
    publishedAt: '2026-06-11T20:37:00.000Z',
    excerpt: 'A late twist to qualifying at Le Mans as the pole position award changed hands after the session ended.',
    imageUrl: 'https://cdn.racingnews365.com/2026/38-Cadillac.jpg?v=1781208115&width=1800&height=945&quality=75&crop=6000%2C3150%2C0%2C425',
    imageCredit: '38 Cadillac'
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'Mercedes weighs up legal options over Gasly Monaco F1 penalty precedent',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/mercedes-weighs-up-legal-options-over-gasly-monaco-f1-penalty-precedent/10829603/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-06-12T15:46:14.000Z',
    excerpt: 'Toto Wolff says Mercedes is "looking what it can do" for George Russell after FIA stewards overturned Pierre Gasly\'s Formula 1 Monaco Grand Prix penalty.Gasly was one of five drivers penalised for pitlane speeding, with it emerging after the race that there had been an error…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/YvKQX3n6/s6/george-russell-mercedes-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Will Denny Hamlin catch Tyler Reddick for the championship lead?',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/will-denny-hamlin-catch-tyler-reddick-for-the-championship-lead/10829606/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-12T15:58:02.000Z',
    excerpt: 'On NASCAR\'s Inside the Race podcast with Steve Letarte and Kyle Petty, they broke down the recent race at Michigan International Speedway, which featured a record-number of cautions.One of those cautions involved Tyler Reddick, whose incredible top 15 streak came to an abrupt…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/2y7A1Ny6/s6/tyler-reddick-no-45-23xi-racin.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Kyle Busch Remembered: From winning Pocono with one gear to KBM\'s 100th',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/kyle-busch-remembered-pocono-one-gear-kbm-win/10829330/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-12T16:04:18.000Z',
    excerpt: 'As NASCAR heads to Pocono, we want to highlight the most iconic Kyle Busch moments from his time racing at the Tricky Triangle. It was the site of several milestone wins for KB, and a track he seemed to enjoy quite a bit with a total of eight wins.Busch is the winningest driver…',
    imageUrl: 'https://cdn-9.motorsport.com/images/amp/0kZAzbq6/s6/kyle-busch-earns-kyle-busch-mo.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'The many ways Pocono Raceway is honoring Kyle Busch this weekend',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/the-many-ways-pocono-raceway-is-honoring-kyle-busch-this-weekend/10829336/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-12T13:35:02.000Z',
    excerpt: 'Pocono Raceway doesn\'t have infield grass where they can stencil a black No. 8, but the track is going out of its way to honor fallen NASCAR legend Kyle Busch.The 41-year-old died unexpectedly on May 21st after a severe case of pneumonia progressed into sepsis. With 234 NASCAR…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/0qgPDmgY/s6/kbpocono-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'wec',
    headline: '“I know I’m going to die here” – Davidson reflects on back-breaking Le Mans crash',
    source: 'Autosport',
    url: 'https://www.autosport.com/wec/news/i-know-im-going-to-die-here-anthony-davidson-reflects-on-back-breaking-le-mans-crash/10829374/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-06-12T07:56:16.000Z',
    excerpt: 'Anthony Davidson says he thought he was “going to die” in his frightening, race-ending crash at the 2012 Le Mans 24 Hours.Davidson was running third overall in the #8 Toyota when he collided with the #81 AF Corse Ferrari driven by Piergiuseppe Perazzini, as he attempted to lap…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/2Qe85XN2/s6/8-toyota-ts-030-hybrid.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'wec',
    headline: 'Le Mans polesetter Dries Vanthoor on record-breaking lap, penalty drama, and BMW’s odds for victory',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/wec/news/le-mans-polesetter-dries-vanthoor-on-record-breaking-lap-penalty-drama-and-bmws-odds-for-victory/10829517/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-12T13:02:53.000Z',
    excerpt: 'Motorsport: Dries, yesterday you officially set the fastest ever Hypercar lap at Le Mans, in 3m22.564s. Can you tell us about that lap, and what it was like from your perspective?Dries Vanthoor: “It was a great day yesterday, obviously. I think the lap itself was pretty good. I…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/YK13ZJb0/s6/15-bmw-m-team-wrt-bmw-m-hybrid.jpg',
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
    headline: '“I know I’m going to die here” – Anthony Davidson reflects on back-breaking Le Mans crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/wec/news/i-know-im-going-to-die-here-anthony-davidson-reflects-on-back-breaking-le-mans-crash/10829361/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-12T07:54:15.000Z',
    excerpt: 'Anthony Davidson says he thought he was “going to die” in his frightening, race-ending crash at the 2012 Le Mans 24 Hours.Davidson was running third overall in the #8 Toyota when he collided with the #81 AF Corse Ferrari driven by Piergiuseppe Perazzini, as he attempted to lap…',
    imageUrl: 'https://cdn-5.motorsport.com/images/amp/2Qe85XN2/s6/8-toyota-ts-030-hybrid.jpg',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'wec',
    headline: 'Le Mans 24h: BMW inherits pole position after Cadillac penalty',
    source: 'Autosport',
    url: 'https://www.autosport.com/wec/news/le-mans-24h-cadillac-snatches-pole-away-from-bmw-by-0005s/10829274/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-06-11T20:09:12.000Z',
    excerpt: 'BMW has taken pole position for the 2026 Le Mans 24 Hours with Dries Vanthoor after Cadillac\'s effort, quicker by five-thousandths of a second, was rendered null and void by the stewards.Read Also:WECWhy Cadillac lost pole position for Le Mans 24 HoursIn Hyperpole 1, Earl…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/6zoJOXJ0/s6/15-bmw-m-team-wrt-bmw-m-hybrid-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'wec',
    headline: 'BMW gifted 24 Hours of Le Mans pole after Cadillac penalty',
    source: 'Crash.net',
    url: 'https://www.crash.net/le-mans/news/1097631/1/bmw-gifted-24-hours-le-mans-pole-after-cadillac-penalty',
    publishedAt: '2026-06-11T20:28:28.000Z',
    excerpt: 'Cadillac scored its second successive pole at the 24 Hours of Le Mans, but was stripped of it post-session',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-06/xpb_1415792_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'wec',
    headline: 'Le Mans 24h: Cadillac snatches pole away from BMW by 0.005s... then gets penalty',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/wec/news/le-mans-24h-hyperpole/10829260/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-11T20:04:00.000Z',
    excerpt: 'BMW has taken pole position for the 2026 Le Mans 24 Hours with Dries Vanthoor after Cadillac\'s effort, quicker by five-thousandths of a second, was rendered null and void by the stewards.Read Also:WECWhy Cadillac lost pole position for 2026 Le Mans 24 HoursHypercarIn Hyperpole…',
    imageUrl: 'https://cdn-6.motorsport.com/images/amp/YpbPZB30/s6/38-cadillac-hertz-team-jota-ca.jpg',
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
