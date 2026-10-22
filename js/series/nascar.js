// ═══════════════════════════════════════════════════════════════════════════
// ── NASCAR MODULE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// Cup Series fully populated with real verified 2026 data through R33 Freeway Insurance 500 (Phoenix).
// Xfinity (O'Reilly Auto Parts Series) and Trucks (Craftsman) scaffolded only.
// Sources: Wikipedia 2026 NASCAR Cup Series, NASCAR.com winners gallery,
// beyondtheflag.com / motorsport.com points after Michigan, race recaps.
// R18–R32 (added 2026-10-14), R33 (added 2026-10-22): official NASCAR.com results/points feed
// (cf.nascar.com/cacher/2026/1/…) cross-checked vs Wikipedia race pages.

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
  'Heim':          {first:'Corey',     team:'23XI Racing',          mfr:'Toyota',    num:67},
  // Part-time sub: drove the No. 35 at R26 Daytona (driver change, P12, 0 pts) —
  // official NASCAR.com R26 results feed. Listed only for the R26 Results table.
  'Burton':        {first:'Harrison',  team:'23XI Racing',          mfr:'Toyota',    num:35},
};

// 2026 Cup Series schedule (R1-R36) — verified against Wikipedia.
// 2026-10-14: R17 laps 80→75, R19 name TBA→eero 400, R25 name Mobil 1 301→
// Dollar Tree 301, R32 laps 400→267 (oval, not the Roval) — per the official
// NASCAR.com race list feed + Wikipedia race pages.
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
  {round:17,race:'Anduril 250',                track:'Coronado Street Course',             country:'🇺🇸', date:'2026-06-21', laps:75,  type:'S'},
  {round:18,race:'Toyota/Save Mart 350',       track:'Sonoma Raceway',                     country:'🇺🇸', date:'2026-06-28', laps:110, type:'R'},
  {round:19,race:'eero 400',                   track:'Chicagoland Speedway',               country:'🇺🇸', date:'2026-07-05', laps:267},
  {round:20,race:'Quaker State 400',           track:'EchoPark Speedway (Atlanta)',        country:'🇺🇸', date:'2026-07-12', laps:260},
  {round:21,race:'Window World 450',           track:'North Wilkesboro Speedway',          country:'🇺🇸', date:'2026-07-19', laps:450},
  {round:22,race:'Brickyard 400',              track:'Indianapolis Motor Speedway',        country:'🇺🇸', date:'2026-07-26', laps:160},
  {round:23,race:'Iowa Corn 350',              track:'Iowa Speedway',                      country:'🇺🇸', date:'2026-08-09', laps:350},
  {round:24,race:'Cook Out 400',               track:'Richmond Raceway',                   country:'🇺🇸', date:'2026-08-15', laps:400},
  {round:25,race:'Dollar Tree 301',            track:'New Hampshire Motor Speedway',       country:'🇺🇸', date:'2026-08-23', laps:301},
  {round:26,race:'Coke Zero Sugar 400',        track:'Daytona International Speedway',     country:'🇺🇸', date:'2026-08-29', laps:160},
  {round:27,race:'Cook Out Southern 500',      track:'Darlington Raceway',                 country:'🇺🇸', date:'2026-09-06', laps:367, chase:true},
  {round:28,race:'Enjoy Illinois 300',         track:'World Wide Technology Raceway',      country:'🇺🇸', date:'2026-09-13', laps:240, chase:true},
  {round:29,race:'Bass Pro Shops Night Race',  track:'Bristol Motor Speedway',             country:'🇺🇸', date:'2026-09-19', laps:500, chase:true},
  {round:30,race:'Hollywood Casino 400',       track:'Kansas Speedway',                    country:'🇺🇸', date:'2026-09-27', laps:267, chase:true},
  {round:31,race:'South Point 400',            track:'Las Vegas Motor Speedway',           country:'🇺🇸', date:'2026-10-04', laps:267, chase:true},
  {round:32,race:'Bank of America 400',        track:'Charlotte Motor Speedway',           country:'🇺🇸', date:'2026-10-11', laps:267, chase:true},
  {round:33,race:'Freeway Insurance 500',      track:'Phoenix Raceway',                    country:'🇺🇸', date:'2026-10-18', laps:312, chase:true},
  {round:34,race:'YellaWood 500',              track:'Talladega Superspeedway',            country:'🇺🇸', date:'2026-10-25', laps:188, chase:true},
  {round:35,race:'Xfinity 500',                track:'Martinsville Speedway',              country:'🇺🇸', date:'2026-11-01', laps:500, chase:true},
  {round:36,race:'Straight Talk Wireless 400', track:'Homestead-Miami Speedway',           country:'🇺🇸', date:'2026-11-08', laps:267, chase:true},
];

