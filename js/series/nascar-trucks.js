// ═══════════════════════════════════════════════════════════════════════════
// ── NASCAR TRUCKS MODULE ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// Craftsman Truck Series 2026 — sibling module to nascar-xfinity.js, built
// 2026-06-12 (all-series buildout, Phase 2). Dispatch is wired at the top of
// each renderNascar* function in nascar.js (currentNascarSeries==='trucks').
//
// Data current through R12 Michigan (2026-06-06). Sources (fetched +
// cross-checked 2026-06-12; per-race URLs in the Phase-2 commit body):
//   https://en.wikipedia.org/wiki/2026_NASCAR_Craftsman_Truck_Series
//     (schedule, standings, teams, manufacturer column)
//   Individual Wikipedia race pages R1–R12 (winners, podiums, poles)
//   NASCAR.com winners gallery/recaps + racingnews.co race results
//     (winner cross-checks for all 12 rounds; R5/R8/R10/R12 podiums)
// Cardinal rule notes:
//   - Standings truncated at P26: Wikipedia's tail (to P68) could not be
//     cross-checked and contained suspect one-off names. Top 15 cross-checked
//     against racingnews.co points gaps (exact match).
//   - 2026 has a FOURTH manufacturer: Ram (Kaulig Racing) — no wins yet.
//   - R5 Rockingham results are post-DQ (C. Smith disqualified from 4th).
//   - Corey Heim is part-time (Cup, 23XI) — 3 wins but championship-
//     ineligible, hence P11 in points.
//   - Kyle Busch's R9 Dover win (his 69th) was his final victory; he died
//     2026-05-21. He remains in roster + results per the Cup-side precedent.

const MFR_COLOR_TRUCKS_RAM='#94002D'; // Ram brand red (styling only)
function nascarTrucksMfrColor(m){return m==='Ram'?MFR_COLOR_TRUCKS_RAM:nascarMfrColor(m);}

