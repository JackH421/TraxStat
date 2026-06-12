// ═══════════════════════════════════════════════════════════════════════════
// ── INDYCAR MODULE ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// NTT IndyCar Series 2026 — built 2026-06-12 (all-series buildout, Phase 1a).
// Data model (design of record: docs/series-data-models.md):
//
//   INDYCAR_DRIVERS:  lastName → {first, team, engine ('Chevrolet'|'Honda'), num}
//   INDYCAR_SCHEDULE: [{round, race, track, country, date, laps|null,
//                       type: 'O' oval | 'R' road | 'S' street}]
//   INDYCAR_RESULTS:  {round: {winner, p2, p3, pole, note}}   // lastName refs
//   INDYCAR_STANDINGS:[{pos, driver, points, gap}]            // gap = pts − leader
//   INDYCAR_ENGINE_WINS: [{pos, engine, wins, drivers:[...]}] // wins-only tally
//
// Sub-tabs: Standings / Race Results / Schedule / Highlights. NO live timing —
// no free live API exists for IndyCar (decision in docs/series-data-models.md).
//
// Sources (fetched + cross-checked 2026-06-12):
//   https://www.indycar.com/standings            (standings, primary)
//   https://en.wikipedia.org/wiki/2026_IndyCar_Series   (calendar, entries, winners)
//   Individual Wikipedia race pages per round (podiums, poles, race facts) —
//   cited above each constant. Winners cross-checked Wikipedia vs indycar.com.
// Cardinal rule: every value below traces to one of those pages; unverified
// values are null with a comment.

let currentIndyCarTab='standings';
let selectedIndyCarRace=null;
let selectedIndyCarDriver=null;

// Engine manufacturer brand colors (styling only, not data)
const INDYCAR_ENGINE_COLOR={'Chevrolet':'#C5B358','Honda':'#E40521','default':'#888'};

// Driver → {first, team, engine, num} for every driver appearing in results or
// standings. Full-time entries from the Wikipedia 2026 entries table; the 8
// part-time drivers (P26–P33 in points) from the 2026 Indianapolis 500 entry
// list (their only/primary outings). Verified 2026-06-12.
const INDYCAR_DRIVERS={
  'Palou':        {first:'Álex',      team:'Chip Ganassi Racing',           engine:'Honda',     num:10},
  'Kirkwood':     {first:'Kyle',      team:'Andretti Global',               engine:'Honda',     num:27},
  'Malukas':      {first:'David',     team:'Team Penske',                   engine:'Chevrolet', num:12},
  'Lundgaard':    {first:'Christian', team:'Arrow McLaren',                 engine:'Chevrolet', num:7},
  "O'Ward":       {first:'Pato',      team:'Arrow McLaren',                 engine:'Chevrolet', num:5},
  'Newgarden':    {first:'Josef',     team:'Team Penske',                   engine:'Chevrolet', num:2},
  'McLaughlin':   {first:'Scott',     team:'Team Penske',                   engine:'Chevrolet', num:3},
  'Rosenqvist':   {first:'Felix',     team:'Meyer Shank Racing',            engine:'Honda',     num:60},
  'Ericsson':     {first:'Marcus',    team:'Andretti Global',               engine:'Honda',     num:28},
  'Armstrong':    {first:'Marcus',    team:'Meyer Shank Racing',            engine:'Honda',     num:66},
  'Rahal':        {first:'Graham',    team:'Rahal Letterman Lanigan Racing',engine:'Honda',     num:15},
  'Dixon':        {first:'Scott',     team:'Chip Ganassi Racing',           engine:'Honda',     num:9},
  'VeeKay':       {first:'Rinus',     team:'Juncos Hollinger Racing',       engine:'Chevrolet', num:76},
  'Rossi':        {first:'Alexander', team:'Ed Carpenter Racing',           engine:'Chevrolet', num:20},
  'Simpson':      {first:'Kyffin',    team:'Chip Ganassi Racing',           engine:'Honda',     num:8},
  'Ferrucci':     {first:'Santino',   team:'A.J. Foyt Enterprises',         engine:'Chevrolet', num:14},
  'Power':        {first:'Will',      team:'Andretti Global',               engine:'Honda',     num:26},
  'Hauger':       {first:'Dennis',    team:'Dale Coyne Racing',             engine:'Honda',     num:19},
  'Foster':       {first:'Louis',     team:'Rahal Letterman Lanigan Racing',engine:'Honda',     num:45},
  'Grosjean':     {first:'Romain',    team:'Dale Coyne Racing',             engine:'Honda',     num:18},
  'Siegel':       {first:'Nolan',     team:'Arrow McLaren',                 engine:'Chevrolet', num:6},
  'Rasmussen':    {first:'Christian', team:'Ed Carpenter Racing',           engine:'Chevrolet', num:21},
  'Collet':       {first:'Caio',      team:'A.J. Foyt Enterprises',         engine:'Chevrolet', num:4},
  'Robb':         {first:'Sting Ray', team:'Juncos Hollinger Racing',       engine:'Chevrolet', num:77},
  'Schumacher':   {first:'Mick',      team:'Rahal Letterman Lanigan Racing',engine:'Honda',     num:47},
  // Part-time entries (2026 Indy 500 entry list)
  'Daly':         {first:'Conor',     team:'Dreyer & Reinbold Racing',      engine:'Chevrolet', num:23},
  'Sato':         {first:'Takuma',    team:'Rahal Letterman Lanigan Racing',engine:'Honda',     num:75},
  'Harvey':       {first:'Jack',      team:'Dreyer & Reinbold Racing',      engine:'Chevrolet', num:24},
  'Abel':         {first:'Jacob',     team:'Abel Motorsports',              engine:'Chevrolet', num:51},
  'Castroneves':  {first:'Hélio',     team:'Meyer Shank Racing',            engine:'Honda',     num:6},
  'Carpenter':    {first:'Ed',        team:'Ed Carpenter Racing',           engine:'Chevrolet', num:33},
  'Hunter-Reay':  {first:'Ryan',      team:'Arrow McLaren w/ Legacy MC',    engine:'Chevrolet', num:31},
  'Legge':        {first:'Katherine', team:'HMD w/ A.J. Foyt Enterprises',  engine:'Chevrolet', num:11},
};

