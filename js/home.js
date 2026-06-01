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
    headline: 'Ryan Blaney takes blame for huge Reddick, Elliott crash at checkered flag',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/ryan-blaney-takes-blames-for-causing-reddick-elliott-crash-at-checkered-flag/10825894/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-01T06:16:35.000Z',
    excerpt: 'On the final lap of Sunday\'s NASCAR Cup race at Nashville, a multi-car battle was getting intense around the final spot inside the top five.With two fresh right-sides, Tyler Reddick squeezed between Chase Elliott and Shane van Gisbergen at the exit of Turn 4. He and Elliott…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/0JXw8pAY/s6/ryan-blaney-team-penske-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Mercedes loophole officially banned as key Monaco GP rule change explained – RacingNews365 Review',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/mercedes-loophole-officially-banned-as-key-monaco-gp-rule-change-explained-racingnews365-review',
    publishedAt: '2026-06-01T20:00:00.000Z',
    excerpt: 'Check out the biggest stories of the day with the RacingNews365 Review!',
    imageUrl: 'https://cdn.racingnews365.com/2026/Russell/XPB_1411114_HiRes.jpg?v=1779571297&width=1800&height=945&quality=75&crop=5185%2C2723%2C0%2C369',
    imageCredit: 'Russell pole Canada'
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'Max Verstappen\'s first serious F1 crash and the remarkable consequences that followed',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/max-verstappens-first-serious-f1-crash-and-the-remarkable-consequences-that-followed',
    publishedAt: '2026-06-01T17:07:00.000Z',
    excerpt: 'They say you always remember your first time for most things. Wonder if Max Verstappen still recalls this?',
    imageUrl: 'https://cdn.racingnews365.com/XPB_743046_HiRes.jpg?v=1780303068&width=1800&height=945&quality=75&crop=5184%2C2722%2C0%2C367',
    imageCredit: 'Verstappen Grosjean crash 2015'
  },
  {
    id: 'a4',
    series: 'f1',
    headline: 'Mercedes reveal cause of Russell\'s Canada retirement may take \'several months\' to confirm',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/news/12433/13549761/george-russell-mercedes-reveal-confirmation-of-cause-of-canadian-grand-prix-retirement-could-take-several-months',
    publishedAt: '2026-06-01T11:00:00.000Z',
    excerpt: 'Mercedes have revealed the exact cause of George Russell\'s sudden retirement from the Canadian Grand Prix could take "several months" to confirm due to complications.',
    imageUrl: 'https://e0.365dm.com/26/06/1600x900/skysports-f1-george-russell_7262829.jpg?20260601114131',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Nick Sanchez joins Peterson team in multi-race NASCAR O\'Reilly deal',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/nascar-os/news/nick-sanchez-secures-nascar-oreilly-ride/10826099/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-01T18:08:46.000Z',
    excerpt: 'After losing his ride twice since the end of 2025 season, Nick Sanchez is coming back in the NASCAR O\'Reilly Auto Parts Series.He will drive the No. 87 Peterson Racing entry in several upcoming NASCAR O\'Reilly races, starting with Pocono race on June 13. He will also compete at…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/6lmd8eK0/s6/austin-green-no-87-peterson-ra.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Denny Hamlin wins frantic Nashville NASCAR Cup finish as JGR sweeps top three',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/denny-hamlin-wins-frantic-nashville-nascar-finish-as-jgr-sweeps-top-three/10825877/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-01T04:50:45.000Z',
    excerpt: 'In a mad four-lap dash to the checkered flag, Denny Hamlin led a Joe Gibbs Racing 1-2-3, and at the white flag, they were all battling three-wide for the win.Hamlin cleared Christopher Bell at the exit of Turn 2 on the final lap, winning the race over Bell in second and Chase…',
    imageUrl: 'https://cdn-9.motorsport.com/images/amp/YE9wvbLY/s6/three-wide-battle-for-the-win--2.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'wec',
    headline: 'Dries Vanthoor explains contact with brother Laurens, slams penalty',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/imsa/news/dries-vanthoor-explains-contact-with-brother-laurens-slams-penalty/10826120/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-01T19:29:43.000Z',
    excerpt: 'BMW factory driver Dries Vanthoor explained the collision at the IMSA race in Detroit and expressed his lack of understanding regarding the penalty handed to the #24 WRT BMW he shared with Sheldon van der Linde.The contact triggered the second caution of the race. Vanthoor was…',
    imageUrl: 'https://cdn-3.motorsport.com/images/amp/68VWxpx2/s6/24-bmw-m-team-wrt-bmw-m-hybrid.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'Crowdfunding campaign for injured sidecar rider after TT crash',
    source: 'The Race',
    url: 'https://www.the-race.com/tt/isle-of-man-tt-crowdfunding-campaign-maria-costello-injured-sidecar-crash/',
    publishedAt: '2026-06-01T15:13:42.000Z',
    excerpt: 'A crowdfunding campaign has been launched for Isle of Man TT competitor Maria Costello after the extent of the injuries she sustained during sidecar practice were detailed',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/06/480880368_621676150493817_3012973139989185662_n.jpg',
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
    headline: 'Maria Costello fundraiser set up as extent of injuries revealed after Isle of Man TT crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/rr/news/1096705/1/maria-costello-fundraiser-set-extent-injuries-revealed-after-isle-man-tt-crash',
    publishedAt: '2026-06-01T15:17:08.000Z',
    excerpt: 'A GoFundMe has been set up to help injured Isle of Man TT racer Maria Costello',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/costello-2019-ctt.png?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'f1',
    headline: 'F1 champion reconsiders motorsport retirement with comeback desire',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/f1-champion-reconsiders-motorsports-retirement-with-comeback-wish',
    publishedAt: '2026-06-01T14:40:00.000Z',
    excerpt: 'It hasn\'t taken Jenson Button long to get itchy racing feet again.',
    imageUrl: 'https://cdn.racingnews365.com/HH5SxsVXMAQEFIC.jpeg?v=1780317920&width=1800&height=945&quality=75&crop=2856%2C1500%2C0%2C52',
    imageCredit: 'Aston Martin Valkyrie'
  },
  {
    id: 'a103',
    series: 'f1',
    headline: 'Drivers banned from Monza after \'pepper spray\' brawl with security personnel',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/drivers-banned-from-monza-after-pepper-spray-brawl-with-security-personnel',
    publishedAt: '2026-06-01T13:30:00.000Z',
    excerpt: 'This is quite a shocking incident, and the drivers involved were severely punished.',
    imageUrl: 'https://cdn.racingnews365.com/51-CMR.jpg?v=1780307257&width=1200&height=630&quality=75&crop=789%2C415%2C0%2C14',
    imageCredit: '51 CMR Mogica/Mogica'
  },
  {
    id: 'a104',
    series: 'motogp',
    headline: 'Official: Cal Crutchlow returns for second MotoGP race with LCR in Hungary',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1096714/1/official-cal-crutchlow-returns-second-motogp-race-lcr-hungary',
    publishedAt: '2026-06-01T18:13:33.000Z',
    excerpt: 'Cal Crutchlow will continue to replace Johann Zarco at the Hungarian Grand Prix',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/gng_1318955_hires_1600x900.jpg?width=1600&aspect_ratio=16:9',
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
