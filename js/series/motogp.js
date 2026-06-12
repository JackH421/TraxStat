// ═══════════════════════════════════════════════════════════════════════════
// ── MOTOGP MODULE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// MotoGP World Championship 2026 — premier class ONLY (no Moto2/Moto3).
// Built 2026-06-12 (all-series buildout, Phase 1b).
// Data model (design of record: docs/series-data-models.md):
//
//   MOTOGP_RIDERS:   lastName → {first, team, bike (manufacturer), num, nat}
//   MOTOGP_SCHEDULE: [{round, gp, circuit, country, date}]   // date = GP Sunday
//   MOTOGP_RESULTS:  {round: {sprintWinner, winner, p2, p3, pole, note}}
//                    // every 2026 round runs a Saturday Sprint + Sunday GP
//   MOTOGP_STANDINGS:[{pos, rider, points, gap}]  // combined sprint+GP points
//   MOTOGP_CONSTRUCTORS: [{pos, constructor, points, gap}]   // as published
//
// Riders sharing last names are keyed with initials: 'M. Marquez'/'A. Marquez'
// (brothers), 'R. Fernandez'/'A. Fernandez' (unrelated). Sub-tabs: Standings /
// Race Results / Schedule / Highlights. NO live timing (no free live API).
//
// Sources (fetched + cross-checked 2026-06-12):
//   https://en.wikipedia.org/wiki/2026_MotoGP_World_Championship
//     (calendar, entry list, riders'+constructors' standings, GP winners —
//      standings/winners re-confirmed directly in this session)
//   Individual Wikipedia GP pages rounds 1–8 (sprint winners, podiums, poles)
//   motogp.com news cross-checks:
//     /en/news/2026/03/01/bezzecchi-bounces-back-...-thailand-dnf/985393 (R1)
//     /en/videos/2026/03/28/last-lap-martin-beats-bagnaia-... /1014441 (R3 sprint)
//     /en/news/2026/05/31/dreamland-bezzecchi-unbeatable-...-mugello/1070361 (R7)
//     /fr/news/2026/05/30/fernandez-fends-off-martin-...-pursuit/1070360 (R7 sprint)
//   (motogp.com standings tables are JS-rendered and unfetchable; its news
//    text confirms Bezzecchi leading M. Marquez by 72 — matches 180 vs 108.)
// Cardinal rule: unverified values are null with a comment, never guessed.

let currentMotoGPTab='standings';
let selectedMotoGPRace=null;
let selectedMotoGPRider=null;

// Manufacturer brand colors (styling only)
const MOTOGP_BIKE_COLOR={'Ducati':'#E8002D','Aprilia':'#9B5DE5','KTM':'#FF6600','Honda':'#3B82F6','Yamaha':'#1BC7E8','default':'#888'};
function motogpBikeColor(b){return MOTOGP_BIKE_COLOR[b]||MOTOGP_BIKE_COLOR['default'];}