// Completed race results through R33 — winners verified from NASCAR.com gallery + race recaps
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
  13: {winner:'Suarez',     p2:'Bell',    p3:'Hamlin',    polePos:'Reddick',   stage1:'Larson',   stage2:'Hamlin',
       note:"Rain-shortened to 373 of 400 laps. Suarez's first win of 2026 and 3rd career Cup win — a two-tire call by crew chief Ryan Sparks on lap 356 vaulted the No. 7 from ~15th to the lead while the leaders took four. Stage 3 won by Bell; qualifying was rained out, Reddick awarded pole by competition formula. The race honored the late NASCAR champion Kyle Busch, with Suarez dedicating the win to him.",
       totalLaps:373, stage1End:100, stage2End:200,
       // Full top-15 classification. Finishing order + laps led verified 2026-05-24
       // via motorsport.com; pts = total race points, derived from the post-R12 →
       // post-R13 standings delta and cross-checked against the motorsport.com
       // points column for the top 6 (exact match).
       Results:[
         {pos:1, car:'7',  driver:'Suarez',       pts:55,ledLaps:17, status:'Running',time:'Winner'},
         {pos:2, car:'20', driver:'Bell',         pts:50,ledLaps:44, status:'Running'},
         {pos:3, car:'11', driver:'Hamlin',       pts:60,ledLaps:75, status:'Running'},
         {pos:4, car:'45', driver:'Reddick',      pts:53,ledLaps:119,status:'Running'},
         {pos:5, car:'5',  driver:'Larson',       pts:54,ledLaps:14, status:'Running'},
         {pos:6, car:'54', driver:'Gibbs',        pts:53,ledLaps:17, status:'Running'},
         {pos:7, car:'12', driver:'Blaney',       pts:41,ledLaps:0,  status:'Running'},
         {pos:8, car:'22', driver:'Logano',       pts:29,ledLaps:0,  status:'Running'},
         {pos:9, car:'24', driver:'Byron',        pts:28,ledLaps:0,  status:'Running'},
         {pos:10,car:'38', driver:'Smith',        pts:27,ledLaps:31, status:'Running'},
         {pos:11,car:'97', driver:'van Gisbergen',pts:33,ledLaps:11, status:'Running'},
         {pos:12,car:'47', driver:'Stenhouse Jr', pts:29,ledLaps:0,  status:'Running'},
         {pos:13,car:'43', driver:'Jones',        pts:30,ledLaps:0,  status:'Running'},
         {pos:14,car:'71', driver:'McDowell',     pts:23,ledLaps:3,  status:'Running'},
         {pos:15,car:'6',  driver:'Keselowski',   pts:25,ledLaps:0,  status:'Running'},
       ]},
  14: {winner:'Hamlin',     p2:'Bell',    p3:'Briscoe',   polePos:'Hamlin',    stage1:'Allmendinger',stage2:'Suarez',  note:"Hamlin's 2nd win of 2026, his first at Nashville and 62nd career Cup win. Qualifying was rained out and Hamlin took pole on the competition formula; he jumped the initial start and was sent to the rear of the 38-car field, then charged back over 300 green-flag laps to the checkered. Bell P2, Briscoe P3. Stage wins: Allmendinger (1), Suarez (2)."},
  15: {winner:'Hamlin',     p2:'Jones',   p3:'Wallace',   polePos:'Hamlin',    stage1:'Reddick',  stage2:'Elliott',  note:"Hamlin completes the Nashville–Michigan double — 3rd win of 2026 and 63rd career Cup win, tying the late Kyle Busch for 9th on the all-time wins list. He qualified on pole (36.901s) but started from the rear for unapproved adjustments after underbody damage. Points leader Reddick crashed on lap 82 and finished 35th — his first DNF of 2026 — cutting his championship lead over Hamlin to 51. Local driver Erik Jones P2, Wallace P3."},
  16: {winner:'Hamlin',     p2:'Reddick', p3:'Byron',     polePos:'Hamlin',    stage1:'Hamlin',   stage2:'Gilliland',note:"Hamlin completes the Nashville–Michigan–Pocono triple — 64th career Cup win, record 8th at Pocono. Passes Bell with 5 laps to go and wins by 1.678s over Reddick. Nemechek led the most laps (42). 5 cautions."},
  17: {winner:'Heim',       p2:'Wallace', p3:'Larson',    polePos:'van Gisbergen',stage1:'Blaney', stage2:'Preece',   note:"Inaugural NASCAR Cup race at Naval Base Coronado (Anduril 250 street race) — Corey Heim takes lead from Reddick with 3 laps to go after Reddick suffers late flat tyre. First career Cup win for Heim in 13th start (23XI Racing, No. 67 Toyota). Reddick's points lead over Hamlin slashed to 8. Race commemorated U.S. Navy's 250th birthday."},
  18: {winner:'van Gisbergen', p2:'Briscoe', p3:'Gibbs', polePos:'Gibbs', stage1:'Gibbs', stage2:'Gibbs',
       note:'SVG holds off Briscoe by 0.357s for his 8th career Cup win, leading 74 of 110 laps. Ty Gibbs took pole and swept both stages but finished P3. Hamlin takes the championship lead from Reddick (719–718) — the first change of points leader all season.',
       totalLaps:110,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'97', driver:'van Gisbergen',pts:63,ledLaps:74, status:'Running',time:'Winner'},
         {pos:2, car:'19', driver:'Briscoe',      pts:37,ledLaps:0,  status:'Running',time:'+0.357'},
         {pos:3, car:'54', driver:'Gibbs',        pts:54,ledLaps:31, status:'Running'},
         {pos:4, car:'5',  driver:'Larson',       pts:35,ledLaps:2,  status:'Running'},
         {pos:5, car:'20', driver:'Bell',         pts:50,ledLaps:0,  status:'Running'},
         {pos:6, car:'12', driver:'Blaney',       pts:32,ledLaps:1,  status:'Running'},
         {pos:7, car:'88', driver:'Zilisch',      pts:33,ledLaps:0,  status:'Running'},
         {pos:8, car:'60', driver:'Preece',       pts:35,ledLaps:0,  status:'Running'},
         {pos:9, car:'71', driver:'McDowell',     pts:36,ledLaps:0,  status:'Running'},
         {pos:10,car:'48', driver:'Bowman',       pts:32,ledLaps:0,  status:'Running'},
         {pos:11,car:'77', driver:'Hocevar',      pts:33,ledLaps:0,  status:'Running'},
         {pos:12,car:'24', driver:'Byron',        pts:25,ledLaps:1,  status:'Running'},
         {pos:13,car:'2',  driver:'Cindric',      pts:31,ledLaps:0,  status:'Running'},
         {pos:14,car:'1',  driver:'Chastain',     pts:29,ledLaps:1,  status:'Running'},
         {pos:15,car:'6',  driver:'Keselowski',   pts:22,ledLaps:0,  status:'Running'},
       ]},
  19: {winner:'Briscoe', p2:'Bell', p3:'Hamlin', polePos:'Hamlin', stage1:'Byron', stage2:'Byron',
       note:'Cup returns to Chicagoland for the first time since 2019. Byron swept both stages and led a race-high 94 laps, but Briscoe took control in the final pit cycle and beat Bell by 0.276s for his 6th career win — a JGR 1-2-3 with Hamlin P3.',
       totalLaps:267,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'19', driver:'Briscoe',      pts:70,ledLaps:51, status:'Running',time:'Winner'},
         {pos:2, car:'20', driver:'Bell',         pts:40,ledLaps:1,  status:'Running',time:'+0.276'},
         {pos:3, car:'11', driver:'Hamlin',       pts:45,ledLaps:30, status:'Running'},
         {pos:4, car:'24', driver:'Byron',        pts:53,ledLaps:94, status:'Running'},
         {pos:5, car:'48', driver:'Bowman',       pts:35,ledLaps:0,  status:'Running'},
         {pos:6, car:'23', driver:'Wallace',      pts:40,ledLaps:35, status:'Running'},
         {pos:7, car:'12', driver:'Blaney',       pts:36,ledLaps:8,  status:'Running'},
         {pos:8, car:'54', driver:'Gibbs',        pts:38,ledLaps:0,  status:'Running'},
         {pos:9, car:'67', driver:'Heim',         pts:0,ledLaps:1,  status:'Running'},
         {pos:10,car:'35', driver:'Herbst',       pts:31,ledLaps:0,  status:'Running'},
         {pos:11,car:'9',  driver:'Elliott',      pts:30,ledLaps:0,  status:'Running'},
         {pos:12,car:'22', driver:'Logano',       pts:25,ledLaps:1,  status:'Running'},
         {pos:13,car:'2',  driver:'Cindric',      pts:33,ledLaps:18, status:'Running'},
         {pos:14,car:'7',  driver:'Suarez',       pts:23,ledLaps:0,  status:'Running'},
         {pos:15,car:'43', driver:'Jones',        pts:22,ledLaps:0,  status:'Running'},
       ]},
  20: {winner:'Blaney', p2:'Bell', p3:'Hocevar', polePos:'Blaney', stage1:'Blaney', stage2:'Blaney',
       note:'Red-flagged on lap 108 for lightning; resumed after about three hours. Blaney won the pole, swept both stages and led 171 laps — the most on a drafting track since Richard Petty in the 1964 Daytona 500 — then won in overtime by 0.068s over Bell for his 19th career win. Hamlin and Reddick clinched Chase spots.',
       totalLaps:263,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'12', driver:'Blaney',       pts:75,ledLaps:171,status:'Running',time:'Winner'},
         {pos:2, car:'20', driver:'Bell',         pts:39,ledLaps:5,  status:'Running',time:'+0.068'},
         {pos:3, car:'77', driver:'Hocevar',      pts:39,ledLaps:25, status:'Running'},
         {pos:4, car:'54', driver:'Gibbs',        pts:38,ledLaps:32, status:'Running'},
         {pos:5, car:'43', driver:'Jones',        pts:35,ledLaps:0,  status:'Running'},
         {pos:6, car:'97', driver:'van Gisbergen',pts:32,ledLaps:0,  status:'Running'},
         {pos:7, car:'3',  driver:'Dillon',       pts:34,ledLaps:0,  status:'Running'},
         {pos:8, car:'45', driver:'Reddick',      pts:47,ledLaps:8,  status:'Running'},
         {pos:9, car:'22', driver:'Logano',       pts:43,ledLaps:0,  status:'Running'},
         {pos:10,car:'17', driver:'Buescher',     pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'1',  driver:'Chastain',     pts:26,ledLaps:0,  status:'Running'},
         {pos:12,car:'11', driver:'Hamlin',       pts:27,ledLaps:0,  status:'Running'},
         {pos:13,car:'9',  driver:'Elliott',      pts:26,ledLaps:5,  status:'Running'},
         {pos:14,car:'2',  driver:'Cindric',      pts:36,ledLaps:0,  status:'Running'},
         {pos:15,car:'71', driver:'McDowell',     pts:22,ledLaps:0,  status:'Running'},
       ]},
  21: {winner:'Logano', p2:'Hamlin', p3:'Briscoe', polePos:'Blaney', stage1:'Gibbs', stage2:'Logano',
       note:'North Wilkesboro\'s first Cup points race since 1996. Qualifying was rained out — Blaney took pole on the competition formula. Logano led 323 of 450 laps and held off Hamlin by 0.859s for his first win since the 2025 Würth 400 (38th career). Blaney clinched a Chase spot.',
       totalLaps:450,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'22', driver:'Logano',       pts:73,ledLaps:323,status:'Running',time:'Winner'},
         {pos:2, car:'11', driver:'Hamlin',       pts:51,ledLaps:9,  status:'Running',time:'+0.859'},
         {pos:3, car:'19', driver:'Briscoe',      pts:45,ledLaps:5,  status:'Running'},
         {pos:4, car:'54', driver:'Gibbs',        pts:43,ledLaps:47, status:'Running'},
         {pos:5, car:'97', driver:'van Gisbergen',pts:47,ledLaps:49, status:'Running'},
         {pos:6, car:'23', driver:'Wallace',      pts:38,ledLaps:8,  status:'Running'},
         {pos:7, car:'6',  driver:'Keselowski',   pts:34,ledLaps:7,  status:'Running'},
         {pos:8, car:'34', driver:'Gilliland',    pts:31,ledLaps:0,  status:'Running'},
         {pos:9, car:'7',  driver:'Suarez',       pts:29,ledLaps:1,  status:'Running'},
         {pos:10,car:'60', driver:'Preece',       pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'12', driver:'Blaney',       pts:29,ledLaps:1,  status:'Running'},
         {pos:12,car:'24', driver:'Byron',        pts:26,ledLaps:0,  status:'Running'},
         {pos:13,car:'77', driver:'Hocevar',      pts:35,ledLaps:0,  status:'Running'},
         {pos:14,car:'2',  driver:'Cindric',      pts:25,ledLaps:0,  status:'Running'},
         {pos:15,car:'5',  driver:'Larson',       pts:22,ledLaps:0,  status:'Running'},
       ]},
  22: {winner:'Heim', p2:'Bell', p3:'Logano', polePos:'Hocevar', stage1:'Gibbs', stage2:'Chastain',
       note:'Corey Heim (part-time No. 67, 23XI) led 58 laps and beat Bell by 0.287s — the first part-time car to win a crown jewel since Trevor Bayne\'s 2011 Daytona 500, and his 2nd Cup win. Hocevar took pole. Heim is not a Cup points-eligible driver (0 pts).',
       totalLaps:160,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'67', driver:'Heim',         pts:0,ledLaps:58, status:'Running',time:'Winner'},
         {pos:2, car:'20', driver:'Bell',         pts:35,ledLaps:0,  status:'Running',time:'+0.287'},
         {pos:3, car:'22', driver:'Logano',       pts:34,ledLaps:0,  status:'Running'},
         {pos:4, car:'19', driver:'Briscoe',      pts:36,ledLaps:1,  status:'Running'},
         {pos:5, car:'11', driver:'Hamlin',       pts:44,ledLaps:14, status:'Running'},
         {pos:6, car:'6',  driver:'Keselowski',   pts:31,ledLaps:0,  status:'Running'},
         {pos:7, car:'21', driver:'Berry',        pts:30,ledLaps:1,  status:'Running'},
         {pos:8, car:'60', driver:'Preece',       pts:33,ledLaps:1,  status:'Running'},
         {pos:9, car:'77', driver:'Hocevar',      pts:40,ledLaps:31, status:'Running'},
         {pos:10,car:'45', driver:'Reddick',      pts:28,ledLaps:1,  status:'Running'},
         {pos:11,car:'17', driver:'Buescher',     pts:28,ledLaps:0,  status:'Running'},
         {pos:12,car:'54', driver:'Gibbs',        pts:43,ledLaps:46, status:'Running'},
         {pos:13,car:'41', driver:'Custer',       pts:24,ledLaps:0,  status:'Running'},
         {pos:14,car:'2',  driver:'Cindric',      pts:23,ledLaps:0,  status:'Running'},
         {pos:15,car:'38', driver:'Smith',        pts:22,ledLaps:0,  status:'Running'},
       ]},
  23: {winner:'Gibbs', p2:'Bell', p3:'Blaney', polePos:'Blaney', stage1:'Blaney', stage2:'Bell',
       note:'Ty Gibbs wins his 2nd career Cup race, 0.253s ahead of JGR teammate Bell. Polesitter Blaney led a race-high 129 laps and finished P3.',
       totalLaps:350,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'54', driver:'Gibbs',        pts:69,ledLaps:20, status:'Running',time:'Winner'},
         {pos:2, car:'20', driver:'Bell',         pts:50,ledLaps:108,status:'Running',time:'+0.253'},
         {pos:3, car:'12', driver:'Blaney',       pts:47,ledLaps:129,status:'Running'},
         {pos:4, car:'21', driver:'Berry',        pts:33,ledLaps:0,  status:'Running'},
         {pos:5, car:'11', driver:'Hamlin',       pts:37,ledLaps:0,  status:'Running'},
         {pos:6, car:'19', driver:'Briscoe',      pts:40,ledLaps:0,  status:'Running'},
         {pos:7, car:'1',  driver:'Chastain',     pts:43,ledLaps:40, status:'Running'},
         {pos:8, car:'16', driver:'Allmendinger', pts:29,ledLaps:0,  status:'Running'},
         {pos:9, car:'24', driver:'Byron',        pts:32,ledLaps:0,  status:'Running'},
         {pos:10,car:'3',  driver:'Dillon',       pts:33,ledLaps:0,  status:'Running'},
         {pos:11,car:'88', driver:'Zilisch',      pts:29,ledLaps:0,  status:'Running'},
         {pos:12,car:'23', driver:'Wallace',      pts:25,ledLaps:35, status:'Running'},
         {pos:13,car:'17', driver:'Buescher',     pts:24,ledLaps:0,  status:'Running'},
         {pos:14,car:'22', driver:'Logano',       pts:41,ledLaps:0,  status:'Running'},
         {pos:15,car:'9',  driver:'Elliott',      pts:22,ledLaps:18, status:'Running'},
       ]},
  24: {winner:'Logano', p2:'Briscoe', p3:'Cindric', polePos:'Blaney', stage1:'Blaney', stage2:'Logano',
       note:'Logano\'s 39th career win and first at Richmond since 2017 — he held off Briscoe (who led a race-high 171 laps) by 0.392s after the final pit cycle. Cindric P3 for a Penske 1-3.',
       totalLaps:400,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'22', driver:'Logano',       pts:73,ledLaps:95, status:'Running',time:'Winner'},
         {pos:2, car:'19', driver:'Briscoe',      pts:52,ledLaps:171,status:'Running',time:'+0.392'},
         {pos:3, car:'2',  driver:'Cindric',      pts:48,ledLaps:0,  status:'Running'},
         {pos:4, car:'11', driver:'Hamlin',       pts:46,ledLaps:3,  status:'Running'},
         {pos:5, car:'9',  driver:'Elliott',      pts:38,ledLaps:0,  status:'Running'},
         {pos:6, car:'5',  driver:'Larson',       pts:31,ledLaps:2,  status:'Running'},
         {pos:7, car:'20', driver:'Bell',         pts:36,ledLaps:29, status:'Running'},
         {pos:8, car:'21', driver:'Berry',        pts:40,ledLaps:1,  status:'Running'},
         {pos:9, car:'24', driver:'Byron',        pts:30,ledLaps:0,  status:'Running'},
         {pos:10,car:'48', driver:'Bowman',       pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'45', driver:'Reddick',      pts:28,ledLaps:7,  status:'Running'},
         {pos:12,car:'1',  driver:'Chastain',     pts:25,ledLaps:0,  status:'Running'},
         {pos:13,car:'12', driver:'Blaney',       pts:41,ledLaps:88, status:'Running'},
         {pos:14,car:'97', driver:'van Gisbergen',pts:23,ledLaps:0,  status:'Running'},
         {pos:15,car:'54', driver:'Gibbs',        pts:22,ledLaps:1,  status:'Running'},
       ]},
  25: {winner:'Blaney', p2:'Wallace', p3:'Berry', polePos:'Reddick', stage1:'Larson', stage2:'Blaney',
       note:'Start moved up an hour for rain; the race began on wet-weather tyres until a competition caution on lap 40. Blaney led 115 laps and beat Wallace by 0.586s — his 20th career win and 2nd straight at New Hampshire. Hamlin clinched the No. 1 seed for the Chase.',
       totalLaps:301,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'12', driver:'Blaney',       pts:70,ledLaps:115,status:'Running',time:'Winner'},
         {pos:2, car:'23', driver:'Wallace',      pts:43,ledLaps:22, status:'Running',time:'+0.586'},
         {pos:3, car:'21', driver:'Berry',        pts:49,ledLaps:73, status:'Running'},
         {pos:4, car:'20', driver:'Bell',         pts:43,ledLaps:0,  status:'Running'},
         {pos:5, car:'5',  driver:'Larson',       pts:48,ledLaps:18, status:'Running'},
         {pos:6, car:'54', driver:'Gibbs',        pts:38,ledLaps:0,  status:'Running'},
         {pos:7, car:'11', driver:'Hamlin',       pts:32,ledLaps:0,  status:'Running'},
         {pos:8, car:'45', driver:'Reddick',      pts:29,ledLaps:0,  status:'Running'},
         {pos:9, car:'60', driver:'Preece',       pts:38,ledLaps:17, status:'Running'},
         {pos:10,car:'4',  driver:'Gragson',      pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'6',  driver:'Keselowski',   pts:31,ledLaps:0,  status:'Running'},
         {pos:12,car:'2',  driver:'Cindric',      pts:25,ledLaps:0,  status:'Running'},
         {pos:13,car:'38', driver:'Smith',        pts:24,ledLaps:0,  status:'Running'},
         {pos:14,car:'22', driver:'Logano',       pts:23,ledLaps:0,  status:'Running'},
         {pos:15,car:'48', driver:'Bowman',       pts:22,ledLaps:0,  status:'Running'},
       ]},
  26: {winner:'Preece', p2:'Suarez', p3:'Reddick', polePos:'Chastain', stage1:'van Gisbergen', stage2:'Blaney',
       note:'Regular-season finale. Ryan Preece takes his first career Cup win, declared the winner when the caution flew on the last lap of overtime (166 laps). Suárez P2, Reddick P3. 41 lead changes among 22 drivers. Preece, Wallace and Cindric claimed the final three Chase spots.',
       totalLaps:166,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'60', driver:'Preece',       pts:67,ledLaps:5,  status:'Running',time:'Winner'},
         {pos:2, car:'7',  driver:'Suarez',       pts:38,ledLaps:0,  status:'Running'},
         {pos:3, car:'45', driver:'Reddick',      pts:34,ledLaps:5,  status:'Running'},
         {pos:4, car:'71', driver:'McDowell',     pts:33,ledLaps:0,  status:'Running'},
         {pos:5, car:'47', driver:'Stenhouse Jr', pts:32,ledLaps:1,  status:'Running'},
         {pos:6, car:'2',  driver:'Cindric',      pts:32,ledLaps:6,  status:'Running'},
         {pos:7, car:'3',  driver:'Dillon',       pts:30,ledLaps:0,  status:'Running'},
         {pos:8, car:'48', driver:'Bowman',       pts:29,ledLaps:0,  status:'Running'},
         {pos:9, car:'21', driver:'Berry',        pts:28,ledLaps:1,  status:'Running'},
         {pos:10,car:'41', driver:'Custer',       pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'11', driver:'Hamlin',       pts:26,ledLaps:0,  status:'Running'},
         {pos:12,car:'35', driver:'Burton',       pts:0,ledLaps:0,  status:'Running'},
         {pos:13,car:'19', driver:'Briscoe',      pts:34,ledLaps:10, status:'Running'},
         {pos:14,car:'6',  driver:'Keselowski',   pts:23,ledLaps:10, status:'Running'},
         {pos:15,car:'42', driver:'Nemechek',     pts:24,ledLaps:2,  status:'Running'},
       ]},
  27: {winner:'Bell', p2:'Gibbs', p3:'Reddick', polePos:'Reddick', stage1:'Reddick', stage2:'Bell',
       note:'Chase opener. Reddick took pole after the rest of qualifying was cancelled by lightning. Bell beat JGR teammate Gibbs by 1.038s for his 14th career win, snapping a 33-race winless streak. Larson led a race-high 99 laps.',
       totalLaps:367,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'20', driver:'Bell',         pts:73,ledLaps:46, status:'Running',time:'Winner'},
         {pos:2, car:'54', driver:'Gibbs',        pts:36,ledLaps:0,  status:'Running',time:'+1.038'},
         {pos:3, car:'45', driver:'Reddick',      pts:46,ledLaps:74, status:'Running'},
         {pos:4, car:'12', driver:'Blaney',       pts:44,ledLaps:1,  status:'Running'},
         {pos:5, car:'5',  driver:'Larson',       pts:41,ledLaps:99, status:'Running'},
         {pos:6, car:'19', driver:'Briscoe',      pts:43,ledLaps:30, status:'Running'},
         {pos:7, car:'21', driver:'Berry',        pts:34,ledLaps:0,  status:'Running'},
         {pos:8, car:'23', driver:'Wallace',      pts:44,ledLaps:38, status:'Running'},
         {pos:9, car:'22', driver:'Logano',       pts:28,ledLaps:0,  status:'Running'},
         {pos:10,car:'60', driver:'Preece',       pts:31,ledLaps:0,  status:'Running'},
         {pos:11,car:'77', driver:'Hocevar',      pts:26,ledLaps:2,  status:'Running'},
         {pos:12,car:'48', driver:'Bowman',       pts:25,ledLaps:0,  status:'Running'},
         {pos:13,car:'2',  driver:'Cindric',      pts:28,ledLaps:0,  status:'Running'},
         {pos:14,car:'9',  driver:'Elliott',      pts:23,ledLaps:1,  status:'Running'},
         {pos:15,car:'43', driver:'Jones',        pts:22,ledLaps:0,  status:'Running'},
       ]},
  28: {winner:'Larson', p2:'Bowman', p3:'Logano', polePos:'Logano', stage1:'Logano', stage2:'Larson',
       note:'18 cautions and a double overtime (247 of 240 scheduled laps). Larson wins by 0.333s over Hendrick teammate Bowman for his 33rd career win, ending a 51-race winless streak. Polesitter Logano led 96 laps and finished P3.',
       totalLaps:247,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'5',  driver:'Larson',       pts:73,ledLaps:80, status:'Running',time:'Winner'},
         {pos:2, car:'48', driver:'Bowman',       pts:38,ledLaps:0,  status:'Running',time:'+0.333'},
         {pos:3, car:'22', driver:'Logano',       pts:54,ledLaps:96, status:'Running'},
         {pos:4, car:'24', driver:'Byron',        pts:33,ledLaps:0,  status:'Running'},
         {pos:5, car:'1',  driver:'Chastain',     pts:32,ledLaps:15, status:'Running'},
         {pos:6, car:'3',  driver:'Dillon',       pts:31,ledLaps:0,  status:'Running'},
         {pos:7, car:'88', driver:'Zilisch',      pts:30,ledLaps:0,  status:'Running'},
         {pos:8, car:'77', driver:'Hocevar',      pts:34,ledLaps:0,  status:'Running'},
         {pos:9, car:'11', driver:'Hamlin',       pts:33,ledLaps:0,  status:'Running'},
         {pos:10,car:'2',  driver:'Cindric',      pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'41', driver:'Custer',       pts:26,ledLaps:0,  status:'Running'},
         {pos:12,car:'6',  driver:'Keselowski',   pts:34,ledLaps:55, status:'Running'},
         {pos:13,car:'43', driver:'Jones',        pts:24,ledLaps:0,  status:'Running'},
         {pos:14,car:'23', driver:'Wallace',      pts:24,ledLaps:0,  status:'Running'},
         {pos:15,car:'42', driver:'Nemechek',     pts:22,ledLaps:0,  status:'Running'},
       ]},
  29: {winner:'Logano', p2:'Larson', p3:'Hocevar', polePos:'Larson', stage1:'Logano', stage2:'Blaney',
       note:'Rain cancelled qualifying (Larson pole on the competition formula). Logano wins by 1.248s for his 40th career win; Larson P2 takes the points lead from Hamlin by one point. Blaney led a race-high 202 laps but crashed out in 33rd and had a post-race altercation with Hocevar over a lap-457 incident.',
       totalLaps:500,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'22', driver:'Logano',       pts:73,ledLaps:93, status:'Running',time:'Winner'},
         {pos:2, car:'5',  driver:'Larson',       pts:47,ledLaps:45, status:'Running',time:'+1.248'},
         {pos:3, car:'77', driver:'Hocevar',      pts:41,ledLaps:39, status:'Running'},
         {pos:4, car:'20', driver:'Bell',         pts:39,ledLaps:1,  status:'Running'},
         {pos:5, car:'54', driver:'Gibbs',        pts:47,ledLaps:120,status:'Running'},
         {pos:6, car:'21', driver:'Berry',        pts:38,ledLaps:0,  status:'Running'},
         {pos:7, car:'23', driver:'Wallace',      pts:36,ledLaps:0,  status:'Running'},
         {pos:8, car:'11', driver:'Hamlin',       pts:37,ledLaps:0,  status:'Running'},
         {pos:9, car:'24', driver:'Byron',        pts:31,ledLaps:0,  status:'Running'},
         {pos:10,car:'60', driver:'Preece',       pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'2',  driver:'Cindric',      pts:30,ledLaps:0,  status:'Running'},
         {pos:12,car:'1',  driver:'Chastain',     pts:32,ledLaps:0,  status:'Running'},
         {pos:13,car:'17', driver:'Buescher',     pts:25,ledLaps:0,  status:'Running'},
         {pos:14,car:'7',  driver:'Suarez',       pts:23,ledLaps:0,  status:'Running'},
         {pos:15,car:'6',  driver:'Keselowski',   pts:24,ledLaps:0,  status:'Running'},
       ]},
  30: {winner:'Larson', p2:'Cindric', p3:'Hamlin', polePos:'Logano', stage1:'Larson', stage2:'Larson',
       note:'Rain cancelled qualifying (Logano pole on the competition formula). Larson swept both stages and led 235 of 267 laps for his 34th career win, 0.565s ahead of Cindric. Hamlin P3.',
       totalLaps:267,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'5',  driver:'Larson',       pts:76,ledLaps:235,status:'Running',time:'Winner'},
         {pos:2, car:'2',  driver:'Cindric',      pts:52,ledLaps:1,  status:'Running',time:'+0.565'},
         {pos:3, car:'11', driver:'Hamlin',       pts:51,ledLaps:2,  status:'Running'},
         {pos:4, car:'19', driver:'Briscoe',      pts:40,ledLaps:23, status:'Running'},
         {pos:5, car:'12', driver:'Blaney',       pts:37,ledLaps:4,  status:'Running'},
         {pos:6, car:'20', driver:'Bell',         pts:43,ledLaps:0,  status:'Running'},
         {pos:7, car:'24', driver:'Byron',        pts:39,ledLaps:0,  status:'Running'},
         {pos:8, car:'9',  driver:'Elliott',      pts:32,ledLaps:0,  status:'Running'},
         {pos:9, car:'23', driver:'Wallace',      pts:28,ledLaps:0,  status:'Running'},
         {pos:10,car:'60', driver:'Preece',       pts:27,ledLaps:0,  status:'Running'},
         {pos:11,car:'45', driver:'Reddick',      pts:26,ledLaps:0,  status:'Running'},
         {pos:12,car:'6',  driver:'Keselowski',   pts:26,ledLaps:0,  status:'Running'},
         {pos:13,car:'42', driver:'Nemechek',     pts:24,ledLaps:0,  status:'Running'},
         {pos:14,car:'7',  driver:'Suarez',       pts:23,ledLaps:0,  status:'Running'},
         {pos:15,car:'1',  driver:'Chastain',     pts:22,ledLaps:1,  status:'Running'},
       ]},
  31: {winner:'Briscoe', p2:'Larson', p3:'Reddick', polePos:'Hamlin', stage1:'Briscoe', stage2:'Briscoe',
       note:'Hamlin led a JGR 1-2-3-4 in qualifying. Briscoe swept both stages, led 175 laps and beat Larson by 1.376s for his 7th career win.',
       totalLaps:267,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'19', driver:'Briscoe',      pts:75,ledLaps:175,status:'Running',time:'Winner'},
         {pos:2, car:'5',  driver:'Larson',       pts:36,ledLaps:0,  status:'Running',time:'+1.376'},
         {pos:3, car:'45', driver:'Reddick',      pts:41,ledLaps:1,  status:'Running'},
         {pos:4, car:'2',  driver:'Cindric',      pts:48,ledLaps:33, status:'Running'},
         {pos:5, car:'12', driver:'Blaney',       pts:47,ledLaps:10, status:'Running'},
         {pos:6, car:'24', driver:'Byron',        pts:34,ledLaps:0,  status:'Running'},
         {pos:7, car:'9',  driver:'Elliott',      pts:34,ledLaps:0,  status:'Running'},
         {pos:8, car:'23', driver:'Wallace',      pts:39,ledLaps:1,  status:'Running'},
         {pos:9, car:'97', driver:'van Gisbergen',pts:28,ledLaps:0,  status:'Running'},
         {pos:10,car:'22', driver:'Logano',       pts:32,ledLaps:0,  status:'Running'},
         {pos:11,car:'48', driver:'Bowman',       pts:28,ledLaps:0,  status:'Running'},
         {pos:12,car:'77', driver:'Hocevar',      pts:28,ledLaps:0,  status:'Running'},
         {pos:13,car:'17', driver:'Buescher',     pts:26,ledLaps:0,  status:'Running'},
         {pos:14,car:'7',  driver:'Suarez',       pts:28,ledLaps:0,  status:'Running'},
         {pos:15,car:'16', driver:'Allmendinger', pts:22,ledLaps:0,  status:'Running'},
       ]},
  32: {winner:'Briscoe', p2:'Bell', p3:'Blaney', polePos:'Larson', stage1:'Larson', stage2:'Bell',
       note:'First fall Charlotte race on the oval after eight years on the Roval. Rain cancelled qualifying (Larson pole on the competition formula). Briscoe beat JGR teammate Bell by 0.029s in a photo finish — back-to-back Chase wins and his 8th career victory. Larson P6 but extends his points lead over Hamlin to 49.',
       totalLaps:267,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com cacher weekend-feed); pts = total race points.
       Results:[
         {pos:1, car:'19', driver:'Briscoe',      pts:68,ledLaps:62, status:'Running',time:'Winner'},
         {pos:2, car:'20', driver:'Bell',         pts:53,ledLaps:93, status:'Running',time:'+0.029'},
         {pos:3, car:'12', driver:'Blaney',       pts:44,ledLaps:4,  status:'Running'},
         {pos:4, car:'21', driver:'Berry',        pts:36,ledLaps:0,  status:'Running'},
         {pos:5, car:'11', driver:'Hamlin',       pts:40,ledLaps:0,  status:'Running'},
         {pos:6, car:'5',  driver:'Larson',       pts:49,ledLaps:97, status:'Running'},
         {pos:7, car:'97', driver:'van Gisbergen',pts:30,ledLaps:0,  status:'Running'},
         {pos:8, car:'45', driver:'Reddick',      pts:41,ledLaps:0,  status:'Running'},
         {pos:9, car:'22', driver:'Logano',       pts:28,ledLaps:0,  status:'Running'},
         {pos:10,car:'17', driver:'Buescher',     pts:29,ledLaps:0,  status:'Running'},
         {pos:11,car:'67', driver:'Heim',         pts:0,ledLaps:0,  status:'Running'},
         {pos:12,car:'9',  driver:'Elliott',      pts:27,ledLaps:0,  status:'Running'},
         {pos:13,car:'7',  driver:'Suarez',       pts:29,ledLaps:0,  status:'Running'},
         {pos:14,car:'77', driver:'Hocevar',      pts:27,ledLaps:0,  status:'Running'},
         {pos:15,car:'60', driver:'Preece',       pts:22,ledLaps:0,  status:'Running'},
       ]},
  33: {winner:'Reddick', p2:'Blaney', p3:'Elliott', polePos:'Blaney', stage1:'Logano', stage2:'Logano',
       note:'Blaney took pole and Logano swept both stages, but Reddick beat Blaney by 0.801s for his 6th win of 2026 and 14th career Cup win. Points leader Larson crashed out in 34th; Hamlin finished 28th, a lap down. Larson leads Bell by 5 with three races left.',
       totalLaps:312, stage1End:60, stage2End:185,
       // Top-15 classification from the official NASCAR.com results feed
       // (cf.nascar.com/cacher/2026/1/5633/weekend-feed.json), podium/pole/
       // stages cross-checked vs Wikipedia '2026 Freeway Insurance 500'.
       // pts = total race points (Heim, part-time No. 67, scores 0).
       Results:[
         {pos:1, car:'45', driver:'Reddick',      pts:61,ledLaps:18, status:'Running',time:'Winner'},
         {pos:2, car:'12', driver:'Blaney',       pts:48,ledLaps:51, status:'Running',time:'+0.801'},
         {pos:3, car:'9',  driver:'Elliott',      pts:39,ledLaps:0,  status:'Running'},
         {pos:4, car:'20', driver:'Bell',         pts:49,ledLaps:85, status:'Running'},
         {pos:5, car:'67', driver:'Heim',         pts:0,ledLaps:0,  status:'Running'},
         {pos:6, car:'22', driver:'Logano',       pts:51,ledLaps:84, status:'Running'},
         {pos:7, car:'7',  driver:'Suarez',       pts:30,ledLaps:0,  status:'Running'},
         {pos:8, car:'19', driver:'Briscoe',      pts:44,ledLaps:13, status:'Running'},
         {pos:9, car:'1',  driver:'Chastain',     pts:31,ledLaps:0,  status:'Running'},
         {pos:10,car:'54', driver:'Gibbs',        pts:27,ledLaps:2,  status:'Running'},
         {pos:11,car:'21', driver:'Berry',        pts:34,ledLaps:1,  status:'Running'},
         {pos:12,car:'77', driver:'Hocevar',      pts:25,ledLaps:0,  status:'Running'},
         {pos:13,car:'4',  driver:'Gragson',      pts:24,ledLaps:0,  status:'Running'},
         {pos:14,car:'34', driver:'Gilliland',    pts:25,ledLaps:0,  status:'Running'},
         {pos:15,car:'38', driver:'Smith',        pts:22,ledLaps:0,  status:'Running'},
       ]},
};

