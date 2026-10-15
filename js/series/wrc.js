// ═══════════════════════════════════════════════════════════════════════════
// ── WRC MODULE ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// World Rally Championship 2026 — top class. Built 2026-06-12 (Phase 1d).
// Data model (design of record: docs/series-data-models.md):
//
//   WRC_DRIVERS:  lastName → {first, codriver, team, car, nat}
//   WRC_SCHEDULE: [{round, rally, country, date, surface}]
//   WRC_RESULTS:  {round: {winner, p2, p3, time, p2Gap, p3Gap,
//                  stageWins: {lastName: count} | null,
//                  powerStage: {winner, top5:[...]|null} | null, note}}
//   WRC_STANDINGS: [{pos, driver, points, gap}]   // as published, NOT recomputed
//   WRC_MFR_STANDINGS: [{pos, mfr, points, gap}]
//
// Rallies are not circuit races — each result stores the overall podium with
// total-time gaps, a stage-winner tally, and the Power Stage result (bonus
// points 5-4-3-2-1). 2026 points: 25-17-15-12-10-8-6-4-2-1 overall + Sunday
// top-5 bonus 5-4-3-2-1 + Power Stage 5-4-3-2-1; standings totals are taken
// as published on the season page, never recomputed here.
// Drivers sharing surnames keyed with initials ('Y. Rossel' / 'L. Rossel').
// Sub-tabs: Standings / Race Results / Schedule / Highlights. NO live timing.
//
// Sources (fetched + cross-checked 2026-06-12; standings, manufacturers,
// winners and calendar re-confirmed directly in this session):
//   https://en.wikipedia.org/wiki/2026_World_Rally_Championship
//     (calendar, standings, manufacturers, entry list)
//   Individual Wikipedia rally pages (podiums, gaps, stage wins, power stage):
//     2026_Monte_Carlo_Rally, 2026_Rally_Sweden, 2026_Safari_Rally,
//     2026_Croatia_Rally, 2026_Rally_Islas_Canarias, 2026_Rally_de_Portugal,
//     2026_Rally_Japan
//   https://www.wrc.com/en/news/evans-wins-in-japan-as-toyota-seals-home-podium-sweep
//     (search-snippet corroboration: Evans 151 / Katsuta 131 after R7, Japan
//      podium + 12.8s margin; wrc.com + fia.com standings pages return 403/404)
// Catch-up 2026-10-14 (R8–R13, season complete): Wikipedia season page +
//   2026_Acropolis_Rally, 2026_Rally_Estonia, 2026_Rally_Finland,
//   2026_Rally_del_Paraguay, 2026_Rally_Chile, 2026_Rally_Italia_Sardegna
//   (Rally1 classification incl. per-driver Sunday/Power Stage points,
//   special-stage winners). wrc.com news (search snippets — pages are
//   JS-rendered) corroborates every winner + margin, Saudi's removal, and
//   the final Evans 243 / Solberg 238 / Pajari 237 / Ogier 189 / Fourmaux 183:
//   https://www.wrc.com/en/news/ogier-wins-in-greece-after-dramatic-acropolis-finale
//   https://www.wrc.com/en/news/pajari-wins-delfi-rally-estonia
//   https://www.wrc.com/en/news/pajari-powers-to-dream-home-victory-in-finland
//   https://www.wrc.com/en/news/pajari-completes-wrc-hat-trick-with-paraguay-victory
//   https://www.wrc.com/en/news/solberg-wins-rally-chile-as-toyota-clinches-manufacturers-crown
//   https://www.wrc.com/en/news/evans-crowned-2026-wrc-champion-in-sardinia-thriller
//   https://www.wrc.com/en/news/fia-and-wrc-promoter-confirm-final-round-of-the-2026-wrc-season
// Cardinal rule: unverified values are null/'—' with a comment, never guessed.

let currentWRCTab='standings';
let selectedWRCRally=null;
let selectedWRCDriver=null;

// Entrant colors (styling only)
const WRC_TEAM_COLOR={'Toyota Gazoo Racing WRT':'#EB0A1E','Toyota Gazoo Racing WRT2':'#FF6B6B','Hyundai Shell Mobis WRT':'#00AAD2','M-Sport Ford WRT':'#003478','default':'#888'};
function wrcTeamColor(t){return WRC_TEAM_COLOR[t]||WRC_TEAM_COLOR['default'];}

