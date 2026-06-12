// ═══════════════════════════════════════════════════════════════════════════
// ── NASCAR XFINITY MODULE ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// O'Reilly Auto Parts Series (formerly Xfinity Series) — 2026 season.
//
// Phase 1 scope: 33-race schedule populated and verified from Wikipedia.
// DRIVERS / RESULTS / STANDINGS / MFRS are intentionally empty stubs for now
// — Phase 2 will backfill race-by-race from NASCAR.com winners gallery,
// racingnews.co points, and individual race recaps, with sources cited.
//
// Cardinal rule: never populate these constants from memory. Every value
// here is verified against an official source; empty values stay empty
// until verified.
//
// Renderers mirror the Cup renderers in `nascar.js` so the Xfinity tabs
// look identical to Cup. Dispatch is wired at the top of each renderNascar*
// function in nascar.js — if currentNascarSeries==='xfinity' it forwards
// here, otherwise the existing Cup code path runs.

// Phase 2 roster (populated 2026-06-12) — every driver appearing in results
// or standings. Shared surnames keyed with initials (R./K. Sieg, J./H. Burton,
// B. Jones, A. Hill, S. Smith, T. Gray). Verified from the Wikipedia 2026
// NASCAR O'Reilly Auto Parts Series teams/drivers table + racingnews.co race
// pages. '—' = not stated on fetched pages (cardinal rule — no guesses):
// Crews (rookie, P14 in points!), Bell (extraction conflicted with Caruth's
// #88), Sanchez, Gase, Yeley, Labbé, Byrd, Patterson, Snider.
// Larson note: racingnews lists his car as '#88 HendrickCars.com Chevrolet';
// Wikipedia credits the wins to JR Motorsports (number shared with Caruth) —
// entrant recorded as JRM, flagged in the session report.
const NASCAR_XFINITY_DRIVERS = {
  'Allgaier':      {first:'Justin',   team:'JR Motorsports',            mfr:'Chevrolet', num:7},
  'Love':          {first:'Jesse',    team:'Richard Childress Racing',  mfr:'Chevrolet', num:2},
  'Day':           {first:'Corey',    team:'Hendrick Motorsports',      mfr:'Chevrolet', num:17},
  'Creed':         {first:'Sheldon',  team:'Haas Factory Team',         mfr:'Chevrolet', num:'00'},
  'B. Jones':      {first:'Brandon',  team:'Joe Gibbs Racing',          mfr:'Toyota',    num:20},
  'A. Hill':       {first:'Austin',   team:'Richard Childress Racing',  mfr:'Chevrolet', num:21},
  'Kvapil':        {first:'Carson',   team:'JR Motorsports',            mfr:'Chevrolet', num:1},
  'S. Smith':      {first:'Sammy',    team:'JR Motorsports',            mfr:'Chevrolet', num:8},
  'Sawalich':      {first:'William',  team:'Joe Gibbs Racing',          mfr:'Toyota',    num:18},
  'Retzlaff':      {first:'Parker',   team:'Viking Motorsports',        mfr:'Chevrolet', num:99},
  'Mayer':         {first:'Sam',      team:'Haas Factory Team',         mfr:'Chevrolet', num:41},
  'T. Gray':       {first:'Taylor',   team:'Joe Gibbs Racing',          mfr:'Toyota',    num:54},
  'Caruth':        {first:'Rajah',    team:'JR Motorsports',            mfr:'Chevrolet', num:88},
  'Crews':         {first:'Brent',    team:'—',                         mfr:'—',         num:'—'},
  'R. Sieg':       {first:'Ryan',     team:'RSS Racing',                mfr:'Chevrolet', num:39},
  'Zilisch':       {first:'Connor',   team:'JR Motorsports',            mfr:'Chevrolet', num:1},
  'van Gisbergen': {first:'Shane',    team:'JR Motorsports',            mfr:'Chevrolet', num:9},
  'Larson':        {first:'Kyle',     team:'JR Motorsports',            mfr:'Chevrolet', num:88},
  'Chastain':      {first:'Ross',     team:'JR Motorsports',            mfr:'Chevrolet', num:9},
  'Briscoe':       {first:'Chase',    team:'Joe Gibbs Racing',          mfr:'Toyota',    num:19},
  'Bell':          {first:'Christopher',team:'—',                       mfr:'—',         num:'—'},
  'Sanchez':       {first:'Nick',     team:'—',                         mfr:'—',         num:'—'},
  'Poole':         {first:'Brennan',  team:'Alpha Prime Racing',        mfr:'Chevrolet', num:44},
  'Alfredo':       {first:'Anthony',  team:'Viking Motorsports',        mfr:'Chevrolet', num:96},
  'Thompson':      {first:'Dean',     team:'Sam Hunt Racing',           mfr:'Toyota',    num:26},
  'Clements':      {first:'Jeremy',   team:'Jeremy Clements Racing',    mfr:'Chevrolet', num:51},
  'J. Burton':     {first:'Jeb',      team:'Jordan Anderson Racing',    mfr:'Chevrolet', num:27},
  'Perkins':       {first:'Blaine',   team:'Jordan Anderson Racing',    mfr:'Chevrolet', num:31},
  'Staropoli':     {first:'Patrick',  team:'Big Machine Racing',        mfr:'Chevrolet', num:48},
  'H. Burton':     {first:'Harrison', team:'Sam Hunt Racing',           mfr:'Toyota',    num:24},
  'Green':         {first:'Austin',   team:'Peterson Racing',           mfr:'Chevrolet', num:87},
  'Scott':         {first:'Lavar',    team:'Alpha Prime Racing',        mfr:'Chevrolet', num:45},
  'K. Sieg':       {first:'Kyle',     team:'RSS Racing',                mfr:'Chevrolet', num:28},
  'Bilicki':       {first:'Josh',     team:'SS-Green Light Racing',     mfr:'Chevrolet', num:'07'},
  'Ellis':         {first:'Ryan',     team:"Young's Motorsports",       mfr:'Chevrolet', num:'02'},
  'Williams':      {first:'Josh',     team:'DGM Racing w/ Jesse Iwuji', mfr:'Chevrolet', num:92},
  'Gase':          {first:'Joey',     team:'—',                         mfr:'—',         num:'—'},
  'Smithley':      {first:'Garrett',  team:'SS-Green Light w/ BRK',     mfr:'Chevrolet', num:0},
  'Yeley':         {first:'J.J.',     team:'—',                         mfr:'—',         num:'—'},
  'Maggio':        {first:'Mason',    team:'DGM Racing w/ Jesse Iwuji', mfr:'Chevrolet', num:91},
  'Labbé':         {first:'Alex',     team:'—',                         mfr:'—',         num:'—'},
  'Byrd':          {first:'Nathan',   team:'—',                         mfr:'—',         num:'—'},
  'Patterson':     {first:'Andrew',   team:'—',                         mfr:'—',         num:'—'},
  'Snider':        {first:'Myatt',    team:'—',                         mfr:'—',         num:'—'},
};

