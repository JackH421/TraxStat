// ── HOME (LANDING PAGE) ──────────────────────────────────────────────────────
// Default landing view for TraxStat — curated motorsport news feed.
// Site boots into HOME (init.js); RACE SCHEDULE is still routable from the
// series bar via switchSeries('schedule').
//
// Sections (top → bottom):
//   1. RECENT WINNERS   — horizontal scroll carousel; one card per series
//                         with completed results (F1 + NASCAR + N24), sorted
//                         most-recent first. HOMEPAGE_FEATURED pins one card
//                         to the leftmost slot.
//   2. CHAMPIONSHIPS    — F1 and NASCAR title leaders + gap to P2.
//   3. NEWS FEED        — 8 article cards from HOMEPAGE_ARTICLES.
//   4. VIDEO HIGHLIGHTS — TODO: Session 5 hook, intentionally not rendered.
//
// Upcoming races live on the RACE SCHEDULE tab only — removed from HOME on
// 2026-05-17 to avoid duplicating that view.
//
// Cardinal rule: featured + championship data read from existing verified
// constants (HARDCODED_RACES, HARDCODED_DRIVER_STANDINGS, NASCAR_CUP_RESULTS,
// NASCAR_CUP_STANDINGS, N24_2026_RESULTS). All 8 article entries below are
// real verified articles — Session 5's daily aggregator will replace/extend
// this list. Never substitute invented real-looking articles.

// ── HOME CONSTANTS ───────────────────────────────────────────────────────────
// HOMEPAGE_FEATURED: null = pure auto carousel. If set to a single
// winner-card payload (same shape getRecentWinnersAcrossAllSeries returns
// per entry), the object is prepended as the leftmost pinned card; the
// auto-derived cards still render after it. Future automation may write here.
const HOMEPAGE_FEATURED = null;

