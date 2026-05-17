// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
// 2026 real team names + brand colors
const TC={'Red Bull Racing':'#3671C6','Red Bull':'#3671C6','Mercedes':'#27F4D2','Ferrari':'#E8002D','McLaren':'#FF8000','Aston Martin':'#358C75','Alpine':'#FF87BC','Williams':'#37BEDD','Haas F1 Team':'#B6BABD','Haas':'#B6BABD','Audi':'#00FFE6','Racing Bulls':'#6692FF','Cadillac':'#C9A468','default':'#888'};
// 2026 driver numbers → team names (real 2026 seats)
// Mercedes: Russell 63, Antonelli 12 · Ferrari: Hamilton 44, Leclerc 16
// McLaren: Norris 4, Piastri 81 · Red Bull: Verstappen 1, Hadjar 6
// Racing Bulls: Lawson 30, Lindblad TBD · Aston Martin: Alonso 14, Stroll 18
// Alpine: Gasly 10, Colapinto 43 · Williams: Sainz 55, Albon 23
// Haas: Bearman 87, Ocon 31 · Audi: Hulkenberg 27, Bortoleto 5
// Cadillac: Perez 11, Bottas 77
const DT={1:'Red Bull',6:'Red Bull',44:'Ferrari',16:'Ferrari',4:'McLaren',81:'McLaren',63:'Mercedes',12:'Mercedes',14:'Aston Martin',18:'Aston Martin',10:'Alpine',43:'Alpine',23:'Williams',55:'Williams',87:'Haas F1 Team',31:'Haas F1 Team',27:'Audi',5:'Audi',30:'Racing Bulls',77:'Cadillac',11:'Cadillac'};

// ── STATE ─────────────────────────────────────────────────────────────────────
let currentSeries='schedule',currentF1Tab='live',selectedRace=null,isLive=false;
let cachedResults={},cachedStandings=null,cachedConstructors=null,cachedLaps={};
let cachedFastestLaps={}; // {round: {driverId: {time, lap, rank}}}
let selectedDriver=null;