// Rider → {first, team, bike, num, nat} for the 24 riders appearing in 2026
// results or scoring standings (zero-point substitutes excluded). Verified
// 2026-06-12 from the Wikipedia 2026 entry list.
const MOTOGP_RIDERS={
  'Bezzecchi':      {first:'Marco',     team:'Aprilia Racing',                    bike:'Aprilia', num:72, nat:'Italian'},
  'Martin':         {first:'Jorge',     team:'Aprilia Racing',                    bike:'Aprilia', num:89, nat:'Spanish'},
  'Di Giannantonio':{first:'Fabio',     team:'Pertamina Enduro VR46 Racing Team', bike:'Ducati',  num:49, nat:'Italian'},
  'Morbidelli':     {first:'Franco',    team:'Pertamina Enduro VR46 Racing Team', bike:'Ducati',  num:21, nat:'Italian'},
  'Bagnaia':        {first:'Francesco', team:'Ducati Lenovo Team',                bike:'Ducati',  num:63, nat:'Italian'},
  'M. Marquez':     {first:'Marc',      team:'Ducati Lenovo Team',                bike:'Ducati',  num:93, nat:'Spanish'},
  'A. Marquez':     {first:'Alex',      team:'BK8 Gresini Racing MotoGP',         bike:'Ducati',  num:73, nat:'Spanish'},
  'Aldeguer':       {first:'Fermin',    team:'BK8 Gresini Racing MotoGP',         bike:'Ducati',  num:54, nat:'Spanish'},
  'Lecuona':        {first:'Iker',      team:'BK8 Gresini Racing MotoGP',         bike:'Ducati',  num:27, nat:'Spanish'},
  'Binder':         {first:'Brad',      team:'Red Bull KTM Factory Racing',       bike:'KTM',     num:33, nat:'South African'},
  'Acosta':         {first:'Pedro',     team:'Red Bull KTM Factory Racing',       bike:'KTM',     num:37, nat:'Spanish'},
  'Bastianini':     {first:'Enea',      team:'Red Bull KTM Tech3',                bike:'KTM',     num:23, nat:'Italian'},
  'Vinales':        {first:'Maverick',  team:'Red Bull KTM Tech3',                bike:'KTM',     num:12, nat:'Spanish'},
  'Marini':         {first:'Luca',      team:'Honda HRC Castrol',                 bike:'Honda',   num:10, nat:'Italian'},
  'Mir':            {first:'Joan',      team:'Honda HRC Castrol',                 bike:'Honda',   num:36, nat:'Spanish'},
  'Zarco':          {first:'Johann',    team:'Castrol Honda LCR',                 bike:'Honda',   num:5,  nat:'French'},
  'Moreira':        {first:'Diogo',     team:'Pro Honda LCR',                     bike:'Honda',   num:11, nat:'Brazilian'},
  'Quartararo':     {first:'Fabio',     team:'Monster Energy Yamaha MotoGP',      bike:'Yamaha',  num:20, nat:'French'},
  'Rins':           {first:'Alex',      team:'Monster Energy Yamaha MotoGP',      bike:'Yamaha',  num:42, nat:'Spanish'},
  'A. Fernandez':   {first:'Augusto',   team:'Monster Energy Yamaha MotoGP',      bike:'Yamaha',  num:47, nat:'Spanish'},
  'Razgatlioglu':   {first:'Toprak',    team:'Prima Pramac Yamaha MotoGP',        bike:'Yamaha',  num:7,  nat:'Turkish'},
  'Miller':         {first:'Jack',      team:'Prima Pramac Yamaha MotoGP',        bike:'Yamaha',  num:43, nat:'Australian'},
  'R. Fernandez':   {first:'Raul',      team:'SuperFile Trackhouse MotoGP Team',  bike:'Aprilia', num:25, nat:'Spanish'},
  'Ogura':          {first:'Ai',        team:'SuperFile Trackhouse MotoGP Team',  bike:'Aprilia', num:79, nat:'Japanese'},
};

