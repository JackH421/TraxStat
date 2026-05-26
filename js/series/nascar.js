// ═══════════════════════════════════════════════════════════════════════════
// ── NASCAR MODULE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// Cup Series fully populated with real verified 2026 data through R12 Watkins Glen.
// Xfinity (O'Reilly Auto Parts Series) and Trucks (Craftsman) scaffolded only.
// Sources: Wikipedia 2026 NASCAR Cup Series, NASCAR.com winners gallery,
// racingnews.co points after Watkins Glen, individual race recaps.

let currentNascarTab='live';
let currentNascarSeries='cup';
let selectedNascarRace=null;
let selectedNascarDriverChamp=null;
let selectedNascarMfrChamp=null;

// Manufacturer brand colors
const MFR_COLOR={'Toyota':'#EB0A1E','Chevrolet':'#C5B358','Ford':'#003478','default':'#888'};

// Driver → {team, mfr, number} mapping for 2026 Cup Series (full-time entries)
const NASCAR_CUP_DRIVERS={
  'Reddick':       {first:'Tyler',     team:'23XI Racing',          mfr:'Toyota',    num:45},
  'Hamlin':        {first:'Denny',     team:'Joe Gibbs Racing',     mfr:'Toyota',    num:11},
  'Elliott':       {first:'Chase',     team:'Hendrick Motorsports', mfr:'Chevrolet', num:9},
  'Blaney':        {first:'Ryan',      team:'Team Penske',          mfr:'Ford',      num:12},
  'Buescher':      {first:'Chris',     team:'RFK Racing',           mfr:'Ford',      num:17},
  'Gibbs':         {first:'Ty',        team:'Joe Gibbs Racing',     mfr:'Toyota',    num:54},
  'Hocevar':       {first:'Carson',    team:'Spire Motorsports',    mfr:'Chevrolet', num:77},
  'Larson':        {first:'Kyle',      team:'Hendrick Motorsports', mfr:'Chevrolet', num:5},
  'Keselowski':    {first:'Brad',      team:'RFK Racing',           mfr:'Ford',      num:6},
  'Wallace':       {first:'Bubba',     team:'23XI Racing',          mfr:'Toyota',    num:23},
  'Bell':          {first:'Christopher',team:'Joe Gibbs Racing',    mfr:'Toyota',    num:20},
  'Byron':         {first:'William',   team:'Hendrick Motorsports', mfr:'Chevrolet', num:24},
  'Preece':        {first:'Ryan',      team:'RFK Racing',           mfr:'Ford',      num:60},
  'Suarez':        {first:'Daniel',    team:'Spire Motorsports',    mfr:'Chevrolet', num:7},
  'Cindric':       {first:'Austin',    team:'Team Penske',          mfr:'Ford',      num:2},
  'van Gisbergen': {first:'Shane',     team:'Trackhouse Racing',    mfr:'Chevrolet', num:97},
  'Briscoe':       {first:'Chase',     team:'Joe Gibbs Racing',     mfr:'Toyota',    num:19},
  'Logano':        {first:'Joey',      team:'Team Penske',          mfr:'Ford',      num:22},
  'Chastain':      {first:'Ross',      team:'Trackhouse Racing',    mfr:'Chevrolet', num:1},
  'Allmendinger':  {first:'A.J.',      team:'Kaulig Racing',        mfr:'Chevrolet', num:16},
  'McDowell':      {first:'Michael',   team:'Spire Motorsports',    mfr:'Chevrolet', num:71},
  'Dillon':        {first:'Austin',    team:'Richard Childress Racing',mfr:'Chevrolet',num:3},
  'Smith':         {first:'Zane',      team:'Front Row Motorsports',mfr:'Ford',      num:38},
  'Busch':         {first:'Kyle',      team:'Richard Childress Racing',mfr:'Chevrolet',num:8},
  'Jones':         {first:'Erik',      team:'Legacy Motor Club',    mfr:'Toyota',    num:43},
  'Gilliland':     {first:'Todd',      team:'Front Row Motorsports',mfr:'Ford',      num:34},
  'Stenhouse Jr':  {first:'Ricky',     team:'Hyak Motorsports',     mfr:'Chevrolet', num:47},
  'Nemechek':      {first:'John Hunter',team:'Legacy Motor Club',   mfr:'Toyota',    num:42},
  'Herbst':        {first:'Riley',     team:'23XI Racing',          mfr:'Toyota',    num:35},
  'Gragson':       {first:'Noah',      team:'Front Row Motorsports',mfr:'Ford',      num:4},
  'Berry':         {first:'Josh',      team:'Wood Brothers Racing', mfr:'Ford',      num:21},
  'Zilisch':       {first:'Connor',    team:'Trackhouse Racing',    mfr:'Chevrolet', num:88},
  'Ty Dillon':     {first:'Ty',        team:'Kaulig Racing',        mfr:'Chevrolet', num:10},
  'Bowman':        {first:'Alex',      team:'Hendrick Motorsports', mfr:'Chevrolet', num:48},
  'Custer':        {first:'Cole',      team:'Haas Factory Team',    mfr:'Chevrolet', num:41},
  'Ware':          {first:'Cody',      team:'Rick Ware Racing',     mfr:'Chevrolet', num:51},
};