// 2026 calendar (18 rounds) — verified 2026-06-12 from
// https://en.wikipedia.org/wiki/2026_IndyCar_Series
// laps: only rounds whose lap counts were individually verified on race pages;
// null = not yet verified (cardinal rule — no guessed lap counts).
const INDYCAR_SCHEDULE=[
  {round:1, race:'Firestone Grand Prix of St. Petersburg', track:'Streets of St. Petersburg',       country:'🇺🇸', date:'2026-03-01', laps:100,  type:'S'},
  {round:2, race:'Good Ranchers 250',                      track:'Phoenix Raceway',                 country:'🇺🇸', date:'2026-03-07', laps:null, type:'O'},
  {round:3, race:'Java House Grand Prix of Arlington',     track:'Streets of Arlington',            country:'🇺🇸', date:'2026-03-15', laps:70,   type:'S'},
  {round:4, race:"Children's of Alabama Indy Grand Prix",  track:'Barber Motorsports Park',         country:'🇺🇸', date:'2026-03-29', laps:null, type:'R'},
  {round:5, race:'Acura Grand Prix of Long Beach',         track:'Streets of Long Beach',           country:'🇺🇸', date:'2026-04-19', laps:90,   type:'S'},
  {round:6, race:'Sonsio Grand Prix',                      track:'IMS Road Course',                 country:'🇺🇸', date:'2026-05-09', laps:85,   type:'R'},
  {round:7, race:'110th Indianapolis 500',                 track:'Indianapolis Motor Speedway',     country:'🇺🇸', date:'2026-05-24', laps:null, type:'O'},
  {round:8, race:'Chevrolet Detroit Grand Prix',           track:'Streets of Detroit',              country:'🇺🇸', date:'2026-05-31', laps:100,  type:'S'},
  {round:9, race:'Bommarito Automotive Group 500',         track:'World Wide Technology Raceway',   country:'🇺🇸', date:'2026-06-07', laps:260,  type:'O'},
  {round:10,race:'XPEL Grand Prix at Road America',        track:'Road America',                    country:'🇺🇸', date:'2026-06-21', laps:null, type:'R'},
  {round:11,race:'Honda Indy 200 at Mid-Ohio',             track:'Mid-Ohio Sports Car Course',      country:'🇺🇸', date:'2026-07-05', laps:null, type:'R'},
  {round:12,race:'Borchetta Bourbon Music City Grand Prix',track:'Nashville Superspeedway',         country:'🇺🇸', date:'2026-07-19', laps:null, type:'O'},
  {round:13,race:'OnlyBulls Grand Prix of Portland',       track:'Portland International Raceway',  country:'🇺🇸', date:'2026-08-09', laps:null, type:'R'},
  {round:14,race:'Ontario Honda Dealers Indy at Markham',  track:'Streets of Markham',              country:'🇨🇦', date:'2026-08-16', laps:null, type:'S'},
  {round:15,race:'Freedom 250 GP of Washington, D.C.',     track:'Streets of Washington',           country:'🇺🇸', date:'2026-08-23', laps:null, type:'S'},
  {round:16,race:'Snap-on Makers and Fixers 250',          track:'Milwaukee Mile',                  country:'🇺🇸', date:'2026-08-29', laps:null, type:'O'},
  {round:17,race:'Snap-on Milwaukee Mile 250',             track:'Milwaukee Mile',                  country:'🇺🇸', date:'2026-08-30', laps:null, type:'O'},
  {round:18,race:'IndyCar Grand Prix of Monterey',         track:'WeatherTech Raceway Laguna Seca', country:'🇺🇸', date:'2026-09-06', laps:null, type:'R'},
];