// HOMEPAGE_ARTICLES — 8 real verified articles seeded 2026-05-17. Session 5
// aggregator (.github/workflows/daily-news-aggregator.yml) replaces this list
// daily at 8am ET via PR. Cardinal rule: every entry must have a real,
// verifiable source URL + publication. Never invent headlines or substitute
// fake URLs.
// Shape:
//   { id, series, headline, source, url, publishedAt (ISO Z), excerpt,
//     imageUrl (optional, '' if no og:image), imageCredit (optional) }
// 'series' enum: f1 | nascar | n24 | motogp | wrc | indycar | wec
const HOMEPAGE_ARTICLES = [
  {
    id: 'a1',
    series: 'f1',
    headline: 'On this day: Michael Schumacher wins… and stuns tifosi with F1 retirement',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/on-this-day-michael-schumacher-wins-and-stuns-tifosi-with-f1-retirement/10853930/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-09-10T06:00:04.000Z',
    excerpt: '10 September 2006 was one of the more consequential days in Formula 1 history, as title contender and seven-time world champion Michael Schumacher announced his retirement.The Ferrari hero did so moments after the Italian Grand Prix at Monza. Pole position had eluded the Ferrari…',
    imageUrl: 'https://cdn-9.motorsport.com/images/amp/68VwoP92/s6/michael-schumacher-ferrari.jpg',
    imageCredit: ''
  },
  {
    id: 'a2',
    series: 'f1',
    headline: 'Charles Leclerc gives health update after violent Monza F1 crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1104081/1/charles-leclerc-gives-health-update-after-violent-monza-f1-crash',
    publishedAt: '2026-09-10T15:51:13.000Z',
    excerpt: 'Charles Leclerc has provided an update on his health following his violent crash at the Italian Grand Prix.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-09/xpb_1425160_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a3',
    series: 'f1',
    headline: '‘Straightforward in the rules’ - Why Audi is protesting Monza F1 result',
    source: 'Crash.net',
    url: 'https://www.crash.net/f1/news/1104073/1/straightforward-rules-why-audi-protesting-monza-f1-result',
    publishedAt: '2026-09-10T14:04:39.000Z',
    excerpt: 'Why Audi is protesting the decision not to penalise Yuki Tsunoda at Monza.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-09/xpb_1433531_hires.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a4',
    series: 'nascar',
    headline: 'Carson Hocevar basically has a very unique, polarizing honor code',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/carson-hocevar-basically-has-a-very-unique-polarizing-honor-code/10853952/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-09-09T17:17:44.000Z',
    excerpt: 'Carson Hocevar is having fun but that doesn’t mean he doesn’t care.At the same time, when someone like Brad Keselowski gets mad at him for what happened between them early in the Southern 500, Hocevar doesn’t feel particularly compelled to offer empty apologies -- especially for…',
    imageUrl: 'https://cdn-9.motorsport.com/images/amp/24QewVzY/s6/carson-hocevar-spire-motorspor.jpg',
    imageCredit: ''
  },
  {
    id: 'a5',
    series: 'nascar',
    headline: 'Josh Berry signs with Legacy Motor Club for 2027 NASCAR Cup season',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/josh-berry-signs-with-legacy-motor-club-for-2027-nascar-cup-season/10853733/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-09-08T19:41:35.000Z',
    excerpt: 'Legacy Motor Club has officially announced Josh Berry as the driver of its No. 42 Toyota for the 2027 NASCAR Cup season. He will join Erik Jones (No. 43) and Riley Herbst (No. 84) as teammates next year. With Herbst, they are expanding into three full-time entries, and the team…',
    imageUrl: 'https://cdn-3.motorsport.com/images/amp/6zQGeQpY/s6/josh-berry-wood-brothers-racin.jpg',
    imageCredit: ''
  },
  {
    id: 'a6',
    series: 'nascar',
    headline: 'Carson Hocevar merch storereportedly approached $200,000 in sales after Keselowski clash',
    source: 'Motorsport.com NASCAR',
    url: 'https://www.motorsport.com/nascar-cup/news/carson-hocevar-souvenir-shop-reportedly-approached-200000-in-sales-after-keselowski-clash/10853933/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-NASCAR-CUP&utm_term=News&utm_content=www',
    publishedAt: '2026-09-09T16:07:47.000Z',
    excerpt: 'At the end of Stage 1 of last weekend\'s Southern 500, Carson Hocevar spun Brad Keselowski in a battle for position. They made contact twice through Turn 4, with Hocevar driving away from the incident unscathed. After the race the 2012 NASCAR Cup champion promised retribution…',
    imageUrl: 'https://cdn-9.motorsport.com/images/amp/2jEAQmb0/s6/carson-hocevar-no-77-spire-mot.jpg',
    imageCredit: ''
  },
  {
    id: 'a7',
    series: 'other',
    headline: 'New CCTV footage reveals timeline of horror Ollie Millroy GT crash',
    source: 'Crash.net',
    url: 'https://www.crash.net/sportscars/news/1104069/1/new-cctv-footage-reveals-timeline-horror-ollie-millroy-gt-crash',
    publishedAt: '2026-09-10T12:51:00.000Z',
    excerpt: 'A timeline of events from Ollie Millroy\'s horrific Chinese GT crash has revealed details on the sluggish response.',
    imageUrl: 'https://www.crash.net/sites/default/files/2026-09/hr1l2-rbyaahknj.jpg?width=1600&aspect_ratio=16:9',
    imageCredit: ''
  },
  {
    id: 'a8',
    series: 'other',
    headline: 'China GT organisers face severe backlash following Ollie Millroy\'s fiery crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/gt/news/hartog-heroics-prompt-serious-allegations-against-china-gt-organiser/10854006/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-09-10T09:01:13.000Z',
    excerpt: 'After a fiery accident at last weekend\'s China GT round that saw Loek Hartog pull Ollie Millroy from his burning Ferrari in Shanghai, event organisers have been left facing a barrage of uncomfortable questions.Onboard footage from Hartog’s Porsche 911 GT3 R (992) reveals track…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/J0r41M7Y/s6/hartog-heldentat-schwerste-vorwuerfe-gegen-veranstalter-china-gt-26090902.jpg',
    imageCredit: ''
  }
];