// 2026 Cup Series schedule (R1-R36) — verified against Wikipedia
const NASCAR_CUP_SCHEDULE=[
  {round:1, race:'Daytona 500',                track:'Daytona International Speedway',     country:'🇺🇸', date:'2026-02-15', laps:200},
  {round:2, race:'Autotrader 400',             track:'EchoPark Speedway (Atlanta)',        country:'🇺🇸', date:'2026-02-22', laps:260},
  {round:3, race:'DuraMAX Texas Grand Prix',   track:'Circuit of the Americas',            country:'🇺🇸', date:'2026-03-01', laps:95,  type:'R'},
  {round:4, race:'Straight Talk Wireless 500', track:'Phoenix Raceway',                    country:'🇺🇸', date:'2026-03-08', laps:312},
  {round:5, race:'Pennzoil 400',               track:'Las Vegas Motor Speedway',           country:'🇺🇸', date:'2026-03-15', laps:267},
  {round:6, race:'Goodyear 400',               track:'Darlington Raceway',                 country:'🇺🇸', date:'2026-03-22', laps:293},
  {round:7, race:'Cook Out 400',               track:'Martinsville Speedway',              country:'🇺🇸', date:'2026-03-29', laps:400},
  {round:8, race:'Food City 500',              track:'Bristol Motor Speedway',             country:'🇺🇸', date:'2026-04-12', laps:500},
  {round:9, race:'AdventHealth 400',           track:'Kansas Speedway',                    country:'🇺🇸', date:'2026-04-19', laps:267},
  {round:10,race:"Jack Link's 500",            track:'Talladega Superspeedway',            country:'🇺🇸', date:'2026-04-26', laps:188},
  {round:11,race:'Würth 400',                  track:'Texas Motor Speedway',               country:'🇺🇸', date:'2026-05-03', laps:267},
  {round:12,race:'Go Bowling at The Glen',     track:'Watkins Glen International',         country:'🇺🇸', date:'2026-05-10', laps:100, type:'R'},
  {round:13,race:'Coca-Cola 600',              track:'Charlotte Motor Speedway',           country:'🇺🇸', date:'2026-05-24', laps:400},
  {round:14,race:'Cracker Barrel 400',         track:'Nashville Superspeedway',            country:'🇺🇸', date:'2026-05-31', laps:300},
  {round:15,race:'FireKeepers Casino 400',     track:'Michigan International Speedway',    country:'🇺🇸', date:'2026-06-07', laps:200},
  {round:16,race:'The Great American Getaway 400',track:'Pocono Raceway',                  country:'🇺🇸', date:'2026-06-14', laps:160},
  {round:17,race:'Anduril 250',                track:'Coronado Street Course',             country:'🇺🇸', date:'2026-06-21', laps:80,  type:'S'},
  {round:18,race:'Toyota/Save Mart 350',       track:'Sonoma Raceway',                     country:'🇺🇸', date:'2026-06-28', laps:110, type:'R'},
  {round:19,race:'TBA',                        track:'Chicagoland Speedway',               country:'🇺🇸', date:'2026-07-05', laps:267},
  {round:20,race:'Quaker State 400',           track:'EchoPark Speedway (Atlanta)',        country:'🇺🇸', date:'2026-07-12', laps:260},
  {round:21,race:'Window World 450',           track:'North Wilkesboro Speedway',          country:'🇺🇸', date:'2026-07-19', laps:450},
  {round:22,race:'Brickyard 400',              track:'Indianapolis Motor Speedway',        country:'🇺🇸', date:'2026-07-26', laps:160},
  {round:23,race:'Iowa Corn 350',              track:'Iowa Speedway',                      country:'🇺🇸', date:'2026-08-09', laps:350},
  {round:24,race:'Cook Out 400',               track:'Richmond Raceway',                   country:'🇺🇸', date:'2026-08-15', laps:400},
  {round:25,race:'Mobil 1 301',                track:'New Hampshire Motor Speedway',       country:'🇺🇸', date:'2026-08-23', laps:301},
  {round:26,race:'Coke Zero Sugar 400',        track:'Daytona International Speedway',     country:'🇺🇸', date:'2026-08-29', laps:160},
  {round:27,race:'Cook Out Southern 500',      track:'Darlington Raceway',                 country:'🇺🇸', date:'2026-09-06', laps:367, chase:true},
  {round:28,race:'Enjoy Illinois 300',         track:'World Wide Technology Raceway',      country:'🇺🇸', date:'2026-09-13', laps:240, chase:true},
  {round:29,race:'Bass Pro Shops Night Race',  track:'Bristol Motor Speedway',             country:'🇺🇸', date:'2026-09-19', laps:500, chase:true},
  {round:30,race:'Hollywood Casino 400',       track:'Kansas Speedway',                    country:'🇺🇸', date:'2026-09-27', laps:267, chase:true},
  {round:31,race:'South Point 400',            track:'Las Vegas Motor Speedway',           country:'🇺🇸', date:'2026-10-04', laps:267, chase:true},
  {round:32,race:'Bank of America 400',        track:'Charlotte Motor Speedway',           country:'🇺🇸', date:'2026-10-11', laps:400, chase:true},
  {round:33,race:'Freeway Insurance 500',      track:'Phoenix Raceway',                    country:'🇺🇸', date:'2026-10-18', laps:312, chase:true},
  {round:34,race:'YellaWood 500',              track:'Talladega Superspeedway',            country:'🇺🇸', date:'2026-10-25', laps:188, chase:true},
  {round:35,race:'Xfinity 500',                track:'Martinsville Speedway',              country:'🇺🇸', date:'2026-11-01', laps:500, chase:true},
  {round:36,race:'Straight Talk Wireless 400', track:'Homestead-Miami Speedway',           country:'🇺🇸', date:'2026-11-08', laps:267, chase:true},
];

