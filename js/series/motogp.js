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
// Rounds 9–17 added 2026-10-14 (catch-up), sources:
//   Official motogp.com timing PDFs (primary), per event code
//   CZE/NED/GER/GBR/ARA/RSM/AUT/JPN/INA:
//     https://resources.motogp.com/files/results/2026/<EVT>/MotoGP/Q2/Classification.pdf  (pole)
//     https://resources.motogp.com/files/results/2026/<EVT>/MotoGP/RAC/Classification.pdf (GP)
//     https://resources.motogp.com/files/results/2026/INA/MotoGP/RAC/worldstanding.pdf
//       (riders' + constructors' standings after R17 with per-round sprint/GP
//        points — sprint winners = 12-pt sprint scorers, GP podium = 25/20/16)
//   Wikipedia 2026 season page + individual GP pages R9–R17 (cross-check:
//     sprint/GP classifications, poles, notes). Season-page standings grid
//     omits M. Marquez's AUT sprint P2 (9 pts) but its total (353) matches
//     the official PDF; the GP page + crash.net Austria sprint report confirm.
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
  // Point-scoring substitutes/wildcards added 2026-10-14 — team/number from the
  // official motogp.com RAC classification PDFs (RSM/AUT/JPN 2026).
  // Keyed 'P. Espargaro' because Aleix Espargaro also raced in 2026 (INA, 0 pts).
  'P. Espargaro':   {first:'Pol',       team:'Red Bull KTM Tech3',                bike:'KTM',     num:44, nat:'Spanish'},
  'Nakagami':       {first:'Takaaki',   team:'Honda HRC Castrol',                 bike:'Honda',   num:30, nat:'Japanese'},
  'Chantra':        {first:'Somkiat',   team:'Honda HRC Castrol',                 bike:'Honda',   num:15, nat:'Thai'},
};

// 2026 calendar (22 rounds) — verified 2026-06-12 from the Wikipedia season
// page; motogp.com /en/calendar cross-check matched all weekend dates and the
// 22-round count (its extracted table dropped Indonesia — see session report).
// Re-audited 2026-10-22 (R18–R22 unchanged): Wikipedia season calendar
// (Qatar moved to 8 Nov, Portugal 22 Nov, Valencia 29 Nov) + motogp.com
// /en/calendar (MAL 30 Oct–1 Nov, QAT 6–8 Nov, POR 20–22 Nov, VAL 27–29 Nov;
// its extracted table dropped Australia this time) + crash.net and the
// promoter motogp.com.au for Australia (R18, Phillip Island, 23–25 Oct).
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
  // R9–R17: winners/podiums/poles from official motogp.com classification
  // PDFs; sprint winners from the official standings PDF (12-pt sprint
  // scorer) and the sprint classification on each Wikipedia GP page.
  9:{sprintWinner:'Bagnaia',     winner:'M. Marquez',     p2:'Ogura',      p3:'Bagnaia',         pole:'Ogura',
     note:'M. Marquez won at Brno ahead of polesitter Ogura and sprint winner Bagnaia. Championship leader Bezzecchi was excluded from Sunday\'s race for striking a track marshal after crashing out of the sprint.'},
  10:{sprintWinner:'R. Fernandez',winner:'Ogura',         p2:'R. Fernandez',p3:'Martin',         pole:'Martin',
     note:'Trackhouse went 1-2 in both races: R. Fernandez won the sprint and Ogura took his maiden MotoGP win — the first by a Japanese rider since Tamada in 2004. Bezzecchi crashed out on lap 2 and polesitter Martin\'s P3 put him into the championship lead.'},
  11:{sprintWinner:'M. Marquez',  winner:'M. Marquez',     p2:'Ogura',      p3:'R. Fernandez',    pole:'M. Marquez',
     note:'M. Marquez completed a Grand Chelem at the Sachsenring for his 10th premier-class win there. Bezzecchi was ruled unfit after breaking his collarbone in qualifying; Martin led the top five, separated by 24 points, into the summer break.'},
  12:{sprintWinner:'Martin',      winner:'R. Fernandez',   p2:'Martin',     p3:'Bezzecchi',       pole:'Martin',
     note:'An all-Aprilia podium in both races at Silverstone: polesitter Martin won the sprint and was second on Sunday as R. Fernandez took the Grand Prix with the fastest lap.'},
  13:{sprintWinner:'M. Marquez',  winner:'M. Marquez',     p2:'Acosta',     p3:'Bezzecchi',       pole:'Bezzecchi',
     note:'M. Marquez swept sprint and Grand Prix at Aragon for the third straight year. Polesitter Bezzecchi was third in both races; Martin was fifth twice.'},
  14:{sprintWinner:'M. Marquez',  winner:'M. Marquez',     p2:'A. Marquez', p3:'Acosta',          pole:'Bezzecchi',
     note:'Another M. Marquez double at Misano, with brother A. Marquez second on Sunday, drew him level with Martin on 274 points and to the top of the table for the first time in 2026.'},
  15:{sprintWinner:'Martin',      winner:'Acosta',         p2:'Martin',     p3:'Bezzecchi',       pole:'Martin',
     note:'Acosta took his maiden MotoGP win — KTM\'s first since Thailand 2022 — passing polesitter Martin, who had won the sprint after Acosta crashed out of the lead. Martin retook the championship lead.'},
  16:{sprintWinner:'M. Marquez',  winner:'M. Marquez',     p2:'Martin',     p3:'Bezzecchi',       pole:'Martin',
     note:'M. Marquez won both races at Motegi, but polesitter Martin (3rd in the sprint, 2nd on Sunday) kept a two-point lead. Moreira was second in the sprint for Honda.'},
  17:{sprintWinner:'M. Marquez',  winner:'Bezzecchi',      p2:'R. Fernandez',p3:'Martin',         pole:'R. Fernandez',
     note:'Bezzecchi led Aprilia\'s first premier-class 1-2-3-4 (Bezzecchi, R. Fernandez, Martin, Ogura). M. Marquez\'s sprint win briefly put him top, but his P6 on Sunday left Martin two points clear; Aprilia retook the constructors\' lead.'},
};