// HOMEPAGE_ALTERNATES — daily aggregator (Session 5) proposes 4 alternates
// alongside the 8 primary articles in HOMEPAGE_ARTICLES. Reviewer can swap
// any primary for an alternate by editing the PR before merge. Same shape
// as HOMEPAGE_ARTICLES entries. Not rendered on the page itself — exists
// purely as a write target for the aggregator.
const HOMEPAGE_ALTERNATES = [
  {
    id: 'a101',
    series: 'f1',
    headline: 'Madrid tipped to host chaotic F1 weekend: \'Put my money on a red flag\'',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/madrid-tipped-to-host-chaotic-f1-weekend-put-my-money-on-a-red-flag',
    publishedAt: '2026-09-10T12:30:00.000Z',
    excerpt: 'The Spanish Grand Prix has moved to Madrid, and the track is set to be a major challenge for the drivers.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Madring.jpg?v=1789047757&width=1800&height=945&quality=75&crop=5471%2C2873%2C0%2C100',
    imageCredit: 'Madring'
  },
  {
    id: 'a102',
    series: 'f1',
    headline: 'On this day: Schumacher announces F1 retirement at Monza',
    source: 'Autosport',
    url: 'https://www.autosport.com/f1/news/schumacher-announces-f1-retirement-on-this-day/10853937/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=uk',
    publishedAt: '2026-09-10T06:00:04.000Z',
    excerpt: '10 September 2006 was one of the more consequential days in Formula 1 history, as title contender and seven-time world champion Michael Schumacher announced his retirement.The Ferrari hero did so moments after the Italian Grand Prix at Monza. Pole position had eluded the Ferrari…',
    imageUrl: 'https://cdn-3.motorsport.com/images/amp/68VwoP92/s6/michael-schumacher-ferrari.jpg',
    imageCredit: ''
  },
  {
    id: 'a103',
    series: 'f1',
    headline: 'Charles Leclerc \'flaw\' pinned after latest Monza crash disaster',
    source: 'RacingNews365',
    url: 'https://racingnews365.com/charles-leclerc-flaw-pinned-after-latest-monza-crash-disaster',
    publishedAt: '2026-09-10T07:15:00.000Z',
    excerpt: 'Charles Leclerc suffered a painful and early end to the Italian GP, crashing at the final corner on just the second lap.',
    imageUrl: 'https://cdn.racingnews365.com/2026/Leclerc/XPB_1434357_HiRes.jpg?v=1788707233&width=1800&height=945&quality=75&crop=3004%2C1578%2C0%2C55',
    imageCredit: 'Leclerc Monza crash'
  },
  {
    id: 'a104',
    series: 'f1',
    headline: 'Charles Leclerc to avoid F1 Spanish GP engine penalty despite Monza crash',
    source: 'Motorsport.com',
    url: 'https://www.motorsport.com/f1/news/charles-leclerc-avoiding-spanish-gp-penalty/10853820/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-ALL&utm_term=News&utm_content=www',
    publishedAt: '2026-09-09T10:21:39.000Z',
    excerpt: 'Charles Leclerc managed to avoid engine damage in his high-speed crash at Monza so will not receive a grid penalty for this weekend’s Formula 1 Spanish Grand Prix.The Ferrari driver retired on lap two of the Italian Grand Prix on Sunday after losing control of his car through…',
    imageUrl: 'https://cdn-4.motorsport.com/images/amp/6zoDPjk0/s6/charles-leclerc-ferrari-3.jpg',
    imageCredit: ''
  }
];

// N24 race-end metadata. Not present as a constant in n24.js, but the
// 16–17 May 2026 date is stated in that file's header comment (verified).
// Used by the featured-card path to compare N24's "most recent" date
// against F1 / NASCAR race dates.
const N24_META = { date:'2026-05-17', raceName:'Nürburgring 24 Hours 2026', circuit:'Nordschleife', country:'🇩🇪' };