// 2026 schedule (R1–R33). Verified 2026-05-22 from
// https://en.wikipedia.org/wiki/2026_NASCAR_O'Reilly_Auto_Parts_Series
// type 'R' = road course, 'S' = street circuit. Playoff rounds: 25-33 (9 races).
// `laps` field omitted for now — will be added with verified race-result data
// in Phase 2 (lap totals vary by track and aren't always derivable from the
// race-name distance). Several entries with race:'TBA' or truncated names
// reflect Wikipedia state at time of scrape — refine when official names land.
const NASCAR_XFINITY_SCHEDULE = [
  {round:1, race:'United Rentals 300',                        track:'Daytona International Speedway',  country:'🇺🇸', date:'2026-02-14'},
  {round:2, race:'Bennett Transportation & Logistics 250',    track:'Atlanta Motor Speedway',          country:'🇺🇸', date:'2026-02-21'},
  {round:3, race:'Focused Health 250',                        track:'Circuit of the Americas',         country:'🇺🇸', date:'2026-02-28', type:'R'},
  {round:4, race:'GOVX 200',                                  track:'Phoenix Raceway',                 country:'🇺🇸', date:'2026-03-07'},
  {round:5, race:'The LiUNA!',                                track:'Las Vegas Motor Speedway',        country:'🇺🇸', date:'2026-03-14'},
  {round:6, race:'Sport Clips Haircuts VFW 200',              track:'Darlington Raceway',              country:'🇺🇸', date:'2026-03-21'},
  {round:7, race:'NFPA 250',                                  track:'Martinsville Speedway',           country:'🇺🇸', date:'2026-03-28'},
  {round:8, race:'North Carolina Education Lottery 250',      track:'Rockingham Speedway',             country:'🇺🇸', date:'2026-04-04'},
  {round:9, race:'Suburban Propane 300',                      track:'Bristol Motor Speedway',          country:'🇺🇸', date:'2026-04-11'},
  {round:10,race:'Kansas Lottery 300',                        track:'Kansas Speedway',                 country:'🇺🇸', date:'2026-04-18'},
  {round:11,race:'Ag-Pro 300',                                track:'Talladega Superspeedway',         country:'🇺🇸', date:'2026-04-25'},
  {round:12,race:"Andy's Frozen Custard 340",                 track:'Texas Motor Speedway',            country:'🇺🇸', date:'2026-05-02'},
  {round:13,race:'Mission 200 at The Glen',                   track:'Watkins Glen International',      country:'🇺🇸', date:'2026-05-09', type:'R'},
  {round:14,race:'BetRivers 200',                             track:'Dover Motor Speedway',            country:'🇺🇸', date:'2026-05-16'},
  {round:15,race:'Charbroil 300',                             track:'Charlotte Motor Speedway',        country:'🇺🇸', date:'2026-05-23'},
  {round:16,race:'Sports Illustrated Resorts 250',            track:'Nashville Superspeedway',         country:'🇺🇸', date:'2026-05-30'},
  {round:17,race:'MillerTech Battery 250',                    track:'Pocono Raceway',                  country:'🇺🇸', date:'2026-06-13'},
  {round:18,race:'TBA',                                       track:'Qualcomm Circuit (San Diego)',    country:'🇺🇸', date:'2026-06-20', type:'S'},
  {round:19,race:'Pit Boss/FoodMaxx 250',                     track:'Sonoma Raceway',                  country:'🇺🇸', date:'2026-06-27', type:'R'},
  {round:20,race:'TBA',                                       track:'Chicagoland Speedway',            country:'🇺🇸', date:'2026-07-04'},
  {round:21,race:'Focused Health 250',                        track:'EchoPark Speedway (Atlanta)',     country:'🇺🇸', date:'2026-07-11'},
  {round:22,race:'Pennzoil 250',                              track:'Indianapolis Motor Speedway',     country:'🇺🇸', date:'2026-07-25'},
  {round:23,race:'Hy-Vee PERKS 250',                          track:'Iowa Speedway',                   country:'🇺🇸', date:'2026-08-08'},
  {round:24,race:'Wawa 250',                                  track:'Daytona International Speedway',  country:'🇺🇸', date:'2026-08-28'},
  {round:25,race:'TBA',                                       track:'Darlington Raceway',              country:'🇺🇸', date:'2026-09-05', chase:true},
  {round:26,race:'Nu Way 225',                                track:'World Wide Technology Raceway',   country:'🇺🇸', date:'2026-09-12', chase:true},
  {round:27,race:'Food City 300',                             track:'Bristol Motor Speedway',          country:'🇺🇸', date:'2026-09-18', chase:true},
  {round:28,race:'Focused Health 302',                        track:'Las Vegas Motor Speedway',        country:'🇺🇸', date:'2026-10-03', chase:true},
  {round:29,race:'Blue Cross NC 250',                         track:'Charlotte Motor Speedway',        country:'🇺🇸', date:'2026-10-10', chase:true},
  {round:30,race:'TBA',                                       track:'Phoenix Raceway',                 country:'🇺🇸', date:'2026-10-17', chase:true},
  {round:31,race:'TPG 250',                                   track:'Talladega Superspeedway',         country:'🇺🇸', date:'2026-10-24', chase:true},
  {round:32,race:'IAA and Ritchie Bros. 250',                 track:'Martinsville Speedway',           country:'🇺🇸', date:'2026-10-31', chase:true},
  {round:33,race:'Hard Rock Bet 300',                         track:'Homestead-Miami Speedway',        country:'🇺🇸', date:'2026-11-07', chase:true},
];

