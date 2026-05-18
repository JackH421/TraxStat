// ── N24 (PERMANENT POST-RACE MODULE) ─────────────────────────────────────────
// Nürburgring 24 Hours 2026 — final classification, qualifying, recap videos.
// Data sources verified by user 2026-05-17:
//   - Results: RacingNews365 (top 20), dailysportscar.com, Wikipedia entry list,
//     motorsport-total.com. Top-20 only — full classification (P21+, lap counts,
//     gaps, fastest laps, grid positions) pending official ADAC PDF.
//   - Qualifying: pitdebrief.com, motorsport-total.com (Top Qualifying 3 only).
//   - Recap videos: official ADAC RAVENOL 24h Nürburgring channel + GT World
//     (official SRO channel). All embeddable.

// Verstappen Racing entry — Wikipedia + ESPN verified for the team/driver fields;
// finalResult sourced from RacingNews365 + dailysportscar.com (2026-05-17).
const N24_VERSTAPPEN={
  car:'3',
  team:'Verstappen Racing',
  operator:'Winward Racing',
  carModel:'Mercedes-AMG GT3 Evo',
  drivers:['Max Verstappen','Lucas Auer','Daniel Juncadella','Jules Gounon'],
  qualifying:{pos:4,time:'8:12.005',driver:'Juncadella',session:'TQ3'},
  finalResult:{
    position:'DNF',
    classifiedPos:38,
    reason:'Driveshaft failure ~3.5h from finish while leading'
  },
};