// Roster — every driver appearing in results or standings. Teams from the
// Wikipedia season page + race pages; '(part-time)' suffixes dropped. '—' =
// unverifiable (LaJoie: conflicting summaries). Several trucks are shared
// (Spire #7: Busch/Mosack/Day/Caruth; Tricon #1: Heim/Crews; HFR #62:
// Nemechek/Bell) — numbers reflect each driver's verified race-page entry.
const NASCAR_TRUCKS_DRIVERS={
  'Riggs':         {first:'Layne',      team:'Front Row Motorsports',     mfr:'Ford',      num:34},
  'Honeycutt':     {first:'Kaden',      team:'Tricon Garage',             mfr:'Toyota',    num:11},
  'Smith':         {first:'Chandler',   team:'Front Row Motorsports',     mfr:'Ford',      num:38},
  'Ruggiero':      {first:'Gio',        team:'Tricon Garage',             mfr:'Toyota',    num:17},
  'Eckes':         {first:'Christian',  team:'McAnally-Hilgemann Racing', mfr:'Chevrolet', num:91},
  'Rhodes':        {first:'Ben',        team:'ThorSport Racing',          mfr:'Ford',      num:99},
  'Majeski':       {first:'Ty',         team:'ThorSport Racing',          mfr:'Ford',      num:88},
  'Ankrum':        {first:'Tyler',      team:'McAnally-Hilgemann Racing', mfr:'Chevrolet', num:18},
  'Hemric':        {first:'Daniel',     team:'McAnally-Hilgemann Racing', mfr:'Chevrolet', num:19},
  'Garcia':        {first:'Jake',       team:'ThorSport Racing',          mfr:'Ford',      num:98},
  'Heim':          {first:'Corey',      team:'Tricon Garage',             mfr:'Toyota',    num:1},
  'Friesen':       {first:'Stewart',    team:'Halmar Friesen Racing',     mfr:'Toyota',    num:52},
  'Enfinger':      {first:'Grant',      team:'CR7 Motorsports',           mfr:'Chevrolet', num:9},
  'Queen':         {first:'Brenden',    team:'Kaulig Racing',             mfr:'Ram',       num:12},
  'Haley':         {first:'Justin',     team:'Kaulig Racing',             mfr:'Ram',       num:16},
  'Busch':         {first:'Kyle',       team:'Spire Motorsports',         mfr:'Chevrolet', num:7},
  'Bell':          {first:'Christopher',team:'Halmar Friesen Racing',     mfr:'Toyota',    num:62},
  'Hocevar':       {first:'Carson',     team:'Spire Motorsports',         mfr:'Chevrolet', num:77},
  'Mosack':        {first:'Connor',     team:'Spire Motorsports',         mfr:'Chevrolet', num:7},
  'Chastain':      {first:'Ross',       team:'Niece Motorsports',         mfr:'Chevrolet', num:45},
  'Crews':         {first:'Brent',      team:'Tricon Garage',             mfr:'Toyota',    num:1},
  'Zilisch':       {first:'Connor',     team:'Spire Motorsports',         mfr:'Chevrolet', num:71},
  'van Gisbergen': {first:'Shane',      team:'Niece Motorsports',         mfr:'Chevrolet', num:4},
  'Day':           {first:'Corey',      team:'Spire Motorsports',         mfr:'Chevrolet', num:7},
  'Caruth':        {first:'Rajah',      team:'Spire Motorsports',         mfr:'Chevrolet', num:7},
  'Nemechek':      {first:'John Hunter',team:'Halmar Friesen Racing',     mfr:'Toyota',    num:62},
  'Pérez de Lara': {first:'Andrés',     team:'Niece Motorsports',         mfr:'Chevrolet', num:44},
  'Gray':          {first:'Tanner',     team:'Tricon Garage',             mfr:'Toyota',    num:15},
  'Sutton':        {first:'Dawson',     team:'Rackley W.A.R.',            mfr:'Chevrolet', num:26},
  'Tyrrell':       {first:'Mini',       team:'Kaulig Racing',             mfr:'Ram',       num:14},
  'LaJoie':        {first:'Corey',      team:'—',                         mfr:'—',         num:'—'},
  'Butcher':       {first:'Cole',       team:'ThorSport Racing',          mfr:'Ford',      num:13},
  'Wright':        {first:'Kris',       team:'McAnally-Hilgemann Racing', mfr:'Chevrolet', num:81},
  'Muniz':         {first:'Frankie',    team:'Team Reaume',               mfr:'Ford',      num:33},
  'Dye':           {first:'Daniel',     team:'Kaulig Racing',             mfr:'Ram',       num:10},
  'Boyd':          {first:'Spencer',    team:'Freedom Racing Enterprises',mfr:'Chevrolet', num:76},
};