// Phase 2 results (populated 2026-06-12), R1–R16. Every winner AND pole
// cross-verified across two allowed sources with zero conflicts: the
// Wikipedia season results table + racingnews.co per-race result pages
// (nascar.com returned 403 this session; its search snippets corroborate
// Nashville/Talladega). Per-race URLs in the Phase-2 commit body.
const NASCAR_XFINITY_RESULTS = {
  1: {winner:'A. Hill',       p2:'Allgaier', p3:'R. Sieg',  polePos:'A. Hill',  note:'Austin Hill won the United Rentals 300 from pole, sweeping all three stages and surviving multiple late cautions.'},
  2: {winner:'Creed',         p2:'Retzlaff', p3:'Sanchez',  polePos:'Mayer',    note:'Sheldon Creed took his first career series win in a final-lap battle at Atlanta, clearing the field in turn four.'},
  3: {winner:'van Gisbergen', p2:'A. Hill',  p3:'S. Smith', polePos:'Zilisch',  note:'SVG led a race-high 31 laps and made a decisive three-wide pass in the final stage at COTA.'},
  4: {winner:'Allgaier',      p2:'Love',     p3:'Kvapil',   polePos:'T. Gray',  note:'Allgaier passed long-time leader Jesse Love with 11 laps remaining — first win of 2026 and the points lead.'},
  5: {winner:'Larson',        p2:'Briscoe',  p3:'Creed',    polePos:'Mayer',    note:'Cup regular Kyle Larson surged late to beat Chase Briscoe; polesitter Mayer retired early with a loss of power.'},
  6: {winner:'Allgaier',      p2:'B. Jones', p3:'Bell',     polePos:'Larson',   note:'Larson won pole and both stages, but Allgaier used pit strategy to lead the final 34 laps at Darlington.'},
  7: {winner:'Allgaier',      p2:'S. Smith', p3:'Day',      polePos:'Allgaier', note:'Allgaier won the NFPA 250 from pole — second straight win, third of the season.'},
  8: {winner:'Sawalich',      p2:'B. Jones', p3:'Allgaier', polePos:'Day',      note:"Corey Day took his first career pole and won two stages, but Sawalich took control late for Toyota's first 2026 win at Rockingham."},
  9: {winner:'Zilisch',       p2:'Larson',   p3:'Crews',    polePos:'Sawalich', note:'Larson dominated and won both stages, but Zilisch executed a late-race strategy to beat him at Bristol.'},
  10:{winner:'T. Gray',       p2:'Creed',    p3:'Allgaier', polePos:'Kvapil',   note:'Taylor Gray won at Kansas; an early red flag flew when polesitter Kvapil was flipped after contact from William Byron.'},
  11:{winner:'Day',           p2:'Creed',    p3:'Crews',    polePos:'Love',     note:"Corey Day's first career series win — Mayer spun while blocking on the last lap and Talladega ended under caution."},
  12:{winner:'Larson',        p2:'Allgaier', p3:'Mayer',    polePos:'Allgaier', note:"Larson held off a late charge from polesitter Allgaier for his second win of the season at Texas."},
  13:{winner:'Zilisch',       p2:'Love',     p3:'T. Gray',  polePos:'Caruth',   note:'Zilisch made a last-lap dive at turn six and won when Love missed his braking point in the final corner at Watkins Glen.'},
  14:{winner:'Day',           p2:'Allgaier', p3:'Mayer',    polePos:'Chastain', note:'Day charged late on the outside lane at Dover, passing Allgaier in traffic for his second win of 2026.'},
  15:{winner:'Chastain',      p2:'Love',     p3:'A. Hill',  polePos:'Allgaier', note:'Ross Chastain won a race called at the end of Stage 2 due to weather at Charlotte.'},
  16:{winner:'Allgaier',      p2:'Crews',    p3:'Sawalich', polePos:'Love',     note:'Allgaier dominated the final stage at Nashville and held off rookie Brent Crews for his series-best fourth win of 2026.'},
};