// Rally1 regulars: full details from the Wikipedia 2026 entry list. Armstrong
// and Sordo's cars + Sesks's Rally1 entry (M-Sport, co-driver Francis) added
// 2026-10-14 from the Rally1 classification tables on the Acropolis/Estonia
// Wikipedia pages. The remaining rows are WRC2-entered crews who score overall
// points — their entrant/car details weren't on the fetched pages → '—'
// (Latvala, Galanti, Gill added 2026-10-14; nationality from season-page flags).
const WRC_DRIVERS={
  'Evans':         {first:'Elfyn',     codriver:'Scott Martin',      team:'Toyota Gazoo Racing WRT',  car:'Toyota GR Yaris Rally1', nat:'British'},
  'Katsuta':       {first:'Takamoto',  codriver:'Aaron Johnston',    team:'Toyota Gazoo Racing WRT',  car:'Toyota GR Yaris Rally1', nat:'Japanese'},
  'Solberg':       {first:'Oliver',    codriver:'Elliott Edmondson', team:'Toyota Gazoo Racing WRT',  car:'Toyota GR Yaris Rally1', nat:'Swedish'},
  'Ogier':         {first:'Sébastien', codriver:'Vincent Landais',   team:'Toyota Gazoo Racing WRT',  car:'Toyota GR Yaris Rally1', nat:'French'},
  'Pajari':        {first:'Sami',      codriver:'Marko Salminen',    team:'Toyota Gazoo Racing WRT2', car:'Toyota GR Yaris Rally1', nat:'Finnish'},
  'Neuville':      {first:'Thierry',   codriver:'Martijn Wydaeghe',  team:'Hyundai Shell Mobis WRT',  car:'Hyundai i20 N Rally1',   nat:'Belgian'},
  'Fourmaux':      {first:'Adrien',    codriver:'Alexandre Coria',   team:'Hyundai Shell Mobis WRT',  car:'Hyundai i20 N Rally1',   nat:'French'},
  'Paddon':        {first:'Hayden',    codriver:'John Kennard',      team:'Hyundai Shell Mobis WRT',  car:'Hyundai i20 N Rally1',   nat:'New Zealander'},
  'Lappi':         {first:'Esapekka',  codriver:'Enni Mälkönen',     team:'Hyundai Shell Mobis WRT',  car:'Hyundai i20 N Rally1',   nat:'Finnish'},
  'Sordo':         {first:'Dani',      codriver:'Cándido Carrera',   team:'Hyundai Shell Mobis WRT',  car:'Hyundai i20 N Rally1',   nat:'Spanish'},
  'McErlean':      {first:'Josh',      codriver:'Eoin Treacy',       team:'M-Sport Ford WRT',         car:'Ford Puma Rally1',       nat:'Irish'},
  'Armstrong':     {first:'Jon',       codriver:'Shane Byrne',       team:'M-Sport Ford WRT',         car:'Ford Puma Rally1',       nat:'Irish'},
  // WRC2-entered overall point scorers — entrant/car not on fetched pages
  'Y. Rossel':     {first:'Yohan',     codriver:'Arnaud Dunand',     team:'—', car:'—', nat:'French'},
  'L. Rossel':     {first:'Léo',       codriver:'—',                 team:'—', car:'—', nat:'French'},
  'Virves':        {first:'Robert',    codriver:'—',                 team:'—', car:'—', nat:'Estonian'},
  'Gryazin':       {first:'Nikolay',   codriver:'—',                 team:'—', car:'—', nat:'Bulgarian'},
  'Greensmith':    {first:'Gus',       codriver:'—',                 team:'—', car:'—', nat:'British'},
  'Cachón':        {first:'Alejandro', codriver:'—',                 team:'—', car:'—', nat:'Spanish'},
  'Zaldivar':      {first:'Fabrizio',  codriver:'—',                 team:'—', car:'—', nat:'Paraguayan'},
  'Daprà':         {first:'Roberto',   codriver:'—',                 team:'—', car:'—', nat:'Italian'},
  'Korhonen':      {first:'Roope',     codriver:'—',                 team:'—', car:'—', nat:'Finnish'},
  'Mikkelsen':     {first:'Andreas',   codriver:'—',                 team:'—', car:'—', nat:'Norwegian'},
  'Domínguez Jr.': {first:'Diego',     codriver:'—',                 team:'—', car:'—', nat:'Paraguayan'},
  'Pelamourgues':  {first:'Arthur',    codriver:'—',                 team:'—', car:'—', nat:'French'},
  'Sesks':         {first:'Mārtiņš',   codriver:'Renārs Francis',    team:'M-Sport Ford WRT',         car:'Ford Puma Rally1',       nat:'Latvian'},
  'Fontana':       {first:'Matteo',    codriver:'—',                 team:'—', car:'—', nat:'Italian'},
  'Suninen':       {first:'Teemu',     codriver:'—',                 team:'—', car:'—', nat:'Finnish'},
  'Camilli':       {first:'Eric',      codriver:'—',                 team:'—', car:'—', nat:'French'},
  'Lindholm':      {first:'Emil',      codriver:'—',                 team:'—', car:'—', nat:'Finnish'},
  'Latvala':       {first:'Jari-Matti',codriver:'—',                 team:'—', car:'—', nat:'Finnish'},
  'Galanti':       {first:'Alejandro', codriver:'—',                 team:'—', car:'—', nat:'Paraguayan'},
  'Gill':          {first:'Taylor',    codriver:'—',                 team:'—', car:'—', nat:'Australian'},
};