// 2026 calendar (22 rounds) — verified 2026-06-12 from the Wikipedia season
// page; motogp.com /en/calendar cross-check matched all weekend dates and the
// 22-round count (its extracted table dropped Indonesia — see session report).
const MOTOGP_SCHEDULE=[
  {round:1, gp:'PT Grand Prix of Thailand',                           circuit:'Chang International Circuit',        country:'🇹🇭', date:'2026-03-01'},
  {round:2, gp:'Estrella Galicia 0,0 Grand Prix of Brazil',           circuit:'Autódromo Internacional Ayrton Senna',country:'🇧🇷', date:'2026-03-22'},
  {round:3, gp:'Red Bull Grand Prix of the United States',            circuit:'Circuit of the Americas',            country:'🇺🇸', date:'2026-03-29'},
  {round:4, gp:'Estrella Galicia 0,0 Grand Prix of Spain',            circuit:'Circuito de Jerez – Ángel Nieto',    country:'🇪🇸', date:'2026-04-26'},
  {round:5, gp:'Michelin Grand Prix of France',                       circuit:'Bugatti Circuit, Le Mans',           country:'🇫🇷', date:'2026-05-10'},
  {round:6, gp:'Monster Energy Grand Prix of Catalunya',              circuit:'Circuit de Barcelona-Catalunya',     country:'🇪🇸', date:'2026-05-17'},
  {round:7, gp:'Brembo Grand Prix of Italy',                          circuit:'Autodromo Internazionale del Mugello',country:'🇮🇹', date:'2026-05-31'},
  {round:8, gp:'Grand Prix of Hungary',                               circuit:'Balaton Park Circuit',               country:'🇭🇺', date:'2026-06-07'},
  {round:9, gp:'Monster Energy Grand Prix of Czechia',                circuit:'Brno Circuit',                       country:'🇨🇿', date:'2026-06-21'},
  {round:10,gp:'Tissot Grand Prix of the Netherlands',                circuit:'TT Circuit Assen',                   country:'🇳🇱', date:'2026-06-28'},
  {round:11,gp:'Liqui Moly Grand Prix of Germany',                    circuit:'Sachsenring',                        country:'🇩🇪', date:'2026-07-12'},
  {round:12,gp:'Qatar Airways Grand Prix of Great Britain',           circuit:'Silverstone Circuit',                country:'🇬🇧', date:'2026-08-09'},
  {round:13,gp:'Grand Prix of Aragon',                                circuit:'MotorLand Aragón',                   country:'🇪🇸', date:'2026-08-30'},
  {round:14,gp:'Red Bull GP of San Marino and Rimini Riviera',        circuit:'Misano World Circuit Marco Simoncelli',country:'🇸🇲', date:'2026-09-13'},
  {round:15,gp:'Grand Prix of Austria',                               circuit:'Red Bull Ring, Spielberg',           country:'🇦🇹', date:'2026-09-20'},
  {round:16,gp:'Motul Grand Prix of Japan',                           circuit:'Mobility Resort Motegi',             country:'🇯🇵', date:'2026-10-04'},
  {round:17,gp:'Pertamina Grand Prix of Indonesia',                   circuit:'Mandalika International Street Circuit',country:'🇮🇩', date:'2026-10-11'},
  {round:18,gp:'Grand Prix of Australia',                             circuit:'Phillip Island Grand Prix Circuit',  country:'🇦🇺', date:'2026-10-25'},
  {round:19,gp:'Petronas Grand Prix of Malaysia',                     circuit:'Sepang International Circuit',       country:'🇲🇾', date:'2026-11-01'},
  {round:20,gp:'Qatar Airways Grand Prix of Qatar',                   circuit:'Lusail International Circuit',       country:'🇶🇦', date:'2026-11-08'},
  {round:21,gp:'Repsol Grand Prix of Portugal',                       circuit:'Algarve International Circuit',      country:'🇵🇹', date:'2026-11-22'},
  {round:22,gp:'Motul Grand Prix of Valencia',                        circuit:'Circuit Ricardo Tormo',              country:'🇪🇸', date:'2026-11-29'},
];

// Completed rounds 1–8 — GP winners re-confirmed on the season page in this
// session; sprint winners from individual GP pages, corroborated by motogp.com
// news and by points arithmetic (e.g. Acosta 32 pts after R1 = 12 sprint +
// 20 GP). A first-pass season-table extraction produced different sprint
// winners and was discarded as an extraction artifact (see session report).
const MOTOGP_RESULTS={
  1:{sprintWinner:'Acosta',      winner:'Bezzecchi',      p2:'Acosta',     p3:'R. Fernandez',    pole:'Bezzecchi',
     note:'Bezzecchi dominated from pole while M. Marquez retired with a technical DNF and A. Marquez crashed out. Sprint winner Acosta recovered from P6 to second and left Thailand as points leader.'},
  2:{sprintWinner:'M. Marquez',  winner:'Bezzecchi',      p2:'Martin',     p3:'Di Giannantonio', pole:'Di Giannantonio',
     note:'Shortened from 31 to 23 laps for asphalt deterioration in turns 11–12; Bezzecchi led an Aprilia 1-2 over Martin, with sprint winner M. Marquez fourth.'},
  3:{sprintWinner:'Martin',      winner:'Bezzecchi',      p2:'Martin',     p3:'Acosta',          pole:'Di Giannantonio',
     note:'Bezzecchi made it three GP wins from three at COTA, beating Martin and Acosta. Martin took Saturday\'s sprint — his first sprint win since 2024.'},
  4:{sprintWinner:'M. Marquez',  winner:'A. Marquez',     p2:'Bezzecchi',  p3:'Di Giannantonio', pole:'M. Marquez',
     note:'A. Marquez won from fifth at Jerez after polesitter and sprint winner M. Marquez crashed out early; Bezzecchi\'s P2 kept the championship lead.'},
  5:{sprintWinner:'Martin',      winner:'Martin',         p2:'Bezzecchi',  p3:'Ogura',           pole:'Bagnaia',
     note:'Martin completed a sprint–GP double at Le Mans as polesitter Bagnaia crashed out; Martin–Bezzecchi–Ogura was MotoGP\'s first all-Aprilia podium.'},
  6:{sprintWinner:'A. Marquez',  winner:'Di Giannantonio',p2:'Aldeguer',   p3:'Bagnaia',         pole:'Acosta',
     note:'Red-flagged twice — a lap-12 crash involving sprint winner A. Marquez, then a multi-rider turn-1 pile-up at the restart — before Di Giannantonio led an all-Ducati podium over the final 12 laps.'},
  7:{sprintWinner:'R. Fernandez',winner:'Bezzecchi',      p2:'Martin',     p3:'Bagnaia',         pole:'Bezzecchi',
     note:'Bezzecchi converted pole into his first Mugello win ahead of Martin; Bagnaia third with the fastest lap. R. Fernandez fended off Martin on Saturday for his maiden sprint win.'},
  8:{sprintWinner:'M. Marquez',  winner:'M. Marquez',     p2:'Acosta',     p3:'Bagnaia',         pole:'M. Marquez',
     note:'M. Marquez swept pole, the sprint and the Grand Prix at Balaton Park, leading start to finish ahead of Acosta and Bagnaia — covered by motogp.com as his 100th win.'},
};