// Completed rounds 1–9 — winners cross-checked Wikipedia season page vs
// individual race pages (and R9 vs indycar.com). Podiums + poles from the
// individual Wikipedia race pages, verified 2026-06-12:
//   R1 .../2026_Firestone_Grand_Prix_of_St._Petersburg
//   R2 .../2026_Good_Ranchers_250
//   R3 .../2026_Java_House_Grand_Prix_of_Arlington
//   R4 .../2026_Children's_of_Alabama_Indy_Grand_Prix
//   R5 .../2026_Acura_Grand_Prix_of_Long_Beach
//   R6 .../2026_Sonsio_Grand_Prix
//   R7 .../2026_Indianapolis_500
//   R8 .../2026_Chevrolet_Detroit_Grand_Prix
//   R9 .../2026_Bommarito_Automotive_Group_500
const INDYCAR_RESULTS={
  1:{winner:'Palou',      p2:'McLaughlin', p3:'Lundgaard', pole:'McLaughlin', note:'Palou led 59 laps and won by ~12.5s over polesitter McLaughlin. Dixon retired after losing a right-rear wheel on lap 39; Kirkwood set the fastest lap.'},
  2:{winner:'Newgarden',  p2:'Kirkwood',   p3:'Malukas',   pole:'Malukas',    note:"Newgarden's 33rd career win — passed Kirkwood on fresh tires with two laps to go. Record-high 565 passes for an IndyCar race at Phoenix."},
  3:{winner:'Kirkwood',   p2:'Palou',      p3:'Power',     pole:'Ericsson',   note:'Kirkwood won the inaugural Arlington street race over Palou. 70 laps on the 2.73-mile temporary circuit; Dixon set the fastest lap.'},
  4:{winner:'Palou',      p2:'Lundgaard',  p3:'Rahal',     pole:'Palou',      note:'Palou won from pole at Barber; Lundgaard set the fastest lap on lap 19.'},
  5:{winner:'Palou',      p2:'Rosenqvist', p3:'Dixon',     pole:'Rosenqvist', note:'Quick pit work helped Palou run away from polesitter Rosenqvist over 90 laps at Long Beach.'},
  6:{winner:'Lundgaard',  p2:'Malukas',    p3:'Rahal',     pole:'Palou',      note:"Lundgaard's first win of 2026 on the IMS road course. Polesitter Palou set the fastest lap but finished P5."},
  7:{winner:'Rosenqvist', p2:'Malukas',    p3:'Armstrong', pole:'Palou',      note:'Rosenqvist beat Malukas to the line by 0.0233s — the closest finish in Indy 500 history — in a race with a record 70 lead changes.'},
  8:{winner:'Palou',      p2:'Kirkwood',   p3:'Rahal',     pole:'Palou',      note:'Palou swept the Detroit weekend — pole and a wire-to-wire win over 100 laps.'},
  9:{winner:'Newgarden',  p2:'Ericsson',   p3:'Rasmussen', pole:'Palou',      note:'Newgarden won the 260-lap Gateway oval race; Penske teammate Malukas qualified second.'},
};