// Completed race results — winners verified from NASCAR.com gallery + race recaps
// Where podium/stage data is verified, included. Otherwise just winner.
const NASCAR_CUP_RESULTS={
  1:  {winner:'Reddick',    p2:'Elliott', p3:null,        polePos:'Busch',     stage1:'Smith',    stage2:'Wallace',  note:'68th Daytona 500 — Reddick passes Elliott exiting Turn 4 after restart with 5 to go. Hamlin tap triggers 20-car "Big One" in stage 2.'},
  2:  {winner:'Reddick',    p2:null,      p3:null,        polePos:'Reddick',   stage1:'Cindric',  stage2:'Wallace',  note:'Reddick becomes 6th driver ever to win first 2 races; rallies from multicar wreck to win in overtime.'},
  3:  {winner:'Reddick',    p2:'van Gisbergen', p3:'Bell',polePos:'Reddick',   stage1:'Chastain', stage2:'Gibbs',    note:'First driver in NASCAR history to win the first 3 races of a season. Holds off SVG by 3.944s.'},
  4:  {winner:'Blaney',     p2:null,      p3:null,        polePos:null,        stage1:null,       stage2:null,       note:'Blaney takes the win at Phoenix — first non-Reddick winner of 2026.'},
  5:  {winner:'Hamlin',     p2:null,      p3:null,        polePos:'Bell',      stage1:'Bell',     stage2:'Byron',    note:"Hamlin's 61st Cup win — 10th all-time. Leads race-high 134 laps, overcomes earlier pit road speeding penalty."},
  6:  {winner:'Reddick',    p2:'Keselowski',p3:null,      polePos:'Reddick',   stage1:'Keselowski',stage2:'Keselowski',note:'Reddick wins 4 of first 6, joining Earnhardt and Elliott. Keselowski sweeps both stages.'},
  7:  {winner:'Elliott',    p2:null,      p3:null,        polePos:'Hamlin',    stage1:null,       stage2:null,       note:"Elliott's first win of 2026 at Martinsville."},
  8:  {winner:'Gibbs',      p2:null,      p3:null,        polePos:null,        stage1:null,       stage2:null,       note:"Ty Gibbs takes his first 2026 win at Bristol."},
  9:  {winner:'Reddick',    p2:null,      p3:null,        polePos:null,        stage1:null,       stage2:null,       note:"Reddick's 5th win of the season — Kansas."},
  10: {winner:'Hocevar',    p2:null,      p3:null,        polePos:null,        stage1:null,       stage2:null,       note:'First career Cup win for Carson Hocevar — chaotic Talladega race with nearly half the field wiped out in massive wreck.'},
  11: {winner:'Elliott',    p2:null,      p3:null,        polePos:null,        stage1:null,       stage2:null,       note:"Elliott's second win of 2026 at Texas."},
  12: {winner:'van Gisbergen',p2:'McDowell',p3:'Gibbs',   polePos:'van Gisbergen',stage1:'Chastain',stage2:'van Gisbergen',note:"SVG's first 2026 win — 7th career Cup win (all on road/street courses). Recovers from 24th in 18 laps. Beats McDowell by 7.288s.",
       totalLaps:100, stage1End:20, stage2End:50,
       // Full top-15 classification, verified 2026-05-16 via motorsport.com + on3.com.
       // pts = total race points (finish-position pts + stage pts combined).
       Results:[
         {pos:1, car:'97', driver:'van Gisbergen',pts:68,ledLaps:74,status:'Running',time:'Winner'},
         {pos:2, car:'71', driver:'McDowell',     pts:36,ledLaps:5, status:'Running',time:'+7.288'},
         {pos:3, car:'54', driver:'Gibbs',        pts:42,ledLaps:17,status:'Running'},
         {pos:4, car:'19', driver:'Briscoe',      pts:35,ledLaps:0, status:'Running'},
         {pos:5, car:'45', driver:'Reddick',      pts:41,ledLaps:0, status:'Running'},
         {pos:6, car:'3',  driver:'Dillon',       pts:38,ledLaps:0, status:'Running'},
         {pos:7, car:'16', driver:'Allmendinger', pts:36,ledLaps:0, status:'Running'},
         {pos:8, car:'8',  driver:'Busch',        pts:35,ledLaps:0, status:'Running'},
         {pos:9, car:'2',  driver:'Cindric',      pts:39,ledLaps:0, status:'Running'},
         {pos:10,car:'42', driver:'Nemechek',     pts:32,ledLaps:0, status:'Running'},
         {pos:11,car:'12', driver:'Blaney',       pts:34,ledLaps:0, status:'Running'},
         {pos:12,car:'17', driver:'Buescher',     pts:30,ledLaps:0, status:'Running'},
         {pos:13,car:'7',  driver:'Suarez',       pts:24,ledLaps:0, status:'Running'},
         {pos:14,car:'60', driver:'Preece',       pts:23,ledLaps:0, status:'Running'},
         {pos:15,car:'41', driver:'Custer',       pts:22,ledLaps:0, status:'Running'},
       ]},
};

