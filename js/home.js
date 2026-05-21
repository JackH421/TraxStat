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
    headline: 'Williams signs key leaders from McLaren, Mercedes, Alpine',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/williams-signs-key-leaders-from-mclaren-mercedes-alpine/10822599/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-21T15:41:31.000Z',
    excerpt: 'Williams has announced it has hired key personnel from several rival Formula 1 teams, most importantly Piers Thynne from McLaren.Thynne has been a stalwart of the Woking-based outfit, which he joined in 2007 as a gearbox programme manager – thanks to the experience previously…',
    imageUrl: 'https://cdn-8.motorsport.com/images/amp/6b8jrNB2/s6/carlos-sainz-williams-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: '\'Lots of people trying to retire me\' - Hamilton confirms Ferrari contract for 2027',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/f1/news/12433/13546658/lewis-hamilton-ferrari-driver-says-lots-of-people-are-trying-to-retire-me-as-he-confirms-contract-until-at-least-2027',
    publishedAt: '2026-05-21T18:10:00.000Z',
    excerpt: 'Lewis Hamilton says "a lot of people are trying to retire me" and confirmed he has a contract with Ferrari until at least the end of 2027.',
    imageUrl: 'https://e0.365dm.com/26/03/1600x900/skysports-lewis-hamilton-ferrari_7184960.jpg?20260307091831',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'Racing Bulls key signing set for debut as fresh F1 challenge revealed',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/racing-bulls-key-signing-set-for-debut-as-fresh-f1-challenge-revealed',
    publishedAt: '2026-05-21T14:30:00.000Z',
    excerpt: 'A major coup for Racing Bulls will make his first appearance trackside in Canada.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Lindblad/SI202603080139.jpg?v=1772969696&width=1800&height=945&quality=75&crop=3840%2C2016%2C0%2C70',
    imageCredit: 'Lindblad Australia race'
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Kyle Busch hospitalized with \'severe illness\', out for Coke 600',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/kyle-busch-hospitalized-with-illness-out-for-coke-600-/10822595/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-21T15:31:48.000Z',
    excerpt: 'Kyle Busch has been checked into a hospital with an undisclosed illness and will not compete in the Coca-Cola 600 this weekend at Charlotte Motor Speedway. Busch, who won the Coke 600 in 2018, has not missed the event since 2003.The official Kyle Busch social media channels…',
    imageUrl: 'https://cdn-7.motorsport.com/images/amp/63QmDVq2/s6/kyle-busch-richard-childress-r.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Daytona International Speedway to install new advanced LED lighting system',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/daytona-international-speedway-to-install-new-state-of-the-art-lightning-system/10822450/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-05-21T14:01:03.000Z',
    excerpt: 'The \'World Center of Racing\' is getting a major update in the form of Musco’s modern LED lighting system, the same system utilized by venues like Yas Marina Circuit, which hosts the Formula 1 Abu Dhabi Grand Prix. Musco also installed the original system at Daytona International…',
    imageUrl: 'https://cdn-6.motorsport.com/images/amp/6O79JkX6/s6/daytona-international-speedway.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Busch hospitalized due to illness, sidelined for Charlotte',
    source: 'Racer',
    url: 'https://racer.com/2026/05/21/busch-hospitalized-due-to-illness-sidelined-for-charlotte',
    publishedAt: '2026-05-21T14:38:38.000Z',
    excerpt: 'Kyle Busch has been hospitalized with an undisclosed illness and will not race this weekend at Charlotte Motor Speedway.',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'motogp',
    headline: 'Alex Marquez to miss next two MotoGP rounds after Barcelona crash',
    source: 'Autosport',
    url: 'https://www.autosport.com/motogp/news/alex-marquez-to-miss-next-two-motogp-rounds-after-barcelona-crash/10822553/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-05-21T12:33:56.000Z',
    excerpt: 'Alex Marquez will sit out MotoGP’s upcoming rounds at Mugello and Balaton Park to continue recovery from the injuries he sustained in last weekend’s Catalan Grand Prix.In a short post on social media on Thursday, Gresini Racing shared a picture of Marquez wearing a neck brace…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/0JXwJpyY/s6/alex-marquez-gresini-racing-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'motogp',
    headline: 'Gresini confirms upcoming MotoGP races Alex Marquez will miss after horror crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/motogp/news/1095704/1/gresini-confirms-upcoming-motogp-races-alex-marquez-will-miss-after-horror',
    publishedAt: '2026-05-21T11:52:11.000Z',
    excerpt: 'Gresini has confirmed Alex Marquez’s absence from the next two races',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-05/gng_1315917_hires.jpg?width=1600&aspect_ratio=16:9',
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
    headline: 'British GT Championship: Oulton Park Preview',
    source: 'DailySportsCar',
    url: 'https://www.dailysportscar.com/2026/05/21/british-gt-championship-oulton-park-preview.html?utm_source=rss&#038;utm_medium=rss&#038;utm_campaign=british-gt-championship-oulton-park-preview',
    publishedAt: '2026-05-21T15:50:59.000Z',
    excerpt: 'After the three-hour Silverstone 500 season opener, the 2026 British GT Championship heads to Oulton Park this Bank Holiday weekend for the second race meeting on the calendar. Located in Cheshire, this venue is perfect for British GT’s sprint race format due to its narrow,…',
    imageUrl: 'https://www.dailysportscar.com/wp-content/uploads/2026/05/67-Orange-Racing-by-JMH-McLaren-720S-GT3-Evo-2026-British-GT-Silverstone-500.jpg',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'f1',
    headline: 'Hamilton ditched Ferrari simulator for Canadian GP',
    source: 'The Race',
    url: 'https://www.the-race.com/formula-1/hamilton-ditched-ferrari-simulator-for-canadian-gp/',
    publishedAt: '2026-05-21T18:23:13.000Z',
    excerpt: 'Lewis Hamilton followed through on his plan to ditch using Ferrari’s Formula 1 simulator ahead of this weekend’s Canadian Grand Prix',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/05/XPB_1409758_HiRes.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'f1',
    headline: 'Ocon: \'Bulls**t\' rumours of Haas F1 exit causing real damage',
    source: 'The Race',
    url: 'https://www.the-race.com/formula-1/esteban-ocon-rants-at-bullying-like-rumours-of-haas-f1-exit/',
    publishedAt: '2026-05-21T17:18:09.000Z',
    excerpt: 'A bewildered Esteban Ocon has rubbished the rumours of a relationship breakdown with his F1 team Haas',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/05/XPB_1409722_HiRes.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'f1',
    headline: 'Ex-McLaren F1 COO among senior figures poached by Williams',
    source: 'The Race',
    url: 'https://www.the-race.com/formula-1/mclaren-f1-coo-among-senior-figures-poached-by-williams/',
    publishedAt: '2026-05-21T15:31:35.000Z',
    excerpt: 'Williams has signed McLaren\'s chief operating officer as part of a recruitment drive that also includes senior Mercedes and Alpine F1 staff',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/05/XPB_1407817_HiRes.jpg',
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
