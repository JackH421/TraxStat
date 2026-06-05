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
    headline: 'Bizarre Isack Hadjar crash triggers first Monaco red flag',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/bizarre-isack-hadjar-crash-triggers-first-monaco-red-flag',
    publishedAt: '2026-06-05T12:13:00.000Z',
    excerpt: 'Isack Hadjar has suffered a strange accident in first practice at the Circuit de Monaco.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Screenshot-2026-06-05-at-14.06.49.png?v=1780661263&width=1200&height=630&quality=75&crop=1670%2C877%2C0%2C214',
    imageCredit: 'Screenshot 2026 06 05 at 14 06 49'
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Isack Hadjar crashes out of Monaco GP FP1 causing red flag',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/isack-hadjar-crashes-out-of-monaco-gp-fp1-causing-red-flag/10827034/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-05T12:18:15.000Z',
    excerpt: 'Red Bull Formula 1 driver Isack Hadjar has crashed out of the first practice session ahead of the 2026 Monaco Grand Prix. The red flag was waved with just under 24 minutes remaining of the 60-minute session after the French-Algerian driver crashed into the wall at the exit of…',
    imageUrl: 'https://cdn-1.motorsport.com/images/amp/2wlExdVY/s6/isack-hadjar-red-bull-racing.jpg',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: 'Hamilton goes fastest and Hadjar in HUGE crash during dramatic Monaco practice',
    source: 'Sky Sports F1',
    url: 'https://www.skysports.com/watch/video/13551206/monaco-grand-prix-practice-highlights',
    publishedAt: '2026-06-05T16:21:00.000Z',
    excerpt: 'Highlights from Friday\'s two dramatic practice sessions ahead of the Monaco Grand Prix.',
    imageUrl: 'https://e0.365dm.com/26/06/1600x900/skysports-motorsport-f1_7266349.jpg?20260605172403',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'NASCAR Hall of Famer and two-time Cup champion Ned Jarrett dies, aged 93',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/nascar-hall-of-famer-and-two-time-cup-champion-ned-jarrett-dies-aged-93/10827204/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-05T17:24:09.000Z',
    excerpt: 'Two-time NASCAR Cup Series champion Ned Jarrett has passed away at the age of 93. He is also the father of 1999 NASCAR Cup Series champion Dale Jarrett.The elder Jarrett was an icon both on the track and off. \'Gentleman\' Ned started 352 Cup races between 1953 and 1966, winning…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/Y9lLm4x2/s6/nedjarrett.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Samantha Busch releases message of thanks for support after death of Kyle Busch',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/samantha-busch-releases-message-of-thanks-for-support-after-kyle-buschs-passing/10827173/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-06-05T16:52:26.000Z',
    excerpt: 'Samantha Busch showed tremendous strength when she and the rest of Kyle\'s grieving family showed up to the Coca-Cola 600, where Kyle Busch was honored as part of the pre-race ceremonies, three days after he passed away.Samantha and Kyle were married for almost 16 years when he…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/2y7AxVX6/s6/richard-childress-samantha-bus.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Ned Jarrett 1932-2026',
    source: 'Racer',
    url: 'https://racer.com/2026/06/05/ned-jarrett-1932-2026',
    publishedAt: '2026-06-05T17:26:25.000Z',
    excerpt: 'Ned Jarrett, a two-time NASCAR Cup Series champion and former NASCAR broadcast analyst, has passed away. A statement from the Jarrett family issued Friday and revealed his passing occurred on Thursday, June 4. He was 93 years old.The full statement reads, “With profound sadness,…',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'other',
    headline: 'Camara rebounds from crash to claim F2 pole in Monaco',
    source: 'Racer',
    url: 'https://racer.com/2026/06/05/camara-rebounds-from-crash-to-claim-f2-pole-in-monaco',
    publishedAt: '2026-06-05T14:30:13.000Z',
    excerpt: 'Rafael Câmara recovered from early contact with the barriers that left him sidelined in the pitlane for much of the session to take pole for this weekend\'s Formula 2 race in Monte Carlo.The Invicta Racing driver’s 1m20.923s in Group A put him on pole for the Feature Race, with…',
    imageUrl: '',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'motogp',
    headline: 'Moto3 rider disqualified from six races over “signs of engine tampering”',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/moto3/news/moto3-rider-disqualified-from-six-races-over-signs-of-engine-tampering/10827027/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-06-05T12:13:32.000Z',
    excerpt: 'Leopard Racing rider Adrian Fernandez has been excluded from the opening six races of the 2026 Moto3 season after two of his engines showed “signs of tampering”.In two separate reports on Friday afternoon ahead of the Hungarian Grand Prix, the stewards noted that the two Honda…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/YpbPvp30/s6/adrian-fernandez-leopard-racin.jpg',
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
    headline: 'F1 Monaco GP: Leclerc leads Ferrari 1-2 in first practice, Hadjar and Alonso suffer crashes',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/f1-monaco-gp-leclerc-leads-ferrari-1-2-in-first-practice-hadjar-and-alonso-suffer-crashes/10827045/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-06-05T12:44:08.000Z',
    excerpt: 'Charles Leclerc was quickest in opening practice for the Monaco Grand Prix as Ferrari went 1-2 to back up its pre-weekend hype, while Isack Hadjar crashed for Red Bull.Leclerc set a 1m13.978s at his home circuit, 0.226s faster than team-mate Lewis Hamilton after many had picked…',
    imageUrl: 'https://cdn-6.motorsport.com/images/amp/6b8jP7p2/s6/charles-leclerc-ferrari-2.jpg',
    imageCredit: ''
  },
  {
    id: 'a102',
    series: 'other',
    headline: 'Dunlop takes another two dominant wins as TT resumes',
    source: 'The Race',
    url: 'https://www.the-race.com/tt/isle-of-man-tt-2026-all-the-results/',
    publishedAt: '2026-06-05T15:39:00.000Z',
    excerpt: 'Isle of Man TT racing finally resumed on Friday afternoon with another commanding win for Michael Dunlop in the second Supersport TT',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/06/art-intro-jpg_c9043f2e.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'f1',
    headline: 'Big Hadjar crash as Ferrari leads Monaco GP practice',
    source: 'The Race',
    url: 'https://www.the-race.com/formula-1/big-hadjar-crash-as-ferrari-leads-monaco-gp-practice/',
    publishedAt: '2026-06-05T13:01:54.000Z',
    excerpt: 'Ferrari secured a 1-2 in first practice for the Monaco Grand Prix, a session that was twice interrupted by red flags including for a sizeable shunt for Red Bull F1 driver Isack Hadjar',
    imageUrl: 'https://storage.ghost.io/c/dd/af/ddafbd99-2ccd-468c-b622-4b3cccf80b49/content/images/size/w1200/2026/06/XPB_1412532_HiRes.jpg',
    imageCredit: ''
  },
  {
    id: 'a104',
    series: 'f1',
    headline: '\'It caught me off guard\' - Isack Hadjar explains costly Monaco crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1097078/1/it-caught-me-guard-isack-hadjar-explains-costly-monaco-crash',
    publishedAt: '2026-06-05T16:56:00.000Z',
    excerpt: 'Isack Hadjar crashed out of FP1 at the Formula 1 Monaco Grand Prix, but bounced back well in FP2.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-06/xpb_1412526_hires.jpg?width=1600&aspect_ratio=16:9',
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
