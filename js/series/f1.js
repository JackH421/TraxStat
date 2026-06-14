const SEEDED_FASTEST_LAPS={
  2:{'antonelli':{time:'1:35.275',lap:'52',rank:'1'}},
  3:{'antonelli':{time:'1:32.432',lap:'49',rank:'1'}},
  4:{'norris':{time:'1:31.869',lap:'35',rank:'1'}},
  5:{'antonelli':{time:'1:14.210',lap:'68',rank:'1'}},
  6:{'antonelli':{time:'1:13.481',lap:'76',rank:'1'}},
};

// ── NEXT RACE ─────────────────────────────────────────────────────────────────
const NEXT_RACES=[
  {round:7,name:'Spanish Grand Prix',circuit:'Circuit de Barcelona-Catalunya',country:'🇪🇸',date:'2026-06-14'},
  {round:8,name:'Austrian Grand Prix',circuit:'Red Bull Ring',country:'🇦🇹',date:'2026-06-28'},
  {round:9,name:'British Grand Prix',circuit:'Silverstone Circuit',country:'🇬🇧',date:'2026-07-05',sprint:true},
  {round:10,name:'Belgian Grand Prix',circuit:'Circuit de Spa-Francorchamps',country:'🇧🇪',date:'2026-07-19'},
  {round:11,name:'Hungarian Grand Prix',circuit:'Hungaroring',country:'🇭🇺',date:'2026-07-26'},
];

// Hardcoded race start/end UTC times per round. Needed because (a) OpenF1
// paywalls their API during live sessions ("Live F1 session in progress.
// Global API access is restricted to authenticated users until the session
// ends"), and (b) the legacy 13:00 UTC heuristic in findPostRaceRound is
// wrong for North-American races. Times verified from OpenF1 pre-session
// (or F1.com schedule); add more as the season progresses.
const F1_RACE_TIMES_UTC={
  5:{start:'20:00',end:'22:00'},  // Canadian GP — Sun 2026-05-24
};