// Riders' championship after R17 Indonesia (2026-10-11) — official motogp.com
// World Championship Classification PDF (INA/MotoGP/RAC/worldstanding.pdf),
// matched by the Wikipedia season page totals. Combined sprint+GP points as
// published; order as published (ties: Quartararo/Moreira 74, Chantra/
// Nakagami 3 — official order kept). gap = points − leader points.
// Zero-point riders (Crutchlow, Folger, Savadori, Pirro, A. Espargaro) omitted.
const MOTOGP_STANDINGS=[
  {pos:1,  rider:'Martin',          points:355, gap:0},
  {pos:2,  rider:'M. Marquez',      points:353, gap:-2},
  {pos:3,  rider:'Bezzecchi',       points:309, gap:-46},
  {pos:4,  rider:'Ogura',           points:259, gap:-96},
  {pos:5,  rider:'Acosta',          points:258, gap:-97},
  {pos:6,  rider:'Di Giannantonio', points:245, gap:-110},
  {pos:7,  rider:'R. Fernandez',    points:236, gap:-119},
  {pos:8,  rider:'A. Marquez',      points:172, gap:-183},
  {pos:9,  rider:'Bagnaia',         points:166, gap:-189},
  {pos:10, rider:'Aldeguer',        points:125, gap:-230},
  {pos:11, rider:'Bastianini',      points:122, gap:-233},
  {pos:12, rider:'Marini',          points:108, gap:-247},
  {pos:13, rider:'Binder',          points:104, gap:-251},
  {pos:14, rider:'Quartararo',      points:74,  gap:-281},
  {pos:15, rider:'Moreira',         points:74,  gap:-281},
  {pos:16, rider:'Morbidelli',      points:59,  gap:-296},
  {pos:17, rider:'Zarco',           points:51,  gap:-304},
  {pos:18, rider:'Mir',             points:33,  gap:-322},
  {pos:19, rider:'Miller',          points:28,  gap:-327},
  {pos:20, rider:'Rins',            points:25,  gap:-330},
  {pos:21, rider:'Razgatlioglu',    points:18,  gap:-337},
  {pos:22, rider:'Vinales',         points:12,  gap:-343},
  {pos:23, rider:'Lecuona',         points:9,   gap:-346},
  {pos:24, rider:'A. Fernandez',    points:6,   gap:-349},
  {pos:25, rider:'P. Espargaro',    points:5,   gap:-350},
  {pos:26, rider:'Chantra',         points:3,   gap:-352},
  {pos:27, rider:'Nakagami',        points:3,   gap:-352},
];

// Constructors' championship after R17 — official motogp.com worldstanding
// PDF (INA), matches Wikipedia. Not derivable from winners; taken as published.
const MOTOGP_CONSTRUCTORS=[
  {pos:1, constructor:'Aprilia', points:503, gap:0},
  {pos:2, constructor:'Ducati',  points:491, gap:-12},
  {pos:3, constructor:'KTM',     points:311, gap:-192},
  {pos:4, constructor:'Honda',   points:165, gap:-338},
  {pos:5, constructor:'Yamaha',  points:97,  gap:-406},
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
  const hdr=`<div class="section-title"><span>MotoGP Riders · 2026 · After R17 Indonesia</span><span>Sprint + GP points</span></div>`;
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
  const conHdr=`<div class="section-title"><span>Constructors</span><span>After R17</span></div>`;
  const conRows=MOTOGP_CONSTRUCTORS.map(c=>`<div class="champ-row">
      <div class="champ-pos" style="color:${c.pos===1?'var(--yellow)':c.pos<=3?'var(--green)':'var(--text)'}">${c.pos}</div>
      <div class="flag-cell" style="color:${motogpBikeColor(c.constructor)};font-size:18px;">●</div>
      <div><div class="champ-name" style="color:${motogpBikeColor(c.constructor)};">${c.constructor}</div></div>
      <div class="champ-pts">${c.points}</div>
      <div class="champ-gap" style="color:${c.pos===1?'var(--yellow)':'var(--muted)'}">${c.pos===1?'LEADER':c.gap}</div>
    </div>`).join('');
  content.innerHTML=top+hdr+rows+conHdr+conRows;
  setStats(`${MOTOGP_STANDINGS[0].points} pts`,MOTOGP_STANDINGS[0].rider,'RIDERS','R17/22');
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