// 2026 calendar — verified 2026-06-12, Wikipedia season page.
// date = final day (Sunday). Rally Saudi Arabia (was R14, 2026-11-14) was
// removed from the WRC calendar ("ongoing regional developments"), making
// Sardegna the 13th and final round — wrc.com/fia.com "FIA and WRC Promoter
// confirm final round of the 2026 WRC season" + Wikipedia season page.
const WRC_SCHEDULE=[
  {round:1, rally:'Rallye Automobile Monte Carlo', country:'🇲🇨', date:'2026-01-25', surface:'mixed'},
  {round:2, rally:'Rally Sweden',                  country:'🇸🇪', date:'2026-02-15', surface:'snow'},
  {round:3, rally:'Safari Rally Kenya',            country:'🇰🇪', date:'2026-03-15', surface:'gravel'},
  {round:4, rally:'Croatia Rally',                 country:'🇭🇷', date:'2026-04-12', surface:'tarmac'},
  {round:5, rally:'Rally Islas Canarias',          country:'🇪🇸', date:'2026-04-26', surface:'tarmac'},
  {round:6, rally:'Rally de Portugal',             country:'🇵🇹', date:'2026-05-10', surface:'gravel'},
  {round:7, rally:'Rally Japan',                   country:'🇯🇵', date:'2026-05-31', surface:'tarmac'},
  {round:8, rally:'Acropolis Rally Greece',        country:'🇬🇷', date:'2026-06-28', surface:'gravel'},
  {round:9, rally:'Rally Estonia',                 country:'🇪🇪', date:'2026-07-19', surface:'gravel'},
  {round:10,rally:'Rally Finland',                 country:'🇫🇮', date:'2026-08-02', surface:'gravel'},
  {round:11,rally:'Rally del Paraguay',            country:'🇵🇾', date:'2026-08-30', surface:'gravel'},
  {round:12,rally:'Rally Chile',                   country:'🇨🇱', date:'2026-09-13', surface:'gravel'},
  {round:13,rally:'Rally Italia Sardegna',         country:'🇮🇹', date:'2026-10-04', surface:'gravel'},
];