function renderNextBanner(){
  const now=new Date();
  const next=NEXT_RACES.find(r=>new Date(r.date+'T13:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Race · Round ${next.round}${next.sprint?' · SPRINT WEEKEND':''}</div>
      <div class="next-race-name">${next.country} ${next.name}</div>
      <div class="next-race-circuit">${next.circuit}</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

// ── HARDCODED RACES — REAL VERIFIED 2026 RESULTS ─────────────────────────────
// All four rounds hardcoded with FIA-confirmed classifications.
// Sources: F1.com official results, Wikipedia race pages, FIA classification PDFs.
// Sprint results stored separately and merged into per-race points breakdown below.
const HARDCODED_RACES={
  1:{round:'1',raceName:'Australian Grand Prix',date:'2026-03-08',Circuit:{circuitName:'Albert Park Circuit',Location:{country:'🇦🇺'}},
    Results:[
      {position:'1',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'25',laps:'58',Time:{time:'Winner'},status:'Finished'},
      {position:'2',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'18',laps:'58',Time:{time:'+2.974'},status:'Finished'},
      {position:'3',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'15',laps:'58',Time:{time:'+15.519'},status:'Finished'},
      {position:'4',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'12',laps:'58',Time:{time:'+16.144'},status:'Finished'},
      {position:'5',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'10',laps:'58',Time:{time:'+51.741'},status:'Finished'},
      {position:'6',Driver:{driverId:'verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'8',laps:'58',Time:{time:'+54.617'},status:'Finished'},
      {position:'7',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'6',laps:'57',status:'+1 Lap'},
      {position:'8',Driver:{driverId:'lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'4',laps:'57',status:'+1 Lap'},
      {position:'9',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'2',laps:'57',status:'+1 Lap'},
      {position:'10',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine'},points:'1',laps:'57',status:'+1 Lap'},
      {position:'11',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'57',status:'+1 Lap'},
      {position:'12',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'0',laps:'57',status:'+1 Lap'},
      {position:'13',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'0',laps:'57',status:'+1 Lap'},
      {position:'14',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine'},points:'0',laps:'56',status:'+2 Laps'},
      {position:'15',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'0',laps:'56',status:'+2 Laps'},
      {position:'16',Driver:{driverId:'perez',familyName:'Perez',nationality:'Mexican'},Constructor:{name:'Cadillac'},points:'0',laps:'56',status:'+2 Laps'},
      {position:'17',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'43',status:'+15 Laps'},
      {position:'DNF',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'0',laps:'—',status:'DNF'},
      {position:'DNF',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac'},points:'0',laps:'—',status:'DNF'},
      {position:'DNF',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'0',laps:'—',status:'DNF'},
      {position:'DNS',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'0',laps:'—',status:'DNS'},
      {position:'DNS',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'—',status:'DNS'},
    ]},
  2:{round:'2',raceName:'Chinese Grand Prix',date:'2026-03-15',Circuit:{circuitName:'Shanghai International Circuit',Location:{country:'🇨🇳'}},
    Results:[
      {position:'1',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'25',laps:'56',Time:{time:'Winner'},status:'Finished',FastestLap:{rank:'1',lap:'52',Time:{time:'1:35.275'}}},
      {position:'2',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'18',laps:'56',Time:{time:'+5.515'},status:'Finished'},
      {position:'3',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'15',laps:'56',Time:{time:'+25.267'},status:'Finished'},
      {position:'4',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'12',laps:'56',Time:{time:'+28.894'},status:'Finished'},
      {position:'5',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'10',laps:'56',Time:{time:'+57.268'},status:'Finished'},
      {position:'6',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine'},points:'8',laps:'56',Time:{time:'+59.647'},status:'Finished'},
      {position:'7',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'6',laps:'56',Time:{time:'+1:20.588'},status:'Finished'},
      {position:'8',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'4',laps:'56',Time:{time:'+1:27.247'},status:'Finished'},
      {position:'9',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'2',laps:'55',status:'+1 Lap'},
      {position:'10',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine'},points:'1',laps:'55',status:'+1 Lap'},
      {position:'11',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'55',status:'+1 Lap'},
      {position:'12',Driver:{driverId:'lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'0',laps:'55',status:'+1 Lap'},
      {position:'13',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac'},points:'0',laps:'55',status:'+1 Lap'},
      {position:'14',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'55',status:'+1 Lap'},
      {position:'15',Driver:{driverId:'perez',familyName:'Perez',nationality:'Mexican'},Constructor:{name:'Cadillac'},points:'0',laps:'55',status:'+1 Lap'},
      {position:'DNF',Driver:{driverId:'verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'0',laps:'45',status:'DNF'},
      {position:'DNF',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'0',laps:'—',status:'DNF'},
      {position:'DNF',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'—',status:'DNF'},
      {position:'DNS',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'0',laps:'—',status:'DNS'},
      {position:'DNS',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'0',laps:'—',status:'DNS'},
      {position:'DNS',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'0',laps:'—',status:'DNS'},
      {position:'DNS',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'0',laps:'—',status:'DNS'},
    ]},
  3:{round:'3',raceName:'Japanese Grand Prix',date:'2026-03-29',Circuit:{circuitName:'Suzuka Circuit',Location:{country:'🇯🇵'}},
    Results:[
      {position:'1',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'25',laps:'53',Time:{time:'Winner'},status:'Finished',FastestLap:{rank:'1',lap:'49',Time:{time:'1:32.432'}}},
      {position:'2',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'18',laps:'53',Time:{time:'+13.722'},status:'Finished'},
      {position:'3',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'15',laps:'53',Time:{time:'+15.270'},status:'Finished'},
      {position:'4',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'12',laps:'53',Time:{time:'+15.754'},status:'Finished'},
      {position:'5',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'10',laps:'53',Time:{time:'+23.479'},status:'Finished'},
      {position:'6',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'8',laps:'53',Time:{time:'+25.037'},status:'Finished'},
      {position:'7',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine'},points:'6',laps:'53',Time:{time:'+32.340'},status:'Finished'},
      {position:'8',Driver:{driverId:'verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'4',laps:'53',Time:{time:'+32.677'},status:'Finished'},
      {position:'9',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'2',laps:'53',Time:{time:'+50.180'},status:'Finished'},
      {position:'10',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'1',laps:'53',Time:{time:'+51.216'},status:'Finished'},
      {position:'11',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'53',Time:{time:'+52.280'},status:'Finished'},
      {position:'12',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'0',laps:'53',Time:{time:'+56.154'},status:'Finished'},
      {position:'13',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'0',laps:'53',Time:{time:'+59.078'},status:'Finished'},
      {position:'14',Driver:{driverId:'lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'0',laps:'53',Time:{time:'+59.848'},status:'Finished'},
      {position:'15',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'0',laps:'53',Time:{time:'+1:05.008'},status:'Finished'},
      {position:'16',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine'},points:'0',laps:'53',Time:{time:'+1:05.773'},status:'Finished'},
      {position:'17',Driver:{driverId:'perez',familyName:'Perez',nationality:'Mexican'},Constructor:{name:'Cadillac'},points:'0',laps:'52',status:'+1 Lap'},
      {position:'18',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'0',laps:'52',status:'+1 Lap'},
      {position:'19',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac'},points:'0',laps:'52',status:'+1 Lap'},
      {position:'20',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'0',laps:'52',status:'+1 Lap'},
      {position:'DNF',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'20',status:'DNF (Crash, L20)'},
      {position:'DNF',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'30',status:'DNF (Water pressure, L30)'},
    ]},
  4:{round:'4',raceName:'Miami Grand Prix',date:'2026-05-03',Circuit:{circuitName:'Miami International Autodrome',Location:{country:'🇺🇸'}},
    Results:[
      {position:'1',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'25',laps:'57',Time:{time:'Winner'},status:'Finished'},
      {position:'2',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'18',laps:'57',Time:{time:'+3.264'},status:'Finished',FastestLap:{rank:'1',lap:'35',Time:{time:'1:31.869'}}},
      {position:'3',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'15',laps:'57',Time:{time:'+23.828'},status:'Finished'},
      {position:'4',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'12',laps:'57',Time:{time:'+43.051'},status:'Finished'},
      {position:'5',Driver:{driverId:'verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'10',laps:'57',Time:{time:'+43.949'},status:'Finished'},
      {position:'6',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'8',laps:'57',Time:{time:'+53.753'},status:'Finished'},
      {position:'7',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine'},points:'6',laps:'57',Time:{time:'+61.871'},status:'Finished'},
      {position:'8',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'4',laps:'57',Time:{time:'+64.245'},status:'+20s penalty'},
      {position:'9',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'2',laps:'57',Time:{time:'+82.072'},status:'Finished'},
      {position:'10',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'1',laps:'57',Time:{time:'+90.972'},status:'Finished'},
      {position:'11',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'12',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'13',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'14',Driver:{driverId:'lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'15',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'16',Driver:{driverId:'perez',familyName:'Perez',nationality:'Mexican'},Constructor:{name:'Cadillac'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'17',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'18',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'19',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'56',status:'+1 Lap'},
      {position:'20',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'0',laps:'55',status:'+2 Laps'},
      {position:'DNF',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine'},points:'0',laps:'—',status:'DNF (Crash)'},
      {position:'DNF',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'0',laps:'—',status:'DNF (Crash)'},
    ]},
  5:{round:'5',raceName:'Canadian Grand Prix',date:'2026-05-24',Circuit:{circuitName:'Circuit Gilles Villeneuve',Location:{country:'🇨🇦'}},
    Results:[
      {position:'1',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'25',laps:'68',Time:{time:'1:28:15.758'},status:'Finished',FastestLap:{rank:'1',lap:'68',Time:{time:'1:14.210'}}},
      {position:'2',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'18',laps:'68',Time:{time:'+10.768'},status:'Finished'},
      {position:'3',Driver:{driverId:'verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'15',laps:'68',Time:{time:'+11.276'},status:'Finished'},
      {position:'4',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'12',laps:'68',Time:{time:'+44.151'},status:'Finished'},
      {position:'5',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'10',laps:'67',status:'+1 Lap'},
      {position:'6',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine'},points:'8',laps:'67',status:'+1 Lap'},
      {position:'7',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'6',laps:'67',status:'+1 Lap'},
      {position:'8',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine'},points:'4',laps:'67',status:'+1 Lap'},
      {position:'9',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'2',laps:'67',status:'+1 Lap'},
      {position:'10',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'1',laps:'67',status:'+1 Lap'},
      {position:'11',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'0',laps:'66',status:'+2 Laps'},
      {position:'12',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'66',status:'+2 Laps'},
      {position:'13',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'0',laps:'66',status:'+2 Laps'},
      {position:'14',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'66',status:'+2 Laps'},
      {position:'15',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'64',status:'+4 Laps'},
      {position:'16',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac'},points:'0',laps:'64',status:'+4 Laps'},
      {position:'DNF',Driver:{driverId:'perez',familyName:'Perez',nationality:'Mexican'},Constructor:{name:'Cadillac'},points:'0',laps:'39',status:'DNF'},
      {position:'DNF',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'0',laps:'38',status:'DNF'},
      {position:'DNF',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'0',laps:'29',status:'DNF'},
      {position:'DNF',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'0',laps:'23',status:'DNF'},
      {position:'DNF',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'0',laps:'11',status:'DNF'},
      {position:'DNS',Driver:{driverId:'lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'0',laps:'—',status:'DNS'},
    ]},
  6:{round:'6',raceName:'Monaco Grand Prix',date:'2026-06-07',Circuit:{circuitName:'Circuit de Monaco',Location:{country:'🇲🇨'}},
    Results:[
      {position:'1',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'25',laps:'78',Time:{time:'2:23:31.243'},status:'Finished',FastestLap:{rank:'1',lap:'76',Time:{time:'1:13.481'}}},
      {position:'2',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'18',laps:'78',Time:{time:'+6.271'},status:'Finished'},
      {position:'3',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'15',laps:'78',Time:{time:'+23.394'},status:'Finished'},
      {position:'4',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'12',laps:'78',Time:{time:'+24.261'},status:'Finished'},
      {position:'5',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'10',laps:'78',Time:{time:'+26.553'},status:'Finished'},
      {position:'6',Driver:{driverId:'lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'8',laps:'78',Time:{time:'+29.010'},status:'Finished'},
      {position:'7',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine'},points:'6',laps:'78',Time:{time:'+30.369'},status:'Finished'},
      {position:'8',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'4',laps:'78',Time:{time:'+33.413'},status:'Finished'},
      {position:'9',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'2',laps:'78',Time:{time:'+37.140'},status:'Finished'},
      {position:'10',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'1',laps:'78',Time:{time:'+41.899'},status:'Finished'},
      {position:'11',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'0',laps:'78',Time:{time:'+42.748'},status:'Finished'},
      {position:'12',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'0',laps:'78',Time:{time:'+43.353'},status:'Finished'},
      {position:'13',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'78',Time:{time:'+44.102'},status:'Finished'},
      {position:'14',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine'},points:'0',laps:'78',Time:{time:'+48.964'},status:'Finished'},
      {position:'15',Driver:{driverId:'perez',familyName:'Perez',nationality:'Mexican'},Constructor:{name:'Cadillac'},points:'0',laps:'78',Time:{time:'+49.153'},status:'Finished'},
      {position:'DNF',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'0',laps:'70',status:'DNF (Crash)'},
      {position:'DNF',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'0',laps:'64',status:'DNF (Crash)'},
      {position:'DNF',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'56',status:'DNF (Crash)'},
      {position:'DNF',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'0',laps:'43',status:'DNF'},
      {position:'DNF',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'27',status:'DNF'},
      {position:'DNF',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac'},points:'0',laps:'15',status:'DNF'},
      {position:'DNF',Driver:{driverId:'verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'0',laps:'0',status:'DNF (Anti-stall)'},
    ]},
  7:{round:'7',raceName:'Barcelona Grand Prix',date:'2026-06-14',Circuit:{circuitName:'Circuit de Barcelona-Catalunya',Location:{country:'🇪🇸'}},
    Results:[
      {position:'1',Driver:{driverId:'hamilton',familyName:'Hamilton',nationality:'British'},Constructor:{name:'Ferrari'},points:'25',laps:'66',Time:{time:'1:32:28.105'},status:'Finished',FastestLap:{rank:'1',lap:'44',Time:{time:'1:20.122'}}},
      {position:'2',Driver:{driverId:'russell',familyName:'Russell',nationality:'British'},Constructor:{name:'Mercedes'},points:'18',laps:'66',Time:{time:'+19.561'},status:'Finished',FastestLap:{rank:'6',lap:'43',Time:{time:'1:20.640'}}},
      {position:'3',Driver:{driverId:'norris',familyName:'Norris',nationality:'British'},Constructor:{name:'McLaren'},points:'15',laps:'66',Time:{time:'+23.719'},status:'Finished',FastestLap:{rank:'4',lap:'37',Time:{time:'1:20.232'}}},
      {position:'4',Driver:{driverId:'max_verstappen',familyName:'Verstappen',nationality:'Dutch'},Constructor:{name:'Red Bull'},points:'12',laps:'66',Time:{time:'+40.497'},status:'Finished',FastestLap:{rank:'3',lap:'42',Time:{time:'1:20.230'}}},
      {position:'5',Driver:{driverId:'piastri',familyName:'Piastri',nationality:'Australian'},Constructor:{name:'McLaren'},points:'10',laps:'66',Time:{time:'+58.661'},status:'Finished',FastestLap:{rank:'8',lap:'46',Time:{time:'1:20.835'}}},
      {position:'6',Driver:{driverId:'hadjar',familyName:'Hadjar',nationality:'French'},Constructor:{name:'Red Bull'},points:'8',laps:'65',Time:{time:'+24.627'},status:'Lapped',FastestLap:{rank:'2',lap:'60',Time:{time:'1:20.150'}}},
      {position:'7',Driver:{driverId:'gasly',familyName:'Gasly',nationality:'French'},Constructor:{name:'Alpine F1 Team'},points:'6',laps:'65',Time:{time:'+55.789'},status:'Lapped',FastestLap:{rank:'13',lap:'43',Time:{time:'1:21.960'}}},
      {position:'8',Driver:{driverId:'lawson',familyName:'Lawson',nationality:'New Zealander'},Constructor:{name:'Racing Bulls'},points:'4',laps:'65',Time:{time:'+1:12.224'},status:'Lapped',FastestLap:{rank:'17',lap:'45',Time:{time:'1:22.691'}}},
      {position:'9',Driver:{driverId:'arvid_lindblad',familyName:'Lindblad',nationality:'British'},Constructor:{name:'Racing Bulls'},points:'2',laps:'65',Time:{time:'+1:18.074'},status:'Lapped',FastestLap:{rank:'12',lap:'45',Time:{time:'1:21.914'}}},
      {position:'10',Driver:{driverId:'colapinto',familyName:'Colapinto',nationality:'Argentine'},Constructor:{name:'Alpine F1 Team'},points:'1',laps:'65',Time:{time:'+1:19.867'},status:'Lapped',FastestLap:{rank:'16',lap:'43',Time:{time:'1:22.449'}}},
      {position:'11',Driver:{driverId:'bortoleto',familyName:'Bortoleto',nationality:'Brazilian'},Constructor:{name:'Audi'},points:'0',laps:'64',Time:{time:'+26.687'},status:'Lapped',FastestLap:{rank:'9',lap:'55',Time:{time:'1:21.446'}}},
      {position:'12',Driver:{driverId:'sainz',familyName:'Sainz',nationality:'Spanish'},Constructor:{name:'Williams'},points:'0',laps:'64',Time:{time:'+27.866'},status:'Lapped',FastestLap:{rank:'14',lap:'58',Time:{time:'1:22.061'}}},
      {position:'13',Driver:{driverId:'ocon',familyName:'Ocon',nationality:'French'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'64',Time:{time:'+59.149'},status:'Lapped',FastestLap:{rank:'10',lap:'63',Time:{time:'1:21.643'}}},
      {position:'14',Driver:{driverId:'perez',familyName:'Pérez',nationality:'Mexican'},Constructor:{name:'Cadillac F1 Team'},points:'0',laps:'63',Time:{time:'+7.769'},status:'Lapped',FastestLap:{rank:'18',lap:'43',Time:{time:'1:22.820'}}},
      {position:'15',Driver:{driverId:'leclerc',familyName:'Leclerc',nationality:'Monegasque'},Constructor:{name:'Ferrari'},points:'0',laps:'62',status:'Retired',FastestLap:{rank:'5',lap:'47',Time:{time:'1:20.379'}}},
      {position:'16',Driver:{driverId:'antonelli',familyName:'Antonelli',nationality:'Italian'},Constructor:{name:'Mercedes'},points:'0',laps:'61',status:'Retired',FastestLap:{rank:'7',lap:'46',Time:{time:'1:20.704'}}},
      {position:'17',Driver:{driverId:'bearman',familyName:'Bearman',nationality:'British'},Constructor:{name:'Haas F1 Team'},points:'0',laps:'60',status:'Retired',FastestLap:{rank:'15',lap:'43',Time:{time:'1:22.419'}}},
      {position:'R',Driver:{driverId:'albon',familyName:'Albon',nationality:'Thai'},Constructor:{name:'Williams'},points:'0',laps:'55',status:'Lapped',FastestLap:{rank:'11',lap:'54',Time:{time:'1:21.744'}}},
      {position:'R',Driver:{driverId:'alonso',familyName:'Alonso',nationality:'Spanish'},Constructor:{name:'Aston Martin'},points:'0',laps:'37',status:'Retired',FastestLap:{rank:'20',lap:'27',Time:{time:'1:25.366'}}},
      {position:'R',Driver:{driverId:'hulkenberg',familyName:'Hülkenberg',nationality:'German'},Constructor:{name:'Audi'},points:'0',laps:'29',status:'Retired',FastestLap:{rank:'19',lap:'2',Time:{time:'1:23.447'}}},
      {position:'R',Driver:{driverId:'bottas',familyName:'Bottas',nationality:'Finnish'},Constructor:{name:'Cadillac F1 Team'},points:'0',laps:'15',status:'Retired',FastestLap:{rank:'21',lap:'3',Time:{time:'1:25.745'}}},
      {position:'R',Driver:{driverId:'stroll',familyName:'Stroll',nationality:'Canadian'},Constructor:{name:'Aston Martin'},points:'0',laps:'5',status:'Retired',FastestLap:{rank:'22',lap:'3',Time:{time:'1:25.904'}}},
    ]}
};

// Hardcoded verified championship standings (after Monaco, R6) — official totals
// from formula1.com (driver + constructor standings pages). Includes Sprint
// points from R2/R4/R5 Sprints as well as each main GP result.
const HARDCODED_DRIVER_STANDINGS=[
  {position:'1',points:'156',Driver:{driverId:'antonelli',familyName:'Antonelli',givenName:'Andrea Kimi',nationality:'Italian'},Constructors:[{name:'Mercedes'}]},
  {position:'2',points:'115',Driver:{driverId:'hamilton',familyName:'Hamilton',givenName:'Lewis',nationality:'British'},Constructors:[{name:'Ferrari'}]},
  {position:'3',points:'106',Driver:{driverId:'russell',familyName:'Russell',givenName:'George',nationality:'British'},Constructors:[{name:'Mercedes'}]},
  {position:'4',points:'75',Driver:{driverId:'leclerc',familyName:'Leclerc',givenName:'Charles',nationality:'Monegasque'},Constructors:[{name:'Ferrari'}]},
  {position:'5',points:'73',Driver:{driverId:'norris',familyName:'Norris',givenName:'Lando',nationality:'British'},Constructors:[{name:'McLaren'}]},
  {position:'6',points:'68',Driver:{driverId:'piastri',familyName:'Piastri',givenName:'Oscar',nationality:'Australian'},Constructors:[{name:'McLaren'}]},
  {position:'7',points:'55',Driver:{driverId:'max_verstappen',familyName:'Verstappen',givenName:'Max',nationality:'Dutch'},Constructors:[{name:'Red Bull'}]},
  {position:'8',points:'41',Driver:{driverId:'gasly',familyName:'Gasly',givenName:'Pierre',nationality:'French'},Constructors:[{name:'Alpine F1 Team'}]},
  {position:'9',points:'34',Driver:{driverId:'hadjar',familyName:'Hadjar',givenName:'Isack',nationality:'French'},Constructors:[{name:'Red Bull'}]},
  {position:'10',points:'28',Driver:{driverId:'lawson',familyName:'Lawson',givenName:'Liam',nationality:'New Zealander'},Constructors:[{name:'Racing Bulls'}]},
  {position:'11',points:'18',Driver:{driverId:'bearman',familyName:'Bearman',givenName:'Oliver',nationality:'British'},Constructors:[{name:'Haas F1 Team'}]},
  {position:'12',points:'16',Driver:{driverId:'colapinto',familyName:'Colapinto',givenName:'Franco',nationality:'Argentine'},Constructors:[{name:'Alpine F1 Team'}]},
  {position:'13',points:'13',Driver:{driverId:'arvid_lindblad',familyName:'Lindblad',givenName:'Arvid',nationality:'British'},Constructors:[{name:'Racing Bulls'}]},
  {position:'14',points:'6',Driver:{driverId:'sainz',familyName:'Sainz',givenName:'Carlos',nationality:'Spanish'},Constructors:[{name:'Williams'}]},
  {position:'15',points:'5',Driver:{driverId:'albon',familyName:'Albon',givenName:'Alexander',nationality:'Thai'},Constructors:[{name:'Williams'}]},
  {position:'16',points:'3',Driver:{driverId:'ocon',familyName:'Ocon',givenName:'Esteban',nationality:'French'},Constructors:[{name:'Haas F1 Team'}]},
  {position:'17',points:'2',Driver:{driverId:'bortoleto',familyName:'Bortoleto',givenName:'Gabriel',nationality:'Brazilian'},Constructors:[{name:'Audi'}]},
  {position:'18',points:'1',Driver:{driverId:'alonso',familyName:'Alonso',givenName:'Fernando',nationality:'Spanish'},Constructors:[{name:'Aston Martin'}]},
  {position:'19',points:'0',Driver:{driverId:'hulkenberg',familyName:'Hülkenberg',givenName:'Nico',nationality:'German'},Constructors:[{name:'Audi'}]},
  {position:'20',points:'0',Driver:{driverId:'bottas',familyName:'Bottas',givenName:'Valtteri',nationality:'Finnish'},Constructors:[{name:'Cadillac F1 Team'}]},
  {position:'21',points:'0',Driver:{driverId:'perez',familyName:'Pérez',givenName:'Sergio',nationality:'Mexican'},Constructors:[{name:'Cadillac F1 Team'}]},
  {position:'22',points:'0',Driver:{driverId:'stroll',familyName:'Stroll',givenName:'Lance',nationality:'Canadian'},Constructors:[{name:'Aston Martin'}]},
];

const HARDCODED_CONSTRUCTOR_STANDINGS=[
  {position:'1',points:'262',Constructor:{name:'Mercedes',nationality:'German'}},
  {position:'2',points:'190',Constructor:{name:'Ferrari',nationality:'Italian'}},
  {position:'3',points:'141',Constructor:{name:'McLaren',nationality:'British'}},
  {position:'4',points:'89',Constructor:{name:'Red Bull',nationality:'Austrian'}},
  {position:'5',points:'57',Constructor:{name:'Alpine F1 Team',nationality:'French'}},
  {position:'6',points:'41',Constructor:{name:'Racing Bulls',nationality:'Italian'}},
  {position:'7',points:'21',Constructor:{name:'Haas F1 Team',nationality:'American'}},
  {position:'8',points:'11',Constructor:{name:'Williams',nationality:'British'}},
  {position:'9',points:'2',Constructor:{name:'Audi',nationality:'German'}},
  {position:'10',points:'1',Constructor:{name:'Aston Martin',nationality:'British'}},
  {position:'11',points:'0',Constructor:{name:'Cadillac F1 Team',nationality:'American'}},
];

// ── RACE SELECTOR ─────────────────────────────────────────────────────────────
async function renderRaceSelector(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('f1','races')+renderBackToSeriesHome('f1');
  content.innerHTML=top+`<div class="section-title"><span>2026 Season Results</span><span class="spin-inline">⟳</span></div>`;
  // Use hardcoded races since they're fully verified — Jolpica may be incomplete.
  // Sorted newest-round-first so the most recent race is at the top.
  const allRaces=Object.values(HARDCODED_RACES).sort((a,b)=>parseInt(b.round)-parseInt(a.round));
  if(!allRaces.length){content.innerHTML+=`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">No Results Yet</div><div class="state-sub">Race results will appear here after each round.</div></div>`;return;}
  const rows=allRaces.map(r=>{
    const winner=r.Results?.[0];
    const dname=winner?.Driver?.familyName||'—';
    const team=winner?.Constructor?.name||'—';
    const nat=winner?.Driver?.nationality||'';
    const flag=driverFlag(nat);
    const isSelected=selectedRace&&String(selectedRace.round)===String(r.round);
    const slug=f1TrackSlug(r.raceName);
    const hlId=`highlights-f1-r${r.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectRace('${r.round}')">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.Circuit?.Location?.country||''}</div>
        <div class="race-item-name">${r.raceName.replace(' Grand Prix','')}</div>
        <div class="race-item-date">${fmtDate(r.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('f1','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag">${flag}</span>
        <div class="winner-name">${dname}</div>
        <div class="winner-team">${team}</div>
      </div>
    </div>`;
  }).join('');
  content.innerHTML=top+`<div class="section-title"><span>2026 Season Results</span><span>${allRaces.length} races</span></div>`+rows;
  if(selectedRace){
    content.innerHTML+=await buildRaceResultsHTML(selectedRace.round);
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
  setStats('—','—','RACE',`${allRaces.length} done`);
}

// ── RACE RESULTS ──────────────────────────────────────────────────────────────
async function buildRaceResultsHTML(round){
  const race=await fetchRaceResults(round);
  if(!race)return'<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">No Data</div></div>';
  const results=race.Results||[];
  const top3=results.slice(0,3);
  const fl=results.find(r=>r.FastestLap?.rank==='1');
  const totalLaps=results[0]?.laps||'—';
  const sprint=SPRINT_RESULTS[round];
  // Pull per-driver fastest laps (seeded + whatever Jolpica returns)
  const flMap=await fetchFastestLaps(round);

  const podium=`<div class="podium-bar">
    <div class="podium-item p2-item">
      <div class="podium-pos">🥈 P2</div>
      <span class="podium-flag">${driverFlag(top3[1]?.Driver?.nationality)}</span>
      <div class="podium-name">${top3[1]?.Driver?.familyName||'—'}</div>
      <div class="podium-team">${top3[1]?.Constructor?.name||'—'}</div>
      <div class="podium-gap">${top3[1]?.Time?.time||top3[1]?.status||'—'}</div>
    </div>
    <div class="podium-item p1-item">
      <div class="podium-pos">🏆 WINNER</div>
      <span class="podium-flag">${driverFlag(top3[0]?.Driver?.nationality)}</span>
      <div class="podium-name">${top3[0]?.Driver?.familyName||'—'}</div>
      <div class="podium-team">${top3[0]?.Constructor?.name||'—'}</div>
      <div class="podium-gap">RACE WINNER</div>
    </div>
    <div class="podium-item p3-item">
      <div class="podium-pos">🥉 P3</div>
      <span class="podium-flag">${driverFlag(top3[2]?.Driver?.nationality)}</span>
      <div class="podium-name">${top3[2]?.Driver?.familyName||'—'}</div>
      <div class="podium-team">${top3[2]?.Constructor?.name||'—'}</div>
      <div class="podium-gap">${top3[2]?.Time?.time||top3[2]?.status||'—'}</div>
    </div>
  </div>`;

  const header=`<div class="results-header">
    <div class="results-race-name">${race.Circuit?.Location?.country||''} ${race.raceName}${sprint?'<span class="sprint-tag">SPRINT WKND</span>':''}</div>
    <div class="results-race-sub">${race.Circuit?.circuitName||''} · Round ${race.round} · ${totalLaps} Laps<br>
    ${fl?`⚡ Fastest Lap: ${fl.FastestLap?.Time?.time||'—'} — ${fl.Driver?.familyName||'—'} (Lap ${fl.FastestLap?.lap||'—'})`:''}
    ${sprint?`<br>Sprint Winner: ${sprint.winner} (${sprint.winnerTeam}) — top 8 scored points`:''}
    </div>
  </div>`;

  const tableHeader=`<div class="results-table-header">
    <div class="rth left">POS</div><div class="rth"></div>
    <div class="rth left">DRIVER</div>
    <div class="rth">PTS</div><div class="rth">GAP / TIME</div>
    <div class="rth">FASTEST</div><div class="rth"></div>
  </div>`;

  const rows=results.map((r,i)=>{
    const name=r.Driver?.familyName||'—';
    const team=r.Constructor?.name||'—';
    const nat=r.Driver?.nationality||'';
    const flag=driverFlag(nat);
    const pts=parseFloat(r.points)||0;
    const pos=r.position;
    const isDns=pos==='DNS';
    const isDnf=pos==='DNF'||(r.status&&r.status.includes('DNF'));
    const numPos=isDnf||isDns?null:parseInt(pos);
    const gap=numPos===1?(r.Time?.time||'WINNER'):(r.Time?.time?r.Time.time:r.status||'—');
    const driverId=r.Driver?.driverId||'';
    const isSelected=selectedDriver===driverId;
    const posLabel=isDns?'DNS':isDnf?'DNF':numPos;
    const posClass=isDns||isDnf?'pos-dnf':posC(numPos);
    // Resolve this driver's personal fastest lap
    const drvFl=flMap[driverId]||(r.FastestLap?{time:r.FastestLap.Time?.time,lap:r.FastestLap.lap,rank:r.FastestLap.rank}:null);
    const flTime=drvFl?.time||'';
    const isOverallFl=drvFl?.rank==='1';
    const flCellClass=isOverallFl?'res-fastest is-fastest':'res-fastest';
    const flDisplay=flTime?(isOverallFl?`⚡${flTime}`:flTime):'—';
    return`<div class="result-row ${numPos===1?'p1-row':''} ${isDnf||isDns?'dnf-row':''} ${isSelected?'selected-driver':''} ${isOverallFl?'fl-row':''}" onclick="toggleLaps('${driverId}','${name}','${round}')">
      <div class="res-pos ${posClass}">${posLabel}</div>
      <div class="flag-cell">${flag}</div>
      <div>
        <div class="res-name" style="color:${tc(team)}">${name}</div>
        <div class="res-team-sm">${team}</div>
      </div>
      <div class="res-pts">${pts>0?'+'+pts:'—'}</div>
      <div class="res-gap ${numPos===1?'leader-gap':''}">${gap}</div>
      <div class="${flCellClass}">${flDisplay}</div>
      <div></div>
    </div>`;
  }).join('');

  const lapPanel=selectedDriver?`<div class="lap-panel" id="lap-panel">
    <div class="lap-panel-header">
      <div>
        <div class="lap-panel-title">${selectedDriver} — Lap Times</div>
        <div class="lap-panel-sub">⚡ = fastest lap</div>
      </div>
      <button class="lap-panel-close" onclick="closeLaps()">✕</button>
    </div>
    <div id="lap-grid-content"><div class="lap-loading">⟳ Loading lap times...</div></div>
  </div>`:'';

  return header+podium+tableHeader+rows+lapPanel;
}

async function toggleLaps(driverId,name,round){
  if(!driverId)return;
  if(selectedDriver===driverId){
    selectedDriver=null;
    await renderRaceSelector();
    return;
  }
  selectedDriver=driverId;
  await renderRaceSelector();
  const grid=document.getElementById('lap-grid-content');
  if(!grid)return;
  try{
    const laps=await fetchLapTimes(round,driverId);
    if(!laps.length){grid.innerHTML='<div class="lap-loading">No lap time data available from Jolpica yet</div>';return;}
    let fastest=Infinity;
    laps.forEach(lap=>{
      const ms=lapStrToMs(lap.Timings?.[0]?.time);
      if(ms&&ms<fastest)fastest=ms;
    });
    const cells=laps.map(lap=>{
      const timing=lap.Timings?.[0];
      const ms=lapStrToMs(timing?.time);
      const isFast=ms&&Math.abs(ms-fastest)<1;
      const isSlow=ms&&ms>fastest*1.05;
      const pos=timing?.position||'—';
      return`<div class="lap-cell-item">
        <div class="lap-num">LAP ${lap.number}</div>
        <div class="lap-time ${isFast?'fastest-lap':isSlow?'slow-lap':''}">${timing?.time||'—'}</div>
        <div class="lap-pos">P${pos}</div>
      </div>`;
    }).join('');
    grid.innerHTML=`<div class="lap-grid">${cells}</div>`;
  }catch(e){
    grid.innerHTML='<div class="lap-loading">Lap times not yet available</div>';
  }
}

function closeLaps(){
  selectedDriver=null;
  renderRaceSelector();
}

async function selectRace(round){
  track('race:open:f1',{round:parseInt(round)});
  selectedRace={round};
  selectedDriver=null;
  await renderRaceSelector();
  setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
}

// ── SPRINT RESULTS — REAL 2026 ─────────────────────────────────────────────────
// Top 8 score: 8-7-6-5-4-3-2-1. Used in per-race breakdown views.
const SPRINT_RESULTS={
  2:{round:2,race:'China',flag:'🇨🇳',winner:'Russell',winnerTeam:'Mercedes',
     drivers:{'Russell':8,'Leclerc':7,'Hamilton':6,'Norris':5,'Antonelli':4,'Piastri':3,'Lawson':2,'Bearman':1}},
  4:{round:4,race:'Miami',flag:'🇺🇸',winner:'Norris',winnerTeam:'McLaren',
     drivers:{'Norris':8,'Piastri':7,'Leclerc':6,'Russell':5,'Verstappen':4,'Antonelli':3,'Hamilton':2,'Gasly':1}},
  5:{round:5,race:'Canada',flag:'🇨🇦',winner:'Russell',winnerTeam:'Mercedes',
     drivers:{'Russell':8,'Norris':7,'Antonelli':6,'Piastri':5,'Leclerc':4,'Hamilton':3,'Verstappen':2,'Lindblad':1}},
};

function getSprintPts(driverName,round){
  return SPRINT_RESULTS[round]?.drivers?.[driverName]||0;
}

// ── DRIVER PER-RACE POINTS — REAL VERIFIED 2026 RESULTS ───────────────────────
// Each driver's GP finishing position and points per round. Sprint points are
// added separately from SPRINT_RESULTS so they display as a labeled sub-row.
// Position 0 = DNS/DNF/DSQ. All totals verified against official standings.
const DRIVER_RACE_POINTS={
  'Antonelli':  [{round:1,race:'Australia',flag:'🇦🇺',pos:2,pts:18},{round:2,race:'China',flag:'🇨🇳',pos:1,pts:25},{round:3,race:'Japan',flag:'🇯🇵',pos:1,pts:25},{round:4,race:'Miami',flag:'🇺🇸',pos:1,pts:25},{round:5,race:'Canada',flag:'🇨🇦',pos:1,pts:25},{round:6,race:'Monaco',flag:'🇲🇨',pos:1,pts:25}],
  'Russell':    [{round:1,race:'Australia',flag:'🇦🇺',pos:1,pts:25},{round:2,race:'China',flag:'🇨🇳',pos:2,pts:18},{round:3,race:'Japan',flag:'🇯🇵',pos:4,pts:12},{round:4,race:'Miami',flag:'🇺🇸',pos:4,pts:12},{round:5,race:'Canada',flag:'🇨🇦',pos:0,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:12,pts:0}],
  'Leclerc':    [{round:1,race:'Australia',flag:'🇦🇺',pos:3,pts:15},{round:2,race:'China',flag:'🇨🇳',pos:4,pts:12},{round:3,race:'Japan',flag:'🇯🇵',pos:3,pts:15},{round:4,race:'Miami',flag:'🇺🇸',pos:8,pts:4},{round:5,race:'Canada',flag:'🇨🇦',pos:4,pts:12},{round:6,race:'Monaco',flag:'🇲🇨',pos:0,pts:0}],
  'Norris':     [{round:1,race:'Australia',flag:'🇦🇺',pos:5,pts:10},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:5,pts:10},{round:4,race:'Miami',flag:'🇺🇸',pos:2,pts:18},{round:5,race:'Canada',flag:'🇨🇦',pos:0,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:0,pts:0}],
  'Hamilton':   [{round:1,race:'Australia',flag:'🇦🇺',pos:4,pts:12},{round:2,race:'China',flag:'🇨🇳',pos:3,pts:15},{round:3,race:'Japan',flag:'🇯🇵',pos:6,pts:8},{round:4,race:'Miami',flag:'🇺🇸',pos:6,pts:8},{round:5,race:'Canada',flag:'🇨🇦',pos:2,pts:18},{round:6,race:'Monaco',flag:'🇲🇨',pos:2,pts:18}],
  'Piastri':    [{round:1,race:'Australia',flag:'🇦🇺',pos:0,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:2,pts:18},{round:4,race:'Miami',flag:'🇺🇸',pos:3,pts:15},{round:5,race:'Canada',flag:'🇨🇦',pos:11,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:4,pts:12}],
  'Verstappen': [{round:1,race:'Australia',flag:'🇦🇺',pos:6,pts:8},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:8,pts:4},{round:4,race:'Miami',flag:'🇺🇸',pos:5,pts:10},{round:5,race:'Canada',flag:'🇨🇦',pos:3,pts:15},{round:6,race:'Monaco',flag:'🇲🇨',pos:0,pts:0}],
  'Bearman':    [{round:1,race:'Australia',flag:'🇦🇺',pos:7,pts:6},{round:2,race:'China',flag:'🇨🇳',pos:5,pts:10},{round:3,race:'Japan',flag:'🇯🇵',pos:0,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:11,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:10,pts:1},{round:6,race:'Monaco',flag:'🇲🇨',pos:0,pts:0}],
  'Gasly':      [{round:1,race:'Australia',flag:'🇦🇺',pos:10,pts:1},{round:2,race:'China',flag:'🇨🇳',pos:6,pts:8},{round:3,race:'Japan',flag:'🇯🇵',pos:7,pts:6},{round:4,race:'Miami',flag:'🇺🇸',pos:0,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:8,pts:4},{round:6,race:'Monaco',flag:'🇲🇨',pos:7,pts:6}],
  'Lawson':     [{round:1,race:'Australia',flag:'🇦🇺',pos:13,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:7,pts:6},{round:3,race:'Japan',flag:'🇯🇵',pos:9,pts:2},{round:4,race:'Miami',flag:'🇺🇸',pos:20,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:7,pts:6},{round:6,race:'Monaco',flag:'🇲🇨',pos:5,pts:10}],
  'Colapinto':  [{round:1,race:'Australia',flag:'🇦🇺',pos:14,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:10,pts:1},{round:3,race:'Japan',flag:'🇯🇵',pos:16,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:7,pts:6},{round:5,race:'Canada',flag:'🇨🇦',pos:6,pts:8},{round:6,race:'Monaco',flag:'🇲🇨',pos:14,pts:0}],
  'Lindblad':   [{round:1,race:'Australia',flag:'🇦🇺',pos:8,pts:4},{round:2,race:'China',flag:'🇨🇳',pos:12,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:14,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:14,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:0,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:6,pts:8}],
  'Hadjar':     [{round:1,race:'Australia',flag:'🇦🇺',pos:0,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:8,pts:4},{round:3,race:'Japan',flag:'🇯🇵',pos:12,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:0,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:5,pts:10},{round:6,race:'Monaco',flag:'🇲🇨',pos:3,pts:15}],
  'Sainz':      [{round:1,race:'Australia',flag:'🇦🇺',pos:15,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:9,pts:2},{round:3,race:'Japan',flag:'🇯🇵',pos:15,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:9,pts:2},{round:5,race:'Canada',flag:'🇨🇦',pos:9,pts:2},{round:6,race:'Monaco',flag:'🇲🇨',pos:0,pts:0}],
  'Bortoleto':  [{round:1,race:'Australia',flag:'🇦🇺',pos:9,pts:2},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:13,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:12,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:13,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:11,pts:0}],
  'Ocon':       [{round:1,race:'Australia',flag:'🇦🇺',pos:11,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:14,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:10,pts:1},{round:4,race:'Miami',flag:'🇺🇸',pos:13,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:14,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:9,pts:2}],
  'Albon':      [{round:1,race:'Australia',flag:'🇦🇺',pos:12,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:20,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:10,pts:1},{round:5,race:'Canada',flag:'🇨🇦',pos:0,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:8,pts:4}],
  'Alonso':     [{round:1,race:'Australia',flag:'🇦🇺',pos:0,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:18,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:15,pts:0},{round:5,race:'Canada',flag:'🇨🇦',pos:0,pts:0},{round:6,race:'Monaco',flag:'🇲🇨',pos:10,pts:1}],
};

let selectedDriverChamp=null;

function posLabel(p){if(p===0)return'DNS/DNF';if(p===1)return'🏆 P1';if(p===2)return'P2';if(p===3)return'P3';return`P${p}`;}
function posColor(p){if(p===0)return'var(--muted)';if(p===1)return'var(--yellow)';if(p===2)return'#c0c0c0';if(p===3)return'#cd7f32';if(p<=10)return'var(--green)';return'var(--muted)';}

function renderDriverBreakdown(name,team,totalPts){
  const races=DRIVER_RACE_POINTS[name]||[];
  if(!races.length)return'';

  // Build race rows — for sprint weekends, render a sprint sub-row in orange
  const raceRows=races.map(r=>{
    const sprintPts=getSprintPts(name,r.round);
    const sprintRow=sprintPts>0?`
      <div style="display:grid;grid-template-columns:28px 1fr auto auto;align-items:center;padding:3px 16px 6px;border-bottom:1px solid #141414;gap:10px;background:#0d0805;">
        <div></div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--orange);letter-spacing:0.05em;">SPRINT</div>
        <div></div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--orange);text-align:right;min-width:36px;">+${sprintPts}</div>
      </div>`:'';
    return`<div style="display:grid;grid-template-columns:28px 1fr auto auto;align-items:center;padding:8px 16px;border-bottom:1px solid #141414;gap:10px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);text-align:center;">R${r.round}</div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-size:13px;">${r.flag}</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--text);">${r.race}</span>
      </div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;color:${posColor(r.pos)};text-align:right;">${posLabel(r.pos)}</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:13px;color:${r.pts>0?'var(--yellow)':'var(--muted)'};text-align:right;min-width:36px;">${r.pts>0?'+'+r.pts:'—'}</div>
    </div>${sprintRow}`;
  }).join('');

  // Mini bar chart of GP+sprint combined points per weekend
  const maxPts=33; // max possible weekend (25 GP + 8 sprint)
  const bars=races.map(r=>{
    const sprintPts=getSprintPts(name,r.round);
    const total=r.pts+sprintPts;
    const h=total>0?Math.max(4,Math.round((total/maxPts)*40)):2;
    return`<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;">
      <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:${total>0?'var(--yellow)':'var(--muted)'};">${total>0?total:''}</div>
      <div style="width:100%;max-width:32px;height:${h}px;background:${total>0?'var(--red)':'var(--dim)'};border-radius:2px 2px 0 0;"></div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:var(--muted);letter-spacing:0.04em;">${r.flag}</div>
    </div>`;
  }).join('');

  return`<div style="background:var(--surface2);border-top:1px solid var(--border);border-bottom:2px solid var(--red);">
    <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:var(--white);">${name} — Points by Weekend</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:${tc(team)};margin-top:2px;">${team} · ${totalPts} pts total · GP + Sprint combined</div>
      </div>
      <button onclick="selectedDriverChamp=null;renderDrivers();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
    </div>
    <div style="padding:12px 16px 8px;display:flex;align-items:flex-end;gap:6px;height:80px;border-bottom:1px solid var(--border);">${bars}</div>
    ${raceRows}
  </div>`;
}

async function renderDrivers(){
  const content=document.getElementById('main-content');
  content.innerHTML=`<div class="state-screen"><div class="state-icon">⟳</div><div class="state-title">Loading...</div></div>`;
  try{
    const standings=await fetchDriverStandings();
    if(!standings.length){content.innerHTML=`<div class="state-screen"><div class="state-icon">🏎</div><div class="state-title">No Data Yet</div></div>`;return;}
    const hdr=`<div class="section-title"><span>Drivers Championship · 2026 · After R6 Monaco</span><span>Tap for breakdown</span></div>`;
    const rows=standings.map((d,i)=>{
      const name=d.Driver?.familyName||'—';
      const team=normalizeTeam(d.Constructors?.[0]?.name||'—');
      const nat=d.Driver?.nationality||'';
      const flag=driverFlag(nat);
      const pts=parseFloat(d.points)||0;
      const leaderPts=parseFloat(standings[0].points)||0;
      const gap=i===0?'LEADER':`-${leaderPts-pts}`;
      const isSelected=selectedDriverChamp===name;
      const breakdown=isSelected?renderDriverBreakdown(name,team,pts):'';
      return`<div>
        <div class="champ-row" style="${isSelected?'background:#0a0005;border-left:2px solid var(--red);':''}" onclick="track('driver:expand:f1',{name:'${name}'});selectedDriverChamp=selectedDriverChamp==='${name}'?null:'${name}';renderF1();">
          <div class="champ-pos" style="color:${i===0?'var(--yellow)':i===1?'#c0c0c0':i===2?'#cd7f32':'var(--muted)'}">${i+1}</div>
          <div class="flag-cell">${flag}</div>
          <div>
            <div class="champ-name">${name}</div>
            <div class="champ-team-sm" style="color:${tc(team)}">${team}</div>
          </div>
          <div class="champ-pts">${pts}</div>
          <div class="champ-gap" style="color:${i===0?'var(--yellow)':'var(--muted)'}">${gap}</div>
        </div>
        ${breakdown}
      </div>`;
    }).join('');
    content.innerHTML=hdr+rows;
    setStats(`${standings[0]?.points||'—'} pts`,standings[0]?.Driver?.familyName||'—','DRIVERS','2026');
    if(selectedDriverChamp){
      setTimeout(()=>{
        const el=document.querySelector('[style*="border-left:2px solid var(--red)"]');
        if(el)el.scrollIntoView({behavior:'smooth',block:'nearest'});
      },50);
    }
  }catch(e){content.innerHTML=`<div class="state-screen"><div class="state-icon">⚠️</div><div class="state-title">Couldn't Load</div><div class="state-sub">Tap ⟳ to retry.</div></div>`;}
}

// ── CONSTRUCTOR PER-RACE POINTS — REAL VERIFIED ───────────────────────────────
// Each team's drivers' GP finishing positions and points per round.
// Sprint points are added by computing per-driver sprint earnings from SPRINT_RESULTS.
// Totals (including sprints) verified against official constructor standings.
const CONSTRUCTOR_RACE_POINTS={
  'Mercedes':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Russell',pos:1,pts:25},{name:'Antonelli',pos:2,pts:18}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:2,pts:18}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:4,pts:12}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:4,pts:12}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:0,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:12,pts:0}]}],
  'Ferrari':      [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Leclerc',pos:3,pts:15},{name:'Hamilton',pos:4,pts:12}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Hamilton',pos:3,pts:15},{name:'Leclerc',pos:4,pts:12}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Leclerc',pos:3,pts:15},{name:'Hamilton',pos:6,pts:8}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Hamilton',pos:6,pts:8},{name:'Leclerc',pos:8,pts:4}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Hamilton',pos:2,pts:18},{name:'Leclerc',pos:4,pts:12}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Hamilton',pos:2,pts:18},{name:'Leclerc',pos:0,pts:0}]}],
  'McLaren':      [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Norris',pos:5,pts:10},{name:'Piastri',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Norris',pos:0,pts:0},{name:'Piastri',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Piastri',pos:2,pts:18},{name:'Norris',pos:5,pts:10}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Norris',pos:2,pts:18},{name:'Piastri',pos:3,pts:15}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Piastri',pos:11,pts:0},{name:'Norris',pos:0,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Piastri',pos:4,pts:12},{name:'Norris',pos:0,pts:0}]}],
  'Red Bull':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Verstappen',pos:6,pts:8},{name:'Hadjar',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Hadjar',pos:8,pts:4},{name:'Verstappen',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Verstappen',pos:8,pts:4},{name:'Hadjar',pos:12,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Verstappen',pos:5,pts:10},{name:'Hadjar',pos:0,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Verstappen',pos:3,pts:15},{name:'Hadjar',pos:5,pts:10}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Hadjar',pos:3,pts:15},{name:'Verstappen',pos:0,pts:0}]}],
  'Alpine':       [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Gasly',pos:10,pts:1},{name:'Colapinto',pos:14,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Gasly',pos:6,pts:8},{name:'Colapinto',pos:10,pts:1}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Gasly',pos:7,pts:6},{name:'Colapinto',pos:16,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Colapinto',pos:7,pts:6},{name:'Gasly',pos:0,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Colapinto',pos:6,pts:8},{name:'Gasly',pos:8,pts:4}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Gasly',pos:7,pts:6},{name:'Colapinto',pos:14,pts:0}]}],
  'Haas F1 Team': [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Bearman',pos:7,pts:6},{name:'Ocon',pos:11,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Bearman',pos:5,pts:10},{name:'Ocon',pos:14,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Ocon',pos:10,pts:1},{name:'Bearman',pos:0,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Bearman',pos:11,pts:0},{name:'Ocon',pos:13,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Bearman',pos:10,pts:1},{name:'Ocon',pos:14,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Ocon',pos:9,pts:2},{name:'Bearman',pos:0,pts:0}]}],
  'Racing Bulls': [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Lindblad',pos:8,pts:4},{name:'Lawson',pos:13,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Lawson',pos:7,pts:6},{name:'Lindblad',pos:12,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Lawson',pos:9,pts:2},{name:'Lindblad',pos:14,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Lindblad',pos:14,pts:0},{name:'Lawson',pos:20,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Lawson',pos:7,pts:6},{name:'Lindblad',pos:0,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Lawson',pos:5,pts:10},{name:'Lindblad',pos:6,pts:8}]}],
  'Williams':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Albon',pos:12,pts:0},{name:'Sainz',pos:15,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Sainz',pos:9,pts:2},{name:'Albon',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Sainz',pos:15,pts:0},{name:'Albon',pos:20,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Sainz',pos:9,pts:2},{name:'Albon',pos:10,pts:1}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Sainz',pos:9,pts:2},{name:'Albon',pos:0,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Albon',pos:8,pts:4},{name:'Sainz',pos:0,pts:0}]}],
  'Audi':         [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Bortoleto',pos:9,pts:2},{name:'Hulkenberg',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Hulkenberg',pos:11,pts:0},{name:'Bortoleto',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Hulkenberg',pos:11,pts:0},{name:'Bortoleto',pos:13,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Bortoleto',pos:12,pts:0},{name:'Hulkenberg',pos:19,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Hulkenberg',pos:12,pts:0},{name:'Bortoleto',pos:13,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Bortoleto',pos:11,pts:0},{name:'Hulkenberg',pos:13,pts:0}]}],
  'Cadillac':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Perez',pos:16,pts:0},{name:'Bottas',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Bottas',pos:13,pts:0},{name:'Perez',pos:15,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Perez',pos:17,pts:0},{name:'Bottas',pos:19,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Perez',pos:16,pts:0},{name:'Bottas',pos:18,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Bottas',pos:16,pts:0},{name:'Perez',pos:0,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Perez',pos:15,pts:0},{name:'Bottas',pos:0,pts:0}]}],
  'Aston Martin': [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Stroll',pos:17,pts:0},{name:'Alonso',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Alonso',pos:0,pts:0},{name:'Stroll',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Alonso',pos:18,pts:0},{name:'Stroll',pos:0,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Alonso',pos:15,pts:0},{name:'Stroll',pos:17,pts:0}]},{round:5,race:'Canada',flag:'🇨🇦',drivers:[{name:'Stroll',pos:15,pts:0},{name:'Alonso',pos:0,pts:0}]},{round:6,race:'Monaco',flag:'🇲🇨',drivers:[{name:'Alonso',pos:10,pts:1},{name:'Stroll',pos:0,pts:0}]}],
};

let selectedConstructorChamp=null;

function teamRoundTotal(teamName,round){
  const races=CONSTRUCTOR_RACE_POINTS[teamName]||[];
  const r=races.find(x=>x.round===round);
  if(!r)return 0;
  const gpPts=r.drivers.reduce((s,d)=>s+(d.pts||0),0);
  const sprintPts=r.drivers.reduce((s,d)=>s+getSprintPts(d.name,round),0);
  return gpPts+sprintPts;
}

function renderConstructorBreakdown(name,totalPts){
  const races=CONSTRUCTOR_RACE_POINTS[name]||[];
  if(!races.length)return'';
  const maxPts=50; // max weekend (1-2 GP + sprint 1-2)
  const bars=races.map(r=>{
    const total=teamRoundTotal(name,r.round);
    const h=total>0?Math.max(4,Math.round((total/maxPts)*40)):2;
    return`<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;">
      <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:${total>0?'var(--yellow)':'var(--muted)'};">${total>0?total:''}</div>
      <div style="width:100%;max-width:32px;height:${h}px;background:${total>0?tc(name):'var(--dim)'};border-radius:2px 2px 0 0;opacity:0.85;"></div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:var(--muted);">${r.flag}</div>
    </div>`;
  }).join('');

  const raceRows=races.map(r=>{
    const gpTotal=r.drivers.reduce((s,d)=>s+(d.pts||0),0);
    const sprintTotal=r.drivers.reduce((s,d)=>s+getSprintPts(d.name,r.round),0);
    const total=gpTotal+sprintTotal;
    const sprintRows=sprintTotal>0?r.drivers.filter(d=>getSprintPts(d.name,r.round)>0).map(d=>`
      <div style="display:grid;grid-template-columns:28px 1fr auto auto;align-items:center;padding:3px 16px 4px;gap:10px;background:#0d0805;">
        <div></div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--orange);">${d.name} sprint</div>
        <div></div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--orange);text-align:right;min-width:36px;">+${getSprintPts(d.name,r.round)}</div>
      </div>`).join(''):'';
    return`<div style="border-bottom:1px solid #141414;">
      <div style="display:grid;grid-template-columns:28px 1fr auto;align-items:center;padding:8px 16px 4px;gap:10px;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);text-align:center;">R${r.round}</div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:13px;">${r.flag}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:var(--text);">${r.race}</span>
        </div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:13px;color:${total>0?'var(--yellow)':'var(--muted)'};text-align:right;">${total>0?'+'+total:'0'} pts</div>
      </div>
      ${r.drivers.map(d=>`
        <div style="display:grid;grid-template-columns:28px 1fr auto auto;align-items:center;padding:3px 16px 6px;gap:10px;">
          <div></div>
          <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);">${d.name}</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:${posColor(d.pos)};text-align:right;">${posLabel(d.pos)}</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:${d.pts>0?'var(--yellow)':'var(--muted)'};text-align:right;min-width:36px;">${d.pts>0?'+'+d.pts:'—'}</div>
        </div>`).join('')}
      ${sprintRows}
    </div>`;
  }).join('');

  return`<div style="background:var(--surface2);border-top:1px solid var(--border);border-bottom:2px solid ${tc(name)};">
    <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:var(--white);">${name} — Points by Weekend</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:${tc(name)};margin-top:2px;">${totalPts} pts total · 4 races · GP + Sprint combined</div>
      </div>
      <button onclick="selectedConstructorChamp=null;renderConstructors();" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">✕</button>
    </div>
    <div style="padding:12px 16px 8px;display:flex;align-items:flex-end;gap:6px;height:80px;border-bottom:1px solid var(--border);">${bars}</div>
    ${raceRows}
  </div>`;
}

async function renderConstructors(){
  const content=document.getElementById('main-content');
  content.innerHTML=`<div class="state-screen"><div class="state-icon">⟳</div><div class="state-title">Loading...</div></div>`;
  try{
    const standings=await fetchConstructorStandings();
    if(!standings.length){content.innerHTML=`<div class="state-screen"><div class="state-icon">🏎</div><div class="state-title">No Data Yet</div></div>`;return;}
    const hdr=`<div class="section-title"><span>Constructors Championship · 2026 · After R6 Monaco</span><span>Tap for breakdown</span></div>`;
    const rows=standings.map((c,i)=>{
      const name=normalizeTeam(c.Constructor?.name||'—');
      const nat=c.Constructor?.nationality||'';
      const flag=NAT_FLAGS[nat]||'🏳️';
      const pts=parseFloat(c.points)||0;
      const leaderPts=parseFloat(standings[0].points)||0;
      const gap=i===0?'LEADER':`-${leaderPts-pts}`;
      const isSelected=selectedConstructorChamp===name;
      const breakdown=isSelected?renderConstructorBreakdown(name,pts):'';
      return`<div>
        <div class="champ-row" style="${isSelected?`background:#0a0005;border-left:2px solid ${tc(name)};`:''}" onclick="track('constructor:expand:f1',{name:'${name}'});selectedConstructorChamp=selectedConstructorChamp==='${name}'?null:'${name}';renderF1();">
          <div class="champ-pos" style="color:${i===0?'var(--yellow)':i===1?'#c0c0c0':i===2?'#cd7f32':'var(--muted)'}">${i+1}</div>
          <div class="flag-cell">${flag}</div>
          <div>
            <div class="champ-name">${name}</div>
            <div class="champ-team-sm" style="color:${tc(name)}">${nat}</div>
          </div>
          <div class="champ-pts">${pts}</div>
          <div class="champ-gap" style="color:${i===0?'var(--yellow)':'var(--muted)'}">${gap}</div>
        </div>
        ${breakdown}
      </div>`;
    }).join('');
    content.innerHTML=hdr+rows;
    setStats(`${standings[0]?.points||'—'} pts`,normalizeTeam(standings[0]?.Constructor?.name||'—'),'CONSTR.','2026');
    if(selectedConstructorChamp){
      setTimeout(()=>{
        const panels=document.querySelectorAll('[style*="border-bottom:2px solid"]');
        if(panels.length)panels[panels.length-1].scrollIntoView({behavior:'smooth',block:'nearest'});
      },50);
    }
  }catch(e){content.innerHTML=`<div class="state-screen"><div class="state-icon">⚠️</div><div class="state-title">Couldn't Load</div><div class="state-sub">Tap ⟳ to retry.</div></div>`;}
}

// ─── F1 LIVE TAB · SUB-TABS ──────────────────────────────────────────────────
// LIVE is split into three inner sub-tabs: PRACTICE / QUALIFYING / RACE. Each
// owns its own data source and rendering — the outer state machine (computeF1State)
// just decides which sub-tab to default to when the user first enters LIVE.
//
// Behavior summary:
//   PRACTICE   — live FP1/FP2/FP3 timing via OpenF1 when a practice session is in
//                progress; otherwise off-air "no practice session active".
//   QUALIFYING — live Qualifying timing via OpenF1 when quali is in progress;
//                otherwise the completed qualifying grid pulled from Jolpica;
//                if neither, off-air.
//   RACE       — live race timing via OpenF1 when the race is in progress;
//                otherwise off-air.
//
// In `post-race` state all three sub-tabs clear (off-air with "see Race Results"
// CTA) — the top-level RACE RESULTS tab is the canonical place for finished races.

let currentF1LiveSubTab=null;  // null = derive default from state; once user picks, sticks.
const F1_LIVE_SUBTABS=['practice','qualifying','race'];

// ─── PRACTICE PERSISTENCE ────────────────────────────────────────────────────
// FP1 / FP2 / FP3 timing snapshots persist in localStorage across page reloads
// AND across "session ended" transitions, so the PRACTICE sub-tab keeps showing
// last-completed standings until the race goes live. On race-start, the cache
// for that round is wiped (handled at the top of renderLive).
//
// Storage key: `traxstat:f1:practice:{round}` → { fp1?, fp2?, fp3? }
// Each FP entry: { capturedAt, sessionKey, sessionType, sessionEnd,
//                  fastest, leader, maxLap, rows: [{pos,num,name,team,teamColor,
//                  lapMs,isFastest,isPit,compound,tireAge,gapVal}, …] }
const F1_PRACTICE_KEY_PREFIX='traxstat:f1:practice:';
function f1PracticeKey(round){return F1_PRACTICE_KEY_PREFIX+round;}
function getF1PracticeCache(round){
  try{const raw=localStorage.getItem(f1PracticeKey(round));return raw?JSON.parse(raw):{};}catch(e){return {};}
}
function setF1PracticeSnapshot(round,fpKey,snapshot){
  const cache=getF1PracticeCache(round);
  cache[fpKey]=snapshot;
  try{localStorage.setItem(f1PracticeKey(round),JSON.stringify(cache));}catch(e){console.warn('F1 practice cache write failed',e);}
}
function clearF1PracticeCache(round){
  try{localStorage.removeItem(f1PracticeKey(round));}catch(e){}
}
function sessionTypeToPracticeKey(st){
  const s=(st||'').toLowerCase();
  if(s==='practice 1')return 'fp1';
  if(s==='practice 2')return 'fp2';
  if(s==='practice 3')return 'fp3';
  return null;
}

// Round number of the closest race weekend (±7 days before / 1 day after race
// day). Used both for caching practice snapshots and for cache-clearing on
// race-start. Returns null outside any weekend window.
function currentRaceWeekendRound(){
  const now=Date.now();
  for(const r of NEXT_RACES){
    const days=(now-new Date(r.date+'T13:00:00Z').getTime())/86400000;
    if(days>=-7&&days<=1)return r.round;
  }
  return null;
}

// Card expansion state — keyed by `${round}_${fpKey}`. Defaults: currently
// live session is expanded; the most recent completed practice is expanded;
// older completed practices are collapsed.
let f1PracticeExpanded={};
function toggleF1PracticeCard(round,fpKey){
  track('f1:practice-card',{fp:fpKey,round});
  const k=`${round}_${fpKey}`;
  f1PracticeExpanded[k]=!f1PracticeExpanded[k];
  renderLive();
}

// Simple "Nm ago / Nh ago" formatter for the captured-at line on a card.
function f1FormatTimeAgo(ts){
  if(!ts)return '—';
  const diff=Date.now()-ts;
  if(diff<0)return 'just now';
  const m=Math.floor(diff/60000);
  if(m<1)return 'just now';
  if(m<60)return m+'m ago';
  const h=Math.floor(m/60);
  if(h<24)return h+'h ago';
  return Math.floor(h/24)+'d ago';
}

// State-transition tracking: when state flips into 'session-live' (race), wipe
// the practice cache for the current round so race data takes over.
let _f1LastState=null;

function defaultF1LiveSubTab(state){
  if(state==='session-live')return 'race';
  if(state==='qualifying-available')return 'qualifying';
  if(state==='practice-available')return 'practice';
  if(state==='post-race')return 'race';
  return 'practice';
}

function switchF1LiveTab(t){
  if(!F1_LIVE_SUBTABS.includes(t))return;
  track('tab:f1-live',{sub:t});
  currentF1LiveSubTab=t;
  renderLive();
}

function renderF1LiveSubTabBar(active){
  const label={practice:'PRACTICE',qualifying:'QUALIFYING',race:'RACE'};
  const tabs=F1_LIVE_SUBTABS.map(k=>
    `<div class="f1-sub-tab ${k===active?'active':''}" onclick="switchF1LiveTab('${k}')" id="tab-live-${k}">${label[k]}</div>`
  ).join('');
  // Reuse the .f1-submenu visual treatment (same as the outer F1 sub-menu)
  // so the inner sub-tab bar feels native. position:relative keeps it in flow
  // inside main-content rather than sticking to the chrome.
  return `<div class="f1-submenu" style="display:flex;position:relative;">${tabs}</div>`;
}

// Adaptive LIVE renderer. Banner + sub-tab bar + dispatch to the selected
// sub-tab's renderer. The state machine picks a default sub-tab on first
// entry; user picks override.
//
// Render order is important: the LIVE banner and sub-tab bar paint IMMEDIATELY
// so the user sees the tab transition even on slow networks. State-machine
// network calls (OpenF1, Jolpica) then resolve in the background and the body
// is filled in afterwards. Previously the entire renderer awaited the state
// machine before touching the DOM — on flaky mobile networks that left the
// previous view (e.g. series-home tiles) stuck under the sub-menu bar.
// Race-specific banner for the LIVE tab — replaces the generic "Live / Formula
// 1 / 2026 Season · After Round 4" header with the current weekend's race so
// the user always sees which Grand Prix they're looking at. Falls back to the
// generic banner outside any weekend window.
function renderF1LiveBanner(){
  const round=currentRaceWeekendRound();
  const race=round?NEXT_RACES.find(r=>r.round===round):null;
  if(!race)return renderSeriesBanner('f1','live');
  const sprintLabel=race.sprint?' · SPRINT WEEKEND':'';
  return `<div class="tx-banner">
    <div class="tx-banner-label">F1 · LIVE · ROUND ${race.round}${sprintLabel}</div>
    <div class="tx-banner-title">${race.country} ${race.name}</div>
    <div class="tx-banner-sub">${race.circuit} · ${fmtDate(race.date)}</div>
  </div>`;
}

async function renderLive(){
  const content=document.getElementById('main-content');
  const top=renderF1LiveBanner()+renderBackToSeriesHome('f1');
  // Optimistic sub-tab: respect the user's last pick, else assume PRACTICE.
  // If the state machine resolves a different default, re-render below.
  const optimisticActive=currentF1LiveSubTab||'practice';
  const optimisticSubBar=renderF1LiveSubTabBar(optimisticActive);
  content.innerHTML=top+optimisticSubBar+`<div class="state-screen"><div class="state-icon">⏱</div><div class="state-title">Loading...</div><div class="state-sub">Fetching session state</div></div>`;

  let state;
  try{state=await getF1RaceWeekendState();}
  catch(e){console.warn('F1 state machine failed',e);state='between-races';}

  // Cache eviction on race-start. If state has just transitioned into
  // 'session-live' (race), clear the practice cache for the current round
  // so race data takes over. Idempotent: clearing twice is fine.
  if(state==='session-live'){
    const round=currentRaceWeekendRound();
    if(round&&_f1LastState!=='session-live'){
      clearF1PracticeCache(round);
      console.log(`F1: race-live transition for R${round} — practice cache cleared.`);
    }
  }
  _f1LastState=state;

  const active=currentF1LiveSubTab||defaultF1LiveSubTab(state);
  const subBar=renderF1LiveSubTabBar(active);
  try{
    let body;
    if(active==='practice')body=await renderLivePracticeBody(state);
    else if(active==='qualifying')body=await renderLiveQualifyingBody(state);
    else body=await renderLiveRaceBody(state);
    content.innerHTML=top+subBar+body;
  }catch(e){
    console.error('renderLive error',e);
    content.innerHTML=top+subBar+renderLiveOffAir('error');
    setStats('—','—','STANDBY','—');
  }
}

// ─── OpenF1 SESSION HELPERS ──────────────────────────────────────────────────
// Single cached sessions fetch so the three sub-tabs share one OpenF1 hit
// per minute instead of three. Falls back to [] on network failure.
let _f1SessionsCache=null;
let _f1SessionsCacheAt=0;
// Race a fetch against a 6s timeout so a hung network never blocks the
// LIVE renderer. Returns [] on failure.
async function fetchF1Sessions(){
  if(_f1SessionsCache&&(Date.now()-_f1SessionsCacheAt)<60000)return _f1SessionsCache;
  const timeout=new Promise(resolve=>setTimeout(()=>resolve(null),6000));
  const request=fetch('https://api.openf1.org/v1/sessions?session_type!=Testing&year=2026')
    .then(r=>r.ok?r.json():null)
    .catch(()=>null);
  const result=await Promise.race([request,timeout]);
  if(!result){console.warn('F1 sessions fetch timed out or failed');return [];}
  _f1SessionsCache=result;
  _f1SessionsCacheAt=Date.now();
  return _f1SessionsCache;
}
// Map a sub-tab key to an OpenF1 session_type matcher. session_type values seen
// in OpenF1 include "Practice 1/2/3", "Sprint Qualifying", "Sprint", "Qualifying",
// "Race" — we group Sprint Qualifying with QUALIFYING and Sprint with RACE.
function sessionMatchesSubTab(session,subTab){
  const st=(session.session_type||'').toLowerCase();
  if(subTab==='practice')return st.startsWith('practice');
  if(subTab==='qualifying')return st.includes('qualif');  // matches "Qualifying" and "Sprint Qualifying"
  if(subTab==='race')return st==='race'||st==='sprint';
  return false;
}
function findActiveSession(sessions,subTab){
  const now=Date.now();
  return sessions.find(s=>sessionMatchesSubTab(s,subTab)&&new Date(s.date_start).getTime()<=now&&new Date(s.date_end).getTime()>=now);
}

// ─── SHARED: live timing table for any session ───────────────────────────────
// Extracted from the original renderLiveSession. Returns { html, summary } —
// the HTML for the full table and a small summary object the caller uses
// to set the bottom stats bar.
async function buildLiveTimingTable(session){
  const sk=session.session_key,st=session.session_type||'Session';
  const [drs,pos,lps,sts,ivs]=await Promise.all([
    fetch(`https://api.openf1.org/v1/drivers?session_key=${sk}`).then(r=>r.json()),
    fetch(`https://api.openf1.org/v1/position?session_key=${sk}`).then(r=>r.json()),
    fetch(`https://api.openf1.org/v1/laps?session_key=${sk}`).then(r=>r.json()),
    fetch(`https://api.openf1.org/v1/stints?session_key=${sk}`).then(r=>r.json()),
    fetch(`https://api.openf1.org/v1/intervals?session_key=${sk}`).then(r=>r.json()).catch(()=>[])
  ]);
  const dm={};drs.forEach(d=>{dm[d.driver_number]=d;});
  const positions={};pos.forEach(p=>{if(!positions[p.driver_number]||p.date>positions[p.driver_number].date)positions[p.driver_number]=p;});
  const ld={};lps.forEach(l=>{if(!ld[l.driver_number])ld[l.driver_number]=[];ld[l.driver_number].push(l);});
  const stints={};sts.forEach(s=>{if(!stints[s.driver_number]||s.stint_number>(stints[s.driver_number].stint_number||0))stints[s.driver_number]=s;});
  const intervals={};ivs.forEach(i=>{if(!intervals[i.driver_number]||i.date>intervals[i.driver_number].date)intervals[i.driver_number]=i;});
  const sorted=Object.values(positions).sort((a,b)=>a.position-b.position);
  const maxLap=Math.max(...Object.values(ld).map(l=>l.length),0);
  let ft=Infinity,leader=null;
  sorted.forEach(p=>{
    const dl=ld[p.driver_number]||[];
    if(dl.length>0){const b=Math.min(...dl.filter(l=>l.lap_duration).map(l=>l.lap_duration*1000));if(b<ft)ft=b;}
    if(p.position===1)leader=dm[p.driver_number];
  });
  if(!sorted.length)return {html:null,summary:null,rows:[]};
  // Two-stage build: structured row objects first (cache-friendly), then
  // HTML. The structured rows are what gets persisted to localStorage so
  // we can re-render a completed practice card without re-querying OpenF1.
  const rowsData=sorted.map((p,i)=>{
    const dn=p.driver_number,dr=dm[dn]||{},dl=ld[dn]||[],stint=stints[dn]||{},intv=intervals[dn]||{};
    const ll=dl.length>0?dl[dl.length-1]:null,lapMs=ll?.lap_duration?ll.lap_duration*1000:null;
    const blms=dl.length>0?Math.min(...dl.filter(l=>l.lap_duration).map(l=>l.lap_duration*1000)):null;
    const isFastest=!!(blms&&Math.abs(blms-ft)<1);
    const isPit=!!ll?.is_pit_out_lap;
    const compound=stint.compound||null;
    const tireAge=stint.lap_start?(maxLap-stint.lap_start+1):null;
    const gapVal=i===0?0:(intv.gap_to_leader!==undefined?intv.gap_to_leader:null);
    const teamColor=tc(DT[dn]||'default');
    const teamName=normalizeTeam(dr.team_name||DT[dn]||'—');
    const name=dr.full_name?dr.full_name.split(' ').pop().toUpperCase():'#'+dn;
    return {pos:p.position,num:dn,name,team:teamName,teamColor,lapMs,isFastest,isPit,compound,tireAge,gapVal};
  });
  const thRow=`<div class="timing-header-row"><div class="th left">POS</div><div class="th"></div><div class="th left">DRIVER</div><div class="th">GAP</div><div class="th">LAST LAP</div><div class="th">TIRE</div></div>`;
  const rowsHtml=rowsData.map((r,i)=>`<div class="driver-row ${i===0?'p1-live':''}">
      <div class="pos-cell ${posC(r.pos)}">${r.pos}</div>
      <div><div class="team-color-bar" style="background:${r.teamColor}"></div></div>
      <div><div class="d-name">${r.name}</div><div class="d-team">${r.team}</div></div>
      <div class="${i===0?'gap-leader-cell':'gap-cell'}">${i===0?'LEADER':fmtGap(r.gapVal)}</div>
      <div class="lap-cell ${r.isFastest?'lap-fastest':r.isPit?'lap-pit':'lap-normal'}">${r.isPit?'PIT':fmtLap(r.lapMs)}</div>
      <div class="tire-cell">${tireBadge(r.compound,r.tireAge)}</div>
    </div>`).join('');
  return {
    html:thRow+rowsHtml,
    summary:{fastest:ft<Infinity?fmtLap(ft):'—',leader:leader?.name_acronym||'—',sessionType:st,maxLap,meeting:session.meeting_name||''},
    rows:rowsData
  };
}

// Render a cached row-set (no OpenF1 hit) — used by the persistent practice
// cards once a session has ended. Same visual treatment as live timing.
function renderTimingTableFromRows(rows){
  if(!rows||!rows.length)return '<div style="padding:14px;text-align:center;font-family:\'Barlow\',sans-serif;font-size:11px;color:var(--muted);">No driver data captured for this session.</div>';
  const thRow=`<div class="timing-header-row"><div class="th left">POS</div><div class="th"></div><div class="th left">DRIVER</div><div class="th">GAP</div><div class="th">LAST LAP</div><div class="th">TIRE</div></div>`;
  const rowsHtml=rows.map((r,i)=>`<div class="driver-row ${i===0?'p1-live':''}">
      <div class="pos-cell ${posC(r.pos)}">${r.pos}</div>
      <div><div class="team-color-bar" style="background:${r.teamColor}"></div></div>
      <div><div class="d-name">${r.name}</div><div class="d-team">${r.team}</div></div>
      <div class="${i===0?'gap-leader-cell':'gap-cell'}">${i===0?'LEADER':fmtGap(r.gapVal)}</div>
      <div class="lap-cell ${r.isFastest?'lap-fastest':r.isPit?'lap-pit':'lap-normal'}">${r.isPit?'PIT':fmtLap(r.lapMs)}</div>
      <div class="tire-cell">${tireBadge(r.compound,r.tireAge)}</div>
    </div>`).join('');
  return thRow+rowsHtml;
}

// Off-air state with sub-tab-specific copy. Reuses the standard panel layout
// but customises the headline so the user knows WHY this sub-tab is empty
// (no session active vs. session not yet started vs. race finished, etc.).
function renderLiveSubTabOffAir(headline,detail){
  return `<div style="padding:18px 16px;text-align:center;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);letter-spacing:0.1em;">⬤ ${headline}</div>
    <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);margin-top:6px;line-height:1.5;">${detail}</div>
  </div>`;
}

// ─── PRACTICE sub-tab ────────────────────────────────────────────────────────
// Renders three persistent cards (FP1 / FP2 / FP3) for the current race weekend.
//
// Mapping of OpenF1 sessions → FP slots:
//   - Explicit "Practice 1 / 2 / 3" names map directly.
//   - Sprint-weekend sessions (where OpenF1 returns just "Practice") are slotted
//     in chronological order into the remaining FP keys.
//
// Cache behavior:
//   - Live session → refetch on every render (30s setInterval).
//   - Completed session not yet cached → backfill once from OpenF1 (so the tab
//     populates even if the user opens it AFTER a session ended).
//   - Completed session already cached → render from localStorage, no fetch.
//   - When state transitions to 'session-live' (race), renderLive() wipes the
//     cache and this tab redirects the user to the RACE sub-tab.
async function renderLivePracticeBody(state){
  if(state==='post-race'){
    setStats('—','—','POST','PRACTICE');
    return renderLiveSubTabOffAir('PRACTICE COMPLETE','Race weekend complete — practice data is no longer cached. See <span onclick="switchF1Tab(\'races\')" style="color:var(--red);text-decoration:underline;cursor:pointer;">RACE RESULTS</span>.');
  }
  if(state==='session-live'){
    setStats('—','—','RACE','LIVE');
    return renderLiveSubTabOffAir('RACE IS LIVE','Practice cache cleared at race start. Tap <span onclick="switchF1LiveTab(\'race\')" style="color:var(--red);text-decoration:underline;cursor:pointer;">RACE</span> for live timing.');
  }

  const round=currentRaceWeekendRound();
  if(!round){
    document.getElementById('live-pill').style.display='none';
    setStats('—','—','STANDBY','PRACTICE');
    return renderLiveSubTabOffAir('NO RACE WEEKEND','Practice cards will appear during the next F1 weekend (within 7 days of race day).');
  }
  const race=NEXT_RACES.find(r=>r.round===round);
  if(!race){
    setStats('—','—','STANDBY','PRACTICE');
    return renderLiveSubTabOffAir('ROUND METADATA MISSING','Race metadata for the current weekend isn\'t loaded.');
  }

  const sessions=await fetchF1Sessions();
  // Practice sessions tied to THIS weekend (within −4 to +1 days of race day).
  const raceMs=new Date(race.date+'T13:00:00Z').getTime();
  const weekendPractices=sessions.filter(s=>{
    const st=(s.session_type||'').toLowerCase();
    if(!(st.startsWith('practice')||st==='free practice'))return false;
    const start=new Date(s.date_start).getTime();
    const days=(start-raceMs)/86400000;
    return days>=-4&&days<=1;
  }).sort((a,b)=>new Date(a.date_start).getTime()-new Date(b.date_start).getTime());

  // Build the fp1/fp2/fp3 → OpenF1-session map. Explicit "Practice 1/2/3" names
  // get their direct slot; generic "Practice" or "Free Practice" names fill
  // remaining slots in chronological order. Handles full weekends AND sprint
  // weekends (1 practice) uniformly.
  const sessionsByFp={};
  for(const s of weekendPractices){
    const st=(s.session_type||'').toLowerCase();
    if(st==='practice 1')sessionsByFp.fp1=s;
    else if(st==='practice 2')sessionsByFp.fp2=s;
    else if(st==='practice 3')sessionsByFp.fp3=s;
  }
  const remainingSlots=['fp1','fp2','fp3'].filter(k=>!sessionsByFp[k]);
  const unnamed=weekendPractices.filter(s=>{
    const st=(s.session_type||'').toLowerCase();
    return !['practice 1','practice 2','practice 3'].includes(st);
  });
  for(let i=0;i<Math.min(remainingSlots.length,unnamed.length);i++){
    sessionsByFp[remainingSlots[i]]=unnamed[i];
  }

  const now=Date.now();
  let cache=getF1PracticeCache(round);
  let activeFpKey=null;

  // Walk FP slots in order. For each: live → refetch; completed-not-cached →
  // backfill from OpenF1; completed-cached → skip.
  for(const fpKey of ['fp1','fp2','fp3']){
    const sess=sessionsByFp[fpKey];
    if(!sess)continue;
    const start=new Date(sess.date_start).getTime();
    const end=new Date(sess.date_end).getTime();
    const isActive=start<=now&&end>=now;
    if(isActive)activeFpKey=fpKey;
    if(!isActive&&cache[fpKey])continue;
    try{
      const {summary,rows}=await buildLiveTimingTable(sess);
      if(rows&&rows.length){
        setF1PracticeSnapshot(round,fpKey,{
          capturedAt:Date.now(),
          sessionKey:sess.session_key,
          sessionType:sess.session_type,
          sessionEnd:end,
          fastest:summary.fastest,
          leader:summary.leader,
          maxLap:summary.maxLap,
          rows
        });
      }
    }catch(e){console.warn(`F1 practice ${fpKey} fetch failed`,e);}
  }
  cache=getF1PracticeCache(round);
  document.getElementById('live-pill').style.display=activeFpKey?'flex':'none';

  const fpKeys=['fp1','fp2','fp3'];
  const anyCached=fpKeys.some(k=>cache[k]);
  if(!anyCached&&!activeFpKey){
    setStats('—','—','STANDBY','PRACTICE');
    return renderLiveSubTabOffAir('NO PRACTICE DATA YET','Live FP1 / FP2 / FP3 timing will appear here once a practice session starts (and stays cached after it ends).');
  }

  const latestCached=[...fpKeys].reverse().find(k=>cache[k])||null;
  const isExpanded=(fpKey)=>{
    const k=`${round}_${fpKey}`;
    if(k in f1PracticeExpanded)return f1PracticeExpanded[k];
    if(fpKey===activeFpKey)return true;
    if(!activeFpKey&&fpKey===latestCached)return true;
    return false;
  };

  const cards=fpKeys.map(k=>renderF1PracticeCard(round,k,cache[k],activeFpKey===k,isExpanded(k))).join('');
  const dimming=(state==='qualifying-available')?'opacity:0.6;':'';
  const dimNote=(state==='qualifying-available')
    ? `<div style="padding:8px 16px;background:#1a1500;border-bottom:1px solid var(--border);font-family:'Barlow',sans-serif;font-size:10px;color:var(--yellow);text-align:center;letter-spacing:0.08em;">QUALIFYING IS THE ACTIVE SESSION — PRACTICE CARDS SHOWN FOR REFERENCE</div>`
    : '';

  if(activeFpKey&&cache[activeFpKey]){
    const c=cache[activeFpKey];
    setStats(c.fastest||'—',c.leader||'—',(c.sessionType||'PRAC').toUpperCase().slice(0,4),c.maxLap>0?`L${c.maxLap}`:'PRAC');
  } else if(latestCached){
    const c=cache[latestCached];
    setStats(c.fastest||'—',c.leader||'—',(c.sessionType||'PRAC').toUpperCase().slice(0,4),latestCached.toUpperCase());
  } else {
    setStats('—','—','STANDBY','PRACTICE');
  }

  const header=`<div class="section-title"><span>Practice · Round ${round}</span><span>${activeFpKey?'Live + cached':'Cached locally'}</span></div>`;
  return header+dimNote+`<div style="${dimming}">${cards}</div>`;
}

// Card for a single practice session. Always rendered (one of FP1/FP2/FP3),
// even when there's no data — empty card just shows "session not yet run".
function renderF1PracticeCard(round,fpKey,data,isLive,expanded){
  const label={fp1:'FP1',fp2:'FP2',fp3:'FP3'}[fpKey];
  const fullLabel={fp1:'Practice 1',fp2:'Practice 2',fp3:'Practice 3'}[fpKey];
  const cardBase=`background:var(--surface2);border:1px solid var(--border);margin:10px 12px;border-radius:6px;overflow:hidden;`;

  if(!data){
    return `<div style="${cardBase}opacity:0.55;">
      <div style="padding:12px 14px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:14px;color:var(--muted);letter-spacing:0.04em;">${label} · ${fullLabel}</div>
          <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-top:2px;">Session has not run yet</div>
        </div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:14px;color:var(--muted);">—</div>
      </div>
    </div>`;
  }

  const statusBadge=isLive
    ? `<span style="color:var(--green);font-weight:700;">⬤ LIVE</span>`
    : `<span style="color:var(--muted);">FINAL</span>`;
  const ageStr=isLive?'updating in background':`captured ${f1FormatTimeAgo(data.capturedAt)}`;
  const summaryLine=data.fastest?`Fastest ${data.fastest} · ${data.leader||'—'}${data.maxLap?` · L${data.maxLap}`:''}`:'';
  const chev=expanded?'▾':'▸';
  const bodyHtml=expanded?renderTimingTableFromRows(data.rows):'';
  const borderBelow=expanded?'border-bottom:1px solid var(--border);':'';
  return `<div style="${cardBase}">
    <div style="padding:12px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;${borderBelow}" onclick="toggleF1PracticeCard(${round},'${fpKey}')">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:14px;color:var(--white);letter-spacing:0.04em;">${label} · ${fullLabel}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-top:2px;">${statusBadge} · ${ageStr}</div>
        ${summaryLine?`<div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text);margin-top:4px;">${summaryLine}</div>`:''}
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:16px;color:var(--text);padding-left:8px;">${chev}</div>
    </div>
    ${bodyHtml}
  </div>`;
}

// ─── QUALIFYING sub-tab ──────────────────────────────────────────────────────
// OpenF1-first data sourcing. Order of preference:
//   1. Currently-active main Qualifying session → live timing via OpenF1
//   2. Currently-active Sprint Qualifying → live timing via OpenF1
//   3. Most recently completed weekend quali session → OpenF1 captured state
//      (works for "just finished" sessions where Jolpica still lags)
//   4. Jolpica historical grid (absolute last resort, e.g. OpenF1 outage)
async function renderLiveQualifyingBody(state){
  if(state==='post-race'){
    setStats('—','—','POST','QUALI');
    return renderLiveSubTabOffAir('QUALIFYING COMPLETE','Race weekend complete — see <span onclick="switchF1Tab(\'races\')" style="color:var(--red);text-decoration:underline;cursor:pointer;">RACE RESULTS</span>.');
  }

  const round=currentRaceWeekendRound();
  const upcoming=NEXT_RACES.find(r=>new Date(r.date+'T13:00:00Z').getTime()>Date.now());
  const race=NEXT_RACES.find(r=>r.round===round)||upcoming;
  const sessions=await fetchF1Sessions();

  // Collect quali sessions tied to this weekend (sprint quali + main quali on
  // sprint weekends, just quali on normal weekends). Sorted oldest → newest.
  let weekendQuali=[];
  if(race){
    const raceMs=new Date(race.date+'T13:00:00Z').getTime();
    weekendQuali=sessions.filter(s=>{
      const st=(s.session_type||'').toLowerCase();
      if(!st.includes('qualif'))return false;
      const start=new Date(s.date_start).getTime();
      const days=(start-raceMs)/86400000;
      return days>=-4&&days<=1;
    }).sort((a,b)=>new Date(a.date_start).getTime()-new Date(b.date_start).getTime());
  }

  const now=Date.now();
  // Choose session: active main quali > active sprint quali > most recent completed.
  let chosen=null;
  let isLive=false;
  const activeSessions=weekendQuali.filter(s=>new Date(s.date_start).getTime()<=now&&new Date(s.date_end).getTime()>=now);
  if(activeSessions.length){
    chosen=activeSessions.find(s=>(s.session_type||'').toLowerCase()==='qualifying')||activeSessions[activeSessions.length-1];
    isLive=true;
  } else {
    const completed=weekendQuali.filter(s=>new Date(s.date_end).getTime()<now);
    chosen=completed[completed.length-1]||null;
  }

  if(chosen){
    document.getElementById('live-pill').style.display=isLive?'flex':'none';
    const {html,summary}=await buildLiveTimingTable(chosen);
    if(html){
      const statusBadge=isLive
        ? `<span style="color:var(--green);font-weight:700;">⬤ LIVE · OpenF1</span>`
        : `<span style="color:var(--muted);">FINAL · OpenF1</span>`;
      const endStr=isLive?'updating every 30s':`session ended ${f1FormatTimeAgo(new Date(chosen.date_end).getTime())}`;
      const header=`<div class="section-title"><span>${chosen.session_type} · Round ${round||'—'}</span><span>${statusBadge}</span></div>
        <div style="padding:6px 16px;background:var(--bg);border-bottom:1px solid var(--border);font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);text-align:center;">${endStr}</div>`;
      setStats(summary.fastest,summary.leader,(summary.sessionType||'QUAL').toUpperCase().slice(0,4),isLive?`L${summary.maxLap||0}`:'FINAL');
      return header+html;
    }
  }

  // Last-resort: Jolpica historical grid. Only reached if OpenF1 has no
  // weekend quali sessions at all (rare — OpenF1 publishes session metadata
  // before sessions start) or buildLiveTimingTable returned empty rows.
  document.getElementById('live-pill').style.display='none';
  const fallbackRound=round||upcoming?.round;
  if(!fallbackRound){
    setStats('—','—','STANDBY','QUALI');
    return renderLiveSubTabOffAir('QUALIFYING NOT AVAILABLE','No upcoming round — qualifying data resumes when the next weekend begins.');
  }
  let quali=null;
  try{
    const data=await fetch(`${JOLPICA}/2026/${fallbackRound}/qualifying/`).then(r=>r.json());
    quali=data.MRData?.RaceTable?.Races?.[0]?.QualifyingResults;
  }catch(e){}
  if(!quali||!quali.length){
    setStats('—','—','STANDBY','QUALI');
    return renderLiveSubTabOffAir('QUALIFYING NOT YET RUN',`Grid for Round ${fallbackRound}${race?` (${race.name})`:''} will appear once OpenF1 streams the session or Jolpica posts the official results.`);
  }
  const rows=quali.map(r=>{
    const pos=parseInt(r.position);
    const name=r.Driver?.familyName||'—';
    const team=normalizeTeam(r.Constructor?.name||'—');
    const q3=r.Q3||r.Q2||r.Q1||'—';
    const posColor=pos===1?'var(--yellow)':pos===2?'#c0c0c0':pos===3?'#cd7f32':'var(--muted)';
    const bg=pos===1?'background:#0d1a08;':'';
    return`<div style="display:grid;grid-template-columns:32px 1fr 90px;padding:8px 12px;border-bottom:1px solid #141414;align-items:center;gap:6px;${bg}">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:${posColor};text-align:center;">${pos}</div>
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${tc(team)};">${name}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);">${team}</div>
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text);text-align:right;">${q3}</div>
    </div>`;
  }).join('');
  setStats(quali[0]?.Q3||quali[0]?.Q2||quali[0]?.Q1||'—',quali[0]?.Driver?.familyName||'—','QUAL',`R${fallbackRound}`);
  const header=`<div class="section-title"><span>Qualifying · Round ${fallbackRound}${race?` · ${race.name}`:''}</span><span>${quali.length} cars · Jolpica</span></div>`;
  return header+rows;
}

// ─── RACE sub-tab ────────────────────────────────────────────────────────────
async function renderLiveRaceBody(state){
  if(state==='post-race'){
    setStats('—','—','POST','RACE');
    return renderLiveSubTabOffAir('RACE COMPLETE','Latest race has finished — full results live on <span onclick="switchF1Tab(\'races\')" style="color:var(--red);text-decoration:underline;cursor:pointer;">RACE RESULTS</span>.');
  }
  const sessions=await fetchF1Sessions();
  const active=findActiveSession(sessions,'race');
  if(!active){
    // No active session per OpenF1. Two scenarios diverge here:
    //   a) Race genuinely isn't running → standard off-air.
    //   b) Race IS running per hardcoded times but OpenF1 paywalled the
    //      response → explain to user; state==='session-live' confirms (b).
    if(state==='session-live'){
      setStats('—','—','RACE','LIVE');
      document.getElementById('live-pill').style.display='flex';
      return renderLiveSubTabOffAir('LIVE TIMING TEMPORARILY UNAVAILABLE',
        'The race is live now, but OpenF1 (our live-timing source) recently '+
        'started paywalling their API during active F1 sessions. We\'ll '+
        'restore live data automatically the moment the session ends and '+
        'OpenF1 reopens. <br><br>Until then, watch the race on your '+
        'preferred broadcast — and check <span onclick="switchF1Tab(\'races\')" style="color:var(--red);text-decoration:underline;cursor:pointer;">RACE RESULTS</span> once it\'s over.');
    }
    document.getElementById('live-pill').style.display='none';
    setStats('—','—','STANDBY','RACE');
    return renderLiveSubTabOffAir('NO RACE IN PROGRESS','Live race timing will appear here when the lights go out.');
  }
  document.getElementById('live-pill').style.display='flex';
  const {html,summary}=await buildLiveTimingTable(active);
  if(!html){
    setStats('—','—','STANDBY','RACE');
    return renderLiveSubTabOffAir('RACE STARTING','Session is live but no timing data yet — check back in a few seconds.');
  }
  setStats(summary.fastest,summary.leader,'RACE',summary.maxLap>0?`L${summary.maxLap}`:'GO');
  return html;
}

// ─── F1 RACE WEEKEND STATE MACHINE ───────────────────────────────────────────
// Five states with precedence:
//   session-live (race live) > post-race > qualifying-available
//   > practice-available > between-races
// 60s cache so we don't hammer OpenF1/Jolpica. ?devstate= URL param forces a
// specific state for manual testing
// (between-races|practice-available|qualifying-available|session-live|post-race).
// `session-live` historically meant "any session live"; after the LIVE sub-tab
// refactor it specifically means "the RACE is live" — the practice-available
// state covers FP1/FP2/FP3 and qualifying-available covers Quali.
let _f1StateCache=null;
let _f1StateCacheAt=0;
const F1_STATES=['between-races','practice-available','qualifying-available','session-live','post-race'];

async function getF1RaceWeekendState(){
  const dev=new URLSearchParams(location.search).get('devstate');
  if(dev&&F1_STATES.includes(dev))return dev;
  if(_f1StateCache&&(Date.now()-_f1StateCacheAt)<60000)return _f1StateCache;
  const state=await computeF1State();
  _f1StateCache=state;_f1StateCacheAt=Date.now();
  // Mid-session transition hook: when the state machine resolves to 'post-race'
  // and we're not already polling, start polling. Idempotent (startF1PostRacePolling
  // early-returns if f1PollTimer is set) and per-round-gated (findPostRaceRound
  // returns null unless a round is actually in its post-race window). Closes the
  // gap where a user keeps the page open through a session-live → post-race
  // transition without reloading.
  if(state==='post-race'&&!f1PollTimer){
    const round=findPostRaceRound();
    if(round!==null)startF1PostRacePolling(round);
  }
  return state;
}

// Returns the round number of any race in post-race window (past start+4h,
// within 24h of start, not yet hardcoded). Returns null otherwise. Used both
// by the state machine and the polling system, decoupled from each other.
// Returns the round number of any race whose actual race session has ENDED
// within the last 24h (and isn't yet in HARDCODED_RACES). Stays synchronous —
// reads the 60s-cached OpenF1 sessions list (_f1SessionsCache) when available
// so it knows each round's real start/end times. Falls back to the legacy
// 13:00 UTC + 4h heuristic only when OpenF1 hasn't been queried yet (cold
// path on first page load before computeF1State has run).
function findPostRaceRound(){
  const now=Date.now();
  const hardcoded=new Set(Object.keys(HARDCODED_RACES).map(Number));
  const cachedSessions=_f1SessionsCache||[];
  for(const r of NEXT_RACES){
    if(hardcoded.has(r.round))continue;
    // Prefer the actual Race session end time from OpenF1 (cached).
    const raceSession=cachedSessions.find(s=>{
      if((s.session_type||'').toLowerCase()!=='race')return false;
      const startMs=new Date(s.date_start).getTime();
      const days=(startMs-new Date(r.date+'T12:00:00Z').getTime())/86400000;
      return Math.abs(days)<2;
    });
    if(raceSession){
      const end=new Date(raceSession.date_end).getTime();
      if(end<now&&(now-end)<24*3600*1000)return r.round;
      continue;
    }
    // Next preference: hardcoded race times (covers the OpenF1-paywalled
    // case during live sessions).
    const times=F1_RACE_TIMES_UTC[r.round];
    if(times){
      const end=new Date(r.date+'T'+times.end+':00Z').getTime();
      if(end<now&&(now-end)<24*3600*1000)return r.round;
      continue;
    }
    // Last-ditch heuristic: 13:00 UTC start + 4h. Wrong for North-American
    // races but only fires when neither OpenF1 nor hardcoded times exist.
    const start=new Date(r.date+'T13:00:00Z').getTime();
    if(now>start+4*3600*1000&&now<start+24*3600*1000)return r.round;
  }
  return null;
}

async function computeF1State(){
  const now=Date.now();
  const hardcoded=new Set(Object.keys(HARDCODED_RACES).map(Number));

  // Only check OpenF1 within ±3 days of a scheduled race — avoid idle-week traffic.
  const inRaceWindow=NEXT_RACES.some(r=>{
    const days=(now-new Date(r.date+'T13:00:00Z').getTime())/86400000;
    return days>=-3&&days<=1;
  });
  if(inRaceWindow){
    const sessions=await fetchF1Sessions();
    // Race in progress beats everything.
    if(findActiveSession(sessions,'race'))return 'session-live';
    // Fallback when OpenF1 is paywalled / unreachable: use hardcoded race
    // start/end times from F1_RACE_TIMES_UTC. If now is within the race
    // window, treat as session-live even without OpenF1 confirmation —
    // renderLiveRaceBody surfaces a "OpenF1 paywalled" message in that case.
    {
      const round=currentRaceWeekendRound();
      const race=round?NEXT_RACES.find(r=>r.round===round):null;
      const times=round?F1_RACE_TIMES_UTC[round]:null;
      if(race&&times){
        const startMs=new Date(race.date+'T'+times.start+':00Z').getTime();
        const endMs=new Date(race.date+'T'+times.end+':00Z').getTime();
        if(now>=startMs&&now<=endMs)return 'session-live';
      }
    }
    // Qualifying live beats both practice and any post-race window.
    if(findActiveSession(sessions,'qualifying'))return 'qualifying-available';
    // OpenF1 recently-completed weekend quali also surfaces qualifying-available
    // so the LIVE tab defaults to the QUALIFYING sub-tab and renders the
    // just-finished session via OpenF1 (no Jolpica lag). Window: quali ended
    // within the last 24h and within ±4 days of the current weekend's race.
    const round=currentRaceWeekendRound();
    const weekendRace=round?NEXT_RACES.find(r=>r.round===round):null;
    if(weekendRace){
      const raceMs=new Date(weekendRace.date+'T13:00:00Z').getTime();
      const recentQuali=sessions.find(s=>{
        const st=(s.session_type||'').toLowerCase();
        if(!st.includes('qualif'))return false;
        const end=new Date(s.date_end).getTime();
        const days=(end-raceMs)/86400000;
        return days>=-4&&days<=1&&end<now&&(now-end)<24*3600*1000;
      });
      if(recentQuali)return 'qualifying-available';
    }
    // Practice live — lowest of the in-session states.
    if(findActiveSession(sessions,'practice'))return 'practice-available';
  }

  // Post-race wins over qualifying-available (when nothing live).
  if(findPostRaceRound()!==null)return 'post-race';

  // Final Jolpica fallback (only fires if OpenF1 lookup above returned nothing
  // and we're outside the race window). Same purpose: surface the QUALIFYING
  // sub-tab so completed grids are discoverable.
  const upcoming=NEXT_RACES.find(r=>new Date(r.date+'T13:00:00Z').getTime()>now);
  if(upcoming&&!hardcoded.has(upcoming.round)){
    try{
      const data=await fetch(`${JOLPICA}/2026/${upcoming.round}/qualifying/`).then(r=>r.json());
      const q=data.MRData?.RaceTable?.Races?.[0]?.QualifyingResults;
      if(q&&q.length>0)return 'qualifying-available';
    }catch(e){}
  }

  return 'between-races';
}

// ─── QUALIFYING TAB ──────────────────────────────────────────────────────────
// Per-round, per-driver qualifying highlight video IDs. Empty initially.
// Add per weekend after verifying each ID with the oEmbed + embed-page check
// workflow used for N24 onboards. See CLAUDE.md "HARDCODED_QUALI_VIDEOS".
//
// Shape:
//   <round number>: { '<jolpica driverId>': 'youtubeVideoId', ... }
//
// Example (once data exists):
//   5: {
//     'verstappen': 'abc123def45',
//     'leclerc':    'xyz987uvw65',
//   },
// Populated 2026-06-12: official FORMULA 1 channel pole-lap onboards, one per
// round, keyed by the polesitter's Jolpica driverId. Each ID oEmbed-verified
// (author_name exactly "FORMULA 1") + embed-page checked (ytcfg.set present,
// no EMBED_NOT_ALLOWED). Titles name the polesitter — e.g. "George Russell's
// Pole Lap | 2026 Australian Grand Prix | Pirelli".
const HARDCODED_QUALI_VIDEOS={
  1:{'russell':'Rbll4MnQuec'},    // George Russell's Pole Lap | 2026 Australian GP
  2:{'antonelli':'lDQgZMA7M7U'},  // Kimi Antonelli's Pole Lap | 2026 Chinese GP
  3:{'antonelli':'VT8ULSU6em8'},  // Kimi Antonelli's Pole Lap | 2026 Japanese GP
  4:{'antonelli':'7pGVugNI59c'},  // Kimi Antonelli's Pole Lap | 2026 Miami GP
  5:{'russell':'CNjJdmNPLMs'},    // George Russell's Pole Lap | 2026 Canadian GP
  6:{'antonelli':'h42iD4tm4OA'},  // Kimi Antonelli's Pole Lap | 2026 Monaco GP
};

// Per-round whole-session official race recaps from the @Formula1 YouTube
// channel. Consumed by renderF1Highlights() for the HIGHLIGHTS tab. Same
// oEmbed + embed-page verification workflow as HARDCODED_QUALI_VIDEOS.
//
// Shape:
//   <round>: 'youtubeVideoId',
const HARDCODED_RACE_HIGHLIGHTS={
  1: 'lL_d84cN1UY',  // Australian GP
  2: 't8HpVlineX4',  // Chinese GP
  3: 'oAtYfF0_4-I',  // Japanese GP
  4: '5gYys4GL7S0',  // Miami GP
  5: 'QrRh2vOJQbw',  // Canadian GP
  6: 'ipOT9ruRobc',  // Monaco GP — added 2026-06-12, oEmbed author "FORMULA 1"
};

// Per-round whole-session qualifying highlights — distinct from the
// per-driver HARDCODED_QUALI_VIDEOS above (which the QUALIFYING tab uses
// for tap-to-expand per-driver lap clips). Consumed by renderF1Highlights().
const HARDCODED_QUALI_HIGHLIGHTS={
  1: 'QztBs3IZBHk',  // Australian GP
  2: '75-_kMm0mb8',  // Chinese GP
  3: 'oZH_7pYJPTE',  // Japanese GP
  4: '83GJM1S0FnE',  // Miami GP
  5: 'rjLDgDc0td4',  // Canadian GP
  6: 'xmk0j-HdgwY',  // Monaco GP — added 2026-06-12, oEmbed author "FORMULA 1"
};

// Per-round sprint highlights for rounds that ran a sprint. Same shape and
// verification workflow as HARDCODED_RACE_HIGHLIGHTS.
const HARDCODED_SPRINT_HIGHLIGHTS={
  2: 'ynRZQ9EBfRI',  // Chinese GP sprint
  4: '0XlphgCNbwQ',  // Miami GP sprint
  5: 'l3aB-W19bnc',  // Canadian GP sprint
};

// Hand-picked action-frame thumbnails per highlight video, chosen 2026-06-12
// by viewing YouTube's auto-captured frames (hq1/hq2/hq3 + maxresdefault)
// and selecting the most dynamic on-track shot (avoiding title cards,
// lap-number graphics, talking heads). Keyed by videoId; consumed by
// stillFrame() below. maxresdefault entries mean no auto-frame showed
// on-track action (flagged in the session report).
const HARDCODED_HIGHLIGHT_THUMBS={
  'lL_d84cN1UY':'https://i.ytimg.com/vi/lL_d84cN1UY/hq1.jpg',  // R1 race — start into T1
  'QztBs3IZBHk':'https://i.ytimg.com/vi/QztBs3IZBHk/hq1.jpg',  // R1 quali — Red Bull on track
  't8HpVlineX4':'https://i.ytimg.com/vi/t8HpVlineX4/hq1.jpg',  // R2 race — Haas/Ferrari battle
  '75-_kMm0mb8':'https://i.ytimg.com/vi/75-_kMm0mb8/hq3.jpg',  // R2 quali — driver wave (no action frame)
  'ynRZQ9EBfRI':'https://i.ytimg.com/vi/ynRZQ9EBfRI/hq1.jpg',  // R2 sprint — multi-car wide shot
  'oAtYfF0_4-I':'https://i.ytimg.com/vi/oAtYfF0_4-I/hq3.jpg',  // R3 race — podium (no action frame)
  'oZH_7pYJPTE':'https://i.ytimg.com/vi/oZH_7pYJPTE/maxresdefault.jpg', // R3 quali — cover (no action frame)
  '5gYys4GL7S0':'https://i.ytimg.com/vi/5gYys4GL7S0/hq1.jpg',  // R4 race — Ferrari/Aston side-by-side
  '83GJM1S0FnE':'https://i.ytimg.com/vi/83GJM1S0FnE/maxresdefault.jpg', // R4 quali — cover (no action frame)
  '0XlphgCNbwQ':'https://i.ytimg.com/vi/0XlphgCNbwQ/hq1.jpg',  // R4 sprint — stopped car, driver out
  'QrRh2vOJQbw':'https://i.ytimg.com/vi/QrRh2vOJQbw/hq1.jpg',  // R5 race — Hamilton Ferrari
  'rjLDgDc0td4':'https://i.ytimg.com/vi/rjLDgDc0td4/maxresdefault.jpg', // R5 quali — cover (no action frame)
  'l3aB-W19bnc':'https://i.ytimg.com/vi/l3aB-W19bnc/hq1.jpg',  // R5 sprint — McLaren action
  'ipOT9ruRobc':'https://i.ytimg.com/vi/ipOT9ruRobc/hq2.jpg',  // R6 race — Ferrari at Monaco
  'xmk0j-HdgwY':'https://i.ytimg.com/vi/xmk0j-HdgwY/hq2.jpg',  // R6 quali — Leclerc on track
};

let selectedQualiDriver=null;
let _qualiDataCache=null;
let _qualiDataCacheRound=null;

function toggleQualiDriver(driverId){
  track('f1:quali-expand',{driver:driverId});
  selectedQualiDriver=selectedQualiDriver===driverId?null:driverId;
  renderQualifying();
}

async function renderQualifying(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('f1','qualifying')+renderBackToSeriesHome('f1');
  if(!_qualiDataCache){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">⟳</div><div class="state-title">Loading qualifying…</div></div>`;
    setStats('—','—','QUAL','—');
  }
  // Walk rounds backward from upcoming to find the most recent with quali data.
  let qualiData=null,qualiRound=null;
  if(_qualiDataCache){qualiData=_qualiDataCache;qualiRound=_qualiDataCacheRound;}
  else{
    const upcoming=NEXT_RACES.find(r=>new Date(r.date+'T13:00:00Z').getTime()>Date.now());
    const startRound=upcoming?upcoming.round:24;
    for(let round=startRound;round>=1;round--){
      try{
        const data=await fetch(`${JOLPICA}/2026/${round}/qualifying/`).then(r=>r.json());
        const races=data.MRData?.RaceTable?.Races;
        const q=races?.[0]?.QualifyingResults;
        if(q&&q.length>0){qualiData=races[0];qualiRound=round;break;}
      }catch(e){}
    }
    _qualiDataCache=qualiData;_qualiDataCacheRound=qualiRound;
  }

  if(!qualiData){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">No Qualifying Data Yet</div><div class="state-sub">Check back closer to race weekend.</div></div>`;
    setStats('—','—','QUAL','—');return;
  }

  const results=qualiData.QualifyingResults;
  const country=qualiData.Circuit?.Location?.country||'';
  const header=`<div class="results-header">
    <div class="results-race-name">${country} ${qualiData.raceName} Qualifying</div>
    <div class="results-race-sub">${qualiData.Circuit?.circuitName||''} · Round ${qualiRound} · ${results.length} drivers${Object.keys(HARDCODED_QUALI_VIDEOS[qualiRound]||{}).length?' · ⬤ VIDEO = tap to expand':''}</div>
  </div>`;

  const videos=HARDCODED_QUALI_VIDEOS[qualiRound]||{};
  const tableHeader=`<div style="display:grid;grid-template-columns:32px 20px 1fr 60px 60px 60px;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:5;gap:4px;">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:left;">POS</div>
    <div></div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:left;">DRIVER</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:right;">Q1</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:right;">Q2</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;text-align:right;">Q3</div>
  </div>`;
  const rows=results.map(r=>{
    const driverId=r.Driver?.driverId||'';
    const videoId=videos[driverId];
    const hasVideo=!!videoId;
    const expanded=selectedQualiDriver===driverId;
    const pos=parseInt(r.position);
    const team=normalizeTeam(r.Constructor?.name||'—');
    const flag=driverFlag(r.Driver?.nationality);
    const name=r.Driver?.familyName||driverId;
    const q1=r.Q1||'—',q2=r.Q2||'—',q3=r.Q3||'—';
    const posColor=pos===1?'var(--yellow)':pos===2?'#c0c0c0':pos===3?'#cd7f32':'var(--muted)';
    const bg=pos===1?'background:#0d1a08;':'';
    const cursor=hasVideo?'cursor:pointer;':'';
    const onclickAttr=hasVideo?` onclick="toggleQualiDriver('${driverId}')"`:'';
    const videoLabel=hasVideo?`<span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.12em;color:${expanded?'var(--red)':'var(--green)'};margin-left:6px;white-space:nowrap;">⬤ VIDEO</span>`:'';
    const row=`<div class="race-item" style="display:grid;grid-template-columns:32px 20px 1fr 60px 60px 60px;padding:7px 10px;align-items:center;gap:4px;${cursor}${bg}"${onclickAttr}>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:${posColor};text-align:center;">${pos}</div>
      <div class="flag-cell">${flag}</div>
      <div>
        <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
          <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${tc(team)};line-height:1.1;">${name}</span>${videoLabel}
        </div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-top:1px;">${team}</div>
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--muted);text-align:right;">${q1}</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--muted);text-align:right;">${q2}</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:${pos<=10?'var(--text)':'var(--muted)'};text-align:right;">${q3}</div>
    </div>`;
    // Lazy iframe: only built when this row is the selected one
    const panel=(expanded&&hasVideo)?`<div style="background:var(--bg);border-bottom:1px solid var(--border);">
      <div style="padding:10px 16px;display:flex;justify-content:space-between;align-items:center;background:var(--surface);border-bottom:1px solid var(--border);">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.12em;color:var(--green);">⬤ QUALI VIDEO · ${name.toUpperCase()}</div>
        <div onclick="event.stopPropagation();toggleQualiDriver('${driverId}');" style="cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:13px;color:var(--muted);padding:0 4px;">✕</div>
      </div>
      <div style="position:relative;padding-bottom:56.25%;height:0;background:#000;">
        <iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      </div>
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener" onclick="event.stopPropagation();" style="display:block;padding:9px 16px;text-decoration:none;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:0.12em;color:var(--muted);text-transform:uppercase;background:var(--surface);border-bottom:1px solid var(--border);">Open in YouTube ↗</a>
    </div>`:'';
    return row+panel;
  }).join('');

  content.innerHTML=top+header+tableHeader+rows;
  setStats(`R${qualiRound}`,qualiData.raceName.split(' ').slice(0,2).join(' '),'QUAL',`${results.length}`);
}

// (renderLiveWithQualifying removed — subsumed by the QUALIFYING sub-tab inside
// renderLive(). Old callers in the state machine no longer reference it.)

// ─── POST-RACE POLLING ───────────────────────────────────────────────────────
// On entering 'post-race' state for a round, start a setTimeout-driven poll
// scheduler: 12 × 5min for the first hour, 23 × 1hr for hours 1-24, then stop.
// Diffs against localStorage snapshots and surfaces a yellow-dot badge on the
// affected sub-tab. Polling NEVER auto-modifies HARDCODED_* constants — only
// proposes via badge. User reviews and updates manually. Session 3 will automate.
let f1PollTimer=null;

async function determineRaceEndAnchor(round){
  const key=`traxstat:f1:pollStart:${round}`;
  const existing=localStorage.getItem(key);
  if(existing)return +existing;
  const race=NEXT_RACES.find(r=>r.round===round);
  if(!race)return null;
  // Try OpenF1 Race session_end_time first; fall back to 13:00 UTC + 4h.
  let anchor=null;
  try{
    const sessions=await fetch('https://api.openf1.org/v1/sessions?session_type=Race&year=2026').then(r=>r.json());
    const session=sessions.find(s=>s.date_start&&s.date_start.startsWith(race.date));
    if(session?.date_end)anchor=new Date(session.date_end).getTime();
  }catch(e){}
  if(!anchor)anchor=new Date(race.date+'T13:00:00Z').getTime()+4*3600*1000;
  localStorage.setItem(key,String(anchor));
  return anchor;
}

async function startF1PostRacePolling(round){
  if(f1PollTimer)return;
  const raceEnd=await determineRaceEndAnchor(round);
  if(!raceEnd)return;
  const tick=async()=>{
    const elapsed=Date.now()-raceEnd;
    if(elapsed>24*3600*1000){console.log(`F1 polling: 24h elapsed for R${round}, stopping`);f1PollTimer=null;return;}
    try{await pollOnce(round);}catch(e){console.warn('F1 poll failed',e);}
    const delay=elapsed<3600*1000?5*60*1000:60*60*1000;
    f1PollTimer=setTimeout(tick,delay);
  };
  tick();
}

async function pollOnce(round){
  const [resultsJson,drvJson,ctrJson]=await Promise.all([
    fetch(`${JOLPICA}/2026/${round}/results/?limit=30`).then(r=>r.json()),
    fetch(`${JOLPICA}/current/driverStandings/`).then(r=>r.json()),
    fetch(`${JOLPICA}/current/constructorStandings/`).then(r=>r.json()),
  ]);
  localStorage.setItem(`traxstat:f1:lastPoll:${round}`,String(Date.now()));
  diffAndBadge(`traxstat:f1:lastResults:${round}`,resultsJson,'races');
  diffAndBadge(`traxstat:f1:lastDriverStandings`,drvJson,'drivers');
  diffAndBadge(`traxstat:f1:lastConstructorStandings`,ctrJson,'constructors');
}

function diffAndBadge(storageKey,fresh,tabKey){
  const prev=localStorage.getItem(storageKey);
  const freshJson=JSON.stringify(fresh);
  if(prev&&prev!==freshJson){
    console.log(`F1 diff detected on ${tabKey}`,{prev:JSON.parse(prev),fresh});
    localStorage.setItem(`traxstat:f1:badge:${tabKey}`,'1');
    updateF1Badges();
  }
  localStorage.setItem(storageKey,freshJson);
}

function updateF1Badges(){
  for(const tab of ['races','drivers','constructors']){
    const has=localStorage.getItem(`traxstat:f1:badge:${tab}`)==='1';
    const el=document.getElementById('tab-'+tab);
    if(!el)continue;
    el.querySelector('.f1-diff-badge')?.remove();
    if(!has)continue;
    const badge=document.createElement('span');
    badge.className='f1-diff-badge';
    badge.style.cssText='margin-left:5px;cursor:default;font-size:11px;';
    badge.innerHTML=' <span style="color:var(--yellow);">•</span><span class="dismiss" style="margin-left:3px;color:var(--muted);font-size:9px;cursor:pointer;">×</span>';
    badge.title='Jolpica reports changes since last sync. A server-side poll also runs every 30 min — check GitHub for auto-PRs. Tap the tab or × to dismiss.';
    badge.querySelector('.dismiss').onclick=(e)=>{e.stopPropagation();dismissF1Badge(tab);track('f1:badge-dismiss',{tab});};
    el.appendChild(badge);
  }
}

function dismissF1Badge(tab){
  if(localStorage.getItem(`traxstat:f1:badge:${tab}`)==='1'){
    localStorage.removeItem(`traxstat:f1:badge:${tab}`);
    updateF1Badges();
  }
}

async function renderF1(){
  // Refresh the diff badges on every F1 render so they reflect current localStorage.
  setTimeout(updateF1Badges,0);
  if(currentF1Tab==='races')return renderRaceSelector();
  if(currentF1Tab==='standings')return renderF1Standings();
  if(currentF1Tab==='schedule')return renderF1Schedule();
  if(currentF1Tab==='highlights')return renderF1Highlights();
  // Legacy deep-link keys still callable via the LIVE state machine's CTA.
  if(currentF1Tab==='drivers')return renderDrivers();
  if(currentF1Tab==='constructors')return renderConstructors();
  if(currentF1Tab==='qualifying')return renderQualifying();
  return renderLive();
}

// Session 7: stacked Drivers + Constructors view backing the new "Standings"
// sub-tab. renderDrivers / renderConstructors each write the full panel into
// main-content; we capture their output between awaits and concatenate.
async function renderF1Standings(){
  const content=document.getElementById('main-content');
  content.innerHTML=renderSeriesBanner('f1','standings')+renderBackToSeriesHome('f1')+
    `<div class="state-screen"><div class="state-icon">⟳</div><div class="state-title">Loading...</div></div>`;
  await renderDrivers();
  const driversHTML=content.innerHTML;
  await renderConstructors();
  const constructorsHTML=content.innerHTML;
  content.innerHTML=renderSeriesBanner('f1','standings')+renderBackToSeriesHome('f1')+driversHTML+constructorsHTML;
}

// Session 7: F1-local schedule. Completed rounds above, NEXT_RACES upcoming
// below. We can't list all 22 rounds (24 originally; Bahrain + Saudi
// cancelled) — NEXT_RACES only covers the next ~7 — so the upcoming section
// is labelled "next races" rather than a full season calendar.
function renderF1Schedule(){
  const content=document.getElementById('main-content');
  // Completed races listed newest-round-first (descending); upcoming list
  // below is still soonest-first since that's chronologically natural.
  const completed=Object.values(HARDCODED_RACES).sort((a,b)=>parseInt(b.round)-parseInt(a.round));
  const completedRows=completed.map(r=>{
    const w=r.Results?.[0];
    return`<div class="race-item" onclick="goToSubTab('f1','races');setTimeout(()=>selectRace('${r.round}'),50);">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.Circuit?.Location?.country||''}</div>
        <div class="race-item-name">${r.raceName.replace(' Grand Prix','')}</div>
        <div class="race-item-date">${fmtDate(r.date)}</div>
      </div>
      <div>
        <div class="winner-name">${w?.Driver?.familyName||'—'}</div>
        <div class="winner-team">${w?.Constructor?.name||'—'}</div>
      </div>
    </div>`;
  }).join('');
  const upcomingRows=NEXT_RACES.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'—';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country}${r.sprint?' · SPRINT':''}</div>
        <div class="race-item-name">${r.name.replace(' Grand Prix','')}</div>
        <div class="race-item-date">${fmtDate(r.date)} · ${r.circuit}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Share Tech Mono',monospace;font-size:16px;color:var(--yellow);line-height:1;">${cdNum}${cdUnit}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:8px;color:var(--muted);letter-spacing:0.08em;margin-top:3px;">AWAY</div>
      </div>
    </div>`;
  }).join('');
  content.innerHTML=renderSeriesBanner('f1','schedule')+renderBackToSeriesHome('f1')+
    `<div class="section-title"><span>Completed Rounds · ${completed.length}</span><span>Tap to open results</span></div>`+
    (completedRows||`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">No Completed Rounds</div></div>`)+
    `<div class="section-title"><span>Upcoming · Next ${NEXT_RACES.length}</span><span>2026 Season</span></div>`+
    (upcomingRows||`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div></div>`);
  setStats('—','—','SCHED',`${completed.length} done`);
}

// Season Highlights — one card per completed round with embedded official
// @Formula1 highlight videos (race, qualifying, optional sprint). Card IDs
// match `highlights-f1-r{round}-{slug}` for the navigateToHighlights() deep
// link from each race-results row. Rounds without verified video IDs still
// render the TODO placeholder.
function f1TrackSlug(raceName){
  return (raceName||'').toLowerCase().replace(/grand prix/g,'').trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'race';
}

// Click-handler for the lite-YouTube thumbnails on the HIGHLIGHTS tab. Swaps
// the thumbnail+play-button div with the actual YouTube iframe (with autoplay
// so the user gets immediate playback after the tap). Global so the inline
// onclick="loadF1HighlightIframe(...)" can find it.
function loadF1HighlightIframe(el,videoId,label){
  track('f1:highlight-play',{round:videoId.slice(0,6)});
  el.innerHTML=`<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${label}"></iframe>`;
  el.style.cursor='default';
  el.onclick=null;
}

function renderF1Highlights(){
  const content=document.getElementById('main-content');
  // Most recent round first (descending). Highlights tab is a feed — newest
  // race at the top matches user expectation.
  const completed=Object.values(HARDCODED_RACES).sort((a,b)=>parseInt(b.round)-parseInt(a.round));

  // Lite-YouTube pattern: render a clickable still-frame thumbnail. On tap
  // the iframe (with autoplay) replaces the thumbnail. This is much lighter
  // than always-loading 3 iframes per round (3 × 5 rounds = 15 iframes
  // previously). The still frame comes from YouTube's auto-generated
  // /1.jpg, /2.jpg, /3.jpg endpoints (real frames from the video, NOT the
  // curated cover thumbnail) — picked deterministically per video via a
  // tiny char-code hash so each clip shows a different moment.
  const stillFrame=(videoId)=>{
    // Hand-picked action frame wins; deterministic char-code hash over the
    // auto frames remains the fallback for any video without a curated pick.
    if(HARDCODED_HIGHLIGHT_THUMBS[videoId])return HARDCODED_HIGHLIGHT_THUMBS[videoId];
    const seed=(videoId.charCodeAt(0)+videoId.charCodeAt(1)+videoId.charCodeAt(2))%3+1;
    return `https://i.ytimg.com/vi/${videoId}/${seed}.jpg`;
  };
  const slotHTML=(label,videoId)=>{
    if(!videoId)return '';
    const still=stillFrame(videoId);
    const fallback=`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    return `<div style="margin-top:12px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.12em;color:var(--green);text-transform:uppercase;padding-bottom:6px;">⬤ ${label}</div>
      <div onclick="loadF1HighlightIframe(this,'${videoId}','${label.replace(/'/g,"\\'")}')" style="position:relative;padding-bottom:56.25%;height:0;background:#000;border-radius:3px;overflow:hidden;cursor:pointer;">
        <img src="${still}" onerror="this.onerror=null;this.src='${fallback}';" loading="lazy" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" alt="${label} thumbnail">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,0.78);display:flex;align-items:center;justify-content:center;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.4);">
          <div style="width:0;height:0;border-left:22px solid var(--red);border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:5px;"></div>
        </div>
      </div>
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" style="display:block;padding:8px 0;text-decoration:none;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:0.12em;color:var(--muted);text-transform:uppercase;">Open on YouTube ↗</a>
    </div>`;
  };

  const cards=completed.map(r=>{
    const w=r.Results?.[0];
    const slug=f1TrackSlug(r.raceName);
    const id=`highlights-f1-r${r.round}-${slug}`;
    const winner=w?`${w.Driver?.familyName||'—'} (${w.Constructor?.name||'—'})`:'—';
    const raceVid=HARDCODED_RACE_HIGHLIGHTS[r.round];
    const qualiVid=HARDCODED_QUALI_HIGHLIGHTS[r.round];
    const sprintVid=HARDCODED_SPRINT_HIGHLIGHTS[r.round];
    const hasAny=raceVid||qualiVid||sprintVid;
    const body=hasAny
      ? slotHTML('Race Highlights',raceVid)+slotHTML('Qualifying Highlights',qualiVid)+slotHTML('Sprint Highlights',sprintVid)
      : `<div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${r.round} · ${r.Circuit?.Location?.country||''} · ${fmtDate(r.date)}</div>
      <div class="tx-highlights-title">${r.raceName}</div>
      <div class="tx-highlights-winner">Winner: ${winner}</div>
      ${body}
    </div>`;
  }).join('');
  content.innerHTML=renderSeriesBanner('f1','highlights')+renderBackToSeriesHome('f1')+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">F1 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps from the @Formula1 YouTube channel. Each round shows race, qualifying, and (when applicable) sprint highlights.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}


function switchF1Tab(tab){
  track('tab:f1',{tab});
  currentF1Tab=tab;
  selectedRace=null;
  selectedDriver=null;
  selectedDriverChamp=null;
  selectedConstructorChamp=null;
  selectedQualiDriver=null;
  // Leaving the LIVE tab resets the inner sub-tab so next entry picks the
  // state-suggested default again (e.g. if the race has started since they
  // last visited, they land on RACE instead of whatever they last picked).
  if(tab!=='live')currentF1LiveSubTab=null;
  // Auto-dismiss diff badge for the tab we just visited (visit = "I've seen it")
  dismissF1Badge(tab);
  document.querySelectorAll('#f1-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+tab)?.classList.add('active');
  renderF1();
}
