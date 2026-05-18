// ── INIT ──────────────────────────────────────────────────────────────────────
// Default to the HOME landing page. switchSeries handles hiding the F1/NASCAR
// submenu bars (which are display:flex by default in CSS). SCHEDULE remains
// accessible as a secondary tab.
switchSeries('home');
setInterval(()=>{if(currentSeries==='f1'&&currentF1Tab==='live'&&isLive)renderLive();},30000);
updateLiveDots();
setInterval(updateLiveDots,60000);
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
