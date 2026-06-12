// ═══════════════════════════════════════════════════════════════════════════
// ── WEC MODULE (routing key 'gt3' — the GT3/WEC series-bar tab) ──────────────
// ═══════════════════════════════════════════════════════════════════════════
// FIA World Endurance Championship 2026 — built 2026-06-12 (Phase 1c).
// Data model (design of record: docs/series-data-models.md):
//
//   WEC_SCHEDULE: [{round, race, circuit, country, date, hours|null}]
//   WEC_RESULTS:  {round: {
//     hypercar: {car, team, mfr, model, drivers:[...]},  // class winner
//     lmgt3:    {car, team, mfr, model, drivers:[...]},  // class winner
//     note }}
//   WEC_HYPERCAR_STANDINGS: [{pos, crew, team, car, points, gap}]
//   WEC_MFR_STANDINGS:      [{pos, mfr, points, gap}]
//   WEC_LMGT3_STANDINGS:    [{pos, car, team, mfr, points, gap}]  // Teams trophy
//
// WEC results are CLASS-BASED — each completed round records the winner per
// class (Hypercar + LMGT3), not a single overall table. fiawec.com groups
// drivers' standings by crew per car; drivers who missed a round (e.g.
// S. van der Linde, D. Vanthoor — absent at Imola for IMSA Long Beach)
// appear as separate rows with their own totals, exactly as published.
//
// Sub-tabs: Standings / Race Results / Schedule / Highlights. NO live timing.
//
// Sources (fetched + cross-checked 2026-06-12; fiawec.com and Wikipedia
// agreed on every points total, position, and winner checked):
//   https://www.fiawec.com/en/page/manufacturers-classification
//     (Hypercar drivers' + manufacturers' + LMGT3 teams' standings, primary)
//   https://en.wikipedia.org/wiki/2026_FIA_World_Endurance_Championship
//     (calendar, entry list, race results summary — cross-check)
//   https://en.wikipedia.org/wiki/2026_6_Hours_of_Imola
//   https://en.wikipedia.org/wiki/2026_6_Hours_of_Spa-Francorchamps
//   https://www.fiawec.com/en/race/lone-star-le-mans-2026 (R5 date)
//   https://www.fiawec.com/en/race/qatar-1812km-2026 (R7 date)
// Cardinal rule: unverified values are null with a comment, never guessed.
// 2026 notes: season opened at Imola (Qatar 1812 km postponed to 24 Oct);
// Porsche withdrew its factory Hypercar programme after 2025; Genesis is a
// new 2026 Hypercar entrant. Le Mans (R3) runs 2026-06-13/14 — not yet raced.

let currentWECTab='standings';
let selectedWECRace=null;

// Hypercar manufacturer brand colors (styling only)
const WEC_MFR_COLOR={'BMW':'#1C69D4','Toyota':'#EB0A1E','Ferrari':'#E8002D','Aston Martin':'#358C75','Alpine':'#0078C1','Peugeot':'#9DA0A3','Cadillac':'#C9A468','Genesis':'#9B6A4F','McLaren':'#FF8000','Porsche':'#D5001C','Corvette':'#FFD700','Lexus':'#888','default':'#888'};
function wecMfrColor(m){return WEC_MFR_COLOR[m]||WEC_MFR_COLOR['default'];}