// Riders' championship after R8 Hungary (2026-06-07) — verified 2026-06-12,
// Wikipedia season page (re-confirmed directly this session); motogp.com news
// text corroborates the 72-point Bezzecchi → M. Marquez gap. Combined
// sprint+GP points as published. gap = points − leader points.
// P12/P13 tie (48 pts): order as published; tie-break criterion not checked.
const MOTOGP_STANDINGS=[
  {pos:1, rider:'Bezzecchi',       points:180, gap:0},
  {pos:2, rider:'Martin',          points:160, gap:-20},
  {pos:3, rider:'Di Giannantonio', points:138, gap:-42},
  {pos:4, rider:'Acosta',          points:132, gap:-48},
  {pos:5, rider:'M. Marquez',      points:108, gap:-72},
  {pos:6, rider:'Ogura',           points:105, gap:-75},
  {pos:7, rider:'Bagnaia',         points:99,  gap:-81},
  {pos:8, rider:'R. Fernandez',    points:93,  gap:-87},
  {pos:9, rider:'A. Marquez',      points:67,  gap:-113},
  {pos:10,rider:'Aldeguer',        points:64,  gap:-116},
  {pos:11,rider:'Marini',          points:57,  gap:-123},
  {pos:12,rider:'Bastianini',      points:48,  gap:-132},
  {pos:13,rider:'Binder',          points:48,  gap:-132},
  {pos:14,rider:'Morbidelli',      points:40,  gap:-140},
  {pos:15,rider:'Quartararo',      points:37,  gap:-143},
  {pos:16,rider:'Moreira',         points:36,  gap:-144},
  {pos:17,rider:'Zarco',           points:34,  gap:-146},
  {pos:18,rider:'Mir',             points:15,  gap:-165},
  {pos:19,rider:'Rins',            points:12,  gap:-168},
  {pos:20,rider:'Miller',          points:11,  gap:-169},
  {pos:21,rider:'Lecuona',         points:9,   gap:-171},
  {pos:22,rider:'Razgatlioglu',    points:9,   gap:-171},
  {pos:23,rider:'Vinales',         points:6,   gap:-174},
  {pos:24,rider:'A. Fernandez',    points:4,   gap:-176},
];

// Constructors' championship after R8 — Wikipedia season page (re-confirmed
// this session). Not derivable from winners alone; taken as published.
const MOTOGP_CONSTRUCTORS=[
  {pos:1, constructor:'Aprilia', points:238, gap:0},
  {pos:2, constructor:'Ducati',  points:225, gap:-13},
  {pos:3, constructor:'KTM',     points:154, gap:-84},
  {pos:4, constructor:'Honda',   points:84,  gap:-154},
  {pos:5, constructor:'Yamaha',  points:49,  gap:-189},
];