// 2026 schedule (R1–R25) — verified from the Wikipedia season page.
// Playoffs (chase): R19–R25. type 'R' = road/street course.
const NASCAR_TRUCKS_SCHEDULE=[
  {round:1, race:'Fresh From Florida 250',               track:'Daytona International Speedway',      country:'🇺🇸', date:'2026-02-13'},
  {round:2, race:'Fr8 208',                              track:'EchoPark Speedway (Atlanta)',         country:'🇺🇸', date:'2026-02-21'},
  {round:3, race:'OnlyBulls Green Flag 150',             track:'St. Petersburg Street Circuit',       country:'🇺🇸', date:'2026-02-28', type:'R'},
  {round:4, race:'Buckle Up South Carolina 200',         track:'Darlington Raceway',                  country:'🇺🇸', date:'2026-03-20'},
  {round:5, race:"Black's Tire 200",                     track:'Rockingham Speedway',                 country:'🇺🇸', date:'2026-04-03'},
  {round:6, race:'Tennessee Army National Guard 250',    track:'Bristol Motor Speedway',              country:'🇺🇸', date:'2026-04-10'},
  {round:7, race:'SpeedyCash.com 250',                   track:'Texas Motor Speedway',                country:'🇺🇸', date:'2026-05-01'},
  {round:8, race:'Bully Hill Vineyards 176 at The Glen', track:'Watkins Glen International',          country:'🇺🇸', date:'2026-05-08', type:'R'},
  {round:9, race:'Ecosave 200',                          track:'Dover Motor Speedway',                country:'🇺🇸', date:'2026-05-15'},
  {round:10,race:'North Carolina Education Lottery 200', track:'Charlotte Motor Speedway',            country:'🇺🇸', date:'2026-05-24'},
  {round:11,race:'Allegiance 200',                       track:'Nashville Superspeedway',             country:'🇺🇸', date:'2026-05-29'},
  {round:12,race:'DQS Solutions & Staffing 250',         track:'Michigan International Speedway',     country:'🇺🇸', date:'2026-06-06'},
  {round:13,race:'Navy 250',                             track:'Qualcomm Circuit (San Diego)',        country:'🇺🇸', date:'2026-06-19', type:'R'},
  {round:14,race:'LiUNA! 150',                           track:'Lime Rock Park',                      country:'🇺🇸', date:'2026-07-11', type:'R'},
  {round:15,race:'FaithFest 250',                        track:'North Wilkesboro Speedway',           country:'🇺🇸', date:'2026-07-18'},
  {round:16,race:'TSport 200',                           track:'Lucas Oil Indianapolis Raceway Park', country:'🇺🇸', date:'2026-07-24'},
  {round:17,race:'eero 250',                             track:'Richmond Raceway',                    country:'🇺🇸', date:'2026-08-14'},
  {round:18,race:'Team EJP 175',                         track:'New Hampshire Motor Speedway',        country:'🇺🇸', date:'2026-08-22'},
  {round:19,race:'UNOH 250',                             track:'Bristol Motor Speedway',              country:'🇺🇸', date:'2026-09-17', chase:true},
  {round:20,race:'Heart of Health Care 200',             track:'Kansas Speedway',                     country:'🇺🇸', date:'2026-09-26', chase:true},
  {round:21,race:'Ecosave 200',                          track:'Charlotte Motor Speedway',            country:'🇺🇸', date:'2026-10-09', chase:true},
  {round:22,race:'Craftsman 150',                        track:'Phoenix Raceway',                     country:'🇺🇸', date:'2026-10-16', chase:true},
  {round:23,race:"Love's RV Stop 225",                   track:'Talladega Superspeedway',             country:'🇺🇸', date:'2026-10-23', chase:true},
  {round:24,race:'Slim Jim 200',                         track:'Martinsville Speedway',               country:'🇺🇸', date:'2026-10-30', chase:true},
  {round:25,race:'Baptist Health 200',                   track:'Homestead-Miami Speedway',            country:'🇺🇸', date:'2026-11-06', chase:true},
];

// Completed rounds 1–12. Winners multi-source for all rounds (Wikipedia race
// pages + NASCAR.com recaps/gallery snippets and/or racingnews.co); podiums
// for R5/R8/R10/R12 dual-source, others single-source Wikipedia race pages.
const NASCAR_TRUCKS_RESULTS={
  1: {winner:'Smith',     p2:'Ruggiero',  p3:'Eckes',         polePos:'Majeski',   note:'Chandler Smith won in overtime with a four-wide tri-oval pass on the final lap. Record 32 lead changes among 12 drivers.'},
  2: {winner:'Busch',     p2:'Hocevar',   p3:'Ruggiero',      polePos:'Garcia',    note:"Kyle Busch survived late chaos and led the final 7 laps for his 68th career Truck win — a third straight Atlanta truck victory."},
  3: {winner:'Riggs',     p2:'Majeski',   p3:'Rhodes',        polePos:'Mosack',    note:"Layne Riggs started from the rear, won Stage 2, led a race-high 41 laps and held off Rhodes and Majeski on fuel mileage in the series' first St. Petersburg street race."},
  4: {winner:'Heim',      p2:'Chastain',  p3:'Eckes',         polePos:'Honeycutt', note:'Corey Heim passed Ross Chastain in the final corner of double overtime on fresher tires for his 24th career win.'},
  5: {winner:'Heim',      p2:'Honeycutt', p3:'Riggs',         polePos:'Garcia',    note:'Heim swept all three stages and led all but 22 laps at Rockingham. Chandler Smith was disqualified from 4th post-race, costing him the points lead.'},
  6: {winner:'Bell',      p2:'Smith',     p3:'Ruggiero',      polePos:'Honeycutt', note:'Cup regular Christopher Bell led the final 63 laps for his 8th career Truck win after a controversial lap-179 collision between dominant leader Eckes (132 laps led) and Heim.'},
  7: {winner:'Hocevar',   p2:'Busch',     p3:'Honeycutt',     polePos:'Rhodes',    note:'Hocevar won Stage 2, led a race-high 76 laps and overcame late pit-road trouble in a chaotic final stage with two red flags — first win of 2026.'},
  8: {winner:'Honeycutt', p2:'Zilisch',   p3:'van Gisbergen', polePos:'Crews',     note:'Kaden Honeycutt took the lead from Zilisch on the final overtime restart for his first career Truck win, hours after also winning the ARCA race at the Glen.'},
  9: {winner:'Busch',     p2:'Majeski',   p3:'Riggs',         polePos:'Busch',     note:'Kyle Busch swept both stages and led 147 of 200 laps from pole — his 69th and final Truck Series win. Busch died on May 21, 2026, at age 41.'},
  10:{winner:'Riggs',     p2:'Honeycutt', p3:'Zilisch',       polePos:'Day',       note:'Riggs led 52 of 110 laps and held off Honeycutt late in a wreck-filled race that set a Charlotte truck-race caution record.'},
  11:{winner:'Riggs',     p2:'Caruth',    p3:'Smith',         polePos:'Riggs',     note:'Riggs dominated from pole, swept all three stages and led a race-high 99 laps, holding off Rajah Caruth in a final-lap thriller — second straight win.'},
  12:{winner:'Heim',      p2:'Honeycutt', p3:'Hocevar',       polePos:'Majeski',   note:'Heim made a late pass on Hocevar and led the final 15 laps, holding off Tricon teammate Honeycutt for his third win of the season. Bell won both stages.'},
};

