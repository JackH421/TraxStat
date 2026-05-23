// ── INIT ──────────────────────────────────────────────────────────────────────
// Default to the HOME landing page. switchSeries handles hiding the F1/NASCAR
// submenu bars (which are display:flex by default in CSS). SCHEDULE remains
// accessible as a secondary tab.
switchSeries('home');
setInterval(()=>{if(currentSeries==='f1'&&currentF1Tab==='live'&&isLive)renderLive();},30000);
updateLiveDots();
setInterval(updateLiveDots,60000);

// ── Countdown freshness ──────────────────────────────────────────────────────
// Every view that shows "N DAYS / HOURS / MINS away" is just an HTML string
// rendered once; if the tab stays open across days the number goes stale.
// Re-render the current countdown-bearing view every 60s, AND whenever the
// user brings the tab back to the foreground (visibilitychange fires on iOS
// when you swipe back into the browser). This is cheap — these views don't
// hit the network, they only re-compute against `new Date()`.
function refreshCountdownViews(){
  try{
    if(currentSeries==='schedule')return renderSchedule();
    if(currentSeries==='f1'){
      if(currentF1Tab==='schedule')return renderF1();
      if(currentF1Tab==='live')return renderLive();
    }
    if(currentSeries==='nascar'){
      if(currentNascarTab==='schedule')return renderNascar();
      if(currentNascarTab==='live')return renderNascar();
    }
    if(currentSeries==='n24' && currentN24Tab==='schedule')return renderN24();
    if(currentSeries==='home')return renderHome();
  }catch(e){console.warn('countdown refresh failed',e);}
}
setInterval(refreshCountdownViews,60000);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible')refreshCountdownViews();
});
// Resume F1 post-race polling on page load if a round is still in its 24h window.
// Persisting `pollStart:{round}` in localStorage means a refresh doesn't reset
// the 35-poll sequence — we pick up where we left off.
(async()=>{
  const hardcoded=new Set(Object.keys(HARDCODED_RACES).map(Number));
  // First check: any saved poll anchor still in 24h window?
  for(const r of NEXT_RACES){
    if(hardcoded.has(r.round))continue;
    const anchor=+localStorage.getItem(`traxstat:f1:pollStart:${r.round}`);
    if(anchor&&(Date.now()-anchor)<24*3600*1000){startF1PostRacePolling(r.round);return;}
  }
  // No saved anchor: detect if we're currently in a post-race window
  const round=findPostRaceRound();
  if(round!==null)startF1PostRacePolling(round);
})();
updateF1Badges();