// 2026 Cup driver standings after Freeway Insurance 500 (R33 of 36, Chase
// race 7 of 10) — official NASCAR.com points feed (cf.nascar.com/cacher/2026/1/
// racinginsights-points-feed.json, fetched 2026-10-22), cross-checked vs
// Wikipedia season table (exact match P1–P35). 2026 Chase format: top 16 after R26 qualified with
// staggered starting points (no win-and-in, no playoff points, no round
// resets); P1–P16 therefore carry Chase totals (2,1xx–2,3xx) while P17+ keep
// raw season points — the large P16→P17 drop is official, not a data error.
// Official table lists 40 drivers; P36–P40 are part-timers outside
// NASCAR_CUP_DRIVERS and are omitted as before. Kyle Busch remains omitted
// (deceased) but stays in NASCAR_CUP_DRIVERS for R1–R12 results.
const NASCAR_CUP_STANDINGS=[
  {pos:1, driver:'Larson',        points:2370, gap:0},
  {pos:2, driver:'Bell',          points:2365, gap:-5},
  {pos:3, driver:'Briscoe',       points:2346, gap:-24},
  {pos:4, driver:'Hamlin',        points:2339, gap:-31},
  {pos:5, driver:'Blaney',        points:2330, gap:-40},
  {pos:6, driver:'Logano',        points:2326, gap:-44},
  {pos:7, driver:'Reddick',       points:2314, gap:-56},
  {pos:8, driver:'Cindric',       points:2240, gap:-130},
  {pos:9, driver:'Gibbs',         points:2238, gap:-132},
  {pos:10,driver:'Elliott',       points:2221, gap:-149},
  {pos:11,driver:'Hocevar',       points:2212, gap:-158},
  {pos:12,driver:'Wallace',       points:2208, gap:-162},
  {pos:13,driver:'Suarez',        points:2182, gap:-188},
  {pos:14,driver:'Byron',         points:2180, gap:-190},
  {pos:15,driver:'Buescher',      points:2166, gap:-204},
  {pos:16,driver:'Preece',        points:2159, gap:-211, cutline:true},
  {pos:17,driver:'van Gisbergen', points:729, gap:-1641},
  {pos:18,driver:'Keselowski',    points:683, gap:-1687},
  {pos:19,driver:'Chastain',      points:673, gap:-1697},
  {pos:20,driver:'McDowell',      points:616, gap:-1754},
  {pos:21,driver:'Jones',         points:607, gap:-1763},
  {pos:22,driver:'Berry',         points:584, gap:-1786},
  {pos:23,driver:'Gilliland',     points:582, gap:-1788},
  {pos:24,driver:'Allmendinger',  points:574, gap:-1796},
  {pos:25,driver:'Dillon',        points:540, gap:-1830},
  {pos:26,driver:'Smith',         points:523, gap:-1847},
  {pos:27,driver:'Bowman',        points:512, gap:-1858},
  {pos:28,driver:'Nemechek',      points:503, gap:-1867},
  {pos:29,driver:'Stenhouse Jr',  points:481, gap:-1889},
  {pos:30,driver:'Herbst',        points:470, gap:-1900},
  {pos:31,driver:'Gragson',       points:430, gap:-1940},
  {pos:32,driver:'Custer',        points:407, gap:-1963},
  {pos:33,driver:'Zilisch',       points:360, gap:-2010},
  {pos:34,driver:'Ty Dillon',     points:352, gap:-2018},
  {pos:35,driver:'Ware',          points:237, gap:-2133},
];