// Completed rounds 1–13 — podiums/gaps/stage wins/power stage from individual
// Wikipedia rally pages; winners re-confirmed on the season page this session;
// R7 corroborated by wrc.com news. powerStage.top5 is null where only the
// winner is published (R3, R4, R7) — cardinal rule, no guessed orders.
const WRC_RESULTS={
  1:{winner:'Solberg', p2:'Evans',   p3:'Ogier',  time:'4:24:59.0', p2Gap:'+51.8',  p3Gap:'+2:02.1',
     stageWins:{'Solberg':6,'Evans':4,'Ogier':4,'Fourmaux':3},
     powerStage:{winner:'Evans',top5:['Evans','Solberg','Fourmaux','Ogier','Neuville']},
     note:'Solberg/Edmondson dominated Monte Carlo for Toyota over 17 stages (339.15 km); Evans P2, Ogier P3, Fourmaux best Hyundai in P4. Evans won the SS17 Power Stage.'},
  2:{winner:'Evans',   p2:'Katsuta', p3:'Pajari', time:'2:35:53.1', p2Gap:'+14.3',  p3Gap:'+46.0',
     stageWins:{'Evans':5,'Solberg':4,'Katsuta':4,'Pajari':2,'Neuville':2,'Sesks':1},
     powerStage:{winner:'Neuville',top5:['Neuville','Evans','Katsuta','Solberg','Fourmaux']},
     note:'Evans/Martin repeated their Rally Sweden win on the snow as Toyota locked out the top four; Neuville won the SS18 Power Stage.'},
  3:{winner:'Katsuta', p2:'Fourmaux',p3:'Pajari', time:'3:16:05.6', p2Gap:'+27.4',  p3Gap:'+4:26.1',
     stageWins:{'Ogier':7,'Pajari':5,'Solberg':4,'Fourmaux':1,'Evans':1},
     powerStage:{winner:'Solberg',top5:null},
     note:'Katsuta/Johnston took their maiden WRC victory on the Safari\'s rough gravel; SS3 and SS16 were cancelled. Solberg won the SS20 Power Stage.'},
  4:{winner:'Katsuta', p2:'Pajari',  p3:'Paddon', time:'2:51:15.8', p2Gap:'+20.7',  p3Gap:'+2:07.7',
     stageWins:{'Solberg':10,'Evans':3,'Neuville':3,'Pajari':3,'Katsuta':1},
     powerStage:{winner:'Solberg',top5:null},
     note:'Katsuta\'s second win of the season on Croatian tarmac ahead of Pajari and Paddon\'s Hyundai. Solberg won 10 stages including the SS20 Power Stage but finished outside the top five.'},
  5:{winner:'Ogier',   p2:'Evans',   p3:'Pajari', time:'2:43:18.9', p2Gap:'+19.9',  p3Gap:'+1:40.8',
     stageWins:{'Ogier':6,'Solberg':5,'Evans':4,'Katsuta':1,'Pajari':1},
     powerStage:{winner:'Evans',top5:['Evans','Ogier','Pajari','Katsuta','Fourmaux']},
     note:'Ogier/Landais won the 50th Rally Islas Canarias by 19.9s over Evans as Toyota filled the top four; SS3 was cancelled and Evans won the SS18 Power Stage.'},
  6:{winner:'Neuville',p2:'Solberg', p3:'Evans',  time:'3:53:01.7', p2Gap:'+16.3',  p3Gap:'+29.1',
     stageWins:{'Ogier':6,'Fourmaux':5,'Solberg':4,'Pajari':3,'Evans':2,'Neuville':2,'McErlean':1},
     powerStage:{winner:'Fourmaux',top5:['Fourmaux','Solberg','Evans','Neuville','Ogier']},
     note:'Neuville/Wydaeghe took their first win of the season on Portugal\'s gravel, 16.3s ahead of Solberg; Fourmaux won the SS23 Power Stage.'},
  7:{winner:'Evans',   p2:'Ogier',   p3:'Pajari', time:'3:17:08.0', p2Gap:'+12.8',  p3Gap:'+51.4',
     stageWins:{'Solberg':7,'Evans':5,'Pajari':4,'Ogier':3,'Katsuta':1},
     powerStage:{winner:'Solberg',top5:null},
     note:'Evans/Martin took their second win of 2026 in Japan, beating Ogier by 12.8s as Toyota swept the top four; Solberg won the SS20 Power Stage.'},
  // R8–R13: top5 = the drivers awarded 5-4-3-2-1 Power Stage points in the
  // published Rally1 classification (all 15 pts accounted for each round).
  // Stages with a shared fastest time credit both crews (R8 SS15, R10 SS10).
  8:{winner:'Ogier',   p2:'Neuville',p3:'Katsuta',time:'3:36:40.7', p2Gap:'+58.3',  p3Gap:'+3:04.8',
     stageWins:{'Ogier':8,'Fourmaux':5,'Neuville':4,'Armstrong':1},
     powerStage:{winner:'Ogier',top5:['Ogier','Pajari','Neuville','Katsuta','Evans']},
     note:'Ogier/Landais took his 69th WRC win and a perfect Sunday (rally, Super Sunday, Power Stage) after long-time leader Neuville suffered two rear punctures on the penultimate stage; Neuville finished 58.3s back.'},
  9:{winner:'Pajari',  p2:'Solberg', p3:'Fourmaux',time:'2:31:16.5', p2Gap:'+19.5', p3Gap:'+53.8',
     stageWins:{'Pajari':12,'Solberg':5,'Neuville':1},
     powerStage:{winner:'Solberg',top5:['Solberg','Neuville','Evans','Ogier','Katsuta']},
     note:'Pajari/Salminen led Rally Estonia from start to finish for their maiden WRC win, taking 12 of 18 stages and beating Solberg by 19.5s; Solberg won the SS18 Power Stage.'},
  10:{winner:'Pajari', p2:'Solberg', p3:'Evans',  time:'2:27:58.0', p2Gap:'+26.7',  p3Gap:'+1:19.5',
     stageWins:{'Pajari':6,'Ogier':5,'Evans':4,'Fourmaux':2,'Solberg':2,'Neuville':1,'Katsuta':1},
     powerStage:{winner:'Evans',top5:['Evans','Solberg','Fourmaux','Neuville','Pajari']},
     note:'Pajari won his home Rally Finland after leader Ogier crashed out on Saturday; Evans recovered from a roll to third and won the SS20 Power Stage by 0.025s from Solberg.'},
  11:{winner:'Pajari', p2:'Paddon',  p3:'Fourmaux',time:'3:13:28.5', p2Gap:'+25.8', p3Gap:'+40.0',
     stageWins:{'Fourmaux':9,'Solberg':5,'Ogier':3,'Paddon':1,'Pajari':1,'Evans':1,'Katsuta':1},
     powerStage:{winner:'Solberg',top5:['Solberg','Ogier','Fourmaux','Evans','Neuville']},
     note:'Pajari/Salminen completed a hat-trick in Paraguay — the first crew to take their first three top-flight wins at consecutive rallies. Paddon was second on his first top-level gravel start since 2018; SS21 was cancelled and Solberg won the SS22 Power Stage.'},
  12:{winner:'Solberg',p2:'Ogier',   p3:'Fourmaux',time:'2:57:08.2', p2Gap:'+16.6', p3Gap:'+33.3',
     stageWins:{'Solberg':6,'Ogier':6,'Evans':2,'Neuville':1,'Pajari':1},
     powerStage:{winner:'Solberg',top5:['Solberg','Evans','Pajari','Katsuta','Ogier']},
     note:'Solberg/Edmondson won Rally Chile by 16.6s from Ogier as Toyota clinched a sixth straight manufacturers\' title (its 10th overall, level with Lancia). Evans lost over two minutes to a puncture and finished fifth.'},
  13:{winner:'Solberg',p2:'Ogier',   p3:'Pajari', time:'3:24:57.0', p2Gap:'+57.6',  p3Gap:'+1:37.4',
     stageWins:{'Neuville':6,'Solberg':5,'Ogier':3,'Fourmaux':2,'Pajari':1},
     powerStage:{winner:'Neuville',top5:['Neuville','Pajari','Evans','Katsuta','Fourmaux']},
     note:'Season finale: Solberg won Sardinia but slid off late in the Power Stage, scoring no stage points, so Evans/Martin (fifth overall, third on the stage) clinched the 2026 world title by five points — the first British drivers\' champion since Richard Burns in 2001. Neuville won the SS17 Power Stage.'},
};