// ── UTILS ─────────────────────────────────────────────────────────────────────
const tc=n=>TC[n]||TC['default'];
const posC=p=>p===1?'pos-1':p===2?'pos-2':p===3?'pos-3':'pos-other';
function fmtLap(ms){if(!ms||ms<=0)return'—';const s=ms/1000,m=Math.floor(s/60),sec=(s%60).toFixed(3).padStart(6,'0');return m>0?`${m}:${sec}`:sec;}
function fmtGap(g){if(g===null||g===undefined)return'—';if(g===0)return'LEADER';if(typeof g==='number')return`+${g.toFixed(3)}`;return g;}
function tireBadge(c,a){if(!c)return'<div style="width:20px"></div>';const cl=c.toLowerCase(),cs=cl==='soft'?'tire-s':cl==='medium'?'tire-m':'tire-h',lt=cl[0].toUpperCase(),ag=a!=null?`<span class="tire-laps">${a}L</span>`:'';return`<div class="tire-badge ${cs}">${lt}</div>${ag}`;}
function countdown(ds){const r=new Date(ds+'T13:00:00Z'),n=new Date(),d=r-n;if(d<=0)return null;const dy=Math.floor(d/86400000),hr=Math.floor((d%86400000)/3600000),mn=Math.floor((d%3600000)/60000);if(dy>0)return{num:dy,unit:dy===1?'DAY':'DAYS'};if(hr>0)return{num:hr,unit:'HOURS'};return{num:mn,unit:'MINS'};}
function fmtDate(ds){return new Date(ds+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
function setStats(a,b,c,d){['stat-1','stat-2','stat-3','stat-4'].forEach((id,i)=>document.getElementById(id).textContent=[a,b,c,d][i]);}

// Vercel Web Analytics — fail-silent custom event tracking.
// window.va is initialized by the inline stub at the bottom of <body>;
// the deferred script.js replaces it with the real implementation and
// drains the queue. Safe to call before script.js loads or if blocked.
function track(name,data){
  if(typeof window.va!=='function')return;
  try{window.va('event',data?{name,data}:{name});}catch(e){/* never break the app */}
}

// Country flags by nationality
const NAT_FLAGS={'British':'🇬🇧','German':'🇩🇪','Spanish':'🇪🇸','Finnish':'🇫🇮','French':'🇫🇷','Australian':'🇦🇺','Dutch':'🇳🇱','Monegasque':'🇲🇨','Mexican':'🇲🇽','Canadian':'🇨🇦','Japanese':'🇯🇵','Chinese':'🇨🇳','Thai':'🇹🇭','Argentine':'🇦🇷','Italian':'🇮🇹','Danish':'🇩🇰','Brazilian':'🇧🇷','American':'🇺🇸','New Zealander':'🇳🇿','Swiss':'🇨🇭','Belgian':'🇧🇪','Austrian':'🇦🇹','Swedish':'🇸🇪'};
const driverFlag=nat=>NAT_FLAGS[nat]||'🏳️';

// Race time string to ms
function lapStrToMs(s){if(!s)return null;const p=s.split(':');if(p.length===2){return(parseInt(p[0])*60+parseFloat(p[1]))*1000;}return parseFloat(s)*1000;}

// Normalize team names returned by Jolpica/Ergast to 2026 display names
function normalizeTeam(name){
  if(!name)return name;
  const map={'Kick Sauber':'Audi','Sauber':'Audi','RB F1 Team':'Racing Bulls','RB':'Racing Bulls','Red Bull':'Red Bull','AlphaTauri':'Racing Bulls'};
  return map[name]||name;
}

// ── JOLPICA API ───────────────────────────────────────────────────────────────
async function jolpica(path){
  const res=await fetch(`${JOLPICA}/${path}`);
  if(!res.ok)throw new Error(`API error ${res.status}`);
  return res.json();
}

async function fetchRaceList(){
  const data=await jolpica('2026/results/?limit=30');
  return data.MRData.RaceTable.Races||[];
}

async function fetchRaceResults(round){
  if(cachedResults[round])return cachedResults[round];
  // Hardcoded takes precedence for rounds we've manually verified
  if(HARDCODED_RACES[round]){cachedResults[round]=HARDCODED_RACES[round];return HARDCODED_RACES[round];}
  try{
    const data=await jolpica(`2026/${round}/results/?limit=30`);
    const results=data.MRData.RaceTable.Races[0]||null;
    if(results)cachedResults[round]=results;
    return results;
  }catch(e){return HARDCODED_RACES[round]||null;}
}

async function fetchDriverStandings(){
  if(cachedStandings)return cachedStandings;
  // Jolpica may lag for current season — use hardcoded verified standings if API fails or returns stale data
  try{
    const data=await jolpica('2026/driverStandings/');
    const standings=data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings||[];
    // If standings look incomplete (less than 4 races' worth), fall back to hardcoded
    if(standings.length>0 && parseFloat(standings[0].points)>=90){
      cachedStandings=standings;
      return standings;
    }
  }catch(e){}
  cachedStandings=HARDCODED_DRIVER_STANDINGS;
  return HARDCODED_DRIVER_STANDINGS;
}

async function fetchConstructorStandings(){
  if(cachedConstructors)return cachedConstructors;
  try{
    const data=await jolpica('2026/constructorStandings/');
    const standings=data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings||[];
    if(standings.length>0 && parseFloat(standings[0].points)>=170){
      cachedConstructors=standings;
      return standings;
    }
  }catch(e){}
  cachedConstructors=HARDCODED_CONSTRUCTOR_STANDINGS;
  return HARDCODED_CONSTRUCTOR_STANDINGS;
}

async function fetchLapTimes(round,driverId){
  const key=`${round}_${driverId}`;
  if(cachedLaps[key])return cachedLaps[key];
  const data=await jolpica(`2026/${round}/drivers/${driverId}/laps/?limit=100`);
  const laps=data.MRData.RaceTable.Races[0]?.Laps||[];
  cachedLaps[key]=laps;
  return laps;
}

// Fetch each driver's personal fastest lap for a given round.
// Tries Jolpica's fastest endpoint (1..20). Falls back to seeded data for
// hardcoded races. Returns {driverId: {time, lap, rank}}.
async function fetchFastestLaps(round){
  if(cachedFastestLaps[round])return cachedFastestLaps[round];
  const out={};
  // Seed verified overall race fastest laps so they appear instantly
  const seeded=SEEDED_FASTEST_LAPS[round]||{};
  Object.assign(out,seeded);
  // Try Jolpica — it has FastestLap embedded in /results, sometimes
  try{
    const data=await jolpica(`2026/${round}/results/?limit=30`);
    const results=data.MRData.RaceTable.Races[0]?.Results||[];
    results.forEach(r=>{
      if(r.FastestLap&&r.FastestLap.Time){
        const drvId=r.Driver?.driverId;
        if(drvId&&!out[drvId]){
          out[drvId]={time:r.FastestLap.Time.time,lap:r.FastestLap.lap,rank:r.FastestLap.rank};
        }
      }
    });
  }catch(e){}
  cachedFastestLaps[round]=out;
  return out;
}

// Seeded fastest laps from official sources for rounds where Jolpica may lag.
// Each entry: {driverId: {time, lap, rank}} — rank "1" = overall race fastest.
// Only includes drivers whose fastest lap is publicly confirmed.

// ── LIVE TIMING ───────────────────────────────────────────────────────────────
// Builds a friendly "between races" view for the LIVE tab when no session is running.
// Shows the next race banner + last completed race recap, instead of empty/error states.
// Generic — takes a context object so F1 and NASCAR can both use it.
function renderLiveOffAir(reason, ctx){
  ctx = ctx || {series:'f1', races:HARDCODED_RACES, banner:renderNextBanner(), seriesLabel:'F1'};
  const banner = ctx.banner;
  const completed = Object.values(ctx.races).sort((a,b)=>parseInt(b.round)-parseInt(a.round));
  const last = completed[0];
  let recap = '';
  if(last){
    const w=last.Results[0],p2=last.Results[1],p3=last.Results[2];
    const lastLabel = ctx.lastLabel || `Last Race · Round ${last.round}`;
    const viewTab = ctx.viewTab || 'races'; // tab to switch to
    const switchFn = ctx.switchFn || 'switchF1Tab';
    recap=`<div class="section-title"><span>${lastLabel}</span><span>${fmtDate(last.date)}</span></div>
    <div style="padding:14px 16px;background:var(--surface2);border-bottom:1px solid var(--border);">
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:18px;color:var(--white);">${last.Circuit?.Location?.country||''} ${last.raceName}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);margin-top:3px;">${last.Circuit?.circuitName||''}</div>
      <div style="display:flex;gap:14px;margin-top:10px;flex-wrap:wrap;">
        <div><span style="color:var(--yellow);font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:0.1em;">🏆 P1</span><div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${tc(w?.Constructor?.name)};">${w?.Driver?.familyName||'—'}</div></div>
        <div><span style="color:#c0c0c0;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:0.1em;">🥈 P2</span><div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${tc(p2?.Constructor?.name)};">${p2?.Driver?.familyName||'—'}</div></div>
        <div><span style="color:#cd7f32;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:0.1em;">🥉 P3</span><div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${tc(p3?.Constructor?.name)};">${p3?.Driver?.familyName||'—'}</div></div>
      </div>
      <div onclick="${switchFn}('${viewTab}')" style="margin-top:12px;font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--red);letter-spacing:0.08em;cursor:pointer;">VIEW FULL RESULTS →</div>
    </div>`;
  }
  const status=`<div style="padding:18px 16px;text-align:center;background:var(--bg);">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);letter-spacing:0.1em;">⬤ NO ${ctx.seriesLabel} SESSION ON TRACK</div>
    <div style="font-family:'Barlow',sans-serif;font-size:11px;color:var(--muted);margin-top:4px;">Live timing will activate when the next session starts.</div>
  </div>`;
  return banner+status+recap;
}

function switchSeries(s){
  track('tab:series',{series:s});
  currentSeries=s;
  document.querySelectorAll('.series-tab').forEach((t,i)=>t.classList.toggle('active',['schedule','f1','nascar','motogp','wrc','indycar','gt3','n24'][i]===s));
  // Toggle the right submenu and tier bar
  document.getElementById('f1-submenu').style.display=s==='f1'?'flex':'none';
  document.getElementById('nascar-submenu').style.display=s==='nascar'?'flex':'none';
  document.getElementById('nascar-series-bar').style.display=s==='nascar'?'flex':'none';
  if(s==='schedule'){renderSchedule();return;}
  if(s==='f1'){renderF1();return;}
  if(s==='nascar'){renderNascar();return;}
  if(s==='n24'){renderN24();return;}
  // All other series — placeholder
  document.getElementById('main-content').innerHTML=`<div class="state-screen"><div class="state-icon">🏎</div><div class="state-title">${s.toUpperCase()} Coming Soon</div><div class="state-sub">F1 and NASCAR are live now. More series launching soon.</div></div>`;
  setStats('—','—',s.toUpperCase(),'—');
}

function refresh(){
  track('refresh');
  cachedResults={};cachedStandings=null;cachedConstructors=null;cachedLaps={};cachedFastestLaps={};
  const btn=document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  const p = currentSeries==='schedule' ? Promise.resolve(renderSchedule())
          : currentSeries==='nascar'   ? Promise.resolve(renderNascar())
          :                              renderF1();
  p.finally(()=>btn.classList.remove('spinning'));
}

// ── LIVE DOTS ─────────────────────────────────────────────────────────────────
// Lights up each series-bar dot only when that series has a real live session.
// Sources, per tab:
//   - F1: OpenF1 /sessions, gated on being within ±2 days of a NEXT_RACES entry
//         so we don't hit their API on idle weekdays.
//   - NASCAR: date-based heuristic — today matches a NASCAR_CUP_SCHEDULE entry
//             AND we're inside the 17:00–23:00 UTC window (covers any Cup race).
//             No public live API for NASCAR; this is the best signal we have.
// Other tabs (motogp/wrc/indycar/gt3/n24): no data source, stay dim.
async function updateLiveDots(){
  const setDot=(sel,on)=>{const el=document.querySelector(sel);if(el)el.classList.toggle('live',!!on);};
  const now=new Date();

  // F1 — only query OpenF1 if we're within ±2 days of a NEXT_RACES entry.
  let f1Live=false;
  const inF1Weekend=NEXT_RACES.some(r=>Math.abs(now.getTime()-new Date(r.date+'T13:00:00Z').getTime())/86400000<=2);
  if(inF1Weekend){
    try{
      const sessions=await fetch('https://api.openf1.org/v1/sessions?session_type!=Testing&year=2026').then(r=>r.json());
      f1Live=sessions.some(s=>new Date(s.date_start)<=now&&new Date(s.date_end)>=now);
    }catch(e){/* network failure — leave f1Live=false */}
  }
  setDot('.series-tab[onclick*="\'f1\'"] .series-dot',f1Live);
  isLive=f1Live;

  // NASCAR — today is a race day AND we're in the race-window.
  const todayUTC=now.toISOString().slice(0,10);
  const todayRace=NASCAR_CUP_SCHEDULE.find(r=>r.date===todayUTC);
  const nascarLive=!!(todayRace&&now>=new Date(todayRace.date+'T17:00:00Z')&&now<=new Date(todayRace.date+'T23:00:00Z'));
  setDot('.series-tab[onclick*="\'nascar\'"] .series-dot',nascarLive);
}