// Manufacturer wins after R33 — counted from race winners; matches the
// Wikipedia manufacturers' table (Toyota 18 / Chevrolet 8 / Ford 7).
const NASCAR_CUP_MFRS=[
  {pos:1, mfr:'Toyota',    wins:18, drivers:['Reddick (6)','Hamlin (4)','Briscoe (3)','Gibbs (2)','Heim (2)','Bell']},
  {pos:2, mfr:'Chevrolet', wins:8,  drivers:['Elliott (2)','van Gisbergen (2)','Larson (2)','Hocevar','Suarez']},
  {pos:3, mfr:'Ford',      wins:7,  drivers:['Blaney (3)','Logano (3)','Preece']},
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
  if(currentNascarSeries==='trucks')return renderNascarTrucksLive();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','live')+renderBackToSeriesHome('nascar');
  content.innerHTML=top+renderLiveOffAir('no-session',nascarOffAirContext());
  const lastRound=Object.keys(NASCAR_CUP_RESULTS).sort((a,b)=>parseInt(b)-parseInt(a))[0];
  setStats('—','—','STANDBY',lastRound?`R${lastRound}`:'—');
}

// ── NASCAR RACE RESULTS ───────────────────────────────────────────────────────
function renderNascarRaces(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityRaces();
  if(currentNascarSeries==='trucks')return renderNascarTrucksRaces();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','races')+renderBackToSeriesHome('nascar');
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
  if(currentNascarSeries==='trucks')return renderNascarTrucksStandings();
  const content=document.getElementById('main-content');
  const hdr=`<div class="section-title"><span>Cup Drivers · 2026 · After R33 Phoenix</span><span>Top 16 = Chase</span></div>`;
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
  setStats(`${NASCAR_CUP_STANDINGS[0].points} pts`,NASCAR_CUP_STANDINGS[0].driver,'DRIVERS','R33/36');
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
  if(currentNascarSeries==='trucks')return renderNascarTrucksStandings();
  const content=document.getElementById('main-content');
  const hdr=`<div class="section-title"><span>Cup Manufacturers · 2026 · After R33</span><span>Wins through Phoenix</span></div>`;
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
  setStats(`${NASCAR_CUP_MFRS[0].wins} wins`,NASCAR_CUP_MFRS[0].mfr,'MFRS','R33/36');
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
  if(currentNascarSeries==='trucks')return renderNascarTrucksStandings();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','standings')+renderBackToSeriesHome('nascar');
  renderNascarDrivers();
  const driversHTML=content.innerHTML;
  renderNascarMfrs();
  const mfrsHTML=content.innerHTML;
  content.innerHTML=top+driversHTML+mfrsHTML;
}