// Drivers' championship after R9 Gateway (2026-06-07) — verified 2026-06-12
// from https://www.indycar.com/standings (primary). Wikipedia cross-check
// agreed on P1–P25; Wikipedia's P26/P27 values (8/10) disagreed with
// indycar.com (24/20) — primary wins, discrepancy logged in session report.
// gap = points − leader points.
const INDYCAR_STANDINGS=[
  {pos:1, driver:'Palou',       points:342, gap:0},
  {pos:2, driver:'Kirkwood',    points:293, gap:-49},
  {pos:3, driver:'Malukas',     points:274, gap:-68},
  {pos:4, driver:'Lundgaard',   points:246, gap:-96},
  {pos:5, driver:"O'Ward",      points:239, gap:-103},
  {pos:6, driver:'Newgarden',   points:238, gap:-104},
  {pos:7, driver:'McLaughlin',  points:222, gap:-120},
  {pos:8, driver:'Rosenqvist',  points:221, gap:-121},
  {pos:9, driver:'Ericsson',    points:196, gap:-146},
  {pos:10,driver:'Armstrong',   points:196, gap:-146},
  {pos:11,driver:'Rahal',       points:193, gap:-149},
  {pos:12,driver:'Dixon',       points:192, gap:-150},
  {pos:13,driver:'VeeKay',      points:175, gap:-167},
  {pos:14,driver:'Rossi',       points:152, gap:-190},
  {pos:15,driver:'Simpson',     points:147, gap:-195},
  {pos:16,driver:'Ferrucci',    points:146, gap:-196},
  {pos:17,driver:'Power',       points:145, gap:-197},
  {pos:18,driver:'Hauger',      points:133, gap:-209},
  {pos:19,driver:'Foster',      points:131, gap:-211},
  {pos:20,driver:'Grosjean',    points:117, gap:-225},
  {pos:21,driver:'Siegel',      points:116, gap:-226},
  {pos:22,driver:'Rasmussen',   points:112, gap:-230},
  {pos:23,driver:'Collet',      points:99,  gap:-243},
  {pos:24,driver:'Robb',        points:89,  gap:-253},
  {pos:25,driver:'Schumacher',  points:89,  gap:-253},
  {pos:26,driver:'Daly',        points:24,  gap:-318},
  {pos:27,driver:'Sato',        points:20,  gap:-322},
  {pos:28,driver:'Harvey',      points:8,   gap:-334},
  {pos:29,driver:'Abel',        points:6,   gap:-336},
  {pos:30,driver:'Castroneves', points:5,   gap:-337},
  {pos:31,driver:'Carpenter',   points:5,   gap:-337},
  {pos:32,driver:'Hunter-Reay', points:5,   gap:-337},
  {pos:33,driver:'Legge',       points:5,   gap:-337},
];

// Engine wins after R9 — derived from INDYCAR_RESULTS winners (cross-checked
// by verify-indycar.js). Honda: Palou ×4, Kirkwood, Rosenqvist. Chevrolet:
// Newgarden ×2, Lundgaard.
const INDYCAR_ENGINE_WINS=[
  {pos:1, engine:'Honda',     wins:6, drivers:['Palou (4)','Kirkwood','Rosenqvist']},
  {pos:2, engine:'Chevrolet', wins:3, drivers:['Newgarden (2)','Lundgaard']},
];

// Per-round official highlight video IDs (INDYCAR YouTube channel) + chosen
// action thumbnails. Populated in Phase 3 after per-video channel verification;
// shape {round: {id:'youtubeVideoId', thumb:'https://i.ytimg.com/...'}}.
const INDYCAR_HIGHLIGHTS={};

