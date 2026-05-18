const SEEDED_FASTEST_LAPS={
  2:{'antonelli':{time:'1:35.275',lap:'52',rank:'1'}},
  3:{'antonelli':{time:'1:32.432',lap:'49',rank:'1'}},
  4:{'norris':{time:'1:31.869',lap:'35',rank:'1'}},
};

// ── NEXT RACE ─────────────────────────────────────────────────────────────────
const NEXT_RACES=[
  {round:5,name:'Canadian Grand Prix',circuit:'Circuit Gilles-Villeneuve',country:'🇨🇦',date:'2026-05-24',sprint:false},
  {round:6,name:'Monaco Grand Prix',circuit:'Circuit de Monaco',country:'🇲🇨',date:'2026-06-07'},
  {round:7,name:'Spanish Grand Prix',circuit:'Circuit de Barcelona-Catalunya',country:'🇪🇸',date:'2026-06-14'},
  {round:8,name:'Austrian Grand Prix',circuit:'Red Bull Ring',country:'🇦🇹',date:'2026-06-28'},
  {round:9,name:'British Grand Prix',circuit:'Silverstone Circuit',country:'🇬🇧',date:'2026-07-05',sprint:true},
  {round:10,name:'Belgian Grand Prix',circuit:'Circuit de Spa-Francorchamps',country:'🇧🇪',date:'2026-07-19'},
  {round:11,name:'Hungarian Grand Prix',circuit:'Hungaroring',country:'🇭🇺',date:'2026-07-26'},
];

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
    ]}
};

// Hardcoded verified championship standings (after Miami, R4) — official totals
const HARDCODED_DRIVER_STANDINGS=[
  {position:'1',points:'100',Driver:{driverId:'antonelli',familyName:'Antonelli',givenName:'Kimi',nationality:'Italian'},Constructors:[{name:'Mercedes'}]},
  {position:'2',points:'80',Driver:{driverId:'russell',familyName:'Russell',givenName:'George',nationality:'British'},Constructors:[{name:'Mercedes'}]},
  {position:'3',points:'59',Driver:{driverId:'leclerc',familyName:'Leclerc',givenName:'Charles',nationality:'Monegasque'},Constructors:[{name:'Ferrari'}]},
  {position:'4',points:'51',Driver:{driverId:'norris',familyName:'Norris',givenName:'Lando',nationality:'British'},Constructors:[{name:'McLaren'}]},
  {position:'5',points:'51',Driver:{driverId:'hamilton',familyName:'Hamilton',givenName:'Lewis',nationality:'British'},Constructors:[{name:'Ferrari'}]},
  {position:'6',points:'43',Driver:{driverId:'piastri',familyName:'Piastri',givenName:'Oscar',nationality:'Australian'},Constructors:[{name:'McLaren'}]},
  {position:'7',points:'26',Driver:{driverId:'verstappen',familyName:'Verstappen',givenName:'Max',nationality:'Dutch'},Constructors:[{name:'Red Bull'}]},
  {position:'8',points:'17',Driver:{driverId:'bearman',familyName:'Bearman',givenName:'Oliver',nationality:'British'},Constructors:[{name:'Haas F1 Team'}]},
  {position:'9',points:'16',Driver:{driverId:'gasly',familyName:'Gasly',givenName:'Pierre',nationality:'French'},Constructors:[{name:'Alpine'}]},
  {position:'10',points:'10',Driver:{driverId:'lawson',familyName:'Lawson',givenName:'Liam',nationality:'New Zealander'},Constructors:[{name:'Racing Bulls'}]},
  {position:'11',points:'7',Driver:{driverId:'colapinto',familyName:'Colapinto',givenName:'Franco',nationality:'Argentine'},Constructors:[{name:'Alpine'}]},
  {position:'12',points:'4',Driver:{driverId:'lindblad',familyName:'Lindblad',givenName:'Arvid',nationality:'British'},Constructors:[{name:'Racing Bulls'}]},
  {position:'13',points:'4',Driver:{driverId:'hadjar',familyName:'Hadjar',givenName:'Isack',nationality:'French'},Constructors:[{name:'Red Bull'}]},
  {position:'14',points:'4',Driver:{driverId:'sainz',familyName:'Sainz',givenName:'Carlos',nationality:'Spanish'},Constructors:[{name:'Williams'}]},
  {position:'15',points:'2',Driver:{driverId:'bortoleto',familyName:'Bortoleto',givenName:'Gabriel',nationality:'Brazilian'},Constructors:[{name:'Audi'}]},
  {position:'16',points:'1',Driver:{driverId:'ocon',familyName:'Ocon',givenName:'Esteban',nationality:'French'},Constructors:[{name:'Haas F1 Team'}]},
  {position:'17',points:'1',Driver:{driverId:'albon',familyName:'Albon',givenName:'Alexander',nationality:'Thai'},Constructors:[{name:'Williams'}]},
  {position:'18',points:'0',Driver:{driverId:'hulkenberg',familyName:'Hulkenberg',givenName:'Nico',nationality:'German'},Constructors:[{name:'Audi'}]},
  {position:'19',points:'0',Driver:{driverId:'bottas',familyName:'Bottas',givenName:'Valtteri',nationality:'Finnish'},Constructors:[{name:'Cadillac'}]},
  {position:'20',points:'0',Driver:{driverId:'perez',familyName:'Perez',givenName:'Sergio',nationality:'Mexican'},Constructors:[{name:'Cadillac'}]},
  {position:'21',points:'0',Driver:{driverId:'alonso',familyName:'Alonso',givenName:'Fernando',nationality:'Spanish'},Constructors:[{name:'Aston Martin'}]},
  {position:'22',points:'0',Driver:{driverId:'stroll',familyName:'Stroll',givenName:'Lance',nationality:'Canadian'},Constructors:[{name:'Aston Martin'}]},
];