// Per-round official Sunday-GP recaps from the MotoGP YouTube channel
// (oEmbed author_name exactly "MotoGP"). The channel's 2026 recap series is
// titled "Best MotoGP Moments | 2026 <X> GP" (publish dates match each race
// Sunday — the old "Race Highlights" format was retired after 2025). Each ID
// oEmbed-verified + embed-page checked 2026-06-12; thumbs hand-picked.
const MOTOGP_HIGHLIGHTS={
  1:{id:'M4BpQ_Sg_Jo',thumb:'https://i.ytimg.com/vi/M4BpQ_Sg_Jo/hq1.jpg'},
  2:{id:'ci-cuioZ-5w',thumb:'https://i.ytimg.com/vi/ci-cuioZ-5w/hq1.jpg'},
  3:{id:'txCsdIIAL9E',thumb:'https://i.ytimg.com/vi/txCsdIIAL9E/hq1.jpg'},
  4:{id:'dUaqIP-8N1Q',thumb:'https://i.ytimg.com/vi/dUaqIP-8N1Q/hq1.jpg'},
  5:{id:'4_Zozg9Fk7k',thumb:'https://i.ytimg.com/vi/4_Zozg9Fk7k/hq1.jpg'},
  6:{id:'79KMky2fizY',thumb:'https://i.ytimg.com/vi/79KMky2fizY/hq1.jpg'},
  7:{id:'18YMxJZ2Bf4',thumb:'https://i.ytimg.com/vi/18YMxJZ2Bf4/hq3.jpg'},
  8:{id:'h7cYVE-nWDE',thumb:'https://i.ytimg.com/vi/h7cYVE-nWDE/hq1.jpg'},
};