// Driver points after R16 Nashville (2026-05-30) — verified 2026-06-12 from
// the Wikipedia season page table ("after 16 of 33 races"). Truncated at P38:
// the extracted P39–P59 tail was non-monotonic (extraction noise) and is
// omitted per the cardinal rule. gap = points − leader points.
const NASCAR_XFINITY_STANDINGS = [
  {pos:1, driver:'Allgaier',  points:770, gap:0},
  {pos:2, driver:'Love',      points:591, gap:-179},
  {pos:3, driver:'Day',       points:574, gap:-196},
  {pos:4, driver:'Creed',     points:532, gap:-238},
  {pos:5, driver:'B. Jones',  points:512, gap:-258},
  {pos:6, driver:'A. Hill',   points:499, gap:-271},
  {pos:7, driver:'Kvapil',    points:493, gap:-277},
  {pos:8, driver:'S. Smith',  points:482, gap:-288},
  {pos:9, driver:'Sawalich',  points:429, gap:-341},
  {pos:10,driver:'Retzlaff',  points:416, gap:-354},
  {pos:11,driver:'Mayer',     points:413, gap:-357},
  {pos:12,driver:'T. Gray',   points:399, gap:-371},
  {pos:13,driver:'Caruth',    points:387, gap:-383},
  {pos:14,driver:'Crews',     points:384, gap:-386},
  {pos:15,driver:'R. Sieg',   points:384, gap:-386},
  {pos:16,driver:'Poole',     points:309, gap:-461},
  {pos:17,driver:'Alfredo',   points:286, gap:-484},
  {pos:18,driver:'Thompson',  points:282, gap:-488},
  {pos:19,driver:'Clements',  points:260, gap:-510},
  {pos:20,driver:'J. Burton', points:253, gap:-517},
  {pos:21,driver:'Perkins',   points:237, gap:-533},
  {pos:22,driver:'Staropoli', points:221, gap:-549},
  {pos:23,driver:'H. Burton', points:221, gap:-549},
  {pos:24,driver:'Green',     points:205, gap:-565},
  {pos:25,driver:'Scott',     points:190, gap:-580},
  {pos:26,driver:'K. Sieg',   points:184, gap:-586},
  {pos:27,driver:'Bilicki',   points:184, gap:-586},
  {pos:28,driver:'Ellis',     points:153, gap:-617},
  {pos:29,driver:'Williams',  points:119, gap:-651},
  {pos:30,driver:'Gase',      points:112, gap:-658},
  {pos:31,driver:'Smithley',  points:93,  gap:-677},
  {pos:32,driver:'Sanchez',   points:81,  gap:-689},
  {pos:33,driver:'Yeley',     points:79,  gap:-691},
  {pos:34,driver:'Maggio',    points:65,  gap:-705},
  {pos:35,driver:'Labbé',     points:62,  gap:-708},
  {pos:36,driver:'Byrd',      points:59,  gap:-711},
  {pos:37,driver:'Patterson', points:49,  gap:-721},
  {pos:38,driver:'Snider',    points:35,  gap:-735},
];