// 2026 calendar (8 rounds) — verified 2026-06-12, fiawec.com nav calendar +
// Wikipedia calendar table (identical). hours: null where no fetched page
// states the 2026 race duration (R5 Lone Star Le Mans; R7 Qatar 1812 km is a
// distance race). R6 Fuji's duration is carried by its official race name.
const WEC_SCHEDULE=[
  {round:1, race:'6 Hours of Imola',                        circuit:'Autodromo Enzo e Dino Ferrari',  country:'🇮🇹', date:'2026-04-19', hours:6},
  {round:2, race:'TotalEnergies 6 Hours of Spa-Francorchamps',circuit:'Circuit de Spa-Francorchamps', country:'🇧🇪', date:'2026-05-09', hours:6},
  {round:3, race:'24 Hours of Le Mans',                     circuit:'Circuit de la Sarthe',           country:'🇫🇷', date:'2026-06-13', hours:24},
  {round:4, race:'6 Hours of São Paulo',                    circuit:'Interlagos Circuit',             country:'🇧🇷', date:'2026-07-12', hours:6},
  {round:5, race:'Lone Star Le Mans',                       circuit:'Circuit of the Americas',        country:'🇺🇸', date:'2026-09-06', hours:null},
  {round:6, race:'6 Hours of Fuji',                         circuit:'Fuji Speedway',                  country:'🇯🇵', date:'2026-09-27', hours:6},
  {round:7, race:'Qatar 1812 km',                           circuit:'Losail International Circuit',   country:'🇶🇦', date:'2026-10-24', hours:null},
  {round:8, race:'8 Hours of Bahrain',                      circuit:'Bahrain International Circuit',  country:'🇧🇭', date:'2026-11-07', hours:8},
];

// Completed rounds 1–2 — class winners verified Wikipedia race pages +
// season results table, corroborated by fiawec.com 25-pt race scores.
const WEC_RESULTS={
  1:{
    hypercar:{car:'8', team:'Toyota Racing',  mfr:'Toyota', model:'Toyota TR010 Hybrid', drivers:['Sébastien Buemi','Brendon Hartley','Ryō Hirakawa']},
    lmgt3:   {car:'69',team:'Team WRT',       mfr:'BMW',    model:'BMW M4 GT3 Evo',      drivers:['Dan Harper','Anthony McIntosh','Parker Thompson']},
    note:'The #8 Toyota won over 213 laps (1,045.61 km); the pole-sitting #51 Ferrari AF Corse (Giovinazzi, 1:30.127) finished second. Several regulars (Aitken, D. Vanthoor, S. van der Linde) missed the round for the clashing IMSA Long Beach race.',
  },
  2:{
    hypercar:{car:'20',team:'BMW M Team WRT', mfr:'BMW',    model:'BMW M Hybrid V8',     drivers:['Robin Frijns','René Rast','Sheldon van der Linde']},
    lmgt3:   {car:'10',team:'Garage 59',      mfr:'McLaren',model:'McLaren 720S GT3 Evo',drivers:['Antares Au','Tom Fleming','Marvin Kirchhöfer']},
    note:'The #20 BMW won from the sister #15 BMW over 152 laps; the #94 Peugeot of Duval/Jakobsen/Pourchaire took pole (2:00.653). The #51 Ferrari, second at Imola, retired. Garage 59 took its first LMGT3 win as McLaren\'s new partner team.',
  },
};

// Hypercar World Endurance Drivers' Championship after R2 Spa — verified
// 2026-06-12 from fiawec.com (primary), cross-checked Wikipedia (identical).
// Crews share points per car; part-season drivers appear separately exactly
// as published (van der Linde and D. Vanthoor missed Imola).
// gap = points − leader points.
const WEC_HYPERCAR_STANDINGS=[
  {pos:1, crew:'Rast / Frijns',                    team:'BMW M Team WRT',       car:'20', points:35, gap:0},
  {pos:2, crew:'Buemi / Hartley / Hirakawa',       team:'Toyota Racing',        car:'8',  points:26, gap:-9},
  {pos:3, crew:'S. van der Linde (from R2)',       team:'BMW M Team WRT',       car:'20', points:25, gap:-10},
  {pos:4, crew:'Conway / Kobayashi / de Vries',    team:'Toyota Racing',        car:'7',  points:25, gap:-10},
  {pos:5, crew:'Magnussen / Marciello',            team:'BMW M Team WRT',       car:'15', points:24, gap:-11},
  {pos:6, crew:'Fuoco / Molina / Nielsen',         team:'Ferrari AF Corse',     car:'50', points:23, gap:-12},
  {pos:7, crew:'Pier Guidi / Giovinazzi / Calado', team:'Ferrari AF Corse',     car:'51', points:19, gap:-16},
  {pos:8, crew:'D. Vanthoor (from R2)',            team:'BMW M Team WRT',       car:'15', points:18, gap:-17},
  {pos:9, crew:'Gamble / Tincknell',               team:'Aston Martin THOR Team',car:'007',points:14, gap:-21},
  {pos:10,crew:'Félix da Costa / Habsburg / Milesi',team:'Alpine Endurance Team',car:'35', points:12, gap:-23},
  {pos:11,crew:'Hanson / Kubica / Ye',             team:'AF Corse',             car:'83', points:9,  gap:-26},
];