// FINAL drivers' championship after R13 Sardegna (2026-10-04) — season
// complete, Evans/Martin champions. Verified 2026-10-14, Wikipedia season
// page (each rally page's post-event table agrees); wrc.com corroborates the
// top five (243 / 238 / 237 / 189 / 183). P6 onward is single-source
// Wikipedia. Totals as published (include Sunday + Power Stage bonus
// points), never recomputed. gap = points − leader points.
const WRC_STANDINGS=[
  {pos:1, driver:'Evans',         points:243, gap:0},
  {pos:2, driver:'Solberg',       points:238, gap:-5},
  {pos:3, driver:'Pajari',        points:237, gap:-6},
  {pos:4, driver:'Ogier',         points:189, gap:-54},
  {pos:5, driver:'Fourmaux',      points:183, gap:-60},
  {pos:6, driver:'Katsuta',       points:175, gap:-68},
  {pos:7, driver:'Neuville',      points:134, gap:-109},
  {pos:8, driver:'Paddon',        points:38,  gap:-205},
  {pos:9, driver:'McErlean',      points:35,  gap:-208},
  {pos:10,driver:'Lappi',         points:33,  gap:-210},
  {pos:11,driver:'Y. Rossel',     points:24,  gap:-219},
  {pos:12,driver:'Armstrong',     points:22,  gap:-221},
  {pos:13,driver:'Virves',        points:19,  gap:-224},
  {pos:14,driver:'L. Rossel',     points:18,  gap:-225},
  {pos:15,driver:'Greensmith',    points:14,  gap:-229},
  {pos:16,driver:'Sesks',         points:12,  gap:-231},
  {pos:17,driver:'Gryazin',       points:10,  gap:-233},
  {pos:18,driver:'Sordo',         points:10,  gap:-233},
  {pos:19,driver:'Korhonen',      points:9,   gap:-234},
  {pos:20,driver:'Domínguez Jr.', points:8,   gap:-235},
  {pos:21,driver:'Cachón',        points:7,   gap:-236},
  {pos:22,driver:'Zaldivar',      points:6,   gap:-237},
  {pos:23,driver:'Daprà',         points:6,   gap:-237},
  {pos:24,driver:'Mikkelsen',     points:5,   gap:-238},
  {pos:25,driver:'Latvala',       points:4,   gap:-239},
  {pos:26,driver:'Pelamourgues',  points:2,   gap:-241},
  {pos:27,driver:'Galanti',       points:2,   gap:-241},
  {pos:28,driver:'Suninen',       points:2,   gap:-241},
  {pos:29,driver:'Fontana',       points:2,   gap:-241},
  {pos:30,driver:'Gill',          points:1,   gap:-242},
  {pos:31,driver:'Camilli',       points:1,   gap:-242},
  {pos:32,driver:'Lindholm',      points:1,   gap:-242},
];

// FINAL manufacturers' championship after R13 — Wikipedia season page.
// Still single-source: wrc.com/FIA tables unreachable; wrc.com news only
// confirms Toyota clinched the title in Chile (R12). Flagged in the report.
const WRC_MFR_STANDINGS=[
  {pos:1, mfr:'Toyota Gazoo Racing WRT',  points:662, gap:0},
  {pos:2, mfr:'Hyundai Shell Mobis WRT',  points:440, gap:-222},
  {pos:3, mfr:'Toyota Gazoo Racing WRT2', points:251, gap:-411},
  {pos:4, mfr:'M-Sport Ford WRT',         points:168, gap:-494},
];