// Manufacturer wins after R16 — derived from the verified winners above and
// independently matched by Wikipedia's manufacturer standings table
// (Chevrolet 14, Toyota 2, Ford 0). Cross-checked by verify-nascar.js.
const NASCAR_XFINITY_MFRS = [
  {pos:1, mfr:'Chevrolet', wins:14, drivers:['Allgaier (4)','Day (2)','Larson (2)','Zilisch (2)','A. Hill','Creed','van Gisbergen','Chastain']},
  {pos:2, mfr:'Toyota',    wins:2,  drivers:['Sawalich','T. Gray']},
  {pos:3, mfr:'Ford',      wins:0,  drivers:[]},
];

// Per-round official highlights from the NASCAR YouTube channel (oEmbed
// author_name exactly "NASCAR"; FOX/NBC/CW uploads rejected). IDs
// oEmbed-verified + embed-page checked 2026-06-12; thumbs hand-picked from
// the auto-captured frames (R15 had no clean on-track frame — cover used).
const NASCAR_XFINITY_HIGHLIGHTS={
  1: {id:'ST0bWGV2Lhw',thumb:'https://i.ytimg.com/vi/ST0bWGV2Lhw/hq3.jpg'},
  2: {id:'28MAx9xpjnc',thumb:'https://i.ytimg.com/vi/28MAx9xpjnc/hq1.jpg'},
  3: {id:'CrmcvrbsR1g',thumb:'https://i.ytimg.com/vi/CrmcvrbsR1g/hq3.jpg'},
  4: {id:'RnaLPRUsj5k',thumb:'https://i.ytimg.com/vi/RnaLPRUsj5k/hq1.jpg'},
  5: {id:'RehadaLD2_A',thumb:'https://i.ytimg.com/vi/RehadaLD2_A/hq3.jpg'},
  6: {id:'2dP8GODLH0E',thumb:'https://i.ytimg.com/vi/2dP8GODLH0E/hq1.jpg'},
  7: {id:'g6YmYN07Ja0',thumb:'https://i.ytimg.com/vi/g6YmYN07Ja0/hq2.jpg'},
  8: {id:'HTHnO9HgLFs',thumb:'https://i.ytimg.com/vi/HTHnO9HgLFs/hq1.jpg'},
  9: {id:'cY4WCQDE2VU',thumb:'https://i.ytimg.com/vi/cY4WCQDE2VU/hq1.jpg'},
  10:{id:'oQj2ZAO1c2E',thumb:'https://i.ytimg.com/vi/oQj2ZAO1c2E/hq1.jpg'},
  11:{id:'sgVLzrpITk4',thumb:'https://i.ytimg.com/vi/sgVLzrpITk4/hq1.jpg'},
  12:{id:'XBAo5qIqgmU',thumb:'https://i.ytimg.com/vi/XBAo5qIqgmU/hq1.jpg'},
  13:{id:'RCtA1NtgjAs',thumb:'https://i.ytimg.com/vi/RCtA1NtgjAs/hq2.jpg'},
  14:{id:'ABQ9-5vAH6k',thumb:'https://i.ytimg.com/vi/ABQ9-5vAH6k/hq2.jpg'},
  15:{id:'d-RtODCP7v0',thumb:'https://i.ytimg.com/vi/d-RtODCP7v0/maxresdefault.jpg'},
  16:{id:'Ll8C_46jHok',thumb:'https://i.ytimg.com/vi/Ll8C_46jHok/hq1.jpg'},
};

// ── XFINITY HELPERS ───────────────────────────────────────────────────────────
// Driver lookup gracefully degrades to placeholders when the roster is empty.
function nascarXfinityDrv(lastName){
  return NASCAR_XFINITY_DRIVERS[lastName] || {first:'',team:'—',mfr:'—',num:'—'};
}

// Latest completed Xfinity round → "After R{n} {track}" label, or fallback when
// the results map is still empty. Same shape as the Cup "After R12 Watkins Glen"
// string but derived rather than hardcoded so Phase 2 doesn't need to edit
// section-title literals every week.
function nascarXfinityProgressLabel(){
  const rounds = Object.keys(NASCAR_XFINITY_RESULTS).map(Number);
  if(!rounds.length) return 'No completed races yet';
  const last = Math.max(...rounds);
  const sched = NASCAR_XFINITY_SCHEDULE.find(s=>s.round===last);
  const trackShort = sched ? sched.track.split(' ').slice(0,2).join(' ') : '';
  return `After R${last}${trackShort?` ${trackShort}`:''}`;
}