// Hypercar World Manufacturers' Championship after R2 — verified 2026-06-12
// from fiawec.com (primary), Wikipedia identical. Points go to the two
// highest finishers per manufacturer; +1 pole bonuses included.
const WEC_MFR_STANDINGS=[
  {pos:1, mfr:'BMW',          points:59, gap:0},
  {pos:2, mfr:'Toyota',       points:52, gap:-7},
  {pos:3, mfr:'Ferrari',      points:42, gap:-17},
  {pos:4, mfr:'Aston Martin', points:14, gap:-45},
  {pos:5, mfr:'Alpine',       points:14, gap:-45},
  {pos:6, mfr:'Peugeot',      points:9,  gap:-50},
  {pos:7, mfr:'Cadillac',     points:8,  gap:-51},
  {pos:8, mfr:'Genesis',      points:6,  gap:-53},
];

// FIA Endurance Trophy for LMGT3 Teams after R2 — verified 2026-06-12 from
// fiawec.com (primary), Wikipedia identical points. Marques from the season
// entry list (#87 Akkodis ASP's Lexus is from entry-list section context —
// lower confidence, flagged in the session report).
const WEC_LMGT3_STANDINGS=[
  {pos:1, car:'92', team:'The Bend Manthey',      mfr:'Porsche',      points:30, gap:0},
  {pos:2, car:'10', team:'Garage 59',             mfr:'McLaren',      points:26, gap:-4},
  {pos:3, car:'69', team:'Team WRT',              mfr:'BMW',          points:25, gap:-5},
  {pos:4, car:'33', team:'TF Sport',              mfr:'Corvette',     points:22, gap:-8},
  {pos:5, car:'21', team:'Vista AF Corse',        mfr:'Ferrari',      points:20, gap:-10},
  {pos:6, car:'27', team:'Heart of Racing Team',  mfr:'Aston Martin', points:18, gap:-12},
  {pos:7, car:'91', team:'Manthey DK Engineering',mfr:'Porsche',      points:18, gap:-12},
  {pos:8, car:'58', team:'Garage 59',             mfr:'McLaren',      points:16, gap:-14},
  {pos:9, car:'32', team:'Team WRT',              mfr:'BMW',          points:10, gap:-20},
  {pos:10,car:'87', team:'Akkodis ASP Team',      mfr:'Lexus',        points:8,  gap:-22},
];

// Per-round official race highlights from the FIA WEC YouTube channel
// (oEmbed author_name "FIA World Endurance Championship"). IDs oEmbed-verified
// + embed-page checked 2026-06-12; thumbs hand-picked from auto frames
// (R1's auto frames were all people shots — cover image used, flagged).
const WEC_HIGHLIGHTS={
  1:{id:'Clz1zmPODSE',thumb:'https://i.ytimg.com/vi/Clz1zmPODSE/maxresdefault.jpg'},
  2:{id:'6-R2YdZHg7Q',thumb:'https://i.ytimg.com/vi/6-R2YdZHg7Q/hq1.jpg'},
};