const HARDCODED_CONSTRUCTOR_STANDINGS=[
  {position:'1',points:'180',Constructor:{name:'Mercedes',nationality:'German'}},
  {position:'2',points:'110',Constructor:{name:'Ferrari',nationality:'Italian'}},
  {position:'3',points:'94',Constructor:{name:'McLaren',nationality:'British'}},
  {position:'4',points:'30',Constructor:{name:'Red Bull',nationality:'Austrian'}},
  {position:'5',points:'23',Constructor:{name:'Alpine',nationality:'French'}},
  {position:'6',points:'18',Constructor:{name:'Haas F1 Team',nationality:'American'}},
  {position:'7',points:'14',Constructor:{name:'Racing Bulls',nationality:'Italian'}},
  {position:'8',points:'5',Constructor:{name:'Williams',nationality:'British'}},
  {position:'9',points:'2',Constructor:{name:'Audi',nationality:'German'}},
  {position:'10',points:'0',Constructor:{name:'Cadillac',nationality:'American'}},
  {position:'11',points:'0',Constructor:{name:'Aston Martin',nationality:'British'}},
];

// ── RACE SELECTOR ─────────────────────────────────────────────────────────────
async function renderRaceSelector(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('f1','races')+renderBackToSeriesHome('f1');
  content.innerHTML=top+`<div class="section-title"><span>2026 Season Results</span><span class="spin-inline">⟳</span></div>`;
  // Use hardcoded races since they're fully verified — Jolpica may be incomplete
  const allRaces=Object.values(HARDCODED_RACES).sort((a,b)=>parseInt(a.round)-parseInt(b.round));
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
};

function getSprintPts(driverName,round){
  return SPRINT_RESULTS[round]?.drivers?.[driverName]||0;
}