// Driver points after R12 Michigan (2026-06-06) — Wikipedia season page;
// top 15 cross-checked against racingnews.co points gaps (exact match).
// Truncated at P26 (see header). gap = points − leader points.
// Heim (P11) has 3 wins but is championship-ineligible (part-time).
const NASCAR_TRUCKS_STANDINGS=[
  {pos:1, driver:'Riggs',         points:497, gap:0},
  {pos:2, driver:'Honeycutt',     points:471, gap:-26},
  {pos:3, driver:'Smith',         points:407, gap:-90},
  {pos:4, driver:'Ruggiero',      points:383, gap:-114},
  {pos:5, driver:'Eckes',         points:379, gap:-118},
  {pos:6, driver:'Rhodes',        points:316, gap:-181},
  {pos:7, driver:'Majeski',       points:312, gap:-185},
  {pos:8, driver:'Ankrum',        points:283, gap:-214},
  {pos:9, driver:'Hemric',        points:278, gap:-219},
  {pos:10,driver:'Garcia',        points:278, gap:-219},
  {pos:11,driver:'Heim',          points:274, gap:-223},
  {pos:12,driver:'Friesen',       points:269, gap:-228},
  {pos:13,driver:'Enfinger',      points:256, gap:-241},
  {pos:14,driver:'Queen',         points:242, gap:-255},
  {pos:15,driver:'Haley',         points:230, gap:-267},
  {pos:16,driver:'Pérez de Lara', points:225, gap:-272},
  {pos:17,driver:'Gray',          points:221, gap:-276},
  {pos:18,driver:'Sutton',        points:186, gap:-311},
  {pos:19,driver:'Tyrrell',       points:175, gap:-322},
  {pos:20,driver:'LaJoie',        points:158, gap:-339},
  {pos:21,driver:'Butcher',       points:155, gap:-342},
  {pos:22,driver:'Wright',        points:143, gap:-354},
  {pos:23,driver:'Muniz',         points:134, gap:-363},
  {pos:24,driver:'Mosack',        points:122, gap:-375},
  {pos:25,driver:'Dye',           points:117, gap:-380},
  {pos:26,driver:'Boyd',          points:114, gap:-383},
];

// Manufacturer wins after R12 — derived from the verified winners above;
// manufacturer column cross-checked on the Wikipedia season page. Ram
// (Kaulig Racing) is new for 2026 and winless so far — included at 0 so the
// fourth manufacturer is visible.
const NASCAR_TRUCKS_MFRS=[
  {pos:1, mfr:'Toyota',    wins:5, drivers:['Heim (3)','Bell','Honeycutt']},
  {pos:2, mfr:'Ford',      wins:4, drivers:['Riggs (3)','Smith']},
  {pos:3, mfr:'Chevrolet', wins:3, drivers:['Busch (2)','Hocevar']},
  {pos:4, mfr:'Ram',       wins:0, drivers:[]},
];