// Per-rally official "Final Day Highlights" from the WRC YouTube channel
// (oEmbed author_name "FIA World Rally Championship" — the channel's 2026
// per-event recap format). IDs oEmbed-verified + embed-page checked
// 2026-06-12. Thumbs: WRC's auto-captured frames are mostly interview shots,
// so most rounds use the cover image (carries the action shot + title text —
// flagged in the session report); R3 uses the trophy-celebration frame.
const WRC_HIGHLIGHTS={
  1:{id:'p8KcaiB6hY0',thumb:'https://i.ytimg.com/vi/p8KcaiB6hY0/maxresdefault.jpg'},
  2:{id:'T9drodnVUpQ',thumb:'https://i.ytimg.com/vi/T9drodnVUpQ/maxresdefault.jpg'},
  3:{id:'vqTmt_DkGYQ',thumb:'https://i.ytimg.com/vi/vqTmt_DkGYQ/hq3.jpg'},
  4:{id:'SA_odqlY1XE',thumb:'https://i.ytimg.com/vi/SA_odqlY1XE/maxresdefault.jpg'},
  5:{id:'9eJNKNthZl8',thumb:'https://i.ytimg.com/vi/9eJNKNthZl8/maxresdefault.jpg'},
  6:{id:'lxTnctlaJWU',thumb:'https://i.ytimg.com/vi/lxTnctlaJWU/maxresdefault.jpg'},
  7:{id:'d268Bi2HJe4',thumb:'https://i.ytimg.com/vi/d268Bi2HJe4/maxresdefault.jpg'},
};