// ── HOME HELPERS ─────────────────────────────────────────────────────────────
function getSeriesAccentColor(s){
  return s==='f1'      ? 'var(--red)'
       : s==='nascar'  ? 'var(--yellow)'
       : s==='n24'     ? '#c0c0c0'
       : s==='motogp'  ? 'var(--orange)'
       : s==='wrc'     ? '#888'
       : s==='indycar' ? '#37bedd'
       : s==='wec'     ? 'var(--green)'
       : 'var(--muted)';
}

function getSeriesLabel(s){
  const map={f1:'F1',nascar:'NASCAR',n24:'N24',motogp:'MOTOGP',wrc:'WRC',indycar:'INDYCAR',wec:'WEC'};
  return map[s]||s.toUpperCase();
}

function formatRelativeTime(iso){
  const t=new Date(iso).getTime();
  const now=Date.now();
  const diff=now-t;
  if(diff<0)return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const mins=Math.floor(diff/60000);
  if(mins<1)return'just now';
  if(mins<60)return mins===1?'1 minute ago':`${mins} minutes ago`;
  const hrs=Math.floor(mins/60);
  if(hrs<24)return hrs===1?'1 hour ago':`${hrs} hours ago`;
  const days=Math.floor(hrs/24);
  if(days===1)return'yesterday';
  if(days<7)return`${days} days ago`;
  return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

// Returns an array of winner-card payloads, one per series with completed
// results, sorted most-recent first. Sources: HARDCODED_RACES (F1),
// NASCAR_CUP_RESULTS (NASCAR), N24_META.date + N24_2026_RESULTS (N24).
// Each entry has shape:
//   { series, seriesLabel, raceName, circuit, country, date, round,
//     winnerDisplay, winnerSub, winnerColor, podium, ctaTab }
function getRecentWinnersAcrossAllSeries(){
  const out=[];
  // F1
  const f1All=Object.values(HARDCODED_RACES).sort((a,b)=>+b.round-+a.round);
  if(f1All.length){
    const r=f1All[0];
    const w=r.Results[0],p2=r.Results[1],p3=r.Results[2];
    out.push({
      series:'f1',seriesLabel:'F1',
      raceName:r.raceName,
      circuit:r.Circuit?.circuitName||'',
      country:r.Circuit?.Location?.country||'',
      date:r.date,
      round:+r.round,
      winnerDisplay:w?.Driver?.familyName||'—',
      winnerSub:w?.Constructor?.name||'—',
      winnerColor:tc(w?.Constructor?.name),
      podium:[
        p2&&{pos:'P2',name:p2.Driver.familyName,team:p2.Constructor.name},
        p3&&{pos:'P3',name:p3.Driver.familyName,team:p3.Constructor.name},
      ].filter(Boolean),
      ctaTab:'races',
    });
  }
  // NASCAR
  const nascarRounds=Object.keys(NASCAR_CUP_RESULTS).map(Number).sort((a,b)=>b-a);
  if(nascarRounds.length){
    const round=nascarRounds[0];
    const r=NASCAR_CUP_RESULTS[round];
    const sched=NASCAR_CUP_SCHEDULE.find(x=>x.round===round);
    if(sched){
      const drv=NASCAR_CUP_DRIVERS[r.winner]||{};
      const p2=r.p2?{pos:'P2',name:r.p2,team:(NASCAR_CUP_DRIVERS[r.p2]||{}).team||''}:null;
      const p3=r.p3?{pos:'P3',name:r.p3,team:(NASCAR_CUP_DRIVERS[r.p3]||{}).team||''}:null;
      out.push({
        series:'nascar',seriesLabel:'NASCAR',
        raceName:sched.race,
        circuit:sched.track,
        country:sched.country||'🇺🇸',
        date:sched.date,
        round,
        winnerDisplay:r.winner,
        winnerSub:`${drv.team||'—'} · ${drv.mfr||'—'}`,
        winnerColor:nascarMfrColor(drv.mfr),
        podium:[p2,p3].filter(Boolean),
        ctaTab:'races',
      });
    }
  }
  // N24
  if(typeof N24_2026_RESULTS!=='undefined'&&N24_2026_RESULTS.length){
    const t1=N24_2026_RESULTS[0],t2=N24_2026_RESULTS[1],t3=N24_2026_RESULTS[2];
    out.push({
      series:'n24',seriesLabel:'N24',
      raceName:N24_META.raceName,
      circuit:N24_META.circuit,
      country:N24_META.country,
      date:N24_META.date,
      round:null,
      winnerDisplay:`#${t1.car} ${t1.team}`,
      winnerSub:t1.drivers.join(' · '),
      winnerColor:'#c0c0c0',
      podium:[
        {pos:'P2',name:`#${t2.car} ${t2.team}`,team:t2.drivers.join(' · ')},
        {pos:'P3',name:`#${t3.car} ${t3.team}`,team:t3.drivers.join(' · ')},
      ],
      ctaTab:null,
    });
  }
  return out.sort((a,b)=>b.date.localeCompare(a.date));
}

// Returns the carousel feed: pinned card first if HOMEPAGE_FEATURED is set,
// then the auto-derived cards. Cards are de-duplicated by series so a pinned
// override replaces the auto card for that same series rather than doubling.
function getFeaturedFeed(){
  const auto=getRecentWinnersAcrossAllSeries();
  if(!HOMEPAGE_FEATURED)return auto;
  const filtered=auto.filter(c=>c.series!==HOMEPAGE_FEATURED.series);
  return[HOMEPAGE_FEATURED,...filtered];
}

// ── HOME ACTIONS ─────────────────────────────────────────────────────────────
function openHomeFeaturedCard(series){
  const feed=getFeaturedFeed();
  const card=feed.find(c=>c.series===series);
  if(!card)return;
  track('home:featured',{series});
  switchSeries(series);
  if(card.ctaTab){
    if(series==='f1')switchF1Tab(card.ctaTab);
    else if(series==='nascar')switchNascarTab(card.ctaTab);
  }
}

function openHomeChampionship(series){
  track('home:championship',{series});
  // New-series cards route straight into the Standings sub-tab; 'wec' is the
  // display key for the 'gt3' routing key.
  if(series==='indycar'||series==='motogp'||series==='wrc'||series==='wec'){
    const key=series==='wec'?'gt3':series;
    switchSeries(key);
    goToSubTab(key,'standings');
    return;
  }
  switchSeries(series);
  if(series==='f1')switchF1Tab('drivers');
  else if(series==='nascar')switchNascarTab('drivers');
}

function openHomeArticle(id){
  const art=HOMEPAGE_ARTICLES.find(a=>a.id===id);
  if(!art)return;
  track('home:article',{series:art.series,source:art.source});
  window.open(art.url,'_blank','noopener,noreferrer');
}

// ── HOME RENDERERS ───────────────────────────────────────────────────────────
function renderHomeFeaturedCard(f){
  const dateStr=fmtDate(f.date);
  const roundLabel=f.round?` · R${f.round}`:'';
  const accent=getSeriesAccentColor(f.series);
  const podiumHTML=f.podium.map(p=>`
    <div style="display:flex;gap:6px;align-items:baseline;margin-top:3px;">
      <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--muted);letter-spacing:0.1em;min-width:20px;">${p.pos==='P2'?'🥈':'🥉'}</span>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:12px;color:var(--text);">${p.name}</span>
      <span style="font-family:'Barlow',sans-serif;font-size:10px;color:var(--muted);">${p.team}</span>
    </div>`).join('');
  return`<div class="home-featured-card" onclick="openHomeFeaturedCard('${f.series}')">
    <div class="home-featured-tag" style="color:${accent};border-color:${accent};">⬤ ${f.seriesLabel}${roundLabel} · ${dateStr}</div>
    <div class="home-featured-title">${f.country} ${f.raceName.toUpperCase()}</div>
    <div class="home-featured-circuit">${f.circuit}</div>
    <div class="home-featured-winner-label">🏆 WINNER</div>
    <div class="home-featured-winner" style="color:${f.winnerColor};">${f.winnerDisplay}</div>
    <div class="home-featured-winner-sub">${f.winnerSub}</div>
    ${podiumHTML?`<div class="home-featured-podium">${podiumHTML}</div>`:''}
    <div class="home-featured-cta">OPEN RESULTS →</div>
  </div>`;
}

function renderHomeFeaturedCarousel(){
  const feed=getFeaturedFeed();
  if(!feed.length)return'';
  const cards=feed.map(renderHomeFeaturedCard).join('');
  return`<div class="section-title"><span>Recent Winners · ${feed.length}</span><span>Swipe →</span></div>
    <div class="home-featured-carousel">${cards}</div>`;
}

function renderHomeChampionships(){
  const f1L=HARDCODED_DRIVER_STANDINGS[0],f1P2=HARDCODED_DRIVER_STANDINGS[1];
  const nL=NASCAR_CUP_STANDINGS[0],nP2=NASCAR_CUP_STANDINGS[1];
  const f1Gap=f1L&&f1P2?(+f1L.points-+f1P2.points):0;
  const nGap=nL&&nP2?(nL.points-nP2.points):0;
  const f1Team=f1L?.Constructors?.[0]?.name||'—';
  const nDrv=NASCAR_CUP_DRIVERS[nL?.driver]||{};
  // New-series leaders (all-series buildout 2026-06-12). Each card reads its
  // module's verified standings constants; gaps derive from the P2 row.
  const iL=INDYCAR_STANDINGS[0],iGap=iL.points-INDYCAR_STANDINGS[1].points;
  const iDrv=INDYCAR_DRIVERS[iL.driver]||{};
  const mL=MOTOGP_STANDINGS[0],mGap=mL.points-MOTOGP_STANDINGS[1].points;
  const mRider=MOTOGP_RIDERS[mL.rider]||{};
  const wL=WEC_HYPERCAR_STANDINGS[0],wGap=wL.points-WEC_HYPERCAR_STANDINGS[1].points;
  const wMfr=(wL.team.match(/BMW|Toyota|Ferrari|Alpine|Peugeot|Cadillac|Genesis|Aston Martin/)||['default'])[0];
  const rL=WRC_STANDINGS[0],rGap=rL.points-WRC_STANDINGS[1].points;
  const rDrv=WRC_DRIVERS[rL.driver]||{};
  return`<div class="section-title"><span>Championship Leaders</span><span>Tap to open</span></div>
  <div class="home-champ-grid">
    <div class="home-champ-card" onclick="openHomeChampionship('f1')">
      <div class="home-champ-series" style="color:var(--red);">F1</div>
      <div class="home-champ-name" style="color:${tc(f1Team)};">${f1L?.Driver?.familyName||'—'}</div>
      <div class="home-champ-team">${f1Team}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${f1L?.points||'0'} PTS</span><span style="color:var(--muted);">  ·  +${f1Gap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('nascar')">
      <div class="home-champ-series" style="color:var(--yellow);">NASCAR</div>
      <div class="home-champ-name" style="color:${nascarMfrColor(nDrv.mfr)};">${nL?.driver||'—'}</div>
      <div class="home-champ-team">${nDrv.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${nL?.points||0} PTS</span><span style="color:var(--muted);">  ·  +${nGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('indycar')">
      <div class="home-champ-series" style="color:#37bedd;">INDYCAR</div>
      <div class="home-champ-name" style="color:${indyEngineColor(iDrv.engine)};">${iL.driver}</div>
      <div class="home-champ-team">${iDrv.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${iL.points} PTS</span><span style="color:var(--muted);">  ·  +${iGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('motogp')">
      <div class="home-champ-series" style="color:var(--orange);">MOTOGP</div>
      <div class="home-champ-name" style="color:${motogpBikeColor(mRider.bike)};">${mL.rider}</div>
      <div class="home-champ-team">${mRider.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${mL.points} PTS</span><span style="color:var(--muted);">  ·  +${mGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('wec')">
      <div class="home-champ-series" style="color:var(--green);">WEC</div>
      <div class="home-champ-name" style="color:${wecMfrColor(wMfr)};">${wL.crew}</div>
      <div class="home-champ-team">${wL.team}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${wL.points} PTS</span><span style="color:var(--muted);">  ·  +${wGap}</span></div>
    </div>
    <div class="home-champ-card" onclick="openHomeChampionship('wrc')">
      <div class="home-champ-series" style="color:#b0b0b0;">WRC</div>
      <div class="home-champ-name" style="color:${wrcTeamColor(rDrv.team)};">${rL.driver}</div>
      <div class="home-champ-team">${rDrv.team||'—'}</div>
      <div class="home-champ-pts"><span style="color:var(--yellow);">${rL.points} PTS</span><span style="color:var(--muted);">  ·  +${rGap}</span></div>
    </div>
  </div>`;
}

function renderHomeArticles(){
  const sorted=[...HOMEPAGE_ARTICLES].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const rows=sorted.map(a=>{
    const accent=getSeriesAccentColor(a.series);
    const label=getSeriesLabel(a.series);
    const when=formatRelativeTime(a.publishedAt);
    // Image block is opt-in: only renders when imageUrl is a non-empty string.
    // onerror hides the <img> so a dead asset URL collapses the slot cleanly
    // instead of showing a broken-image icon.
    const imgHTML=a.imageUrl?`<img class="home-article-img" src="${a.imageUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling&&this.nextElementSibling.classList.contains('home-article-credit')&&(this.nextElementSibling.style.display='none');">${a.imageCredit?`<div class="home-article-credit">${a.imageCredit}</div>`:''}`:'';
    return`<div class="home-article" onclick="openHomeArticle('${a.id}')">
      <div class="home-article-stripe" style="background:${accent};"></div>
      <div>
        ${imgHTML}
        <div class="home-article-meta"><span style="color:${accent};">${label}</span><span>  ·  ${a.source}</span><span>  ·  ${when}</span></div>
        <div class="home-article-headline">${a.headline}</div>
        <div class="home-article-excerpt">${a.excerpt}</div>
      </div>
    </div>`;
  }).join('');
  return`<div class="section-title"><span>Latest News · ${sorted.length} Stories</span><span>Tap to read</span></div>${rows}`;
}

// TODO (Session 5): VIDEO HIGHLIGHTS section. Two slots — latest F1 video
// (read from HARDCODED_QUALI_VIDEOS or future RECAP_VIDEOS) and latest
// NASCAR video. Intentionally not rendered until source constants exist;
// adding empty visual scaffolding now would either show nothing or require
// invented data. Deferred per cardinal rule.

function renderHomeFooter(){
  const feed=getFeaturedFeed();
  const newest=feed[0];
  const dateStr=newest?fmtDate(newest.date):'—';
  return`<div class="home-footer">Updated ${dateStr}  ·  Cards: ${feed.length}  ·  Feed v1</div>`;
}

function renderHome(){
  const feed=getFeaturedFeed();
  const top=feed[0];
  track('home:render',{cardCount:feed.length,topSeries:top?.series||'none'});
  document.getElementById('main-content').innerHTML=
    renderHomeFeaturedCarousel()
    +renderHomeChampionships()
    +renderHomeArticles()
    +renderHomeFooter();
  if(top){
    setStats(top.seriesLabel,top.winnerDisplay.length>10?top.winnerDisplay.slice(0,10):top.winnerDisplay,'HOME','—');
  }else{
    setStats('—','—','HOME','—');
  }
}
// ── END HOME ─────────────────────────────────────────────────────────────────