// ── TRUCKS HELPERS ────────────────────────────────────────────────────────────
function nascarTrucksDrv(lastName){return NASCAR_TRUCKS_DRIVERS[lastName]||{first:'',team:'—',mfr:'—',num:'—'};}

function nascarTrucksProgressLabel(){
  const rounds=Object.keys(NASCAR_TRUCKS_RESULTS).map(Number);
  if(!rounds.length)return 'No completed races yet';
  const last=Math.max(...rounds);
  const sched=NASCAR_TRUCKS_SCHEDULE.find(s=>s.round===last);
  const trackShort=sched?sched.track.split(' ').slice(0,2).join(' '):'';
  return `After R${last}${trackShort?` ${trackShort}`:''}`;
}

function renderNascarTrucksNextBanner(){
  const now=new Date();
  const next=NASCAR_TRUCKS_SCHEDULE.find(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Race · Round ${next.round}${next.type==='R'?' · ROAD/STREET':''}${next.chase?' · 🏆 PLAYOFFS':''}</div>
      <div class="next-race-name">${next.country} ${next.race}</div>
      <div class="next-race-circuit">${next.track}</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

function nascarTrucksOffAirContext(){
  const lastCompleted=Object.entries(NASCAR_TRUCKS_RESULTS).sort((a,b)=>parseInt(b[0])-parseInt(a[0]))[0];
  if(!lastCompleted)return{series:'nascar',races:{},banner:renderNascarTrucksNextBanner(),seriesLabel:'TRUCKS',viewTab:'races',switchFn:'switchNascarTab'};
  const [round,res]=lastCompleted;
  const sched=NASCAR_TRUCKS_SCHEDULE.find(s=>s.round===parseInt(round));
  const winInfo=nascarTrucksDrv(res.winner), p2Info=res.p2?nascarTrucksDrv(res.p2):null, p3Info=res.p3?nascarTrucksDrv(res.p3):null;
  const fakeRaces={[round]:{round,raceName:sched.race,date:sched.date,
    Circuit:{circuitName:sched.track,Location:{country:sched.country}},
    Results:[
      {Driver:{familyName:res.winner,nationality:'American'},Constructor:{name:winInfo.mfr}},
      res.p2?{Driver:{familyName:res.p2,nationality:'American'},Constructor:{name:p2Info.mfr}}:{Driver:{familyName:'—'},Constructor:{name:'—'}},
      res.p3?{Driver:{familyName:res.p3,nationality:'American'},Constructor:{name:p3Info.mfr}}:{Driver:{familyName:'—'},Constructor:{name:'—'}},
    ]}};
  return{series:'nascar',races:fakeRaces,banner:renderNascarTrucksNextBanner(),seriesLabel:'TRUCKS',lastLabel:`Last Race · Round ${round}`,viewTab:'races',switchFn:'switchNascarTab'};
}

// ── TRUCKS LIVE (off-air view) ────────────────────────────────────────────────
function renderNascarTrucksLive(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','live')+renderBackToSeriesHome('nascar');
  content.innerHTML=top+renderLiveOffAir('no-session',nascarTrucksOffAirContext());
  const lastRound=Object.keys(NASCAR_TRUCKS_RESULTS).sort((a,b)=>parseInt(b)-parseInt(a))[0];
  setStats('—','—','STANDBY',lastRound?`R${lastRound}`:'—');
}

// ── TRUCKS RACE RESULTS ───────────────────────────────────────────────────────
function renderNascarTrucksRaces(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','races')+renderBackToSeriesHome('nascar');
  const banner=renderNascarTrucksNextBanner();
  const completed=NASCAR_TRUCKS_SCHEDULE.filter(s=>NASCAR_TRUCKS_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const total=NASCAR_TRUCKS_SCHEDULE.length;
  const rows=completed.map(s=>{
    const res=NASCAR_TRUCKS_RESULTS[s.round];
    const w=nascarTrucksDrv(res.winner);
    const isSelected=selectedNascarRace&&selectedNascarRace.round===s.round;
    const slug=nascarTrackSlug(s.track);
    const hlId=`highlights-nascar-trucks-r${s.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectNascarRace(${s.round})">
      <div class="round-badge"><div class="round-num">${s.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${s.country}${s.type==='R'?' · 🛣 RC':''}</div>
        <div class="race-item-name">${s.race}</div>
        <div class="race-item-date">${fmtDate(s.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('nascar','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag" style="color:${nascarTrucksMfrColor(w.mfr)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${w.num}</span>
        <div class="winner-name">${res.winner}</div>
        <div class="winner-team">${w.mfr}</div>
      </div>
    </div>`;
  }).join('');
  let html=top+banner+`<div class="section-title"><span>2026 Truck Series · ${completed.length} of ${total} races</span><span>Tap for details</span></div>`+rows;
  if(selectedNascarRace&&NASCAR_TRUCKS_RESULTS[selectedNascarRace.round]){
    html+=buildNascarTrucksRaceDetailHTML(selectedNascarRace.round);
  }
  content.innerHTML=html;
  setStats('—','—','RACE',`${completed.length}/${total}`);
  if(selectedNascarRace){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

function buildNascarTrucksRaceDetailHTML(round){
  const sched=NASCAR_TRUCKS_SCHEDULE.find(s=>s.round===round);
  const res=NASCAR_TRUCKS_RESULTS[round];
  if(!sched||!res)return'';
  const w=nascarTrucksDrv(res.winner);
  const p2=res.p2?nascarTrucksDrv(res.p2):null;
  const p3=res.p3?nascarTrucksDrv(res.p3):null;
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.race}</div>
    <div class="results-race-sub">${sched.track} · Round ${sched.round}${sched.type==='R'?' · Road/Street Course':''}
    ${res.polePos?`<br>🏁 Pole: ${res.polePos}`:''}
    </div>
  </div>`;
  let podium;
  if(p2&&p3){
    podium=`<div class="podium-bar">
      <div class="podium-item p2-item">
        <div class="podium-pos">🥈 P2</div>
        <div class="podium-name">${res.p2}</div>
        <div class="podium-team">${p2.team}</div>
        <div class="podium-gap" style="color:${nascarTrucksMfrColor(p2.mfr)}">${p2.mfr}</div>
      </div>
      <div class="podium-item p1-item">
        <div class="podium-pos">🏆 WINNER</div>
        <div class="podium-name">${res.winner}</div>
        <div class="podium-team">${w.team}</div>
        <div class="podium-gap" style="color:${nascarTrucksMfrColor(w.mfr)}">${w.mfr}</div>
      </div>
      <div class="podium-item p3-item">
        <div class="podium-pos">🥉 P3</div>
        <div class="podium-name">${res.p3}</div>
        <div class="podium-team">${p3.team}</div>
        <div class="podium-gap" style="color:${nascarTrucksMfrColor(p3.mfr)}">${p3.mfr}</div>
      </div>
    </div>`;
  }else{
    podium=`<div style="padding:18px;background:var(--surface2);border-bottom:1px solid var(--border);text-align:center;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--yellow);letter-spacing:0.12em;margin-bottom:6px;">🏆 RACE WINNER</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:var(--white);">#${w.num} ${res.winner}</div>
      <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--muted);margin-top:3px;">${w.team} · <span style="color:${nascarTrucksMfrColor(w.mfr)};font-weight:700;">${w.mfr}</span></div>
    </div>`;
  }
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RACE NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+podium+notes;
}

// ── TRUCKS STANDINGS (drivers + mfrs stacked) ─────────────────────────────────
function renderNascarTrucksStandings(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','standings')+renderBackToSeriesHome('nascar');
  const progress=nascarTrucksProgressLabel();
  const hdr=`<div class="section-title"><span>Truck Drivers · 2026 · ${progress}</span><span>Top 10 = Playoffs</span></div>`;
  const note=`<div style="padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--border);font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);line-height:1.5;">
    Standings shown through P26 (verified); Heim (P11) has 3 wins but is championship-ineligible as a part-time entry.
  </div>`;
  const rows=NASCAR_TRUCKS_STANDINGS.map(d=>{
    const info=nascarTrucksDrv(d.driver);
    const inPlayoffs=d.pos<=10;
    const gapText=d.pos===1?'LEADER':`${d.gap}`;
    const posColor=d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':inPlayoffs?'var(--text)':'var(--muted)';
    return`<div>
      <div class="champ-row">
        <div class="champ-pos" style="color:${posColor}">${d.pos}</div>
        <div class="flag-cell" style="color:${nascarTrucksMfrColor(info.mfr)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${info.num}</div>
        <div>
          <div class="champ-name">${d.driver}</div>
          <div class="champ-team-sm" style="color:${nascarTrucksMfrColor(info.mfr)}">${info.team}</div>
        </div>
        <div class="champ-pts">${d.points}</div>
        <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${gapText}</div>
      </div>
      ${d.pos===10?`<div style="padding:6px 16px;background:#1a0005;border-top:1px solid var(--red);border-bottom:1px solid var(--red);font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--red);letter-spacing:0.15em;text-align:center;font-weight:700;">— PLAYOFF CUTLINE —</div>`:''}
    </div>`;
  }).join('');
  const mfrHdr=`<div class="section-title"><span>Truck Manufacturers · Wins</span><span>${nascarTrucksProgressLabel().replace('After ','After ')}</span></div>`;
  const mfrRows=NASCAR_TRUCKS_MFRS.map(m=>`<div class="champ-row">
      <div class="champ-pos" style="color:${m.pos===1?'var(--yellow)':m.pos===2?'#c0c0c0':m.pos===3?'#cd7f32':'var(--muted)'}">${m.pos}</div>
      <div class="flag-cell" style="color:${nascarTrucksMfrColor(m.mfr)};font-size:18px;">●</div>
      <div>
        <div class="champ-name" style="color:${nascarTrucksMfrColor(m.mfr)};">${m.mfr}</div>
        <div class="champ-team-sm">${m.drivers.length?m.drivers.join(', '):'No wins yet'}</div>
      </div>
      <div class="champ-pts" style="color:${nascarTrucksMfrColor(m.mfr)};">${m.wins}</div>
      <div class="champ-gap">WINS</div>
    </div>`).join('');
  content.innerHTML=top+hdr+note+rows+mfrHdr+mfrRows;
  setStats(`${NASCAR_TRUCKS_STANDINGS[0].points} pts`,NASCAR_TRUCKS_STANDINGS[0].driver,'DRIVERS',`R12/25`);
}

// ── TRUCKS HIGHLIGHTS ─────────────────────────────────────────────────────────
// {round: {id, thumb}} — populated in Phase 3 after channel verification.
const NASCAR_TRUCKS_HIGHLIGHTS={};
function renderNascarTrucksHighlights(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','highlights')+renderBackToSeriesHome('nascar');
  const completed=NASCAR_TRUCKS_SCHEDULE.filter(s=>NASCAR_TRUCKS_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=NASCAR_TRUCKS_RESULTS[s.round];
    const winInfo=nascarTrucksDrv(res.winner);
    const slug=nascarTrackSlug(s.track);
    const id=`highlights-nascar-trucks-r${s.round}-${slug}`;
    const vid=NASCAR_TRUCKS_HIGHLIGHTS[s.round];
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
      <div class="tx-highlights-header-title">Trucks 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps and key moments. Videos are added after verification — placeholders shown for races without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

// ── TRUCKS SCHEDULE ───────────────────────────────────────────────────────────
function renderNascarTrucksSchedule(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('nascar','schedule')+renderBackToSeriesHome('nascar');
  const now=new Date();
  const upcoming=NASCAR_TRUCKS_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more Truck races on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const hdr=`<div class="section-title"><span>Trucks 2026 · ${upcoming.length} Upcoming</span><span>Through R${upcoming[upcoming.length-1].round}</span></div>`;
  const rows=upcoming.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'-';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country}${r.type==='R'?' · RC':''}${r.chase?' · PLAYOFFS':''}</div>
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
// ── END NASCAR TRUCKS ─────────────────────────────────────────────────────────