// ── WEC HELPERS ───────────────────────────────────────────────────────────────
function wecTrackSlug(circuit){return (circuit||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'race';}

function renderWECNextBanner(){
  const now=new Date();
  const next=WEC_SCHEDULE.find(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!next)return'';
  const cd=countdown(next.date);
  const cdHTML=cd?`<div class="countdown-num">${cd.num}</div><div class="countdown-label">${cd.unit} AWAY</div>`:`<div class="countdown-num" style="color:var(--green)">NOW</div>`;
  return`<div class="next-race-banner">
    <div>
      <div class="next-race-label">Next Race · Round ${next.round}${next.hours?` · ${next.hours}H`:''}</div>
      <div class="next-race-name">${next.country} ${next.race}</div>
      <div class="next-race-circuit">${next.circuit}</div>
      <div class="next-race-date">${fmtDate(next.date)}</div>
    </div>
    <div class="countdown-box">${cdHTML}</div>
  </div>`;
}

// ── WEC RACE RESULTS ──────────────────────────────────────────────────────────
function renderWECRaces(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('gt3','races')+renderBackToSeriesHome('gt3');
  const banner=renderWECNextBanner();
  const completed=WEC_SCHEDULE.filter(s=>WEC_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const rows=completed.map(s=>{
    const res=WEC_RESULTS[s.round];
    const hc=res.hypercar;
    const isSelected=selectedWECRace===s.round;
    const slug=wecTrackSlug(s.circuit);
    const hlId=`highlights-gt3-r${s.round}-${slug}`;
    return`<div class="race-item ${isSelected?'selected':''}" onclick="selectWECRace(${s.round})">
      <div class="round-badge"><div class="round-num">${s.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${s.country}${s.hours?` · ${s.hours}H`:''}</div>
        <div class="race-item-name">${s.race}</div>
        <div class="race-item-date">${fmtDate(s.date)}</div>
        <span class="tx-race-highlights-link" onclick="event.stopPropagation();navigateToHighlights('gt3','${hlId}')">▶ Highlights</span>
      </div>
      <div>
        <span class="winner-flag" style="color:${wecMfrColor(hc.mfr)};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;">#${hc.car}</span>
        <div class="winner-name">${hc.team}</div>
        <div class="winner-team">${hc.mfr}</div>
      </div>
    </div>`;
  }).join('');
  let html=top+banner+`<div class="section-title"><span>2026 WEC · ${completed.length} of ${WEC_SCHEDULE.length} rounds</span><span>Hypercar winner shown · Tap for both classes</span></div>`+rows;
  if(selectedWECRace)html+=buildWECRaceDetailHTML(selectedWECRace);
  content.innerHTML=html;
  setStats('—','—','RACE',`${completed.length}/${WEC_SCHEDULE.length}`);
  if(selectedWECRace){
    setTimeout(()=>{const el=document.querySelector('.results-header');if(el)el.scrollIntoView({behavior:'smooth'});},100);
  }
}

// Class-winner card — one per class in the race detail panel.
function wecClassWinnerCard(label,w){
  if(!w)return'';
  return`<div style="padding:14px 16px;background:var(--surface2);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--yellow);letter-spacing:0.12em;margin-bottom:6px;">🏆 ${label} WINNER</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:${wecMfrColor(w.mfr)};">#${w.car} ${w.team}</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);margin-top:3px;">${w.drivers.join(' · ')}</div>
    <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);margin-top:2px;">${w.model||w.mfr}</div>
  </div>`;
}

function buildWECRaceDetailHTML(round){
  const sched=WEC_SCHEDULE.find(s=>s.round===round);
  const res=WEC_RESULTS[round];
  if(!sched||!res)return'';
  const header=`<div class="results-header">
    <div class="results-race-name">${sched.country} ${sched.race}</div>
    <div class="results-race-sub">${sched.circuit} · Round ${sched.round}${sched.hours?` · ${sched.hours} Hours`:''}</div>
  </div>`;
  const notes=res.note?`<div style="padding:14px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;margin-bottom:4px;">RACE NOTES</div>
    <div style="font-family:'Barlow',sans-serif;font-size:12px;color:var(--text);line-height:1.5;">${res.note}</div>
  </div>`:'';
  return header+wecClassWinnerCard('HYPERCAR',res.hypercar)+wecClassWinnerCard('LMGT3',res.lmgt3)+notes;
}

function selectWECRace(round){
  track('race:open:gt3',{round});
  selectedWECRace=selectedWECRace===round?null:round;
  renderWECRaces();
}

// ── WEC STANDINGS (Hypercar drivers + manufacturers + LMGT3 teams stacked) ────
function renderWECStandings(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('gt3','standings')+renderBackToSeriesHome('gt3');
  const hcHdr=`<div class="section-title"><span>Hypercar Drivers · 2026 · After R2 Spa</span><span>Crews share points</span></div>`;
  const hcRows=WEC_HYPERCAR_STANDINGS.map(d=>`<div class="champ-row">
      <div class="champ-pos" style="color:${d.pos===1?'var(--yellow)':d.pos<=3?'var(--green)':'var(--text)'}">${d.pos}</div>
      <div class="flag-cell" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;color:var(--muted);">#${d.car}</div>
      <div>
        <div class="champ-name" style="font-size:13px;">${d.crew}</div>
        <div class="champ-team-sm">${d.team}</div>
      </div>
      <div class="champ-pts">${d.points}</div>
      <div class="champ-gap" style="color:${d.pos===1?'var(--yellow)':'var(--muted)'}">${d.pos===1?'LEADER':d.gap}</div>
    </div>`).join('');
  const mfrHdr=`<div class="section-title"><span>Hypercar Manufacturers</span><span>After R2</span></div>`;
  const mfrRows=WEC_MFR_STANDINGS.map(m=>`<div class="champ-row">
      <div class="champ-pos" style="color:${m.pos===1?'var(--yellow)':m.pos<=3?'var(--green)':'var(--text)'}">${m.pos}</div>
      <div class="flag-cell" style="color:${wecMfrColor(m.mfr)};font-size:18px;">●</div>
      <div><div class="champ-name" style="color:${wecMfrColor(m.mfr)};">${m.mfr}</div></div>
      <div class="champ-pts">${m.points}</div>
      <div class="champ-gap" style="color:${m.pos===1?'var(--yellow)':'var(--muted)'}">${m.pos===1?'LEADER':m.gap}</div>
    </div>`).join('');
  const gtHdr=`<div class="section-title"><span>LMGT3 Teams Trophy</span><span>After R2</span></div>`;
  const gtRows=WEC_LMGT3_STANDINGS.map(t=>`<div class="champ-row">
      <div class="champ-pos" style="color:${t.pos===1?'var(--yellow)':t.pos<=3?'var(--green)':'var(--text)'}">${t.pos}</div>
      <div class="flag-cell" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;color:${wecMfrColor(t.mfr)};">#${t.car}</div>
      <div>
        <div class="champ-name">${t.team}</div>
        <div class="champ-team-sm" style="color:${wecMfrColor(t.mfr)}">${t.mfr}</div>
      </div>
      <div class="champ-pts">${t.points}</div>
      <div class="champ-gap" style="color:${t.pos===1?'var(--yellow)':'var(--muted)'}">${t.pos===1?'LEADER':t.gap}</div>
    </div>`).join('');
  content.innerHTML=top+hcHdr+hcRows+mfrHdr+mfrRows+gtHdr+gtRows;
  setStats(`${WEC_HYPERCAR_STANDINGS[0].points} pts`,WEC_HYPERCAR_STANDINGS[0].crew.split(' / ')[0],'STANDINGS','R2/8');
}

// ── WEC SCHEDULE ──────────────────────────────────────────────────────────────
function renderWECSchedule(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('gt3','schedule')+renderBackToSeriesHome('gt3');
  const now=new Date();
  const upcoming=WEC_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now);
  if(!upcoming.length){
    content.innerHTML=top+`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">Season Complete</div><div class="state-sub">No more WEC rounds on the 2026 calendar.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const hdr=`<div class="section-title"><span>WEC 2026 · ${upcoming.length} Upcoming</span><span>Through R${upcoming[upcoming.length-1].round}</span></div>`;
  const rows=upcoming.map(r=>{
    const cd=countdown(r.date);
    const cdNum=cd?cd.num:'-';
    const cdUnit=cd?(cd.unit==='DAYS'||cd.unit==='DAY'?'D':cd.unit==='HOURS'?'H':'M'):'';
    return`<div class="race-item">
      <div class="round-badge"><div class="round-num">${r.round}</div><div class="round-label">RND</div></div>
      <div>
        <div class="race-item-country">${r.country}${r.hours?` · ${r.hours}H`:''}</div>
        <div class="race-item-name">${r.race}</div>
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
  setStats(`R${next.round}`,next.race.split(' ').slice(0,3).join(' '),'SCHED',cd?`${cd.num}${cd.unit[0]}`:'NOW');
}

// ── WEC HIGHLIGHTS ────────────────────────────────────────────────────────────
function renderWECHighlights(){
  const content=document.getElementById('main-content');
  const top=renderSeriesBanner('gt3','highlights')+renderBackToSeriesHome('gt3');
  const completed=WEC_SCHEDULE.filter(s=>WEC_RESULTS[s.round]).slice().sort((a,b)=>b.round-a.round);
  const cards=completed.map(s=>{
    const res=WEC_RESULTS[s.round];
    const slug=wecTrackSlug(s.circuit);
    const id=`highlights-gt3-r${s.round}-${slug}`;
    const vid=WEC_HIGHLIGHTS[s.round];
    const body=vid
      ? txHighlightSlotHTML('Race Highlights',vid.id,vid.thumb)
      : `<div class="tx-highlights-watch-todo"><b>Watch highlights</b><br>TODO: paste verified official YouTube URL</div>`;
    return`<div class="tx-highlights-card" id="${id}">
      <div class="tx-highlights-meta">Round ${s.round} · ${s.country} · ${fmtDate(s.date)}</div>
      <div class="tx-highlights-title">${s.race}</div>
      <div class="tx-highlights-winner">Hypercar: #${res.hypercar.car} ${res.hypercar.team} · LMGT3: #${res.lmgt3.car} ${res.lmgt3.team}</div>
      ${body}
    </div>`;
  }).join('');
  content.innerHTML=top+
    `<div class="tx-highlights-header">
      <div class="tx-highlights-header-title">WEC 2026 · Season Highlights</div>
      <div class="tx-highlights-header-sub">Official race recaps from the FIA WEC YouTube channel. Videos are added after verification — placeholders shown for rounds without a confirmed URL yet.</div>
    </div>`+
    (cards||`<div class="state-screen"><div class="state-icon">🎬</div><div class="state-title">No Completed Rounds Yet</div></div>`);
  setStats('—','—','HILITES',`${completed.length}`);
}

// ── DISPATCHER ────────────────────────────────────────────────────────────────
function switchWECTab(tab){
  track('tab:gt3',{tab});
  currentWECTab=tab;
  selectedWECRace=null;
  document.querySelectorAll('#gt3-submenu .f1-sub-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('gt3tab-'+tab)?.classList.add('active');
  renderWEC();
}

function renderWEC(){
  if(currentWECTab==='races')return renderWECRaces();
  if(currentWECTab==='schedule')return renderWECSchedule();
  if(currentWECTab==='highlights')return renderWECHighlights();
  return renderWECStandings();
}
// ── END WEC ───────────────────────────────────────────────────────────────────