// ── INDYCAR HELPERS ───────────────────────────────────────────────────────────
function indyDrv(lastName){return INDYCAR_DRIVERS[lastName]||{first:'',team:'—',engine:'—',num:'—'};}
function indyEngineColor(e){return INDYCAR_ENGINE_COLOR[e]||INDYCAR_ENGINE_COLOR['default'];}
function indyTrackSlug(track){return (track||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'race';}
function indyTypeLabel(t){return t==='O'?'OVAL':t==='R'?'ROAD':t==='S'?'STREET':'';}

function renderIndyCarNextBanner(){
  const now=new Date();
  const next=INDYCAR_SCHEDULE.find(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Race · Round ${next.round} · ${indyTypeLabel(next.type)}</div>
      <div class="next-race-name">${next.country} ${next.race}</div>
      <div class="next-race-circuit">${next.track}</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

// ── INDYCAR RACE RESULTS ──────────────────────────────────────────────────────
function renderIndyCarRaces(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('indycar','races')+renderBackToSeriesHome('indycar');
  const banner=renderIndyCarNextBanner();
  const completed=INDYCAR_SCHEDULE.filter(s=>INDYCAR_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const rows=completed.map(s=>{
    const res=INDYCAR_RESULTS[s.round];
    const w=indyDrv(res.winner);
    const isSelected=selectedIndyCarRace===s.round;
    const slug=indyTrackSlug(s.track);
    const hlId=`highlights-indycar-r${s.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectIndyCarRace(${s.round})">
      <div class="round-badge"><div class="round-num">${s.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${s.country} · ${indyTypeLabel(s.type)}</div>
        <div class="race-item-name">${s.race}</div>
        <div class="race-item-date">${fmtDate(s.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('indycar','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag" style="color:${indyEngineColor(w.engine)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${w.num}</span>
        <div class="winner-name">${res.winner}</div>
        <div class="winner-team">${w.engine}</div>
      </div>
    </div>`;
  }).join('');
  let html=top+banner+`<div class="section-title"><span>2026 IndyCar · ${completed.length} of ${INDYCAR_SCHEDULE.length} races</span><span>Tap for details</span></div>`+rows;
  if(selectedIndyCarRace)html+=buildIndyCarRaceDetailHTML(selectedIndyCarRace);
  content.innerHTML=html;
  setStats('—','—','RACE',`${completed.length}/${INDYCAR_SCHEDULE.length}`);
  if(selectedIndyCarRace){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

function buildIndyCarRaceDetailHTML(round){
  const sched=INDYCAR_SCHEDULE.find(s=>s.round===round);
  const res=INDYCAR_RESULTS[round];
  if(!sched||!res)return'';
  const w=indyDrv(res.winner);
  const p2=res.p2?indyDrv(res.p2):null;
  const p3=res.p3?indyDrv(res.p3):null;
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.race}</div>
    <div class="results-race-sub">${sched.track} · Round ${sched.round}${sched.laps?` · ${sched.laps} Laps`:''} · ${indyTypeLabel(sched.type)}
    ${res.pole?`<br>🏁 Pole: ${res.pole}`:''}
    </div>
  </div>`;
  let podium;
  if(p2&&p3){
    podium=`<div class="podium-bar">
      <div class="podium-item p2-item">
        <div class="podium-pos">🥈 P2</div>
        <div class="podium-name">${res.p2}</div>
        <div class="podium-team">${p2.team}</div>
        <div class="podium-gap" style="color:${indyEngineColor(p2.engine)}">${p2.engine}</div>
      </div>
      <div class="podium-item p1-item">
        <div class="podium-pos">🏆 WINNER</div>
        <div class="podium-name">${res.winner}</div>
        <div class="podium-team">${w.team}</div>
        <div class="podium-gap" style="color:${indyEngineColor(w.engine)}">${w.engine}</div>
      </div>
      <div class="podium-item p3-item">
        <div class="podium-pos">🥉 P3</div>
        <div class="podium-name">${res.p3}</div>
        <div class="podium-team">${p3.team}</div>
        <div class="podium-gap" style="color:${indyEngineColor(p3.engine)}">${p3.engine}</div>
      </div>
    </div>`;
  }else{
    podium=`<div style="padding:18px;background:var(--surface2);border-bottom:1px solid var(--border);text-align:center;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--yellow);letter-spacing:0.12em;margin-bottom:6px;">🏆 RACE WINNER</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:var(--white);">#${w.num} ${res.winner}</div>
      <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--muted);margin-top:3px;">${w.team} · <span style="color:${indyEngineColor(w.engine)};font-weight:700;">${w.engine}</span></div>
    </div>`;
  }
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RACE NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+podium+notes;
}

function selectIndyCarRace(round){
  track('race:open:indycar',{round});
  selectedIndyCarRace=selectedIndyCarRace===round?null:round;
  renderIndyCarRaces();
}

// ── INDYCAR STANDINGS (drivers + engine wins stacked) ─────────────────────────
function renderIndyCarStandings(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('indycar','standings')+renderBackToSeriesHome('indycar');
  const hdr=`<div class="section-title"><span>IndyCar Drivers · 2026 · After R9 Gateway</span><span>${INDYCAR_STANDINGS.length} drivers</span></div>`;
  const rows=INDYCAR_STANDINGS.map(d=>{
    const info=indyDrv(d.driver);
    const isSelected=selectedIndyCarDriver===d.driver;
    const gapText=d.pos===1?'LEADER':`${d.gap}`;
    const posColor=d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':'var(--text)';
    const breakdown=isSelected?renderIndyCarDriverBreakdown(d.driver,info,d.points,d.pos):'';
    return`<div>
      <div class="champ-row" style="${isSelected?'background:#0a0005;border-left:2px solid var(--yellow);':''}" onclick="track('driver:expand:indycar',{name:'${d.driver.replace(/'/g,"\\'")}'});selectedIndyCarDriver=selectedIndyCarDriver==='${d.driver.replace(/'/g,"\\'")}'?null:'${d.driver.replace(/'/g,"\\'")}';renderIndyCar();">
        <div class="champ-pos" style="color:${posColor}">${d.pos}</div>
        <div class="flag-cell" style="color:${indyEngineColor(info.engine)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${info.num}</div>
        <div>
          <div class="champ-name">${d.driver}</div>
          <div class="champ-team-sm" style="color:${indyEngineColor(info.engine)}">${info.team}</div>
        </div>
        <div class="champ-pts">${d.points}</div>
        <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${gapText}</div>
      </div>
      ${breakdown}
    </div>`;
  }).join('');
  // Engine wins block
  const engHdr=`<div class="section-title"><span>Engine Manufacturers · Wins</span><span>After R9</span></div>`;
  const engRows=INDYCAR_ENGINE_WINS.map(e=>`<div class="champ-row">
      <div class="champ-pos" style="color:${e.pos===1?'var(--yellow)':'#c0c0c0'}">${e.pos}</div>
      <div class="flag-cell" style="color:${indyEngineColor(e.engine)};font-size:18px;">●</div>
      <div>
        <div class="champ-name" style="color:${indyEngineColor(e.engine)};">${e.engine}</div>
        <div class="champ-team-sm">${e.drivers.join(', ')}</div>
      </div>
      <div class="champ-pts" style="color:${indyEngineColor(e.engine)};">${e.wins}</div>
      <div class="champ-gap">WINS</div>
    </div>`).join('');
  content.innerHTML=top+hdr+rows+engHdr+engRows;
  setStats(`${INDYCAR_STANDINGS[0].points} pts`,INDYCAR_STANDINGS[0].driver,'DRIVERS','R9/18');
}

function renderIndyCarDriverBreakdown(name,info,points,pos){
  const winEntries=Object.entries(INDYCAR_RESULTS).filter(([_,r])=>r.winner===name);
  const wins=winEntries.length;
  const poles=Object.values(INDYCAR_RESULTS).filter(r=>r.pole===name).length;
  const winRows=winEntries.map(([rd])=>{
    const sched=INDYCAR_SCHEDULE.find(s=>s.round===parseInt(rd));
    return`<div style="display:grid;grid-template-columns:32px 1fr auto;padding:6px 16px;border-bottom:1px solid #141414;align-items:center;gap:10px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);">R${rd}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--text);">${sched?.race||''}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--yellow);letter-spacing:0.08em;">🏆 WIN</div>
    </div>`;
  }).join('');
  return`<div style="background:var(--surface2);border-top:1px solid var(--border);border-bottom:2px solid var(--yellow);">
    <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:var(--white);">${info.first} ${name}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:${indyEngineColor(info.engine)};margin-top:2px;">${info.team} · #${info.num} · ${info.engine}</div>
      </div>
      <button onclick="selectedIndyCarDriver=null;renderIndyCar();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);">
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">CHAMPIONSHIP</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${pos===1?'var(--yellow)':'var(--text)'};">P${pos}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">POINTS</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:18px;color:var(--yellow);">${points}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">WINS</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${wins>0?'var(--yellow)':'var(--muted)'};">${wins}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">POLES</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${poles>0?'var(--text)':'var(--muted)'};">${poles}</div>
      </div>
    </div>
    ${wins>0?`<div style="padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;border-bottom:1px solid var(--border);">2026 WINS</div>${winRows}`:''}
  </div>`;
}

// ── INDYCAR SCHEDULE ──────────────────────────────────────────────────────────
function renderIndyCarSchedule(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('indycar','schedule')+renderBackToSeriesHome('indycar');
  const now=new Date();
  const upcoming=INDYCAR_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more IndyCar races on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const hdr=`<div class="section-title"><span>IndyCar 2026 · ${upcoming.length} Upcoming</span><span>Through R${upcoming[upcoming.length-1].round}</span></div>`;
  const rows=upcoming.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'-';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country} · ${indyTypeLabel(r.type)}</div>
        <div class="race-item-name">${r.race}</div>
        <div class="race-item-date">${fmtDate(r.date)} · ${r.track}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Share Tech Mono',monospace;font-size:16px;color:var(--yellow);line-height:1;">${cdNum}${cdUnit}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:8px;color:var(--muted);letter-spacing:0.08em;margin-top:3px;">AWAY</div>
      </div>
    </div>`;
  }).join('');
  content.innerHTML=top+hdr+rows;
  const next=upcoming[0];
  const cd=countdown(next.date);
  setStats(`R${next.round}`,next.race.split(' ').slice(0,2).join(' '),'SCHED',cd?`${cd.num}${cd.unit[0]}`:'NOW');
}