// 2026 Cup driver standings after Watkins Glen (R12 of 36) — verified racingnews.co
const NASCAR_CUP_STANDINGS=[
  {pos:1, driver:'Reddick',       points:567, gap:0},
  {pos:2, driver:'Hamlin',        points:438, gap:-129},
  {pos:3, driver:'Elliott',       points:422, gap:-145},
  {pos:4, driver:'Blaney',        points:405, gap:-162},
  {pos:5, driver:'Buescher',      points:375, gap:-192},
  {pos:6, driver:'Gibbs',         points:372, gap:-195},
  {pos:7, driver:'Hocevar',       points:342, gap:-225},
  {pos:8, driver:'Larson',        points:332, gap:-235},
  {pos:9, driver:'Keselowski',    points:318, gap:-249},
  {pos:10,driver:'Wallace',       points:313, gap:-254},
  {pos:11,driver:'Bell',          points:311, gap:-256},
  {pos:12,driver:'Byron',         points:309, gap:-258},
  {pos:13,driver:'Preece',        points:296, gap:-271},
  {pos:14,driver:'Suarez',        points:295, gap:-272},
  {pos:15,driver:'Cindric',       points:287, gap:-280},
  {pos:16,driver:'van Gisbergen', points:283, gap:-284, cutline:true},
  {pos:17,driver:'Briscoe',       points:277, gap:-290},
  {pos:18,driver:'Logano',        points:245, gap:-322},
  {pos:19,driver:'Chastain',      points:236, gap:-331},
  {pos:20,driver:'Allmendinger',  points:235, gap:-332},
  {pos:21,driver:'McDowell',      points:225, gap:-342},
  {pos:22,driver:'Dillon',        points:220, gap:-347},
  {pos:23,driver:'Smith',         points:217, gap:-350},
  {pos:24,driver:'Busch',         points:217, gap:-350},
  {pos:25,driver:'Jones',         points:214, gap:-353},
  {pos:26,driver:'Gilliland',     points:206, gap:-361},
  {pos:27,driver:'Stenhouse Jr',  points:193, gap:-374},
  {pos:28,driver:'Nemechek',      points:189, gap:-378},
  {pos:29,driver:'Herbst',        points:186, gap:-381},
  {pos:30,driver:'Gragson',       points:168, gap:-399},
  {pos:31,driver:'Berry',         points:160, gap:-407},
  {pos:32,driver:'Zilisch',       points:145, gap:-422},
  {pos:33,driver:'Ty Dillon',     points:140, gap:-427},
  {pos:34,driver:'Bowman',        points:127, gap:-440},
  {pos:35,driver:'Custer',        points:113, gap:-454},
  {pos:36,driver:'Ware',          points:93,  gap:-474},
];

// Manufacturer wins after R12 — verified by counting NASCAR.com winners gallery
const NASCAR_CUP_MFRS=[
  {pos:1, mfr:'Toyota',    wins:7, drivers:['Reddick (5)','Hamlin','Gibbs']},
  {pos:2, mfr:'Chevrolet', wins:4, drivers:['Elliott (2)','Hocevar','van Gisbergen']},
  {pos:3, mfr:'Ford',      wins:1, drivers:['Blaney']},
];

// ── NASCAR HELPERS ────────────────────────────────────────────────────────────
function nascarDrv(lastName){return NASCAR_CUP_DRIVERS[lastName]||{first:'',team:'—',mfr:'—',num:'—'};}
function nascarMfrColor(m){return MFR_COLOR[m]||MFR_COLOR['default'];}