// ── DRIVER PER-RACE POINTS — REAL VERIFIED 2026 RESULTS ───────────────────────
// Each driver's GP finishing position and points per round. Sprint points are
// added separately from SPRINT_RESULTS so they display as a labeled sub-row.
// Position 0 = DNS/DNF/DSQ. All totals verified against official standings.
const DRIVER_RACE_POINTS={
  'Antonelli':  [{round:1,race:'Australia',flag:'🇦🇺',pos:2,pts:18},{round:2,race:'China',flag:'🇨🇳',pos:1,pts:25},{round:3,race:'Japan',flag:'🇯🇵',pos:1,pts:25},{round:4,race:'Miami',flag:'🇺🇸',pos:1,pts:25}],
  'Russell':    [{round:1,race:'Australia',flag:'🇦🇺',pos:1,pts:25},{round:2,race:'China',flag:'🇨🇳',pos:2,pts:18},{round:3,race:'Japan',flag:'🇯🇵',pos:4,pts:12},{round:4,race:'Miami',flag:'🇺🇸',pos:4,pts:12}],
  'Leclerc':    [{round:1,race:'Australia',flag:'🇦🇺',pos:3,pts:15},{round:2,race:'China',flag:'🇨🇳',pos:4,pts:12},{round:3,race:'Japan',flag:'🇯🇵',pos:3,pts:15},{round:4,race:'Miami',flag:'🇺🇸',pos:8,pts:4}],
  'Norris':     [{round:1,race:'Australia',flag:'🇦🇺',pos:5,pts:10},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:5,pts:10},{round:4,race:'Miami',flag:'🇺🇸',pos:2,pts:18}],
  'Hamilton':   [{round:1,race:'Australia',flag:'🇦🇺',pos:4,pts:12},{round:2,race:'China',flag:'🇨🇳',pos:3,pts:15},{round:3,race:'Japan',flag:'🇯🇵',pos:6,pts:8},{round:4,race:'Miami',flag:'🇺🇸',pos:6,pts:8}],
  'Piastri':    [{round:1,race:'Australia',flag:'🇦🇺',pos:0,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:2,pts:18},{round:4,race:'Miami',flag:'🇺🇸',pos:3,pts:15}],
  'Verstappen': [{round:1,race:'Australia',flag:'🇦🇺',pos:6,pts:8},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:8,pts:4},{round:4,race:'Miami',flag:'🇺🇸',pos:5,pts:10}],
  'Bearman':    [{round:1,race:'Australia',flag:'🇦🇺',pos:7,pts:6},{round:2,race:'China',flag:'🇨🇳',pos:5,pts:10},{round:3,race:'Japan',flag:'🇯🇵',pos:0,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:11,pts:0}],
  'Gasly':      [{round:1,race:'Australia',flag:'🇦🇺',pos:10,pts:1},{round:2,race:'China',flag:'🇨🇳',pos:6,pts:8},{round:3,race:'Japan',flag:'🇯🇵',pos:7,pts:6},{round:4,race:'Miami',flag:'🇺🇸',pos:0,pts:0}],
  'Lawson':     [{round:1,race:'Australia',flag:'🇦🇺',pos:13,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:7,pts:6},{round:3,race:'Japan',flag:'🇯🇵',pos:9,pts:2},{round:4,race:'Miami',flag:'🇺🇸',pos:20,pts:0}],
  'Colapinto':  [{round:1,race:'Australia',flag:'🇦🇺',pos:14,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:10,pts:1},{round:3,race:'Japan',flag:'🇯🇵',pos:16,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:7,pts:6}],
  'Lindblad':   [{round:1,race:'Australia',flag:'🇦🇺',pos:8,pts:4},{round:2,race:'China',flag:'🇨🇳',pos:12,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:14,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:14,pts:0}],
  'Hadjar':     [{round:1,race:'Australia',flag:'🇦🇺',pos:0,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:8,pts:4},{round:3,race:'Japan',flag:'🇯🇵',pos:12,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:0,pts:0}],
  'Sainz':      [{round:1,race:'Australia',flag:'🇦🇺',pos:15,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:9,pts:2},{round:3,race:'Japan',flag:'🇯🇵',pos:15,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:9,pts:2}],
  'Bortoleto':  [{round:1,race:'Australia',flag:'🇦🇺',pos:9,pts:2},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:13,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:12,pts:0}],
  'Ocon':       [{round:1,race:'Australia',flag:'🇦🇺',pos:11,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:14,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:10,pts:1},{round:4,race:'Miami',flag:'🇺🇸',pos:13,pts:0}],
  'Albon':      [{round:1,race:'Australia',flag:'🇦🇺',pos:12,pts:0},{round:2,race:'China',flag:'🇨🇳',pos:0,pts:0},{round:3,race:'Japan',flag:'🇯🇵',pos:20,pts:0},{round:4,race:'Miami',flag:'🇺🇸',pos:10,pts:1}],
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
    const hdr=`<div class="section-title"><span>Drivers Championship · 2026 · After R4 Miami</span><span>Tap for breakdown</span></div>`;
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
  'Mercedes':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Russell',pos:1,pts:25},{name:'Antonelli',pos:2,pts:18}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:2,pts:18}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:4,pts:12}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Antonelli',pos:1,pts:25},{name:'Russell',pos:4,pts:12}]}],
  'Ferrari':      [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Leclerc',pos:3,pts:15},{name:'Hamilton',pos:4,pts:12}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Hamilton',pos:3,pts:15},{name:'Leclerc',pos:4,pts:12}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Leclerc',pos:3,pts:15},{name:'Hamilton',pos:6,pts:8}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Hamilton',pos:6,pts:8},{name:'Leclerc',pos:8,pts:4}]}],
  'McLaren':      [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Norris',pos:5,pts:10},{name:'Piastri',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Norris',pos:0,pts:0},{name:'Piastri',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Piastri',pos:2,pts:18},{name:'Norris',pos:5,pts:10}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Norris',pos:2,pts:18},{name:'Piastri',pos:3,pts:15}]}],
  'Red Bull':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Verstappen',pos:6,pts:8},{name:'Hadjar',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Hadjar',pos:8,pts:4},{name:'Verstappen',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Verstappen',pos:8,pts:4},{name:'Hadjar',pos:12,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Verstappen',pos:5,pts:10},{name:'Hadjar',pos:0,pts:0}]}],
  'Alpine':       [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Gasly',pos:10,pts:1},{name:'Colapinto',pos:14,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Gasly',pos:6,pts:8},{name:'Colapinto',pos:10,pts:1}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Gasly',pos:7,pts:6},{name:'Colapinto',pos:16,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Colapinto',pos:7,pts:6},{name:'Gasly',pos:0,pts:0}]}],
  'Haas F1 Team': [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Bearman',pos:7,pts:6},{name:'Ocon',pos:11,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Bearman',pos:5,pts:10},{name:'Ocon',pos:14,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Ocon',pos:10,pts:1},{name:'Bearman',pos:0,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Bearman',pos:11,pts:0},{name:'Ocon',pos:13,pts:0}]}],
  'Racing Bulls': [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Lindblad',pos:8,pts:4},{name:'Lawson',pos:13,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Lawson',pos:7,pts:6},{name:'Lindblad',pos:12,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Lawson',pos:9,pts:2},{name:'Lindblad',pos:14,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Lindblad',pos:14,pts:0},{name:'Lawson',pos:20,pts:0}]}],
  'Williams':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Albon',pos:12,pts:0},{name:'Sainz',pos:15,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Sainz',pos:9,pts:2},{name:'Albon',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Sainz',pos:15,pts:0},{name:'Albon',pos:20,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Sainz',pos:9,pts:2},{name:'Albon',pos:10,pts:1}]}],
  'Audi':         [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Bortoleto',pos:9,pts:2},{name:'Hulkenberg',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Hulkenberg',pos:11,pts:0},{name:'Bortoleto',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Hulkenberg',pos:11,pts:0},{name:'Bortoleto',pos:13,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Bortoleto',pos:12,pts:0},{name:'Hulkenberg',pos:19,pts:0}]}],
  'Cadillac':     [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Perez',pos:16,pts:0},{name:'Bottas',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Bottas',pos:13,pts:0},{name:'Perez',pos:15,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Perez',pos:17,pts:0},{name:'Bottas',pos:19,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Perez',pos:16,pts:0},{name:'Bottas',pos:18,pts:0}]}],
  'Aston Martin': [{round:1,race:'Australia',flag:'🇦🇺',drivers:[{name:'Stroll',pos:17,pts:0},{name:'Alonso',pos:0,pts:0}]},{round:2,race:'China',flag:'🇨🇳',drivers:[{name:'Alonso',pos:0,pts:0},{name:'Stroll',pos:0,pts:0}]},{round:3,race:'Japan',flag:'🇯🇵',drivers:[{name:'Alonso',pos:18,pts:0},{name:'Stroll',pos:0,pts:0}]},{round:4,race:'Miami',flag:'🇺🇸',drivers:[{name:'Alonso',pos:15,pts:0},{name:'Stroll',pos:17,pts:0}]}],
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
    const hdr=`<div class="section-title"><span>Constructors Championship · 2026 · After R4 Miami</span><span>Tap for breakdown</span></div>`;
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

