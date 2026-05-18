// ── HOME (LANDING PAGE) ──────────────────────────────────────────────────────
// Default landing view for TraxStat — curated motorsport news feed.
// Site boots into HOME (init.js); RACE SCHEDULE is still routable from the
// series bar via switchSeries('schedule').
//
// Sections (top → bottom):
//   1. FEATURED STORY   — auto-derived from latest race across F1/NASCAR/N24,
//                         or manually pinned via HOMEPAGE_FEATURED.
//   2. CHAMPIONSHIPS    — F1 and NASCAR title leaders + gap to P2.
//   3. NEWS FEED        — 8 article cards from HOMEPAGE_ARTICLES.
//   4. COMING UP        — next 3 races across all series (renderScheduleRow).
//   5. VIDEO HIGHLIGHTS — TODO: Session 5 hook, intentionally not rendered.
//
// Cardinal rule: featured + championship data read from existing verified
// constants (HARDCODED_RACES, HARDCODED_DRIVER_STANDINGS, NASCAR_CUP_RESULTS,
// NASCAR_CUP_STANDINGS, N24_2026_RESULTS). Article entries below are
// PLACEHOLDERS — Session 5's daily aggregator replaces them with real
// sourced articles. Never replace placeholder URLs with invented real ones.

// ── HOME CONSTANTS ───────────────────────────────────────────────────────────
// HOMEPAGE_FEATURED: null = auto-select via getLatestWinnerAcrossAllSeries().
// To pin a story, replace null with an object matching that helper's return
// shape ({series, seriesLabel, raceName, circuit, country, date, round,
// winnerDisplay, winnerSub, podium, ctaTab}). Future automation writes here.
const HOMEPAGE_FEATURED = null;