// Build the "next race" banner for NASCAR
function renderNascarNextBanner(){
  const now=new Date();
  const next=NASCAR_CUP_SCHEDULE.find(r=>new Date(r.date+'T18:00:00Z')>now);
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

// Adapter: convert NASCAR_CUP_RESULTS into the same shape renderLiveOffAir expects
function nascarOffAirContext(){
  const lastCompleted=Object.entries(NASCAR_CUP_RESULTS).sort((a,b)=>parseInt(b[0])-parseInt(a[0]))[0];
  if(!lastCompleted)return{series:'nascar',races:{},banner:renderNascarNextBanner(),seriesLabel:'NASCAR',viewTab:'races',switchFn:'switchNascarTab'};
  const [round,res]=lastCompleted;
  const sched=NASCAR_CUP_SCHEDULE.find(s=>s.round===parseInt(round));
  // Shape it like F1 hardcoded race so renderLiveOffAir reads it
  const winner=res.winner, p2=res.p2, p3=res.p3;
  const winInfo=nascarDrv(winner), p2Info=p2?nascarDrv(p2):null, p3Info=p3?nascarDrv(p3):null;
  const fakeRaces={[round]:{round,raceName:sched.race,date:sched.date,
    Circuit:{circuitName:sched.track,Location:{country:sched.country}},
    Results:[
      {Driver:{familyName:winner,nationality:'American'},Constructor:{name:winInfo.mfr}},
      p2?{Driver:{familyName:p2,nationality:'American'},Constructor:{name:p2Info.mfr}}:{Driver:{familyName:'—'},Constructor:{name:'—'}},
      p3?{Driver:{familyName:p3,nationality:'American'},Constructor:{name:p3Info.mfr}}:{Driver:{familyName:'—'},Constructor:{name:'—'}},
    ]}};
  return{series:'nascar',races:fakeRaces,banner:renderNascarNextBanner(),seriesLabel:'NASCAR',lastLabel:`Last Race · Round ${round}`,viewTab:'races',switchFn:'switchNascarTab'};
}

// ── NASCAR LIVE (off-air view) ────────────────────────────────────────────────
function renderNascarLive(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityLive();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','live')+renderBackToSeriesHome('nascar');
  if(currentNascarSeries!=='cup'){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Craftsman Truck Series Coming Soon</div><div class="state-sub">Cup and Xfinity data are live now. Trucks support launching in a future update.</div></div>`;
    setStats('—','—',currentNascarSeries.toUpperCase(),'—');
    return;
  }
  content.innerHTML=top+renderLiveOffAir('no-session',nascarOffAirContext());
  const lastRound=Object.keys(NASCAR_CUP_RESULTS).sort((a,b)=>parseInt(b)-parseInt(a))[0];
  setStats('—','—','STANDBY',lastRound?`R${lastRound}`:'—');
}

// ── NASCAR RACE RESULTS ───────────────────────────────────────────────────────
function renderNascarRaces(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityRaces();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','races')+renderBackToSeriesHome('nascar');
  if(currentNascarSeries!=='cup'){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">TRUCKS Coming Soon</div><div class="state-sub">Cup and Xfinity race data are populated. Trucks launching soon.</div></div>`;
    setStats('—','—',currentNascarSeries.toUpperCase(),'—');
    return;
  }
  const banner=renderNascarNextBanner();
  // Race list — completed races only (where NASCAR_CUP_RESULTS has an entry)
  // Newest-round-first so the most recent race is at the top of the list.
  const completed=NASCAR_CUP_SCHEDULE.filter(s=>NASCAR_CUP_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const rows=completed.map(s=>{
    const res=NASCAR_CUP_RESULTS[s.round];
    const w=nascarDrv(res.winner);
    const isSelected=selectedNascarRace&&selectedNascarRace.round===s.round;
    const typeLabel=s.type==='R'?' · 🛣 RC':s.type==='S'?' · 🛣 ST':'';
    const slug=nascarTrackSlug(s.track);
    const hlId=`highlights-nascar-r${s.round}-${slug}`;
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
  let html=top+banner+`<div class="section-title"><span>2026 Cup Series · ${completed.length} of 36 races</span><span>Tap for details</span></div>`+rows;
  // Selected race detail panel
  if(selectedNascarRace){
    html+=buildNascarRaceDetailHTML(selectedNascarRace.round);
  }
  content.innerHTML=html;
  setStats('—','—','RACE',`${completed.length}/36`);
  if(selectedNascarRace){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

// Helper for NASCAR highlights anchor slugs. Matches the F1 pattern.
function nascarTrackSlug(track){
  return (track||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'race';
}

function buildNascarRaceDetailHTML(round){
  // TODO (Session 7 fact-check): backfill verified fastest-lap data per round.
  // When that lands, mark the fastest-lap row/cell with class `fl-row` (border
  // accent) and/or `fastest-lap` (purple text) — see f1.js buildRaceResultsHTML
  // for the pattern. Until then, no fastest-lap highlight here.
  const sched=NASCAR_CUP_SCHEDULE.find(s=>s.round===round);
  const res=NASCAR_CUP_RESULTS[round];
  if(!sched||!res)return'';
  const w=nascarDrv(res.winner);
  const p2=res.p2?nascarDrv(res.p2):null;
  const p3=res.p3?nascarDrv(res.p3):null;
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.race}</div>
    <div class="results-race-sub">${sched.track} · Round ${sched.round} · ${sched.laps} Laps${sched.type==='R'?' · Road Course':sched.type==='S'?' · Street Course':''}
    ${res.polePos?`<br>🏁 Pole: ${res.polePos}`:''}
    ${res.stage1||res.stage2?`<br>📊 Stages: ${res.stage1?`S1 ${res.stage1}`:'S1 —'} · ${res.stage2?`S2 ${res.stage2}`:'S2 —'}`:''}
    </div>
  </div>`;
  // Podium row — if we have p2/p3, show full; otherwise winner-only state
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
    </div>
    <div style="padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--border);text-align:center;">
      <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);">Full classification not yet available — winner verified from NASCAR.com</div>
    </div>`;
  }
  // Full top-15 classification (rendered when Results array exists; otherwise skipped).
  const fullTable=(res.Results&&res.Results.length>0)?buildNascarFullResultsHTML(res):'';
  // Race notes
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RACE NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+podium+fullTable+notes;
}

// Builds the F1-style top-15 results table for a NASCAR race that has a
// verified Results array. Columns: POS · car# · DRIVER (team) · PTS · LED.
// Status is shown inline next to the gap/time on the row, mirroring how
// F1 collapses status into the GAP/TIME column for DNFs etc.
function buildNascarFullResultsHTML(res){
  const tableHeader=`<div style="display:grid;grid-template-columns:32px 36px 1fr 44px 44px;padding:6px 12px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:5;gap:6px;">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:left;">POS</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:left;">#</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:left;">DRIVER</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:right;">PTS</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:right;">LED</div>
  </div>`;
  const rows=res.Results.map(r=>{
    const info=nascarDrv(r.driver);
    const posColor=r.pos===1?'var(--yellow)':r.pos===2?'#c0c0c0':r.pos===3?'#cd7f32':'var(--muted)';
    const bg=r.pos===1?'background:#0d1a08;':'';
    return`<div style="display:grid;grid-template-columns:32px 36px 1fr 44px 44px;padding:8px 12px;border-bottom:1px solid #141414;align-items:center;gap:6px;${bg}">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:${posColor};">${r.pos}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;color:${nascarMfrColor(info.mfr)};">#${r.car}</div>
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px;color:var(--text);line-height:1.1;">${r.driver}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-top:1px;">${info.team}</div>
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--yellow);text-align:right;">${r.pts}</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:${r.ledLaps>0?'var(--text)':'var(--muted)'};text-align:right;">${r.ledLaps}</div>
    </div>`;
  }).join('');
  const note=`<div style="padding:8px 12px;background:var(--surface);border-bottom:1px solid var(--border);font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);text-align:center;line-height:1.5;">PTS = total race points (finish + stage). LED = laps led. Top 15 of ~37 entries.</div>`;
  return tableHeader+rows+note;
}

function selectNascarRace(round){
  track('race:open:nascar',{round});
  selectedNascarRace=selectedNascarRace&&selectedNascarRace.round===round?null:{round};
  renderNascarRaces();
}

// ── NASCAR DRIVERS CHAMPIONSHIP ───────────────────────────────────────────────
function renderNascarDrivers(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityDrivers();
  const content=document.getElementById('main-content');
  if(currentNascarSeries!=='cup'){
    content.innerHTML=`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">TRUCKS Coming Soon</div><div class="state-sub">Cup and Xfinity standings are populated. Trucks launching soon.</div></div>`;
    setStats('—','—',currentNascarSeries.toUpperCase(),'—');
    return;
  }
  const hdr=`<div class="section-title"><span>Cup Drivers · 2026 · After R12 Watkins Glen</span><span>Top 16 = Chase</span></div>`;
  const rows=NASCAR_CUP_STANDINGS.map(d=>{
    const info=nascarDrv(d.driver);
    const isCutline=d.cutline;
    const inChase=d.pos<=16;
    const isSelected=selectedNascarDriverChamp===d.driver;
    const gapText=d.pos===1?'LEADER':`${d.gap}`;
    const cutlineDivider=isCutline?`<div style="padding:6px 16px;background:#1a0005;border-top:1px solid var(--red);border-bottom:1px solid var(--red);font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--red);letter-spacing:0.15em;text-align:center;font-weight:700;">— CHASE CUTLINE —</div>`:'';
    const breakdown=isSelected?renderNascarDriverBreakdown(d.driver,info,d.points,d.pos):'';
    const posColor=d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':inChase?'var(--text)':'var(--muted)';
    return`<div>
      ${isCutline?'':''}
      <div class="champ-row" style="${isSelected?'background:#0a0005;border-left:2px solid var(--yellow);':''}" onclick="track('driver:expand:nascar',{name:'${d.driver}'});selectedNascarDriverChamp=selectedNascarDriverChamp==='${d.driver}'?null:'${d.driver}';renderNascar();">
        <div class="champ-pos" style="color:${posColor}">${d.pos}</div>
        <div class="flag-cell" style="color:${nascarMfrColor(info.mfr)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${info.num}</div>
        <div>
          <div class="champ-name">${d.driver}</div>
          <div class="champ-team-sm" style="color:${nascarMfrColor(info.mfr)}">${info.team}</div>
        </div>
        <div class="champ-pts">${d.points}</div>
        <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${gapText}</div>
      </div>
      ${breakdown}
      ${d.pos===16?`<div style="padding:6px 16px;background:#1a0005;border-top:1px solid var(--red);border-bottom:1px solid var(--red);font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--red);letter-spacing:0.15em;text-align:center;font-weight:700;">— CHASE CUTLINE —</div>`:''}
    </div>`;
  }).join('');
  content.innerHTML=hdr+rows;
  setStats(`${NASCAR_CUP_STANDINGS[0].points} pts`,NASCAR_CUP_STANDINGS[0].driver,'DRIVERS','R12/36');
}

function renderNascarDriverBreakdown(name,info,points,pos){
  // Count wins for this driver from completed races
  const wins=Object.values(NASCAR_CUP_RESULTS).filter(r=>r.winner===name).length;
  const winRaces=Object.entries(NASCAR_CUP_RESULTS).filter(([_,r])=>r.winner===name).map(([rd,r])=>{
    const sched=NASCAR_CUP_SCHEDULE.find(s=>s.round===parseInt(rd));
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
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:${nascarMfrColor(info.mfr)};margin-top:2px;">${info.team} · #${info.num} · ${info.mfr}</div>
      </div>
      <button onclick="selectedNascarDriverChamp=null;renderNascar();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);">
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">CHAMPIONSHIP</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${pos===1?'var(--yellow)':pos<=16?'var(--text)':'var(--muted)'};">P${pos}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">POINTS</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:18px;color:var(--yellow);">${points}</div>
      </div>
      <div style="background:var(--bg);padding:10px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;">WINS</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${wins>0?'var(--yellow)':'var(--muted)'};">${wins}</div>
      </div>
    </div>
    ${wins>0?`<div style="padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;border-bottom:1px solid var(--border);">2026 WINS</div>`:''}
    ${winRaces}
  </div>`;
}

// ── NASCAR MANUFACTURERS ──────────────────────────────────────────────────────
function renderNascarMfrs(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityMfrs();
  const content=document.getElementById('main-content');
  if(currentNascarSeries!=='cup'){
    content.innerHTML=`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">TRUCKS Coming Soon</div><div class="state-sub">Cup and Xfinity manufacturer standings are populated.</div></div>`;
    setStats('—','—',currentNascarSeries.toUpperCase(),'—');
    return;
  }
  const hdr=`<div class="section-title"><span>Cup Manufacturers · 2026 · After R12</span><span>Wins through Watkins Glen</span></div>`;
  const note=`<div style="padding:12px 16px;background:#1a1a05;border-bottom:1px solid var(--border);font-family:'Barlow',sans-serif;font-size:11px;color:var(--yellow);line-height:1.5;">
    ℹ️ NASCAR no longer publicly publishes official manufacturer points after each race. Wins shown below are verified from NASCAR.com.
  </div>`;
  const rows=NASCAR_CUP_MFRS.map(m=>{
    const isSelected=selectedNascarMfrChamp===m.mfr;
    const breakdown=isSelected?renderNascarMfrBreakdown(m):'';
    return`<div>
      <div class="champ-row" style="${isSelected?`background:#0a0005;border-left:2px solid ${nascarMfrColor(m.mfr)};`:''}" onclick="track('mfr:expand:nascar',{name:'${m.mfr}'});selectedNascarMfrChamp=selectedNascarMfrChamp==='${m.mfr}'?null:'${m.mfr}';renderNascar();">
        <div class="champ-pos" style="color:${m.pos===1?'var(--yellow)':m.pos===2?'#c0c0c0':'#cd7f32'}">${m.pos}</div>
        <div class="flag-cell" style="color:${nascarMfrColor(m.mfr)};font-size:18px;">●</div>
        <div>
          <div class="champ-name" style="color:${nascarMfrColor(m.mfr)};">${m.mfr}</div>
          <div class="champ-team-sm">${m.drivers.length} winning driver${m.drivers.length>1?'s':''}</div>
        </div>
        <div class="champ-pts" style="color:${nascarMfrColor(m.mfr)};">${m.wins}</div>
        <div class="champ-gap">WINS</div>
      </div>
      ${breakdown}
    </div>`;
  }).join('');
  content.innerHTML=hdr+note+rows;
  setStats(`${NASCAR_CUP_MFRS[0].wins} wins`,NASCAR_CUP_MFRS[0].mfr,'MFRS','R12/36');
}

function renderNascarMfrBreakdown(m){
  // List each win for this manufacturer with race + driver
  const wins=Object.entries(NASCAR_CUP_RESULTS).filter(([_,r])=>nascarDrv(r.winner).mfr===m.mfr).map(([rd,r])=>{
    const sched=NASCAR_CUP_SCHEDULE.find(s=>s.round===parseInt(rd));
    return`<div style="display:grid;grid-template-columns:32px 1fr auto;padding:7px 16px;border-bottom:1px solid #141414;align-items:center;gap:10px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);">R${rd}</div>
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:var(--text);">${sched?.race||''}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);">${r.winner}</div>
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--muted);">${fmtDate(sched?.date)}</div>
    </div>`;
  }).join('');
  return`<div style="background:var(--surface2);border-top:1px solid var(--border);border-bottom:2px solid ${nascarMfrColor(m.mfr)};">
    <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:${nascarMfrColor(m.mfr)};">${m.mfr} — 2026 Wins</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);margin-top:2px;">${m.wins} race win${m.wins>1?'s':''} · ${m.drivers.join(', ')}</div>
      </div>
      <button onclick="selectedNascarMfrChamp=null;renderNascar();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
    </div>
    ${wins}
  </div>`;
}

// ── NASCAR ROUTER ─────────────────────────────────────────────────────────────
function renderNascar(){
  if(currentNascarTab==='races')return renderNascarRaces();
  if(currentNascarTab==='standings')return renderNascarStandings();
  if(currentNascarTab==='highlights')return renderNascarHighlights();
  if(currentNascarTab==='schedule')return renderNascarSchedule();
  // Legacy deep-link keys (no longer in the sub-tab strip; kept callable).
  if(currentNascarTab==='drivers')return renderNascarDrivers();
  if(currentNascarTab==='mfrs')return renderNascarMfrs();
  return renderNascarLive();
}

// Session 7: stacked Drivers + Manufacturers view backing the new "Standings"
// sub-tab. renderNascarDrivers / renderNascarMfrs each write the full panel
// into main-content; we capture their output and concatenate under the banner.
function renderNascarStandings(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityStandings();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','standings')+renderBackToSeriesHome('nascar');
  if(currentNascarSeries!=='cup'){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">TRUCKS Coming Soon</div><div class="state-sub">Cup and Xfinity standings are populated. Trucks launching soon.</div></div>`;
    setStats('—','—',currentNascarSeries.toUpperCase(),'—');
    return;
  }
  renderNascarDrivers();
  const driversHTML=content.innerHTML;
  renderNascarMfrs();
  const mfrsHTML=content.innerHTML;
  content.innerHTML=top+driversHTML+mfrsHTML;
}

// Session 7: Season Highlights. One placeholder card per completed Cup race.
// IDs follow `highlights-nascar-r{round}-{trackSlug}` for the deep-link from
// each race-results row. No invented URLs — TODO placeholder only.
function renderNascarHighlights(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityHighlights();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','highlights')+renderBackToSeriesHome('nascar');
  // Newest-round-first so the most recent race is at the top of the list.
  const completed=NASCAR_CUP_SCHEDULE.filter(s=>NASCAR_CUP_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=NASCAR_CUP_RESULTS[s.round];
    const winInfo=nascarDrv(res.winner);
    const slug=nascarTrackSlug(s.track);
    const id=`highlights-nascar-r${s.round}-${slug}`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${s.round} · ${s.country} · ${fmtDate(s.date)}</div>
      <div class="tx-highlights-title">${s.race}</div>
      <div class="tx-highlights-winner">Winner: ${res.winner} (${winInfo.mfr})</div>
      <div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>
    </div>`;
  }).join('');
  content.innerHTML=top+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">NASCAR 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps and key moments. Videos are added after verification — placeholders shown for races without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

function renderNascarSchedule(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinitySchedule();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','schedule')+renderBackToSeriesHome('nascar');
  if(currentNascarSeries!=='cup'){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Craftsman Truck Series Coming Soon</div><div class="state-sub">Cup and Xfinity schedules are live now.</div></div>`;
    setStats('—','—',currentNascarSeries.toUpperCase(),'—');return;
  }
  const now=new Date();
  const upcoming=NASCAR_CUP_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more Cup races on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const lastRound=upcoming[upcoming.length-1].round;
  const hdr=`<div class="section-title"><span>Cup 2026 · ${upcoming.length} Upcoming</span><span>Through R${lastRound}</span></div>`;
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

function switchNascarTab(tab){
  track('tab:nascar',{tab});
  currentNascarTab=tab;
  selectedNascarRace=null;
  selectedNascarDriverChamp=null;
  selectedNascarMfrChamp=null;
  document.querySelectorAll('#nascar-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  // The legacy 'drivers'/'mfrs' keys map onto the new 'standings' tab for the
  // active-class highlight (so deep-links into the legacy code paths still
  // light up a visible tab in the new strip).
  const stripId='ntab-'+({drivers:'standings',mfrs:'standings'}[tab]||tab);
  document.getElementById(stripId)?.classList.add('active');
  renderNascar();
}

function switchNascarSeries(s){
  track('tab:nascar-series',{series:s});
  currentNascarSeries=s;
  selectedNascarRace=null;
  selectedNascarDriverChamp=null;
  selectedNascarMfrChamp=null;
  document.querySelectorAll('.nascar-series-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('nseries-'+s)?.classList.add('active');
  // Tapping a sub-series tab (CUP / XFINITY / TRUCKS) always lands you on this
  // series' home menu — the 5-tile "pick a section" page. The banner header
  // updates per-sub-series via TX_SERIES_META.nascar.name (a getter that reads
  // currentNascarSeries). From the menu, picking a tile drops into the sub-tab
  // view via goToSubTab, which is what brings up the LIVE/STANDINGS/RACES/...
  // sub-menu strip.
  goToSeriesHome('nascar');
}