// ── WRC HELPERS ───────────────────────────────────────────────────────────────
function wrcDrv(lastName){return WRC_DRIVERS[lastName]||{first:'',codriver:'—',team:'—',car:'—',nat:''};}
function wrcSlug(rally){return (rally||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'rally';}
function wrcSurfaceLabel(s){return (s||'').toUpperCase();}

function renderWRCNextBanner(){
  const now=new Date();
  const next=WRC_SCHEDULE.find(r=>new Date(r.date+'T13:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Rally · Round ${next.round} · ${wrcSurfaceLabel(next.surface)}</div>
      <div class="next-race-name">${next.country} ${next.rally}</div>
      <div class="next-race-circuit">Final day</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

// ── WRC RALLY RESULTS ─────────────────────────────────────────────────────────
function renderWRCRaces(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('wrc','races')+renderBackToSeriesHome('wrc');
  const banner=renderWRCNextBanner();
  const completed=WRC_SCHEDULE.filter(s=>WRC_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const rows=completed.map(s=>{
    const res=WRC_RESULTS[s.round];
    const w=wrcDrv(res.winner);
    const isSelected=selectedWRCRally===s.round;
    const slug=wrcSlug(s.rally);
    const hlId=`highlights-wrc-r${s.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectWRCRally(${s.round})">
      <div class="round-badge"><div class="round-num">${s.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${s.country} · ${wrcSurfaceLabel(s.surface)}</div>
        <div class="race-item-name">${s.rally}</div>
        <div class="race-item-date">${fmtDate(s.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('wrc','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag" style="color:${wrcTeamColor(w.team)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">🏆</span>
        <div class="winner-name">${res.winner}</div>
        <div class="winner-team">${w.team.replace(' WRT','').replace(' Shell Mobis','')}</div>
      </div>
    </div>`;
  }).join('');
  let html=top+banner+`<div class="section-title"><span>2026 WRC · ${completed.length} of ${WRC_SCHEDULE.length} rallies</span><span>Tap for stages + power stage</span></div>`+rows;
  if(selectedWRCRally)html+=buildWRCRallyDetailHTML(selectedWRCRally);
  content.innerHTML=html;
  setStats('—','—','RALLY',`${completed.length}/${WRC_SCHEDULE.length}`);
  if(selectedWRCRally){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

function buildWRCRallyDetailHTML(round){
  const sched=WRC_SCHEDULE.find(s=>s.round===round);
  const res=WRC_RESULTS[round];
  if(!sched||!res)return'';
  const w=wrcDrv(res.winner);
  const p2=res.p2?wrcDrv(res.p2):null;
  const p3=res.p3?wrcDrv(res.p3):null;
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.rally}</div>
    <div class="results-race-sub">Round ${sched.round} · ${wrcSurfaceLabel(sched.surface)}${res.time&&res.time!=='—'?` · Winning time ${res.time}`:''}</div>
  </div>`;
  let podium='';
  if(p2&&p3){
    podium=`<div class="podium-bar">
      <div class="podium-item p2-item">
        <div class="podium-pos">🥈 P2</div>
        <div class="podium-name">${res.p2}</div>
        <div class="podium-team">${p2.team}</div>
        <div class="podium-gap">${res.p2Gap||''}</div>
      </div>
      <div class="podium-item p1-item">
        <div class="podium-pos">🏆 WINNER</div>
        <div class="podium-name">${res.winner}</div>
        <div class="podium-team">${w.team}</div>
        <div class="podium-gap" style="color:${wrcTeamColor(w.team)}">${w.codriver!=='—'?'w/ '+w.codriver:''}</div>
      </div>
      <div class="podium-item p3-item">
        <div class="podium-pos">🥉 P3</div>
        <div class="podium-name">${res.p3}</div>
        <div class="podium-team">${p3.team}</div>
        <div class="podium-gap">${res.p3Gap||''}</div>
      </div>
    </div>`;
  }
  // Stage-winner tally, sorted by count desc
  let stages='';
  if(res.stageWins){
    const rows=Object.entries(res.stageWins).sort((a,b)=>b[1]-a[1]).map(([name,count])=>{
      const info=wrcDrv(name);
      return`<div style="display:grid;grid-template-columns:1fr auto;padding:6px 16px;border-bottom:1px solid #141414;align-items:center;gap:10px;">
        <div>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:${wrcTeamColor(info.team)};">${name}</span>
          <span style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-left:6px;">${info.team!=='—'?info.team:''}</span>
        </div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:13px;color:var(--yellow);">${count}</div>
      </div>`;
    }).join('');
    stages=`<div style="padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;border-bottom:1px solid var(--border);background:var(--bg);">STAGE WINS</div>${rows}`;
  }
  // Power Stage
  let ps='';
  if(res.powerStage){
    const top5=res.powerStage.top5;
    const psBody=top5
      ? top5.map((name,i)=>`<div style="display:grid;grid-template-columns:28px 1fr auto;padding:5px 16px;border-bottom:1px solid #141414;align-items:center;gap:8px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;color:${i===0?'var(--yellow)':'var(--muted)'};">${i+1}</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--text);">${name}</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--green);">+${5-i}</div>
        </div>`).join('')
      : `<div style="padding:8px 16px;border-bottom:1px solid #141414;">
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--yellow);">${res.powerStage.winner}</span>
          <span style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-left:8px;">P2–P5 not published on verified sources</span>
        </div>`;
    ps=`<div style="padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;border-bottom:1px solid var(--border);background:var(--bg);">⚡ POWER STAGE · bonus 5-4-3-2-1</div>${psBody}`;
  }
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RALLY NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+podium+stages+ps+notes;
}

function selectWRCRally(round){
  track('race:open:wrc',{round});
  selectedWRCRally=selectedWRCRally===round?null:round;
  renderWRCRaces();
}

// Season is decided once every scheduled rally has a verified result — P1 is
// then shown as CHAMPION instead of LEADER (standings + home card).
function wrcSeasonComplete(){return WRC_SCHEDULE.every(r=>WRC_RESULTS[r.round]);}

// ── WRC STANDINGS (drivers + manufacturers stacked) ───────────────────────────
function renderWRCStandings(){
  const p1Label=wrcSeasonComplete()?'🏆 CHAMPION':'LEADER';
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('wrc','standings')+renderBackToSeriesHome('wrc');
  const hdr=`<div class="section-title"><span>WRC Drivers · 2026 · Final · After R13 Sardegna</span><span>Incl. Sunday + Power Stage pts</span></div>`;
  const rows=WRC_STANDINGS.map(d=>{
    const info=wrcDrv(d.driver);
    const isSelected=selectedWRCDriver===d.driver;
    const breakdown=isSelected?renderWRCDriverBreakdown(d.driver,info,d.points,d.pos):'';
    const safeName=d.driver.replace(/'/g,"\\'");
    return`<div>
      <div class="champ-row" style="${isSelected?'background:#0a0005;border-left:2px solid var(--yellow);':''}" onclick="track('driver:expand:wrc',{name:'${safeName}'});selectedWRCDriver=selectedWRCDriver==='${safeName}'?null:'${safeName}';renderWRC();">
        <div class="champ-pos" style="color:${d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':'var(--text)'}">${d.pos}</div>
        <div class="flag-cell">${driverFlag(info.nat)}</div>
        <div>
          <div class="champ-name">${d.driver}</div>
          <div class="champ-team-sm" style="color:${wrcTeamColor(info.team)}">${info.team}</div>
        </div>
        <div class="champ-pts">${d.points}</div>
        <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${d.pos===1?p1Label:d.gap}</div>
      </div>
      ${breakdown}
    </div>`;
  }).join('');
  const mfrHdr=`<div class="section-title"><span>Manufacturers</span><span>Final · After R13</span></div>`;
  const mfrRows=WRC_MFR_STANDINGS.map(m=>`<div class="champ-row">
      <div class="champ-pos" style="color:${m.pos===1?'var(--yellow)':m.pos<=3?'var(--green)':'var(--text)'}">${m.pos}</div>
      <div class="flag-cell" style="color:${wrcTeamColor(m.mfr)};font-size:18px;">●</div>
      <div><div class="champ-name" style="color:${wrcTeamColor(m.mfr)};">${m.mfr}</div></div>
      <div class="champ-pts">${m.points}</div>
      <div class="champ-gap" style="color:${m.pos===1?'var(--yellow)':'var(--muted)'}">${m.pos===1?p1Label:m.gap}</div>
    </div>`).join('');
  content.innerHTML=top+hdr+rows+mfrHdr+mfrRows;
  setStats(`${WRC_STANDINGS[0].points} pts`,WRC_STANDINGS[0].driver,'DRIVERS','R13/13');
}

function renderWRCDriverBreakdown(name,info,points,pos){
  const rallyWins=Object.entries(WRC_RESULTS).filter(([_,r])=>r.winner===name);
  const psWins=Object.values(WRC_RESULTS).filter(r=>r.powerStage&&r.powerStage.winner===name).length;
  const totalStageWins=Object.values(WRC_RESULTS).reduce((s,r)=>s+((r.stageWins&&r.stageWins[name])||0),0);
  const winRows=rallyWins.map(([rd])=>{
    const sched=WRC_SCHEDULE.find(s=>s.round===parseInt(rd));
    return`<div style="display:grid;grid-template-columns:32px 1fr auto;padding:6px 16px;border-bottom:1px solid #141414;align-items:center;gap:10px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);">R${rd}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--text);">${sched?.rally||''}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--yellow);letter-spacing:0.08em;">🏆 WIN</div>
    </div>`;
  }).join('');
  return`<div style="background:var(--surface2);border-top:1px solid var(--border);border-bottom:2px solid var(--yellow);">
    <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:var(--white);">${info.first} ${name.replace(/^[A-Z]\. /,'')}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:${wrcTeamColor(info.team)};margin-top:2px;">${info.team}${info.car!=='—'?' · '+info.car:''}${info.codriver!=='—'?' · Co-driver: '+info.codriver:''}</div>
      </div>
      <button onclick="selectedWRCDriver=null;renderWRC();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
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
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">RALLY WINS</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${rallyWins.length>0?'var(--yellow)':'var(--muted)'};">${rallyWins.length}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">STAGE WINS</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${totalStageWins>0?'var(--text)':'var(--muted)'};">${totalStageWins}</div>
      </div>
    </div>
    ${psWins>0?`<div style="padding:8px 16px;font-family:'Barlow',sans-serif;font-size:11px;color:var(--green);border-bottom:1px solid var(--border);">⚡ ${psWins} Power Stage win${psWins>1?'s':''} in 2026</div>`:''}
    ${rallyWins.length>0?`<div style="padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;border-bottom:1px solid var(--border);">2026 WINS</div>${winRows}`:''}
  </div>`;
}

// ── WRC SCHEDULE ──────────────────────────────────────────────────────────────
function renderWRCSchedule(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('wrc','schedule')+renderBackToSeriesHome('wrc');
  const now=new Date();
  const upcoming=WRC_SCHEDULE.filter(r=>new Date(r.date+'T13:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more WRC rallies on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const hdr=`<div class="section-title"><span>WRC 2026 · ${upcoming.length} Upcoming</span><span>Through R${upcoming[upcoming.length-1].round}</span></div>`;
  const rows=upcoming.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'-';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country} · ${wrcSurfaceLabel(r.surface)}</div>
        <div class="race-item-name">${r.rally}</div>
        <div class="race-item-date">${fmtDate(r.date)}</div>
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
  setStats(`R${next.round}`,next.rally.split(' ').slice(0,2).join(' '),'SCHED',cd?`${cd.num}${cd.unit[0]}`:'NOW');
}

// ── WRC HIGHLIGHTS ────────────────────────────────────────────────────────────
function renderWRCHighlights(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('wrc','highlights')+renderBackToSeriesHome('wrc');
  const completed=WRC_SCHEDULE.filter(s=>WRC_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=WRC_RESULTS[s.round];
    const winInfo=wrcDrv(res.winner);
    const slug=wrcSlug(s.rally);
    const id=`highlights-wrc-r${s.round}-${slug}`;
    const vid=WRC_HIGHLIGHTS[s.round];
    const body=vid
      ? txHighlightSlotHTML('Rally Highlights',vid.id,vid.thumb)
      : `<div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${s.round} · ${s.country} · ${fmtDate(s.date)}</div>
      <div class="tx-highlights-title">${s.rally}</div>
      <div class="tx-highlights-winner">Winner: ${res.winner} (${winInfo.team})</div>
      ${body}
    </div>`;
  }).join('');
  content.innerHTML=top+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">WRC 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official rally recaps from the FIA World Rally Championship YouTube channel. Videos are added after verification — placeholders shown for rallies without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rallies Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

// ── DISPATCHER ────────────────────────────────────────────────────────────────
function switchWRCTab(tab){
  track('tab:wrc',{tab});
  currentWRCTab=tab;
  selectedWRCRally=null;
  selectedWRCDriver=null;
  document.querySelectorAll('#wrc-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('wrctab-'+tab)?.classList.add('active');
  renderWRC();
}

function renderWRC(){
  if(currentWRCTab==='races')return renderWRCRaces();
  if(currentWRCTab==='schedule')return renderWRCSchedule();
  if(currentWRCTab==='highlights')return renderWRCHighlights();
  return renderWRCStandings();
}
// ── END WRC ───────────────────────────────────────────────────────────────────
