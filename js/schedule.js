// ── SCHEDULE (LANDING PAGE) ───────────────────────────────────────────────────
// Hero card for the very next race across all series, then the 3 next-closest
// races as a compact list. For more, users tap into a series and use its
// per-series SCHEDULE sub-tab.
function renderSchedule(){
  const content=document.getElementById('main-content');
  const now=new Date();
  const f1Up=NEXT_RACES.filter(r=>new Date(r.date+'T13:00:00Z')>now).map(r=>({
    series:'f1', tag:'F1', tagColor:'var(--red)',
    name:r.name, circuit:r.circuit, country:r.country, date:r.date,
    round:r.round, sprint:r.sprint, chase:false,
    dateObj:new Date(r.date+'T13:00:00Z')
  }));
  const nascarUp=NASCAR_CUP_SCHEDULE.filter(r=>new Date(r.date+'T18:00:00Z')>now).map(r=>({
    series:'nascar', tag:'NSCR', tagColor:'var(--yellow)',
    name:r.race, circuit:r.track, country:r.country, date:r.date,
    round:r.round, sprint:false, chase:!!r.chase, type:r.type,
    dateObj:new Date(r.date+'T18:00:00Z')
  }));

  const all=[...f1Up,...nascarUp].sort((a,b)=>a.dateObj-b.dateObj);

  if(!all.length){
    content.innerHTML=`<div class="state-screen"><div class="state-icon">🏁</div><div class="state-title">No Upcoming Races</div><div class="state-sub">Season schedule complete.</div></div>`;
    setStats('—','—','SCHED','—');return;
  }
  const next=all[0];
  const cd=countdown(next.date);
  const cdNum=cd?cd.num:'GO';
  const cdUnit=cd?cd.unit+' AWAY':'STARTING';
  const tags=[next.sprint?'SPRINT':'',next.chase?'CHASE':'',next.type==='R'?'ROAD':next.type==='S'?'STREET':''].filter(Boolean).join(' · ');
  const heroRoundLabel=`Round ${next.round}`;
  const hero=`<div onclick="switchSeries('${next.series}')" style="background:linear-gradient(135deg,#0d0d0d 0%,#1a0005 50%,#0d0d0d 100%);border-bottom:1px solid var(--border);padding:22px 16px;cursor:pointer;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;">
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;color:${next.tagColor};text-transform:uppercase;margin-bottom:6px;">⬤ NEXT UP · ${next.tag} · ${heroRoundLabel}${tags?' · '+tags:''}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:26px;color:var(--white);line-height:1.05;">${next.country} ${next.name.toUpperCase()}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;color:var(--muted);margin-top:5px;">${next.circuit}</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--muted);margin-top:3px;">${fmtDate(next.date)}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-family:'Share Tech Mono',monospace;font-size:38px;color:${cd?'var(--yellow)':'var(--green)'};line-height:1;">${cdNum}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:9px;color:var(--muted);letter-spacing:0.1em;margin-top:3px;text-transform:uppercase;">${cdUnit}</div>
      </div>
    </div>
  </div>`;

  const upcoming=all.slice(1,4);
  const rows=upcoming.map(r=>renderScheduleRow(r)).join('');
  const sectionTitle=upcoming.length?`<div class="section-title"><span>Coming Up · Next ${upcoming.length}</span><span>Tap to open series</span></div>`:'';

  content.innerHTML=hero+sectionTitle+rows;
  setStats(next.tag,next.name.split(' ').slice(0,2).join(' '),'SCHED',cd?`${cd.num}${cd.unit[0]}`:'NOW');
}

// Schedule row template extracted so the live-N24 path and the normal path share it.
function renderScheduleRow(r){
  const cd2=countdown(r.date);
  const cdNum2=cd2?cd2.num:'-';
  const cdUnit2=cd2?(cd2.unit==='DAYS'||cd2.unit==='DAY'?'D':cd2.unit==='HOURS'?'H':'M'):'';
  const rowTags=[r.sprint?'SPRINT':'',r.chase?'CHASE':'',r.type==='R'?'RC':r.type==='S'?'ST':''].filter(Boolean).join(' · ');
  const subLabel=r.round?'R'+r.round:'';
  return`<div class="race-item" onclick="switchSeries('${r.series}')">
    <div style="width:44px;text-align:center;">
      <div style="display:inline-block;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.06em;color:${r.tagColor};border:1px solid ${r.tagColor};padding:2px 5px;border-radius:3px;">${r.tag}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:8px;color:var(--muted);letter-spacing:0.05em;margin-top:3px;">${subLabel}</div>
    </div>
    <div>
      <div class="race-item-country">${r.country}${rowTags?' · '+rowTags:''}</div>
      <div class="race-item-name">${r.name}</div>
      <div class="race-item-date">${fmtDate(r.date)}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:'Share Tech Mono',monospace;font-size:16px;color:var(--yellow);line-height:1;">${cdNum2}${cdUnit2}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:8px;color:var(--muted);letter-spacing:0.08em;margin-top:3px;">AWAY</div>
    </div>
  </div>`;
}