// Top-20 final classification. Top-20 only — full classification (P21+, lap
// counts, gaps, fastest laps, grid positions) pending official ADAC PDF.
// Sources verified 2026-05-17: RacingNews365 (top-20 table), dailysportscar.com,
// Wikipedia entry list (car make/model + class), motorsport-total.com.
const N24_2026_RESULTS=[
  {pos:1,  car:'80',  team:'Mercedes-AMG Team RAVENOL',           carModel:'Mercedes-AMG GT3 Evo',             cls:'SP9 Pro',    drivers:['Engel','Stolz','Schiller','Martin'],                 classWin:true,  note:null},
  {pos:2,  car:'84',  team:'Red Bull Team ABT',                   carModel:'Lamborghini Huracán GT3 Evo 2',    cls:'SP9 Pro',    drivers:['Engstler','Bortolotti','Niederhauser'],              classWin:false, note:'(started P1)'},
  {pos:3,  car:'34',  team:'Walkenhorst Motorsport',              carModel:'Aston Martin Vantage AMR GT3 Evo', cls:'SP9 Pro',    drivers:['Krognes','Drudi','Thiim','Fernandez Laser'],         classWin:false, note:null},
  {pos:4,  car:'99',  team:'ROWE Racing',                         carModel:'BMW M4 GT3 Evo',                   cls:'SP9 Pro',    drivers:['Harper','Hesse','S. van der Linde','D. Vanthoor'],   classWin:false, note:null},
  {pos:5,  car:'81',  team:'Schubert Motorsport',                 carModel:'BMW M3 Touring 24H',               cls:'SP-X',       drivers:['Klingmann','de Phillippi','Verhagen','de Wilde'],    classWin:true,  note:null},
  {pos:6,  car:'24',  team:'Lionspeed GP',                        carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro',    drivers:['Heinrich','L. Vanthoor','Feller'],                   classWin:false, note:null},
  {pos:7,  car:'67',  team:'HRT Ford Racing',                     carModel:'Ford Mustang GT3 Evo',             cls:'SP9 Pro',    drivers:['Olsen','Mies','Vervisch','Stippler'],                classWin:false, note:null},
  {pos:8,  car:'54',  team:'Dinamic GT',                          carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro',    drivers:['Buus','Christensen','Sturm','Hartog'],               classWin:false, note:null},
  {pos:9,  car:'77',  team:'Schubert Motorsport',                 carModel:'BMW M4 GT3 Evo',                   cls:'SP9 Pro',    drivers:['Wittmann','Eng','Weerts','Frijns'],                  classWin:false, note:null},
  {pos:10, car:'48',  team:'48LOSCH Motorsport by Black Falcon',  carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro-Am', drivers:['"Daan Arrow"','Assenheimer','T. Müller','Pereira'],  classWin:false, note:null},
  {pos:11, car:'18',  team:'Lionspeed GP',                        carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro-Am', drivers:['Tilley','Hill','Kolb','(Hofer)'],                    classWin:false, note:null},
  {pos:12, car:'123', team:'Mühlner Motorsport',                  carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro-Am', drivers:['Rump','Bünnagel','Brundle'],                         classWin:false, note:null},
  {pos:13, car:'30',  team:'Hankook Competition',                 carModel:'Porsche 911 GT3 R (992)',          cls:'SP9 Pro-Am', drivers:['Kim','Bruins','Cho','Seefried'],                     classWin:false, note:null},
  {pos:14, car:'4',   team:'Goroyan RT by Car Collection',        carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro-Am', drivers:['Goroyan','Kvitka','Fontana','Berthon'],              classWin:false, note:null},
  {pos:15, car:'86',  team:'High Class Racing',                   carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro-Am', drivers:['Li','Fjordbach','Ye','King'],                        classWin:false, note:null},
  {pos:16, car:'69',  team:'Dörr Motorsport',                     carModel:'McLaren 720S GT3 Evo',             cls:'SP9 Pro',    drivers:['Scheider','Dörr','Kirchhöfer','Glock (DSQ)'],        classWin:false, note:'Glock DSQ mid-race'},
  {pos:17, car:'55',  team:'Dinamic GT',                          carModel:'Porsche 911 GT3 R (992.2)',        cls:'SP9 Pro',    drivers:['Beretta','Ghiretti','Sturm','Hartog'],               classWin:false, note:null},
  {pos:18, car:'32',  team:'Toyo Tires with Ring Racing',         carModel:'Mercedes-AMG GT3 Evo',             cls:'SP9 Pro-Am', drivers:['Nakayama','Gülden','Sandtler'],                      classWin:false, note:null},
  {pos:19, car:'900', team:'Black Falcon Team Zimmermann',        carModel:'Porsche 911 GT3 Cup (992.1)',      cls:'Cup 2-Pro',  drivers:['Hardt','Hites','Koslowski','Meijer'],                classWin:true,  note:null},
  {pos:20, car:'902', team:'Black Falcon Team Liqui Moly',        carModel:'Porsche 911 GT3 Cup (992.1)',      cls:'Cup 2-Pro',  drivers:['Harrison','Nagelsdiek','Rennhofer','Wassertheuer'],  classWin:false, note:null},
];

// Top Qualifying 3 — pole shootout. 12 cars (positions P13+ are set by prior
// qualifying sessions and aren't part of the pole-shootout view).
// Source verified 2026-05-17: pitdebrief.com, motorsport-total.com.
const N24_2026_QUALIFYING=[
  {pos:1,  car:'84', team:'Red Bull Team ABT',              driver:'Engstler',    time:'8:11.123', gap:'POLE'},
  {pos:2,  car:'130',team:'Schaeffler Team ABT (Red Bull)', driver:'Mapelli',     time:'8:11.468', gap:'+0.345'},
  {pos:3,  car:'16', team:'Scherer Sport PHX',              driver:'Haase',       time:'8:11.984', gap:'+0.861'},
  {pos:4,  car:'3',  team:'Verstappen Racing',              driver:'Juncadella',  time:'8:12.005', gap:'+0.882', highlight:true},
  {pos:5,  car:'45', team:'Realize Kondo Racing',           driver:'Neubauer',    time:'8:12.221', gap:'+1.098'},
  {pos:6,  car:'7',  team:'Konrad Motorsport',              driver:'M. Paul',     time:'8:12.256', gap:'+1.133'},
  {pos:7,  car:'64', team:'HRT Ford Racing',                driver:'Stippler',    time:'8:13.676', gap:'+2.553'},
  {pos:8,  car:'911',team:'Manthey Racing',                 driver:'Preining',    time:'8:13.939', gap:'+2.816'},
  {pos:9,  car:'1',  team:'ROWE Racing',                    driver:'Marciello',   time:'8:14.256', gap:'+3.133'},
  {pos:10, car:'47', team:'KCMG',                           driver:'Pittard',     time:'8:14.627', gap:'+3.504'},
  {pos:11, car:'34', team:'Walkenhorst Motorsport',         driver:'Thiim',       time:'8:15.250', gap:'+4.127'},
  {pos:12, car:'67', team:'HRT Ford Racing',                driver:'Vervisch',    time:'8:16.144', gap:'+5.021'},
];

// Recap videos — official ADAC RAVENOL 24h Nürburgring channel and GT World
// (official SRO channel). All embeddable; verified via oEmbed 2026-05-17.
const N24_2026_RECAP=[
  {title:'Race Highlights: Last 4 Hours',     videoId:'MZDpeHnkZSI', caption:"Official ADAC RAVENOL 24h highlights from the final 4 hours of the 2026 race — the Verstappen drama and Mercedes' first overall win since 2016."},
  {title:'Race Highlights: First 6 Hours',    videoId:'MG2LrnmfUck', caption:"Official highlights from the opening 6 hours — chaos, crashes, and Verstappen's wet-weather charge from P10 to the lead."},
  {title:'Verstappen Onboard at Night',       videoId:'B5IXDZlWLIU', caption:'Max Verstappen night-time onboard during Top Qualifying 2 — first time on the Nordschleife in the dark.'},
  {title:'#80 Mercedes (Race Winner) Onboard',videoId:'diS_9fO2uQE', caption:'Live onboard of the winning #80 Mercedes-AMG Team RAVENOL — Engel, Stolz, Schiller, Martin.'},
];

// Sub-tab state. 'results' is the default (post-race classification first).
let currentN24Tab='results';
// Expanded results-row car number (string), or null. One open at a time.
let selectedN24Entry=null;
// Expanded recap-video index (number), or null. One iframe at a time so the
// DOM never holds more than one YouTube embed simultaneously.
let selectedN24RecapIndex=null;

function switchN24Tab(tab){
  track('tab:n24',{tab});
  currentN24Tab=tab;
  selectedN24Entry=null;
  selectedN24RecapIndex=null;
  renderN24();
}

function toggleN24Entry(car){
  track('result:expand:n24',{car});
  selectedN24Entry=selectedN24Entry===car?null:car;
  renderN24();
}

function toggleN24Recap(i){
  track('recap:open:n24',{index:i});
  selectedN24RecapIndex=selectedN24RecapIndex===i?null:i;
  renderN24();
}

function renderN24VerstappenCard(){
  const v=N24_VERSTAPPEN, fr=v.finalResult;
  return `<div style="background:var(--surface);border-top:1px solid var(--border);border-left:3px solid var(--red);padding:14px 16px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:18px;color:var(--red);background:#1a0005;border:1px solid var(--red);padding:2px 8px;border-radius:3px;">#${v.car}</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:var(--white);letter-spacing:0.04em;">${v.team.toUpperCase()}</div>
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;color:var(--muted);margin-top:2px;">${v.carModel} · operated by ${v.operator}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--text);margin-top:8px;line-height:1.4;">${v.drivers.join(' · ')}</div>
        <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);margin-top:6px;line-height:1.4;">${fr.reason}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:var(--muted);letter-spacing:0.1em;">Q${v.qualifying.pos} →</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:26px;color:var(--red);line-height:1;">P${fr.classifiedPos}</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--red);margin-top:3px;">${fr.position}</div>
      </div>
    </div>
  </div>`;
}

function renderN24ResultsBody(){
  const verstappenCard=renderN24VerstappenCard();
  const title=`<div class="section-title"><span>Top 20 — full classification pending official ADAC results</span><span>${N24_2026_RESULTS.length||''} cars</span></div>`;

  if(!N24_2026_RESULTS.length){
    return verstappenCard+title+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Final Classification</div><div class="state-sub">Top-20 data lands in the next commit.</div></div>`;
  }

  const rows=N24_2026_RESULTS.map(r=>{
    const expanded=selectedN24Entry===r.car;
    const posColor=r.pos===1?'var(--yellow)':r.pos<=3?'var(--white)':'var(--muted)';
    const classWinBadge=r.classWin
      ?`<span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:9px;letter-spacing:0.1em;color:#000;background:var(--yellow);padding:2px 5px;border-radius:2px;white-space:nowrap;">‡ CLASS WIN</span>`
      :'';
    const leadDriver=r.drivers[0];
    const moreCount=r.drivers.length-1;
    const moreLabel=moreCount>0?`<span style="color:var(--muted);font-size:11px;">+${moreCount}</span>`:'';

    const row=`<div class="race-item" style="cursor:pointer;${expanded?'background:#0a0005;':''}" onclick="toggleN24Entry('${r.car}')">
      <div style="width:36px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:${posColor};">P${r.pos}</div>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;color:var(--text);background:var(--surface2);border:1px solid var(--border);padding:1px 5px;border-radius:2px;">#${r.car}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:var(--text);">${leadDriver}</span>
          ${moreLabel}
          <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:9px;letter-spacing:0.08em;color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:1px 5px;border-radius:2px;white-space:nowrap;">${r.cls}</span>
        </div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-top:2px;">${r.team}</div>
      </div>
      <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
        ${classWinBadge}
      </div>
    </div>`;

    const panel=expanded?`<div style="background:var(--bg);border-bottom:1px solid var(--border);padding:10px 16px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">Drivers</div>
      <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${r.drivers.join(' · ')}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-top:8px;margin-bottom:4px;">Car</div>
      <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${r.carModel}</div>
      ${r.note?`<div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--yellow);margin-top:8px;line-height:1.4;">${r.note}</div>`:''}
    </div>`:'';

    return row+panel;
  }).join('');

  return verstappenCard+title+rows;
}

function renderN24QualifyingBody(){
  const title=`<div class="section-title"><span>Top Qualifying 3 — pole shootout (12 cars)</span><span>TQ3</span></div>`;

  if(!N24_2026_QUALIFYING.length){
    return title+`<div class="state-screen"><div class="state-icon">⏱</div><div class="state-title">TQ3 Pole Shootout</div><div class="state-sub">12-car classification lands in the next commit.</div></div>`;
  }

  const rows=N24_2026_QUALIFYING.map(r=>{
    const posColor=r.pos===1?'var(--yellow)':r.pos<=3?'var(--white)':r.highlight?'var(--red)':'var(--muted)';
    const rowStyle=r.highlight?'background:#1a0005;border-left:2px solid var(--red);':'';
    return `<div class="race-item" style="${rowStyle}">
      <div style="width:36px;text-align:center;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:${posColor};">P${r.pos}</div>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;color:${r.highlight?'var(--red)':'var(--text)'};background:${r.highlight?'#1a0005':'var(--surface2)'};border:1px solid ${r.highlight?'var(--red)':'var(--border)'};padding:1px 5px;border-radius:2px;">#${r.car}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:var(--text);">${r.driver}</span>
        </div>
        <div style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);margin-top:2px;">${r.team}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--text);line-height:1;">${r.time}</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:${r.pos===1?'var(--yellow)':'var(--muted)'};margin-top:3px;">${r.gap}</div>
      </div>
    </div>`;
  }).join('');

  return title+rows;
}

function renderN24RecapBody(){
  const title=`<div class="section-title"><span>Recap highlights</span><span>${N24_2026_RECAP.length||''} videos</span></div>`;

  if(!N24_2026_RECAP.length){
    return title+`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">Recap Highlights</div><div class="state-sub">Verified videos land in the next commit.</div></div>`;
  }

  const tiles=N24_2026_RECAP.map((v,i)=>{
    const active=selectedN24RecapIndex===i;
    return `<div onclick="toggleN24Recap(${i})" style="position:relative;background-image:url('https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg');background-size:cover;background-position:center;background-color:#000;padding-bottom:56.25%;cursor:pointer;outline:${active?'2px solid var(--red)':'none'};outline-offset:-2px;">
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 55%);display:flex;flex-direction:column;justify-content:flex-end;padding:6px 8px;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10px;color:#fff;line-height:1.15;letter-spacing:0.02em;">${v.title}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:${active?'var(--red)':'#fff'};margin-top:2px;letter-spacing:0.06em;">${active?'▶ NOW PLAYING':'▶ TAP TO PLAY'}</div>
      </div>
    </div>`;
  }).join('');

  const grid=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);">${tiles}</div>`;

  let player='';
  if(selectedN24RecapIndex!==null && N24_2026_RECAP[selectedN24RecapIndex]){
    const v=N24_2026_RECAP[selectedN24RecapIndex];
    player=`<div style="background:var(--bg);">
      <div style="padding:10px 16px;display:flex;justify-content:space-between;align-items:center;background:var(--surface);border-bottom:1px solid var(--border);">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.12em;color:var(--red);">▶ ${v.title.toUpperCase()}</div>
        <div onclick="toggleN24Recap(${selectedN24RecapIndex})" style="cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:13px;color:var(--muted);padding:0 4px;">✕</div>
      </div>
      <div style="position:relative;padding-bottom:56.25%;height:0;background:#000;">
        <iframe src="https://www.youtube.com/embed/${v.videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div style="background:var(--surface);border-bottom:1px solid var(--border);padding:10px 16px;font-family:'Barlow',sans-serif;font-size:11px;color:var(--text);line-height:1.5;">${v.caption}</div>
    </div>`;
  }

  return title+grid+player;
}

function renderN24(){
  const content=document.getElementById('main-content');
  const v=N24_VERSTAPPEN;

  const header=`<div style="background:linear-gradient(135deg,#0d0d0d 0%,#1a0005 50%,#0d0d0d 100%);border-bottom:1px solid var(--border);padding:14px 16px;">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;color:var(--red);text-transform:uppercase;">🇩🇪 N24 · NÜRBURGRING 24 HOURS 2026 · FINAL CLASSIFICATION</div>
    <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--muted);margin-top:4px;">Nordschleife · 16–17 May 2026</div>
  </div>`;

  const pillBase="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.1em;padding:9px 14px;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;text-transform:uppercase;";
  const activeStyle="color:var(--red);border-bottom-color:var(--red);";
  const idleStyle="color:var(--red);";
  const pill=(tab,label)=>`<div onclick="switchN24Tab('${tab}')" style="${pillBase}${currentN24Tab===tab?activeStyle:idleStyle}">${label}</div>`;
  const subBar=`<div style="background:var(--surface2);border-bottom:1px solid var(--border);display:flex;">
    ${pill('results','Race Results')}
    ${pill('qualifying','Qualifying')}
    ${pill('recap','Recap')}
  </div>`;

  const body =
    currentN24Tab==='qualifying' ? renderN24QualifyingBody() :
    currentN24Tab==='recap'      ? renderN24RecapBody()      :
                                   renderN24ResultsBody();

  content.innerHTML=header+subBar+body;

  if(currentN24Tab==='qualifying'){
    setStats(`P${v.qualifying.pos}`,`#${v.car}`,'N24 QUAL',v.qualifying.time);
  }else{
    setStats(`P${v.finalResult.classifiedPos}`,`#${v.car}`,'N24',v.finalResult.position);
  }
}
// ── END N24 ───────────────────────────────────────────────────────────────────