// ── INDYCAR HIGHLIGHTS ────────────────────────────────────────────────────────
// Lite-YouTube pattern shared with f1.js (loadF1HighlightIframe is generic —
// it only swaps a thumbnail div for an iframe). Entries appear only after
// per-video official-channel verification (Phase 3); no invented URLs.
function renderIndyCarHighlights(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('indycar','highlights')+renderBackToSeriesHome('indycar');
  const completed=INDYCAR_SCHEDULE.filter(s=>INDYCAR_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=INDYCAR_RESULTS[s.round];
    const winInfo=indyDrv(res.winner);
    const slug=indyTrackSlug(s.track);
    const id=`highlights-indycar-r${s.round}-${slug}`;
    const vid=INDYCAR_HIGHLIGHTS[s.round];
    const body=vid
      ? txHighlightSlotHTML('Race Highlights',vid.id,vid.thumb)
      : `<div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${s.round} · ${s.country} · ${fmtDate(s.date)}</div>
      <div class="tx-highlights-title">${s.race}</div>
      <div class="tx-highlights-winner">Winner: ${res.winner} (${winInfo.team})</div>
      ${body}
    </div>`;
  }).join('');
  content.innerHTML=top+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">IndyCar 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps from the INDYCAR YouTube channel. Videos are added after verification — placeholders shown for races without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

// ── DISPATCHER ────────────────────────────────────────────────────────────────
function switchIndyCarTab(tab){
  track('tab:indycar',{tab});
  currentIndyCarTab=tab;
  selectedIndyCarRace=null;
  selectedIndyCarDriver=null;
  document.querySelectorAll('#indycar-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('indycartab-'+tab)?.classList.add('active');
  renderIndyCar();
}

function renderIndyCar(){
  if(currentIndyCarTab==='races')return renderIndyCarRaces();
  if(currentIndyCarTab==='schedule')return renderIndyCarSchedule();
  if(currentIndyCarTab==='highlights')return renderIndyCarHighlights();
  return renderIndyCarStandings();
}
// ── END INDYCAR ───────────────────────────────────────────────────────────────