// Per-round official extended highlights from the NASCAR YouTube channel
// (oEmbed author_name exactly "NASCAR"; FOX/NBC uploads rejected). IDs
// oEmbed-verified + embed-page checked 2026-06-12; thumbs hand-picked from
// the auto-captured frames (R9/R13 had no clean on-track frame — flagged).
const NASCAR_CUP_HIGHLIGHTS={
  1: {id:'fy8eGJ7qzMc',thumb:'https://i.ytimg.com/vi/fy8eGJ7qzMc/hq2.jpg'},
  2: {id:'h6NRbydlp9w',thumb:'https://i.ytimg.com/vi/h6NRbydlp9w/hq1.jpg'},
  3: {id:'otwwnGChIIY',thumb:'https://i.ytimg.com/vi/otwwnGChIIY/hq2.jpg'},
  4: {id:'6AEmtZR4rsQ',thumb:'https://i.ytimg.com/vi/6AEmtZR4rsQ/hq1.jpg'},
  5: {id:'QiPbZV4zRpo',thumb:'https://i.ytimg.com/vi/QiPbZV4zRpo/hq1.jpg'},
  6: {id:'_oz2J1uO3Is',thumb:'https://i.ytimg.com/vi/_oz2J1uO3Is/hq2.jpg'},
  7: {id:'jpS7hpTwmdc',thumb:'https://i.ytimg.com/vi/jpS7hpTwmdc/hq2.jpg'},
  8: {id:'MQHry_BnlzY',thumb:'https://i.ytimg.com/vi/MQHry_BnlzY/hq1.jpg'},
  9: {id:'M_N_08SXrzg',thumb:'https://i.ytimg.com/vi/M_N_08SXrzg/maxresdefault.jpg'},
  10:{id:'N3bQ47dG0wU',thumb:'https://i.ytimg.com/vi/N3bQ47dG0wU/hq2.jpg'},
  11:{id:'BtL_H0RvQfA',thumb:'https://i.ytimg.com/vi/BtL_H0RvQfA/hq1.jpg'},
  12:{id:'laxcGBfCXVc',thumb:'https://i.ytimg.com/vi/laxcGBfCXVc/hq3.jpg'},
  13:{id:'a_6CpnBk-uQ',thumb:'https://i.ytimg.com/vi/a_6CpnBk-uQ/hq3.jpg'},
  14:{id:'eXY2SBiRdfU',thumb:'https://i.ytimg.com/vi/eXY2SBiRdfU/hq2.jpg'},
  15:{id:'W27WZJir37g',thumb:'https://i.ytimg.com/vi/W27WZJir37g/hq3.jpg'},
};