// 8-card news feed. PLACEHOLDER values intentional — Session 5 aggregator
// replaces these at 8am ET daily. Cardinal rule: never substitute invented
// real-looking headlines/URLs. Shape:
//   { id, series, headline, source, url, publishedAt (ISO Z), excerpt }
// 'series' enum: f1 | nascar | n24 | motogp | wrc | indycar | wec
const HOMEPAGE_ARTICLES = [
  { id:'a1', series:'f1',      headline:'[PLACEHOLDER] Sample F1 headline #1',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-17T10:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a2', series:'nascar',  headline:'[PLACEHOLDER] Sample NASCAR headline #2',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-17T07:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a3', series:'n24',     headline:'[PLACEHOLDER] Sample N24 headline #3',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-16T15:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a4', series:'f1',      headline:'[PLACEHOLDER] Sample F1 headline #4',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-15T12:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a5', series:'nascar',  headline:'[PLACEHOLDER] Sample NASCAR headline #5',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-14T12:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a6', series:'motogp',  headline:'[PLACEHOLDER] Sample MotoGP headline #6',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-13T12:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a7', series:'wec',     headline:'[PLACEHOLDER] Sample WEC headline #7',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-12T12:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
  { id:'a8', series:'indycar', headline:'[PLACEHOLDER] Sample IndyCar headline #8',
    source:'Source TBD', url:'https://example.com', publishedAt:'2026-05-11T12:00:00Z',
    excerpt:'[PLACEHOLDER] Replace with real article excerpt before going live.' },
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

// Returns the most recent race winner across F1, NASCAR, N24 as a featured
// card payload. Compares HARDCODED_RACES (F1), NASCAR_CUP_RESULTS (NASCAR),
// and N24_META.date (N24). Series with no completed races are skipped.
function getLatestWinnerAcrossAllSeries(){
  const candidates=[];
  // F1
  const f1All=Object.values(HARDCODED_RACES).sort((a,b)=>+b.round-+a.round);
  if(f1All.length){
    const r=f1All[0];
    candidates.push({series:'f1',date:r.date,race:r});
  }
  // NASCAR
  const nascarRounds=Object.keys(NASCAR_CUP_RESULTS).map(Number).sort((a,b)=>b-a);
  if(nascarRounds.length){
    const round=nascarRounds[0];
    const result=NASCAR_CUP_RESULTS[round];
    const sched=NASCAR_CUP_SCHEDULE.find(r=>r.round===round);
    if(sched)candidates.push({series:'nascar',date:sched.date,round,result,sched});
  }
  // N24
  candidates.push({series:'n24',date:N24_META.date});

  candidates.sort((a,b)=>b.date.localeCompare(a.date));
  const top=candidates[0];

  if(top.series==='f1'){
    const r=top.race;
    const w=r.Results[0],p2=r.Results[1],p3=r.Results[2];
    return{
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
    };
  }
  if(top.series==='nascar'){
    const r=top.result,sched=top.sched;
    const drv=NASCAR_CUP_DRIVERS[r.winner]||{};
    const p2=r.p2?{pos:'P2',name:r.p2,team:(NASCAR_CUP_DRIVERS[r.p2]||{}).team||''}:null;
    const p3=r.p3?{pos:'P3',name:r.p3,team:(NASCAR_CUP_DRIVERS[r.p3]||{}).team||''}:null;
    return{
      series:'nascar',seriesLabel:'NASCAR',
      raceName:sched.race,
      circuit:sched.track,
      country:sched.country||'🇺🇸',
      date:sched.date,
      round:top.round,
      winnerDisplay:r.winner,
      winnerSub:`${drv.team||'—'} · ${drv.mfr||'—'}`,
      winnerColor:nascarMfrColor(drv.mfr),
      podium:[p2,p3].filter(Boolean),
      ctaTab:'races',
    };
  }
  // N24
  const t1=N24_2026_RESULTS[0],t2=N24_2026_RESULTS[1],t3=N24_2026_RESULTS[2];
  return{
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
  };
}

function getFeatured(){
  return HOMEPAGE_FEATURED||getLatestWinnerAcrossAllSeries();
}

function mergedUpcoming(limit){
  limit=limit||3;
  const now=new Date();
  const f1Up=NEXT_RACES.filter(r=>new Date(r.date+'T13:00:00Z')>now).map(r=>({
    series:'f1',tag:'F1',tagColor:'var(--red)',
    name:r.name,circuit:r.circuit,country:r.country,date:r.date,
    round:r.round,sprint:r.sprint,chase:false,
    dateObj:new Date(r.date+'T13:00:00Z'),
  }));
  const nascarUp=NASCAR_CUP_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now).map(r=>({
    series:'nascar',tag:'NSCR',tagColor:'var(--yellow)',
    name:r.race,circuit:r.track,country:r.country,date:r.date,
    round:r.round,sprint:false,chase:!!r.chase,type:r.type,
    dateObj:new Date(r.date+'T18:00:00Z'),
  }));
  return[...f1Up,...nascarUp].sort((a,b)=>a.dateObj-b.dateObj).slice(0,limit);
}

// ── HOME ACTIONS ─────────────────────────────────────────────────────────────
function openHomeFeatured(){
  const feat=getFeatured();
  track('home:featured',{series:feat.series});
  switchSeries(feat.series);
  if(feat.ctaTab){
    if(feat.series==='f1')switchF1Tab(feat.ctaTab);
    else if(feat.series==='nascar')switchNascarTab(feat.ctaTab);
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
function renderHomeFeatured(){
  const f=getFeatured();
  const dateStr=fmtDate(f.date);
  const roundLabel=f.round?` · R${f.round}`:'';
  const accent=getSeriesAccentColor(f.series);
  const podiumHTML=f.podium.map(p=>`
    <div style="display:flex;gap:8px;align-items:baseline;margin-top:4px;">
      <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;min-width:22px;">${p.pos==='P2'?'🥈':'🥉'}</span>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:var(--text);">${p.name}</span>
      <span style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);">${p.team}</span>
    </div>`).join('');
  return`<div class="home-featured" onclick="openHomeFeatured()">
    <div class="home-featured-tag" style="color:${accent};border-color:${accent};">⬤ FEATURED · ${f.seriesLabel}${roundLabel} · ${dateStr}</div>
    <div class="home-featured-title">${f.country} ${f.raceName.toUpperCase()}</div>
    <div class="home-featured-circuit">${f.circuit}</div>
    <div class="home-featured-winner-label">🏆 WINNER</div>
    <div class="home-featured-winner" style="color:${f.winnerColor};">${f.winnerDisplay}</div>
    <div class="home-featured-winner-sub">${f.winnerSub}</div>
    ${podiumHTML?`<div class="home-featured-podium">${podiumHTML}</div>`:''}
    <div class="home-featured-cta">READ FULL RESULTS →</div>
  </div>`;
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
    return`<div class="home-article" onclick="openHomeArticle('${a.id}')">
      <div class="home-article-stripe" style="background:${accent};"></div>
      <div>
        <div class="home-article-meta"><span style="color:${accent};">${label}</span><span>  ·  ${a.source}</span><span>  ·  ${when}</span></div>
        <div class="home-article-headline">${a.headline}</div>
        <div class="home-article-excerpt">${a.excerpt}</div>
      </div>
    </div>`;
  }).join('');
  return`<div class="section-title"><span>Latest News · ${sorted.length} Stories</span><span>Tap to read</span></div>${rows}`;
}

function renderHomeUpcoming(){
  const upcoming=mergedUpcoming(3);
  if(!upcoming.length)return'';
  const rows=upcoming.map(r=>renderScheduleRow(r)).join('');
  return`<div class="section-title"><span>Coming Up · Next ${upcoming.length}</span><span>Tap to open series</span></div>${rows}`;
}

// TODO (Session 5): VIDEO HIGHLIGHTS section. Two slots — latest F1 video
// (read from HARDCODED_QUALI_VIDEOS or future RECAP_VIDEOS) and latest
// NASCAR video. Intentionally not rendered until source constants exist;
// adding empty visual scaffolding now would either show nothing or require
// invented data. Deferred per cardinal rule.

function renderHomeFooter(){
  const f=getFeatured();
  return`<div class="home-footer">Updated ${fmtDate(f.date)}  ·  Featured: ${f.seriesLabel}  ·  Feed v1</div>`;
}

function renderHome(){
  const f=getFeatured();
  track('home:render',{featuredSeries:f.series});
  document.getElementById('main-content').innerHTML=
    renderHomeFeatured()
    +renderHomeChampionships()
    +renderHomeArticles()
    +renderHomeUpcoming()
    +renderHomeFooter();
  setStats(f.seriesLabel,f.winnerDisplay.length>10?f.winnerDisplay.slice(0,10):f.winnerDisplay,'HOME','—');
}
// ── END HOME ─────────────────────────────────────────────────────────────────