// Next-race banner for Xfinity, mirrors renderNascarNextBanner.
function renderNascarXfinityNextBanner(){
  const now=new Date();
  const next=NASCAR_XFINITY_SCHEDULE.find(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  const typeLabel=next.type==='R'?' · ROAD COURSE':next.type==='S'?' · STREET RACE':'';
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Race · Round ${next.round}${typeLabel}${next.chase?' · 🏆 CHASE':''}</div>
      <div class="next-race-name">${next.country} ${next.race}</div>
      <div class="next-race-circuit">${next.track}</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

// Off-air context adapter — feeds renderLiveOffAir the same shape it expects.
// When NASCAR_XFINITY_RESULTS is empty, returns a context with no last race
// (banner-only render).
function nascarXfinityOffAirContext(){
  const lastCompleted=Object.entries(NASCAR_XFINITY_RESULTS).sort((a,b)=>parseInt(b[0])-parseInt(a[0]))[0];
  if(!lastCompleted)return{series:'nascar',races:{},banner:renderNascarXfinityNextBanner(),seriesLabel:'XFINITY',viewTab:'races',switchFn:'switchNascarTab'};
  const [round,res]=lastCompleted;
  const sched=NASCAR_XFINITY_SCHEDULE.find(s=>s.round===parseInt(round));
  const winner=res.winner, p2=res.p2, p3=res.p3;
  const winInfo=nascarXfinityDrv(winner), p2Info=p2?nascarXfinityDrv(p2):null, p3Info=p3?nascarXfinityDrv(p3):null;
  const fakeRaces={[round]:{round,raceName:sched.race,date:sched.date,
    Circuit:{circuitName:sched.track,Location:{country:sched.country}},
    Results:[
      {Driver:{familyName:winner,nationality:'American'},Constructor:{name:winInfo.mfr}},
      p2?{Driver:{familyName:p2,nationality:'American'},Constructor:{name:p2Info.mfr}}:{Driver:{familyName:'—'},Constructor:{name:'—'}},
      p3?{Driver:{familyName:p3,nationality:'American'},Constructor:{name:p3Info.mfr}}:{Driver:{familyName:'—'},Constructor:{name:'—'}},
    ]}};
  return{series:'nascar',races:fakeRaces,banner:renderNascarXfinityNextBanner(),seriesLabel:'XFINITY',lastLabel:`Last Race · Round ${round}`,viewTab:'races',switchFn:'switchNascarTab'};
}

// Small empty-state used by the Standings / Highlights / MFRs panels until
// Phase 2 backfill lands.
function renderNascarXfinityEmpty(title, sub){
  return `<div class="state-screen">
    <div class="state-icon">📋</div>
    <div class="state-title">${title}</div>
    <div class="state-sub">${sub}</div>
  </div>`;
}

// ── XFINITY LIVE (off-air view) ───────────────────────────────────────────────
function renderNascarXfinityLive(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','live')+renderBackToSeriesHome('nascar');
  content.innerHTML=top+renderLiveOffAir('no-session',nascarXfinityOffAirContext());
  const lastRound=Object.keys(NASCAR_XFINITY_RESULTS).sort((a,b)=>parseInt(b)-parseInt(a))[0];
  setStats('—','—','STANDBY',lastRound?`R${lastRound}`:'—');
}

// ── XFINITY RACE RESULTS ──────────────────────────────────────────────────────
function renderNascarXfinityRaces(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','races')+renderBackToSeriesHome('nascar');
  const banner=renderNascarXfinityNextBanner();
  // Newest-round-first so the most recent race is at the top of the list.
  const completed=NASCAR_XFINITY_SCHEDULE.filter(s=>NASCAR_XFINITY_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const total=NASCAR_XFINITY_SCHEDULE.length;
  const rows=completed.map(s=>{
    const res=NASCAR_XFINITY_RESULTS[s.round];
    const w=nascarXfinityDrv(res.winner);
    const isSelected=selectedNascarRace&&selectedNascarRace.round===s.round;
    const typeLabel=s.type==='R'?' · 🛣 RC':s.type==='S'?' · 🛣 ST':'';
    const slug=nascarTrackSlug(s.track);
    const hlId=`highlights-nascar-xfinity-r${s.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectNascarRace(${s.round})">
      <div class="round-badge"><div class="round-num">${s.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${s.country}${typeLabel}</div>
        <div class="race-item-name">${s.race}</div>
        <div class="race-item-date">${fmtDate(s.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('nascar','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag" style="color:${nascarMfrColor(w.mfr)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${w.num}</span>
        <div class="winner-name">${res.winner}</div>
        <div class="winner-team">${w.mfr}</div>
      </div>
    </div>`;
  }).join('');
  let html=top+banner+`<div class="section-title"><span>2026 Xfinity Series · ${completed.length} of ${total} races</span><span>${completed.length?'Tap for details':'Backfill pending'}</span></div>`+rows;
  if(!completed.length){
    html+=renderNascarXfinityEmpty('Race results coming soon','Schedule is verified — race-by-race results will populate as Phase 2 backfill lands. Cardinal rule: every value verified from an official source before it appears here.');
  }
  if(selectedNascarRace && NASCAR_XFINITY_RESULTS[selectedNascarRace.round]){
    html+=buildNascarXfinityRaceDetailHTML(selectedNascarRace.round);
  }
  content.innerHTML=html;
  setStats('—','—','RACE',`${completed.length}/${total}`);
  if(selectedNascarRace){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

function buildNascarXfinityRaceDetailHTML(round){
  const sched=NASCAR_XFINITY_SCHEDULE.find(s=>s.round===round);
  const res=NASCAR_XFINITY_RESULTS[round];
  if(!sched||!res)return'';
  const w=nascarXfinityDrv(res.winner);
  const p2=res.p2?nascarXfinityDrv(res.p2):null;
  const p3=res.p3?nascarXfinityDrv(res.p3):null;
  const lapsTxt=sched.laps?`${sched.laps} Laps`:'';
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.race}</div>
    <div class="results-race-sub">${sched.track} · Round ${sched.round}${lapsTxt?` · ${lapsTxt}`:''}${sched.type==='R'?' · Road Course':sched.type==='S'?' · Street Course':''}
    ${res.polePos?`<br>🏁 Pole: ${res.polePos}`:''}
    ${res.stage1||res.stage2?`<br>📊 Stages: ${res.stage1?`S1 ${res.stage1}`:'S1 —'} · ${res.stage2?`S2 ${res.stage2}`:'S2 —'}`:''}
    </div>
  </div>`;
  let podium;
  if(p2&&p3){
    podium=`<div class="podium-bar">
      <div class="podium-item p2-item">
        <div class="podium-pos">🥈 P2</div>
        <div class="podium-name">${res.p2}</div>
        <div class="podium-team">${p2.team}</div>
        <div class="podium-gap" style="color:${nascarMfrColor(p2.mfr)}">${p2.mfr}</div>
      </div>
      <div class="podium-item p1-item">
        <div class="podium-pos">🏆 WINNER</div>
        <div class="podium-name">${res.winner}</div>
        <div class="podium-team">${w.team}</div>
        <div class="podium-gap" style="color:${nascarMfrColor(w.mfr)}">${w.mfr}</div>
      </div>
      <div class="podium-item p3-item">
        <div class="podium-pos">🥉 P3</div>
        <div class="podium-name">${res.p3}</div>
        <div class="podium-team">${p3.team}</div>
        <div class="podium-gap" style="color:${nascarMfrColor(p3.mfr)}">${p3.mfr}</div>
      </div>
    </div>`;
  } else {
    podium=`<div style="padding:18px;background:var(--surface2);border-bottom:1px solid var(--border);text-align:center;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--yellow);letter-spacing:0.12em;margin-bottom:6px;">🏆 RACE WINNER</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:var(--white);">#${w.num} ${res.winner}</div>
      <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--muted);margin-top:3px;">${w.team} · <span style="color:${nascarMfrColor(w.mfr)};font-weight:700;">${w.mfr}</span></div>
    </div>`;
  }
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RACE NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+podium+notes;
}

// ── XFINITY DRIVERS CHAMPIONSHIP ──────────────────────────────────────────────
function renderNascarXfinityDrivers(){
  const content=document.getElementById('main-content');
  const progress=nascarXfinityProgressLabel();
  const hdr=`<div class="section-title"><span>Xfinity Drivers · 2026 · ${progress}</span><span>Top 12 = Chase</span></div>`;
  if(!NASCAR_XFINITY_STANDINGS.length){
    content.innerHTML=hdr+renderNascarXfinityEmpty('Standings backfill pending','Driver points will populate from racingnews.co (same source as Cup) once Phase 2 begins. Cardinal rule: never invented from memory.');
    setStats('—','—','DRIVERS','—');
    return;
  }
  const rows=NASCAR_XFINITY_STANDINGS.map(d=>{
    const info=nascarXfinityDrv(d.driver);
    const inChase=d.pos<=12;
    const isSelected=selectedNascarDriverChamp===d.driver;
    const gapText=d.pos===1?'LEADER':`${d.gap}`;
    const posColor=d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':inChase?'var(--text)':'var(--muted)';
    return`<div>
      <div class="champ-row" style="${isSelected?'background:#0a0005;border-left:2px solid var(--yellow);':''}" onclick="track('driver:expand:nascar-xfinity',{name:'${d.driver}'});selectedNascarDriverChamp=selectedNascarDriverChamp==='${d.driver}'?null:'${d.driver}';renderNascar();">
        <div class="champ-pos" style="color:${posColor}">${d.pos}</div>
        <div class="flag-cell" style="color:${nascarMfrColor(info.mfr)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${info.num}</div>
        <div>
          <div class="champ-name">${d.driver}</div>
          <div class="champ-team-sm" style="color:${nascarMfrColor(info.mfr)}">${info.team}</div>
        </div>
        <div class="champ-pts">${d.points}</div>
        <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${gapText}</div>
      </div>
      ${d.pos===12?`<div style="padding:6px 16px;background:#1a0005;border-top:1px solid var(--red);border-bottom:1px solid var(--red);font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--red);letter-spacing:0.15em;text-align:center;font-weight:700;">— CHASE CUTLINE —</div>`:''}
    </div>`;
  }).join('');
  content.innerHTML=hdr+rows;
  setStats(`${NASCAR_XFINITY_STANDINGS[0].points} pts`,NASCAR_XFINITY_STANDINGS[0].driver,'DRIVERS',progress.replace('After ',''));
}

// ── XFINITY MANUFACTURERS ─────────────────────────────────────────────────────
function renderNascarXfinityMfrs(){
  const content=document.getElementById('main-content');
  const progress=nascarXfinityProgressLabel();
  const hdr=`<div class="section-title"><span>Xfinity Manufacturers · 2026 · ${progress}</span><span>${NASCAR_XFINITY_MFRS.length?'Wins this season':'Pending'}</span></div>`;
  const note=`<div style="padding:12px 16px;background:#1a1a05;border-bottom:1px solid var(--border);font-family:'Barlow',sans-serif;font-size:11px;color:var(--yellow);line-height:1.5;">
    ℹ️ NASCAR no longer publicly publishes official manufacturer points after each race. Wins shown will be verified from NASCAR.com.
  </div>`;
  if(!NASCAR_XFINITY_MFRS.length){
    content.innerHTML=hdr+note+renderNascarXfinityEmpty('Manufacturer wins backfill pending','Wins are derived from verified race results — they\'ll appear here as Phase 2 backfill lands.');
    setStats('—','—','MFRS','—');
    return;
  }
  const rows=NASCAR_XFINITY_MFRS.map(m=>{
    return`<div>
      <div class="champ-row" onclick="track('mfr:expand:nascar-xfinity',{name:'${m.mfr}'});">
        <div class="champ-pos" style="color:${m.pos===1?'var(--yellow)':m.pos===2?'#c0c0c0':'#cd7f32'}">${m.pos}</div>
        <div class="flag-cell" style="color:${nascarMfrColor(m.mfr)};font-size:18px;">●</div>
        <div>
          <div class="champ-name" style="color:${nascarMfrColor(m.mfr)};">${m.mfr}</div>
          <div class="champ-team-sm">${m.drivers.length} winning driver${m.drivers.length>1?'s':''}</div>
        </div>
        <div class="champ-pts" style="color:${nascarMfrColor(m.mfr)};">${m.wins}</div>
        <div class="champ-gap">WINS</div>
      </div>
    </div>`;
  }).join('');
  content.innerHTML=hdr+note+rows;
  setStats(`${NASCAR_XFINITY_MFRS[0].wins} wins`,NASCAR_XFINITY_MFRS[0].mfr,'MFRS','—');
}

// ── XFINITY STANDINGS (drivers + mfrs stacked, mirrors Cup Standings tab) ─────
function renderNascarXfinityStandings(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','standings')+renderBackToSeriesHome('nascar');
  renderNascarXfinityDrivers();
  const driversHTML=content.innerHTML;
  renderNascarXfinityMfrs();
  const mfrsHTML=content.innerHTML;
  content.innerHTML=top+driversHTML+mfrsHTML;
}

// ── XFINITY HIGHLIGHTS ────────────────────────────────────────────────────────
function renderNascarXfinityHighlights(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','highlights')+renderBackToSeriesHome('nascar');
  // Newest-round-first so the most recent race is at the top of the list.
  const completed=NASCAR_XFINITY_SCHEDULE.filter(s=>NASCAR_XFINITY_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=NASCAR_XFINITY_RESULTS[s.round];
    const winInfo=nascarXfinityDrv(res.winner);
    const slug=nascarTrackSlug(s.track);
    const id=`highlights-nascar-xfinity-r${s.round}-${slug}`;
    const vid=NASCAR_XFINITY_HIGHLIGHTS[s.round];
    const body=vid
      ? txHighlightSlotHTML('Race Highlights',vid.id,vid.thumb)
      : `<div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${s.round} · ${s.country} · ${fmtDate(s.date)}</div>
      <div class="tx-highlights-title">${s.race}</div>
      <div class="tx-highlights-winner">Winner: ${res.winner} (${winInfo.mfr})</div>
      ${body}
    </div>`;
  }).join('');
  content.innerHTML=top+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">Xfinity 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps and key moments. Videos are added after verification — placeholders shown for races without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

// ── XFINITY SCHEDULE ──────────────────────────────────────────────────────────
function renderNascarXfinitySchedule(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','schedule')+renderBackToSeriesHome('nascar');
  const now=new Date();
  const upcoming=NASCAR_XFINITY_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more Xfinity races on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const lastRound=upcoming[upcoming.length-1].round;
  const hdr=`<div class="section-title"><span>Xfinity 2026 · ${upcoming.length} Upcoming</span><span>Through R${lastRound}</span></div>`;
  const rows=upcoming.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'-';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    const typeLabel=r.type==='R'?' · RC':r.type==='S'?' · ST':'';
    const chaseLabel=r.chase?' · CHASE':'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country}${typeLabel}${chaseLabel}</div>
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