// Season Highlights — one card per completed Cup race with the verified
// official video (lite-YouTube thumb via txHighlightSlotHTML); rounds without
// a verified video keep the TODO placeholder. IDs follow
// `highlights-nascar-r{round}-{trackSlug}` for race-row deep links.
function renderNascarHighlights(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinityHighlights();
  if(currentNascarSeries==='trucks')return renderNascarTrucksHighlights();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','highlights')+renderBackToSeriesHome('nascar');
  // Newest-round-first so the most recent race is at the top of the list.
  const completed=NASCAR_CUP_SCHEDULE.filter(s=>NASCAR_CUP_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=NASCAR_CUP_RESULTS[s.round];
    const winInfo=nascarDrv(res.winner);
    const slug=nascarTrackSlug(s.track);
    const id=`highlights-nascar-r${s.round}-${slug}`;
    const vid=NASCAR_CUP_HIGHLIGHTS[s.round];
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
      <div class="tx-highlights-header-title">NASCAR 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps and key moments. Videos are added after verification — placeholders shown for races without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

function renderNascarSchedule(){
  if(currentNascarSeries==='xfinity')return renderNascarXfinitySchedule();
  if(currentNascarSeries==='trucks')return renderNascarTrucksSchedule();
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','schedule')+renderBackToSeriesHome('nascar');
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