// ── MOTOGP HELPERS ────────────────────────────────────────────────────────────
function motogpRider(lastName){return MOTOGP_RIDERS[lastName]||{first:'',team:'—',bike:'—',num:'—',nat:''};}
function motogpSlug(circuit){return (circuit||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'race';}

function renderMotoGPNextBanner(){
  const now=new Date();
  const next=MOTOGP_SCHEDULE.find(r=>new Date(r.date+'T13:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Race · Round ${next.round} · SPRINT + GP</div>
      <div class="next-race-name">${next.country} ${next.gp}</div>
      <div class="next-race-circuit">${next.circuit}</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

// ── MOTOGP RACE RESULTS ───────────────────────────────────────────────────────
function renderMotoGPRaces(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('motogp','races')+renderBackToSeriesHome('motogp');
  const banner=renderMotoGPNextBanner();
  const completed=MOTOGP_SCHEDULE.filter(s=>MOTOGP_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const rows=completed.map(s=>{
    const res=MOTOGP_RESULTS[s.round];
    const w=motogpRider(res.winner);
    const isSelected=selectedMotoGPRace===s.round;
    const slug=motogpSlug(s.circuit);
    const hlId=`highlights-motogp-r${s.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectMotoGPRace(${s.round})">
      <div class="round-badge"><div class="round-num">${s.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${s.country}</div>
        <div class="race-item-name">${s.gp}</div>
        <div class="race-item-date">${fmtDate(s.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('motogp','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag" style="color:${motogpBikeColor(w.bike)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${w.num}</span>
        <div class="winner-name">${res.winner}</div>
        <div class="winner-team">${w.bike}</div>
      </div>
    </div>`;
  }).join('');
  let html=top+banner+`<div class="section-title"><span>2026 MotoGP · ${completed.length} of ${MOTOGP_SCHEDULE.length} rounds</span><span>GP winner shown · Tap for sprint + podium</span></div>`+rows;
  if(selectedMotoGPRace)html+=buildMotoGPRaceDetailHTML(selectedMotoGPRace);
  content.innerHTML=html;
  setStats('—','—','RACE',`${completed.length}/${MOTOGP_SCHEDULE.length}`);
  if(selectedMotoGPRace){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

function buildMotoGPRaceDetailHTML(round){
  const sched=MOTOGP_SCHEDULE.find(s=>s.round===round);
  const res=MOTOGP_RESULTS[round];
  if(!sched||!res)return'';
  const w=motogpRider(res.winner);
  const p2=res.p2?motogpRider(res.p2):null;
  const p3=res.p3?motogpRider(res.p3):null;
  const sw=res.sprintWinner?motogpRider(res.sprintWinner):null;
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.gp}</div>
    <div class="results-race-sub">${sched.circuit} · Round ${sched.round}
    ${res.pole?`<br>🏁 Pole: ${res.pole}`:''}
    </div>
  </div>`;
  const sprint=sw?`<div style="padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--border);display:flex;align-items:baseline;gap:10px;">
    <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--yellow);letter-spacing:0.12em;">⚡ SPRINT WINNER</span>
    <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px;color:${motogpBikeColor(sw.bike)};">${res.sprintWinner}</span>
    <span style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);">${sw.team}</span>
  </div>`:'';
  let podium='';
  if(p2&&p3){
    podium=`<div class="podium-bar">
      <div class="podium-item p2-item">
        <div class="podium-pos">🥈 P2</div>
        <div class="podium-name">${res.p2}</div>
        <div class="podium-team">${p2.team}</div>
        <div class="podium-gap" style="color:${motogpBikeColor(p2.bike)}">${p2.bike}</div>
      </div>
      <div class="podium-item p1-item">
        <div class="podium-pos">🏆 GP WINNER</div>
        <div class="podium-name">${res.winner}</div>
        <div class="podium-team">${w.team}</div>
        <div class="podium-gap" style="color:${motogpBikeColor(w.bike)}">${w.bike}</div>
      </div>
      <div class="podium-item p3-item">
        <div class="podium-pos">🥉 P3</div>
        <div class="podium-name">${res.p3}</div>
        <div class="podium-team">${p3.team}</div>
        <div class="podium-gap" style="color:${motogpBikeColor(p3.bike)}">${p3.bike}</div>
      </div>
    </div>`;
  }
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RACE NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+podium+sprint+notes;
}

function selectMotoGPRace(round){
  track('race:open:motogp',{round});
  selectedMotoGPRace=selectedMotoGPRace===round?null:round;
  renderMotoGPRaces();
}

// ── MOTOGP STANDINGS (riders + constructors stacked) ──────────────────────────
function renderMotoGPStandings(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('motogp','standings')+renderBackToSeriesHome('motogp');
  const hdr=`<div class="section-title"><span>MotoGP Riders · 2026 · After R8 Hungary</span><span>Sprint + GP points</span></div>`;
  const rows=MOTOGP_STANDINGS.map(d=>{
    const info=motogpRider(d.rider);
    const isSelected=selectedMotoGPRider===d.rider;
    const breakdown=isSelected?renderMotoGPRiderBreakdown(d.rider,info,d.points,d.pos):'';
    return`<div>
      <div class="champ-row" style="${isSelected?'background:#0a0005;border-left:2px solid var(--yellow);':''}" onclick="track('rider:expand:motogp',{name:'${d.rider}'});selectedMotoGPRider=selectedMotoGPRider==='${d.rider}'?null:'${d.rider}';renderMotoGP();">
        <div class="champ-pos" style="color:${d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':'var(--text)'}">${d.pos}</div>
        <div class="flag-cell" style="color:${motogpBikeColor(info.bike)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${info.num}</div>
        <div>
          <div class="champ-name">${d.rider}</div>
          <div class="champ-team-sm" style="color:${motogpBikeColor(info.bike)}">${info.team}</div>
        </div>
        <div class="champ-pts">${d.points}</div>
        <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${d.pos===1?'LEADER':d.gap}</div>
      </div>
      ${breakdown}
    </div>`;
  }).join('');
  const conHdr=`<div class="section-title"><span>Constructors</span><span>After R8</span></div>`;
  const conRows=MOTOGP_CONSTRUCTORS.map(c=>`<div class="champ-row">
      <div class="champ-pos" style="color:${c.pos===1?'var(--yellow)':c.pos<=3?'var(--green)':'var(--text)'}">${c.pos}</div>
      <div class="flag-cell" style="color:${motogpBikeColor(c.constructor)};font-size:18px;">●</div>
      <div><div class="champ-name" style="color:${motogpBikeColor(c.constructor)};">${c.constructor}</div></div>
      <div class="champ-pts">${c.points}</div>
      <div class="champ-gap" style="color:${c.pos===1?'var(--yellow)':'var(--muted)'}">${c.pos===1?'LEADER':c.gap}</div>
    </div>`).join('');
  content.innerHTML=top+hdr+rows+conHdr+conRows;
  setStats(`${MOTOGP_STANDINGS[0].points} pts`,MOTOGP_STANDINGS[0].rider,'RIDERS','R8/22');
}

function renderMotoGPRiderBreakdown(name,info,points,pos){
  const gpWins=Object.entries(MOTOGP_RESULTS).filter(([_,r])=>r.winner===name);
  const sprintWins=Object.entries(MOTOGP_RESULTS).filter(([_,r])=>r.sprintWinner===name);
  const poles=Object.values(MOTOGP_RESULTS).filter(r=>r.pole===name).length;
  const winRows=gpWins.map(([rd])=>{
    const sched=MOTOGP_SCHEDULE.find(s=>s.round===parseInt(rd));
    return`<div style="display:grid;grid-template-columns:32px 1fr auto;padding:6px 16px;border-bottom:1px solid #141414;align-items:center;gap:10px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);">R${rd}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--text);">${sched?.gp||''}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--yellow);letter-spacing:0.08em;">🏆 GP WIN</div>
    </div>`;
  }).join('');
  return`<div style="background:var(--surface2);border-top:1px solid var(--border);border-bottom:2px solid var(--yellow);">
    <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:var(--white);">${info.first} ${name.replace(/^[A-Z]\. /,'')}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:${motogpBikeColor(info.bike)};margin-top:2px;">${info.team} · #${info.num} · ${info.bike}</div>
      </div>
      <button onclick="selectedMotoGPRider=null;renderMotoGP();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
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
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">GP WINS</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${gpWins.length>0?'var(--yellow)':'var(--muted)'};">${gpWins.length}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">SPRINT WINS</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${sprintWins.length>0?'var(--text)':'var(--muted)'};">${sprintWins.length}</div>
      </div>
    </div>
    ${gpWins.length>0?`<div style="padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;border-bottom:1px solid var(--border);">2026 GP WINS</div>${winRows}`:''}
  </div>`;
}

// ── MOTOGP SCHEDULE ───────────────────────────────────────────────────────────
function renderMotoGPSchedule(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('motogp','schedule')+renderBackToSeriesHome('motogp');
  const now=new Date();
  const upcoming=MOTOGP_SCHEDULE.filter(r=>new Date(r.date+'T13:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more MotoGP rounds on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const hdr=`<div class="section-title"><span>MotoGP 2026 · ${upcoming.length} Upcoming</span><span>Through R${upcoming[upcoming.length-1].round}</span></div>`;
  const rows=upcoming.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'-';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country} · SPRINT + GP</div>
        <div class="race-item-name">${r.gp}</div>
        <div class="race-item-date">${fmtDate(r.date)} · ${r.circuit}</div>
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
  setStats(`R${next.round}`,next.gp.split(' ').slice(-2).join(' '),'SCHED',cd?`${cd.num}${cd.unit[0]}`:'NOW');
}

// ── MOTOGP HIGHLIGHTS ─────────────────────────────────────────────────────────
function renderMotoGPHighlights(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('motogp','highlights')+renderBackToSeriesHome('motogp');
  const completed=MOTOGP_SCHEDULE.filter(s=>MOTOGP_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=MOTOGP_RESULTS[s.round];
    const winInfo=motogpRider(res.winner);
    const slug=motogpSlug(s.circuit);
    const id=`highlights-motogp-r${s.round}-${slug}`;
    const vid=MOTOGP_HIGHLIGHTS[s.round];
    const body=vid
      ? txHighlightSlotHTML('Race Highlights',vid.id,vid.thumb)
      : `<div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${s.round} · ${s.country} · ${fmtDate(s.date)}</div>
      <div class="tx-highlights-title">${s.gp}</div>
      <div class="tx-highlights-winner">GP: ${res.winner} (${winInfo.bike}) · Sprint: ${res.sprintWinner||'—'}</div>
      ${body}
    </div>`;
  }).join('');
  content.innerHTML=top+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">MotoGP 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps from the MotoGP YouTube channel. Videos are added after verification — placeholders shown for rounds without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

// ── DISPATCHER ────────────────────────────────────────────────────────────────
function switchMotoGPTab(tab){
  track('tab:motogp',{tab});
  currentMotoGPTab=tab;
  selectedMotoGPRace=null;
  selectedMotoGPRider=null;
  document.querySelectorAll('#motogp-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('motogptab-'+tab)?.classList.add('active');
  renderMotoGP();
}

function renderMotoGP(){
  if(currentMotoGPTab==='races')return renderMotoGPRaces();
  if(currentMotoGPTab==='schedule')return renderMotoGPSchedule();
  if(currentMotoGPTab==='highlights')return renderMotoGPHighlights();
  return renderMotoGPStandings();
}
// ── END MOTOGP ────────────────────────────────────────────────────────────────