// LIVE tab is an adaptive dispatcher: it renders one of three views based on
// the current F1 race-weekend state. See getF1RaceWeekendState() for state logic.
async function renderLive(){
  const state=await getF1RaceWeekendState();
  if(state==='session-live')return renderLiveSession();
  if(state==='qualifying-available')return renderLiveWithQualifying();
  // 'between-races' and 'post-race' both render the off-air view (banner + last
  // race recap). Polling runs in background for post-race.
  document.getElementById('live-pill').style.display='none';
  const content=document.getElementById('main-content');
  content.innerHTML=renderSeriesBanner('f1','live')+renderBackToSeriesHome('f1')+renderLiveOffAir(state);
  setStats('—','—','STANDBY',state==='post-race'?'POST-RACE':'BETWEEN');
}

// Renamed: original renderLive body. Renders OpenF1 live timing when a session
// is actively running. Called by renderLive() dispatcher when state==='session-live'.
async function renderLiveSession(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('f1','live')+renderBackToSeriesHome('f1');
  content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏎</div><div class="state-title">Connecting...</div><div class="state-sub">Fetching live F1 timing data</div></div>`;
  try{
    const sessRes=await fetch('https://api.openf1.org/v1/sessions?session_type!=Testing&year=2026');
    const sessions=await sessRes.json();
    const now=new Date();
    let session=sessions.find(s=>new Date(s.date_start)<=now&&new Date(s.date_end)>=now);
    isLive=!!session;
    document.getElementById('live-pill').style.display=isLive?'flex':'none';
    if(!session){
      content.innerHTML=top+renderLiveOffAir('no-session');
      setStats('—','—','STANDBY','R4');return;
    }
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
    if(!sorted.length){
      content.innerHTML=top+renderLiveOffAir('no-data');
      setStats('—','—','STANDBY','R4');return;
    }
    const thRow=`<div class="timing-header-row"><div class="th left">POS</div><div class="th"></div><div class="th left">DRIVER</div><div class="th">GAP</div><div class="th">LAST LAP</div><div class="th">TIRE</div></div>`;
    const rows=sorted.map((p,i)=>{
      const dn=p.driver_number,dr=dm[dn]||{},dl=ld[dn]||[],stint=stints[dn]||{},intv=intervals[dn]||{};
      const ll=dl.length>0?dl[dl.length-1]:null,llms=ll?.lap_duration?ll.lap_duration*1000:null;
      const blms=dl.length>0?Math.min(...dl.filter(l=>l.lap_duration).map(l=>l.lap_duration*1000)):null;
      const isFast=blms&&Math.abs(blms-ft)<1,isPit=ll?.is_pit_out_lap,compound=stint.compound||null;
      const tireAge=stint.lap_start?(maxLap-stint.lap_start+1):null;
      const gapVal=i===0?0:(intv.gap_to_leader!==undefined?intv.gap_to_leader:null);
      const color=tc(DT[dn]||'default');
      const teamName=normalizeTeam(dr.team_name||DT[dn]||'—');
      return`<div class="driver-row ${i===0?'p1-live':''}">
        <div class="pos-cell ${posC(p.position)}">${p.position}</div>
        <div><div class="team-color-bar" style="background:${color}"></div></div>
        <div><div class="d-name">${dr.full_name?dr.full_name.split(' ').pop().toUpperCase():'#'+dn}</div><div class="d-team">${teamName}</div></div>
        <div class="${i===0?'gap-leader-cell':'gap-cell'}">${i===0?'LEADER':fmtGap(gapVal)}</div>
        <div class="lap-cell ${isFast?'lap-fastest':isPit?'lap-pit':'lap-normal'}">${isPit?'PIT':fmtLap(llms)}</div>
        <div class="tire-cell">${tireBadge(compound,tireAge)}</div>
      </div>`;
    }).join('');
    content.innerHTML=top+thRow+rows;
    setStats(ft<Infinity?fmtLap(ft):'—',leader?.name_acronym||'—',isLive?'LIVE':st.substring(0,4).toUpperCase(),maxLap>0?`L${maxLap}`:session.meeting_name?.substring(0,6).toUpperCase()||'—');
  }catch(e){
    console.error(e);
    // On connection failure show the same friendly off-air view, not a scary error screen
    content.innerHTML=top+renderLiveOffAir('error');
    setStats('—','—','STANDBY','R4');
  }
}

// ─── F1 RACE WEEKEND STATE MACHINE ───────────────────────────────────────────
// Four states with precedence: session-live > post-race > qualifying-available > between-races.
// 60s cache so we don't hammer OpenF1/Jolpica. ?devstate= URL param forces a
// specific state for manual testing (between-races|qualifying-available|session-live|post-race).
let _f1StateCache=null;
let _f1StateCacheAt=0;
const F1_STATES=['between-races','qualifying-available','session-live','post-race'];

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
function findPostRaceRound(){
  const now=Date.now();
  const hardcoded=new Set(Object.keys(HARDCODED_RACES).map(Number));
  for(const r of NEXT_RACES){
    const start=new Date(r.date+'T13:00:00Z').getTime();
    if(now>start+4*3600*1000&&now<start+24*3600*1000&&!hardcoded.has(r.round))return r.round;
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
    try{
      const sessions=await fetch('https://api.openf1.org/v1/sessions?session_type!=Testing&year=2026').then(r=>r.json());
      if(sessions.some(s=>new Date(s.date_start).getTime()<=now&&new Date(s.date_end).getTime()>=now))return 'session-live';
    }catch(e){}
  }

  // Post-race wins over qualifying-available per precedence rule.
  if(findPostRaceRound()!==null)return 'post-race';

  // Qualifying-available: Jolpica has non-empty qualifying for the upcoming round.
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
const HARDCODED_QUALI_VIDEOS={};

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

// LIVE tab variant: between-races banner + compact top-10 qualifying.
async function renderLiveWithQualifying(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('f1','live')+renderBackToSeriesHome('f1');
  document.getElementById('live-pill').style.display='none';
  const upcoming=NEXT_RACES.find(r=>new Date(r.date+'T13:00:00Z').getTime()>Date.now());
  if(!upcoming){content.innerHTML=top+renderLiveOffAir('between-races');return;}
  let quali=null;
  try{
    const data=await fetch(`${JOLPICA}/2026/${upcoming.round}/qualifying/`).then(r=>r.json());
    quali=data.MRData?.RaceTable?.Races?.[0]?.QualifyingResults;
  }catch(e){}
  if(!quali||!quali.length){content.innerHTML=top+renderLiveOffAir('between-races');return;}
  const top10=quali.slice(0,10);
  const rows=top10.map(r=>{
    const pos=parseInt(r.position);
    const name=r.Driver?.familyName||'—';
    const team=normalizeTeam(r.Constructor?.name||'—');
    const q3=r.Q3||r.Q2||r.Q1||'—';
    const posColor=pos===1?'var(--yellow)':pos===2?'#c0c0c0':pos===3?'#cd7f32':'var(--muted)';
    const bg=pos===1?'background:#0d1a08;':'';
    return`<div style="display:grid;grid-template-columns:32px 1fr 80px;padding:7px 12px;border-bottom:1px solid #141414;align-items:center;gap:6px;${bg}">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:${posColor};text-align:center;">${pos}</div>
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${tc(team)};">${name}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);">${team}</div>
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text);text-align:right;">${q3}</div>
    </div>`;
  }).join('');
  const cta=`<div onclick="switchF1Tab('qualifying')" style="background:var(--surface2);padding:12px 16px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;color:var(--red);cursor:pointer;text-transform:uppercase;border-top:1px solid var(--border);">Full Qualifying →</div>`;
  content.innerHTML=top+renderNextBanner()+`<div class="section-title"><span>Qualifying · Round ${upcoming.round} · Top 10</span><span>Most recent</span></div>`+rows+cta;
  setStats('QUAL',`R${upcoming.round}`,'QUAL',`${quali.length}`);
}

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
// below. We can't list all 24 rounds — NEXT_RACES only covers the next ~7 —
// so the upcoming section is labelled "next races" rather than a full season
// calendar.
function renderF1Schedule(){
  const content=document.getElementById('main-content');
  const completed=Object.values(HARDCODED_RACES).sort((a,b)=>parseInt(a.round)-parseInt(b.round));
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

// Session 7: Season Highlights. One placeholder card per completed round.
// IDs follow `highlights-f1-r{round}-{slug}` for the Highlights deep-link
// from each race-results row. No invented URLs — TODO placeholder only.
function f1TrackSlug(raceName){
  return (raceName||'').toLowerCase().replace(/grand prix/g,'').trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'race';
}
function renderF1Highlights(){
  const content=document.getElementById('main-content');
  const completed=Object.values(HARDCODED_RACES).sort((a,b)=>parseInt(a.round)-parseInt(b.round));
  const cards=completed.map(r=>{
    const w=r.Results?.[0];
    const slug=f1TrackSlug(r.raceName);
    const id=`highlights-f1-r${r.round}-${slug}`;
    const winner=w?`${w.Driver?.familyName||'—'} (${w.Constructor?.name||'—'})`:'—';
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${r.round} · ${r.Circuit?.Location?.country||''} · ${fmtDate(r.date)}</div>
      <div class="tx-highlights-title">${r.raceName}</div>
      <div class="tx-highlights-winner">Winner: ${winner}</div>
      <div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>
    </div>`;
  }).join('');
  content.innerHTML=renderSeriesBanner('f1','highlights')+renderBackToSeriesHome('f1')+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">F1 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps and key moments. Videos are added after verification — placeholders shown for races without a confirmed URL yet.</div>
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
  // Auto-dismiss diff badge for the tab we just visited (visit = "I've seen it")
  dismissF1Badge(tab);
  document.querySelectorAll('#f1-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+tab)?.classList.add('active');
  renderF1();
}
