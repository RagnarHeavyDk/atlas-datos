(async () => {
  'use strict';
  if (document.getElementById('atlas-agent-office')) return;
  if(!window.AtlasOfficeWorld) await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='office-world.js?v=11';script.onload=resolve;script.onerror=reject;document.head.append(script);}).catch(()=>null);
  const world=window.AtlasOfficeWorld;if(!world)return;
  if(!window.AtlasOfficeRoomDesignV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-room-design-v1.js?v=2';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const roomDesign=window.AtlasOfficeRoomDesignV1;if(!roomDesign)return;
  if(!window.AtlasOfficeTrafficV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-traffic-v1.js?v=6';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const traffic=window.AtlasOfficeTrafficV1;if(!traffic)return;
  const trafficBudget=traffic.budget();
  const pedestrianRecovery=traffic.recovery(world);
  const ambientDepartures=traffic.departures();
  if(!window.AtlasOfficeLife)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-life.js?v=7';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const life=window.AtlasOfficeLife;if(!life)return;
  if(!window.AtlasOfficeStagePanV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-stage-pan-v1.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const stagePan=window.AtlasOfficeStagePanV1;if(!stagePan)return;
  if(!window.AtlasOfficeStageFocusV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-stage-focus-v1.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const stageFocus=window.AtlasOfficeStageFocusV1;if(!stageFocus)return;
  if(!window.AtlasOfficeActionsV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-actions-v1.js?v=2';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const actions=window.AtlasOfficeActionsV1;if(!actions)return;
  if(!window.AtlasOfficeEnvironmentV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-environment-v1.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const environment=window.AtlasOfficeEnvironmentV1;if(!environment)return;
  if(!window.AtlasOfficeExteriorV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-exterior-v1.js?v=2';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const exterior=window.AtlasOfficeExteriorV1;
  if(exterior&&!window.AtlasOfficeExteriorMotionV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-exterior-motion-v1.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  if(exterior&&window.AtlasOfficeExteriorMotionV1&&!window.AtlasOfficeExteriorAnimatedV1)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-exterior-animated-v1.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const exteriorMotion=window.AtlasOfficeExteriorMotionV1,exteriorAnimated=window.AtlasOfficeExteriorAnimatedV1;
  if(!window.AtlasOfficeParkingIntegratedV8)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-parking-integrated-v8.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const parking=window.AtlasOfficeParkingIntegratedV8?.create(world);
  if(!window.AtlasOfficeSignage)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-signage.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const signage=window.AtlasOfficeSignage;if(!signage)return;
  if(!window.AtlasOfficeMarket)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='office-market.js?v=1';s.onload=resolve;s.onerror=reject;document.head.append(s);}).catch(()=>null);
  const market=window.AtlasOfficeMarket;if(!market)return;
  if (document.getElementById('atlas-agent-office')) return;
  const root = document.querySelector('main > section'); if (!root) return;
  const sheet = document.createElement('link'); sheet.rel='stylesheet'; sheet.href='agent-office.css?v=25';
  // Do not expose interactive SVG controls while their layout is still unstyled.
  const styleReady=new Promise(resolve=>{sheet.addEventListener('load',()=>resolve(true),{once:true});sheet.addEventListener('error',()=>resolve(false),{once:true});});
  document.head.append(sheet);if(!await styleReady)return;
  const panel = document.createElement('section'); panel.id='atlas-agent-office'; panel.setAttribute('aria-label','Oficina de agentes / Agent office');
  // The office is the first operational view; existing panels remain below it.
  const place = () => {
    const anchor=root.querySelector('.top')||root.firstElementChild;
    if(anchor && anchor!==panel && anchor.nextElementSibling!==panel) anchor.after(panel);
  };
  place(); setTimeout(place,2500); setTimeout(place,4500);
  const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  let payload=null, selected='mateo', paused=false, motionChoice='on';
  // Explicit public-site requirement: start playing, including under OS reduced motion.
  // Pause is local to this visit; never reuse the private office preferences.
  let frameCount=0,frameError=false,lastMotionAt=0;
  let analyst=null, aiQuestion='', aiStatus='', aiPosting=false;
  let workflow=null, workflowEventId=0, workflowInitialized=false;
  let specialistTeam=null,specialistSeen=new Set(),specialistInitialized=false;
  let zoom=1, speed=1, department='all', lastFrame=0, lastSeenMessage=0, initialized=false, fetching=false, online=false, roster=[];
  let peopleNodes=new Map(), packets=[], packetCounterAt=0, organisationOpen=false, replayIndex=0, lastReplayAt=0;
  let ambient=true, dialogues=[], dialogueTurn=0, nextAmbient=Date.now()+1500, lastDepth=0, directoryOpen=false;
  let personIndex=new Map(), spriteParts=new Map(), lastDialogueLayout=0;
  let focused=false,cameraRoom=null,camera=world.viewBox.slice(),cameraTarget=camera.slice();
  if(parking){camera=parking.viewBox.slice();cameraTarget=camera.slice();}
  let parkingFocus=false;
  let panController=null;
  let environmentState={},environmentElapsed=0;
  let exteriorOpen=false,exteriorState=exteriorMotion?.at(0),lastExteriorPaint=0;
  const exteriorSolids=exteriorMotion&&exterior?exteriorMotion.obstacles(exterior):[];
  let marketState=null,marketAsset='BTCUSDT',marketOpen=false,lastScreenAt=0;
  const quoteHistory=new Map(market.symbols.map(s=>[s,[]]));
  const wallAssets={data:'BTCUSDT',technical:'BTCUSDT',macro:'ETHUSDT',execution:'SOLUSDT'};
  try{ambient=localStorage.getItem('atlas-office-ambient-v1')!=='off';}catch{}
  const walkers=new Map(), colors=['#68e4d4','#a98af4','#e2bd73','#ef7e9c','#81b8fb','#c9dd73','#eea56e','#e3e7ee'];
  const rooms=world.rooms;
  const language=()=>document.documentElement.lang==='en'?'en':'es';
  const t=(es,en)=>language()==='en'?en:es;
  const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=(x,d=3)=>x==null?'—':Number(x).toLocaleString(language()==='en'?'en-US':'es-ES',{maximumFractionDigits:d});
  const time=x=>x?new Date(x).toLocaleTimeString(language()==='en'?'en-GB':'es-ES'):'—';
  const point=world.point;
  const polygon=(pts,fill,stroke='#5b798455')=>`<polygon points="${pts.map(p=>point(...p).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
  const tile=(x,y,w,h,z,fill)=>polygon([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],fill);
  const box=(x,y,w,h,z,fill,side='#192d3a',base=0)=>tile(x,y,w,h,z,fill)+polygon([[x+w,y,z],[x+w,y+h,z],[x+w,y+h,base],[x+w,y,base]],side)+polygon([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,base],[x,y+h,base]],side);
  const label=(x,y,text,fill='#a8c8d1',size=10)=>{const p=point(x,y);return `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-family="monospace" font-size="${size}" fill="${fill}">${escape(text)}</text>`;};
  function plant(x,y){const p=point(x+.125,y+.125,29);return `<g class="ao-plant">${box(x,y,.25,.25,14,'#9e8b77','#5a4b43')}<path d="M${p[0]} ${p[1]+9} v-18" stroke="#5f9773" stroke-width="3"/><g fill="#66a67d" stroke="#376453" stroke-width="1"><ellipse cx="${p[0]-6}" cy="${p[1]-2}" rx="8" ry="4" transform="rotate(28 ${p[0]-6} ${p[1]-2})"/><ellipse cx="${p[0]+6}" cy="${p[1]-9}" rx="8" ry="4" transform="rotate(-30 ${p[0]+6} ${p[1]-9})"/><ellipse cx="${p[0]-3}" cy="${p[1]-15}" rx="5" ry="7"/></g></g>`;}
  function desk(f,color){
    const {x,y,w,h,z}=f;
    const design=roomDesign.plan(f.room,w,h,z),material=design.spec;
    return `<g class="ao-workstation">${tile(x-.04,y-.03,w+.08,h+.06,10.5,'#09152177')}
      ${box(x+.12,y+.1,.09,.09,z-1,'#526477')+box(x+w-.21,y+.1,.09,.09,z-1,'#526477')+box(x+.12,y+h-.2,.09,.09,z-1,'#526477')+box(x+w-.21,y+h-.2,.09,.09,z-1,'#526477')+box(x,y,w,h,z,material.surface,material.side,z-2)}
      ${tile(x+.1,y+.1,w-.2,h-.17,z+1,material.mat)}
      ${design.monitors.map(m=>box(x+m.x+m.w/2-.055,y+.17,.11,.22,z+8,'#6c8597','#314858',z+1)).join('')}
      ${roomDesign.drawScreens(f,color,point)}
      ${design.props.map(p=>p.kind==='computer'?box(x+p.x,y+p.y,p.w,p.h,z+p.top,'#243547','#182534',z+1):tile(x+p.x,y+p.y,p.w,p.h,z+p.top,p.kind==='notebook'?'#d5c9a8':p.kind==='mouse'?'#d3dce1':'#91a6b7')).join('')}
      </g>`;
  }
  function furnishings(){return world.furniture.map(f=>{
    const {x,y,w,h,z}=f,color=life.sectors.find(s=>s.id===f.room).color;let content='';
    if(f.kind==='desk')content=desk(f,color);
    if(f.kind==='chair'){const design=roomDesign.chairPlan(f.room,w,h,z);content=`<g class="ao-upholstered-chair" data-chair-style="${design.theme}">${design.parts.map(p=>box(x+p.x,y+p.y,p.w,p.h,p.top,p.fill,p.side,p.base)).join('')}</g>`;}
    if(f.kind==='plant')content=plant(x,y);
    if(f.kind==='cabinet'){content=box(x,y,w,h,z,'#758b9a','#314857');for(let k=0;k<3;k++)content+=tile(x+.1,y+.03,w-.2,h-.06,14+k*6,'#c7bba0');}
    if(f.kind==='server'){const p=point(x+w/2,y+h/2,23);content=box(x,y,w,h,z,'#456277','#182737')+`<g class="ao-server-led"><circle cx="${p[0]}" cy="${p[1]}" r="1.5" fill="#69e6bc"/><circle cx="${p[0]+4}" cy="${p[1]+2}" r="1.3" fill="#74b6ff"/></g>`;}
    if(f.kind==='coffee'){const p=point(x+w/2,y+h/2,37);content=box(x,y,w,h,z,'#a7b1b5')+box(x+.13,y+.04,.27,.15,36,'#283e4e','#192d3a',24)+`<path class="ao-coffee-steam" d="M${p[0]} ${p[1]} q-4 -6 0 -12" fill="none" stroke="#d1e7ed"/>`;}
    if(['table','meeting-table'].includes(f.kind)){
      content=box(x+.15,y+.12,.1,.1,z-2,'#70839a')+box(x+w-.25,y+h-.24,.1,.1,z-2,'#70839a')+box(x,y,w,h,z,'#b4a68d','#5d5e65',z-3);
      if(f.kind==='meeting-table')for(let i=0;i<3;i++)content+=tile(x+.35+i*.9,y+.25,.4,.4,z+1,'#243849')+tile(x+.4+i*.9,y+.32,.28,.17,z+2,'#91c5cc');
      else{const p=point(x+w/2,y+h/2,z+4);content+=`<ellipse cx="${p[0]}" cy="${p[1]}" rx="5" ry="2.5" fill="#dce6df"/><rect x="${p[0]-3}" y="${p[1]-6}" width="6" height="5" rx="1" fill="#e9c18b"/>`;}
    }
    if(f.kind==='stool')content=box(x+.2,y+.15,.12,.12,z-2,'#3c5267')+box(x,y,w,h,z,'#889eab','#4a6173',z-3);
    if(f.kind==='sofa')content=box(x,y,w,h,12,'#655480','#3d3452')+box(x+.12,y+.12,w-.24,h-.24,z,'#a495bb','#766489',12)+box(x,y,w,.13,z+17,'#89739f','#5c4b75',12)+box(x,y,.16,h,z+12,'#89739f','#5c4b75',12)+box(x+w-.16,y,.16,h,z+12,'#89739f','#5c4b75',12);
    if(f.kind==='counter'){
      content=box(x,y,w,h,z,'#a4b3ae','#3d5956')+box(x+.1,y+.08,.6,.45,z+20,'#283e4e','#192b3a',z)+tile(x+1.2,y+.1,.75,.4,z+1,'#cfe0e0');
      const p=point(x+.4,y+.25,z+22);content+=`<path class="ao-coffee-steam" d="M${p[0]} ${p[1]} q-5 -8 0 -16" fill="none" stroke="#cfefec" stroke-width="1.8"/>`;
      content+=box(x+w-.55,y,.55,h,z+22,'#85969e','#435e6b');
    }
    if(f.kind==='bookshelf'||f.kind==='locker'){
      content=box(x,y,w,h,z,'#667b89','#263b4b');
      for(let i=0;i<4;i++)content+=tile(x+.03,y+.08+i*h/4,w-.06,h/5,z+1,['#c79b6c','#81b6c5','#aaa0cf','#88c5aa'][i]);
    }
    if(f.kind==='sink'){
      content=box(x,y,w,h,z,'#bad5d7','#608491');
      for(let i=0;i<2;i++){content+=tile(x+.17+i*.85,y+.14,.54,.31,z+1,'#294756');const p=point(x+.45+i*.85,y+.08,z+8);content+=`<path d="M${p[0]} ${p[1]+8} v-8 l6 3" fill="none" stroke="#e7eff1" stroke-width="2"/>`;}
      content+=polygon([[x,y,z+8],[x+w,y,z+8],[x+w,y,z+25],[x,y,z+25]],'#90c6db44','#bfdfe9');
    }
    if(f.kind==='stall'){
      content=tile(x,y,w,h,11,'#9ab5bd')+box(x+.55,y+.45,.6,.9,24,'#f1f4ed','#a6bbc1')+box(x+.6,y+.15,.5,.28,39,'#f3f5ef','#acbec4');
      content+=box(x,y,.09,h,z,'#adc3ce','#678493')+box(x+w-.09,y,.09,h,z,'#adc3ce','#678493');
      content+=polygon([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,12],[x,y+h,12]],'#547783ee','#a7c9d4');
      const p=point(x+w/2,y+h,z-16);content+=`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#f1c786"/><path d="M${p[0]-5} ${p[1]+7} h10" stroke="#d9e5eb"/>`;
    }
    if(f.kind==='whiteboard'){
      content=polygon([[x,y,22],[x+w,y,22],[x+w,y,z+22],[x,y,z+22]],'#d2e2df','#91bdc3');
      for(let i=0;i<3;i++)content+=polygon([[x+.35+i*1.45,y-.01,33],[x+1.35+i*1.45,y-.01,33],[x+1.35+i*1.45,y-.01,53],[x+.35+i*1.45,y-.01,53]],['#739f98','#8e93b5','#c2a772'][i]);
    }
    return `<g class="ao-furniture" data-furniture="${f.id}" data-kind="${f.kind}" data-top="${world.renderTop(f)}" data-depth="${f.depth}" data-x="${x}" data-y="${y}" data-width="${w}" data-height="${h}" data-solid="${f.solid}" aria-hidden="true">${content}</g>`;
  }).join('');}
  function wallScreen(r,symbol){
    const p=point(r.x+.025,r.y+5.65,73);
    // Left-wall market screen; the room plaque is on the other wall.
    return `<g class="ao-live-screen" data-wall-symbol="${symbol}" role="img" aria-label="${t('Pantalla decorativa','Decorative screen')}" transform="matrix(.72 -.36 0 .65 ${p[0]} ${p[1]})"><rect x="-3" y="-3" width="132" height="70" rx="3" fill="#2d4356" stroke="#88a6b9"/><rect width="126" height="64" rx="2" fill="#081521"/><text class="ao-wall-title" x="6" y="12">${symbol.replace('USDT',' / USDT')}</text><text class="ao-wall-price" x="6" y="25">—</text><path class="ao-wall-trace" fill="none" stroke="#76ddcd" stroke-width="1.1"/><circle class="ao-wall-dot" r="1.5" fill="#76ddcd" visibility="hidden"/><text class="ao-wall-status" x="6" y="61">${t('SIN FUENTE','NO SOURCE')}</text></g>`;
  }
  function roomSign(r){const s=life.sectors.find(s=>s.id===r.id),p=signage.plan(r,point);return `<g class="ao-room-sign" data-sign-room="${r.id}" data-sign-wall="${p.wall}" role="button" tabindex="0" aria-label="${escape(s.number+' · '+r[language()]+' · '+s.detail[language()])}" transform="matrix(${p.matrix.join(' ')})" style="--sector:${s.color}"><rect class="ao-sign-card" width="${p.width}" height="${p.height}" rx="3"/><rect width="3" height="${p.height}" rx="1" fill="${s.color}"/><text x="8" y="15.5" fill="${s.color}" font-size="12" font-weight="700">${s.number}</text><text x="29" y="15.5" fill="#f1f7fb" font-family="Arial,sans-serif" font-size="14" font-weight="700">${escape(signage.name(s,language()))}</text></g>`;}
  function architecture(){return rooms.map(r=>{
    const sector=life.sectors.find(s=>s.id===r.id);
    let back=polygon([[r.x,r.y,10],[r.x+r.w,r.y,10],[r.x+r.w,r.y,78],[r.x,r.y,78]],'url(#ao-wall-material)','#97b0b8');
    for(let x=r.x+1;x<r.x+r.w;x+=1.5){const a=point(x,r.y+.01,12),b=point(x,r.y+.01,36);back+=`<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#cadce033"/>`;}
    back+=`<g class="ao-room-light">${polygon([[r.x,r.y,39],[r.x+r.w,r.y,39],[r.x+r.w,r.y+.08,39],[r.x,r.y+.08,39]],sector.color)}</g>`;
    if(!r.facility)back+=box(r.x+1.15,r.y+.12,1.15,.16,33,'#192f43','#142637',30);
    back+=`<g class="ao-wall-display">${tile(r.x+1.2,r.y+.12,.25,.08,34,sector.color)+tile(r.x+1.55,r.y+.12,.2,.08,34,'#86a7bb')+tile(r.x+1.85,r.y+.12,.35,.08,34,sector.color)}</g>`;
    let left=polygon([[r.x,r.y,10],[r.x,r.y+r.h,10],[r.x,r.y+r.h,78],[r.x,r.y,78]],'#394f62','#688799');
    // No unconditional glass/reflection overlay: residual panels were drawn in
    // every room, even amenities. Structural walls and collision map stay intact.
    left+=polygon([[r.x+.12,r.y+.12,18],[r.x+.12,r.y+r.h-.2,18],[r.x+.12,r.y+r.h-.2,19],[r.x+.12,r.y+.12,19]],sector.color+'66');
    if(wallAssets[r.id])left+=wallScreen(r,wallAssets[r.id]);
    if(signage.plan(r,point).wall==='back')back+=roomSign(r);else left+=roomSign(r);
    return `<g class="ao-wall" data-wall="${r.id}-back" data-x="${r.x}" data-y="${r.y}" data-width="${r.w}" data-height="0.02">${back}</g><g class="ao-wall" data-wall="${r.id}-left" data-x="${r.x}" data-y="${r.y}" data-width="0.02" data-height="${r.h}">${left}</g>`;
  }).join('');}
  function scene(){
    let out='<defs><filter id="ao-shadow"><feGaussianBlur stdDeviation="12"/></filter><linearGradient id="ao-screen"><stop stop-color="#69e7dd"/><stop offset="1" stop-color="#617adc"/></linearGradient><linearGradient id="ao-wall-material" x2="0" y2="1"><stop stop-color="#728594"/><stop offset="1" stop-color="#344a5e"/></linearGradient><radialGradient id="ao-lamp-pool"><stop stop-color="#bfe9ff" stop-opacity=".14"/><stop offset="1" stop-color="#bfe9ff" stop-opacity="0"/></radialGradient></defs>';
    if(parking)out+=parking.floor(language());
    // No global shadow ellipse: it obscured the attached parking surface.
    out+=box(0,0,world.width,world.height,8,'#203447','#0a1725');
    out+=polygon([[0,world.height,7],[world.width,world.height,7],[world.width,world.height,5],[0,world.height,5]],'#50c9c377');
    for(let x=0;x<world.width;x++)for(let y=0;y<world.height;y++)out+=tile(x,y,1,1,9,(x+y)%2?'#253948':'#283d4c');
    for(const r of rooms){
      out+=`<g class="ao-room" data-room="${r.id}" role="button" tabindex="0" aria-label="${escape(r[language()])}"><title>${escape(r[language()])}</title>`;
      out+=tile(r.x,r.y,r.w,r.h,10,r.c);
      if(r.facility)for(let x=r.x;x<r.x+r.w;x++)for(let y=r.y;y<r.y+r.h;y++)out+=tile(x+.04,y+.04,.92,.92,10.1,r.id==='bathrooms'?((x+y)%2?'#72939c':'#9bb5be'):((x+y)%2?r.c:'#566172'));
      out+=tile(r.x+.15,r.y+.15,r.w-.3,r.h-.3,10.3,r.id==='direction'||r.id==='committee'?'#90775725':'#14223222');
      const sector=life.sectors.find(s=>s.id===r.id);
      // Floors stay below every wall, piece of furniture and person.
      const light=point(r.x+3,r.y+3,11);
      out+=`<ellipse class="ao-light-pool" cx="${light[0]}" cy="${light[1]}" rx="130" ry="57" fill="url(#ao-lamp-pool)" pointer-events="none"/>`;
      out+=tile(r.x+.15,r.y+.15,.5,.5,11,sector.color+'88');
      // Front rail with a real opening matching the walk graph's door.
      out+=box(r.x,r.y+r.h-.08,r.doorStart-.05,.08,9,'#567a89');
      out+=box(r.x+r.doorStart+r.doorWidth+.05,r.y+r.h-.08,r.w-r.doorStart-r.doorWidth-.05,.08,9,'#567a89');
      out+=tile(r.x+r.doorStart,r.y+r.h-.15,r.doorWidth,.3,11,'#58c8b355');
      const door=point(r.x+r.doorStart+r.doorWidth/2,r.y+r.h,12);
      out+=`<g class="ao-door" data-door-room="${r.id}" data-door-width="${r.doorWidth}" transform="translate(${door[0]} ${door[1]})" aria-hidden="true"><path d="M${-11*r.doorWidth} ${-5.5*r.doorWidth} L${11*r.doorWidth} ${5.5*r.doorWidth}" stroke="#d3e5e999" stroke-width="2"/><circle class="ao-door-led" cx="0" cy="0" r="2.5" fill="#72a9b7"/></g>`;
      out+='</g>';
    }
    const aisleRows=[...new Set(rooms.map(r=>r.y+r.h+world.corridorWidth/2))].sort((a,b)=>a-b);
    const rowTitles=[['GOBIERNO / CONTROLES','GOVERNANCE / CONTROLS'],['FRONT OFFICE / INVESTIGACIÓN','FRONT OFFICE / RESEARCH'],['MIDDLE / BACK OFFICE','MIDDLE / BACK OFFICE'],['ALA DE SERVICIOS / ESPACIOS COMPARTIDOS','AMENITIES WING / SHARED SPACES'],['ATLAS · SIMULACIÓN · SIN ÓRDENES','ATLAS · SIMULATION · NO ORDERS']];
    for(const [i,y] of aisleRows.entries()){
      out+=label(world.width/2,y,t(...rowTitles[i]),'#afc2c9',12);
      out+=tile(.4,y-.3,.3,.5,12,'#e6c677')+tile(world.width-1.3,y-.3,.3,.5,12,'#e6c677');
    }
    // Wayfinding inset into existing corridors, not new walls or obstacles.
    const aisleColumns=[...new Set(rooms.map(r=>r.x+r.w+world.corridorWidth/2))].sort((a,b)=>a-b).slice(0,-1);
    for(const y of aisleRows.slice(0,-1))for(const x of aisleColumns){const p=point(x,y,12);out+=`<g class="ao-aisle-marker" fill="none" stroke="#69c7d399" stroke-width="1.6"><path d="M${p[0]-9} ${p[1]} l7 -4 7 4 m-7 -4 v11"/></g>`;}
    return out;
  }
  function sprite(a,i){
    const skin=['#c9906c','#b57f62','#edbc95','#ab7860','#e0ac82','#d2a27d','#b58666','#ecc69d'][i%8];
    const look=life.appearance(i),sector=life.sectors.find(s=>s.id===a.room),outfit=a.specialist?.color||(a.lead?sector.color:[sector.color,'#7896ad','#647287','#b1aa9b'][i%4]);
    const hair=[`<path d="M-8 -35 V-40 Q0 -47 8 -40 V-35 L4 -38 L-4 -38Z"/>`,`<path d="M-9 -28 V-40 Q0 -49 9 -40 V-28 L6 -27 V-37 L-6 -38 V-27Z"/>`,`<path d="M-8 -35 V-41 Q1 -48 8 -39 V-35 L4 -40 L-8 -37Z"/>`,`<path d="M-8 -36 V-40 Q0 -46 8 -40 V-36 L4 -38 L-4 -38Z"/><circle cy="-44" r="4"/>`,`<path d="M-9 -35 Q-13 -40 -7 -43 Q-2 -49 3 -44 Q11 -44 10 -36 L6 -37 Q0 -42 -6 -37Z"/>`][look.style];
    const status=a.kind==='specialist'?t('analista IA local con modelo propio en sombra','local AI analyst with own shadow model'):a.kind==='task'?t('control por reglas con cola real','rule-based check with real queue'):a.kind==='worker'?t('especialista conectado','connected specialist'):a.kind==='unavailable'?t('especialista sin registro disponible','specialist ledger unavailable'):t('puesto visual','visual role');
    return `<g class="ao-agent ${['worker','task','specialist'].includes(a.kind)?'ao-connected':'ao-visual'} ${a.kind==='task'?'ao-task-agent':''} ${a.kind==='specialist'?'ao-neural-agent':''}" data-agent="${a.id}" style="--life-delay:${look.delay}s;--walk-cycle:${.34/look.pace}s;--sector:${a.specialist?.color||sector.color}" role="button" tabindex="0" aria-label="${escape(a.name+' · '+a.role[language()]+' · '+status)}"><title>${escape(a.name+' · '+a.role[language()])}</title>
      <ellipse class="ao-foot-shadow" cx="3" cy="3" rx="13" ry="5" fill="#06102077"/>
      <ellipse class="ao-ring" cx="0" cy="1" rx="14" ry="7"/>
      <g class="ao-facing"><g class="ao-posture"><g class="ao-person">
      <rect class="ao-leg-left" x="-7" y="-11" width="5" height="12" rx="1" fill="#102333"/>
      <rect class="ao-leg-right" x="2" y="-11" width="5" height="12" rx="1" fill="#102333"/>
      <rect x="-10" y="-27" width="20" height="19" rx="3" fill="${outfit}"/>
      <path d="M-8 -25 l5 3 -1 12 M8 -25 l-5 3 1 12" fill="none" stroke="#15273c66" stroke-width="1"/>
      <rect class="ao-arm-left" x="-12" y="-25" width="4" height="15" rx="2" fill="${skin}"/>
      <rect class="ao-arm-right" x="8" y="-25" width="4" height="15" rx="2" fill="${skin}"/>
      <g class="ao-head-motion">
      <rect x="-7" y="-40" width="14" height="15" rx="4" fill="${skin}"/>
      <g fill="${look.hair}">${hair}</g>
      <g class="ao-eyes"><rect x="-5" y="-34" width="3" height="2" fill="#1a2633"/><rect x="3" y="-34" width="3" height="2" fill="#1a2633"/></g>
      ${look.glasses?'<path d="M-7 -35 h6 v4 h-6z M1 -35 h6 v4 H1z M-1 -33 h2" fill="none" stroke="#334c65" stroke-width="1.2"/>':''}
      ${look.beard?`<path d="M-5 -29 Q0 -24 5 -29" fill="none" stroke="${look.hair}" stroke-width="3"/>`:''}
      ${['execution','technology'].includes(a.room)?'<path d="M-8 -31 V-38 Q0 -45 8 -38 v8 l-4 2" fill="none" stroke="#a2d1df" stroke-width="1.5"/>':''}
      <path class="ao-mouth" d="M-2 -29 Q0 -27 2 -29" fill="none" stroke="#715343" stroke-width="1"/></g>
      <rect x="-3" y="-26" width="6" height="13" fill="#e2f0ed"/><rect x="1" y="-21" width="5" height="2" fill="#142d3f"/>
      <rect x="4" y="-19" width="4" height="5" rx=".5" fill="#dde8e5"/><rect x="5" y="-18" width="2" height="1" fill="${sector.color}"/>
      <g class="ao-hand-prop"><rect class="ao-notebook" x="7" y="-20" width="7" height="10" rx="1" fill="#dcba79"/><path d="M9 -18 v6" stroke="#876c48" stroke-width="1"/></g>
      <g class="ao-cup"><rect x="8" y="-17" width="7" height="6" rx="1" fill="#f0ce97"/><path d="M15 -16 q5 2 0 4" fill="none" stroke="#f0ce97" stroke-width="2"/></g></g></g></g>
      <g class="ao-avatar-tag"><rect x="-51" y="7" width="102" height="30" rx="4" fill="#0c1e32eb" stroke="#587b9655"/><text y="20" text-anchor="middle" fill="#e5f7fc" font-size="11" font-family="monospace">${escape(a.name)}</text><text class="ao-pose-label" y="32" text-anchor="middle" fill="#abbecd" font-size="7.5">${escape(life.poses.idle[language()])}</text></g>
      <g class="ao-talk" style="display:none"><rect class="ao-bubble" x="-28" y="-66" width="56" height="21" rx="3"/><text class="ao-speech" x="0" y="-52" text-anchor="middle">···</text></g>
    </g>`;
  }
  function mount(){
    exteriorOpen=panel.querySelector('.ao-exterior')?.open??exteriorOpen;
    const previousPan=panController?.snapshot();panController?.destroy();panController=null;
    panel.classList.add('ao-refined-office');
    packets.forEach(p=>p.node.remove());packets=[];
    dialogues.forEach(d=>d.node.remove());dialogues=[];
    let shortcut=document.getElementById('ao-office-shortcut');
    if(!shortcut){shortcut=document.createElement('a');shortcut.id='ao-office-shortcut';shortcut.href='#atlas-agent-office';shortcut.className='floor-bridge-link';document.querySelector('.controls')?.append(shortcut);}
    shortcut.textContent=t('OFICINA 2.5D ↘','2.5D OFFICE ↘');
    const oldDetails=panel.querySelector('.ao-learning details')?.open;
    aiQuestion=panel.querySelector('#ao-ai-question')?.value??aiQuestion;
    panel.innerHTML=`<div class="ao-head"><div><span class="ao-kicker">ATLAS // INSTITUTIONAL OPERATIONS FLOOR</span><h2>${t('OFICINA DEL FONDO // 64 PUESTOS','FUND OFFICE // 64 ROLES')}</h2><p>${t('16 departamentos + 4 espacios compartidos · dirección, inversión, controles y vida de oficina. Estructura organizativa representada, no 64 IAs autónomas.','16 departments + 4 shared spaces · leadership, investment, controls and office life. Represented organisation, not 64 autonomous AIs.')}</p></div><div><div class="ao-controls"><button data-action="pause">${paused?t('Animar','Animate'):t('Pausar movimiento','Pause motion')}</button><button data-action="zoom" aria-label="${t('Cambiar zoom de la oficina','Change office zoom')}">ZOOM ${zoom===1?'1×':zoom+'×'}</button><button data-action="speed">${t('TRÁFICO','TRAFFIC')} ${speed}×</button><button data-action="organisation" aria-expanded="${organisationOpen}">${t('CADENA DE MANDO','CHAIN OF COMMAND')}</button></div><p class="ao-status" role="status"></p></div></div>
    <div class="ao-office-stats"></div><div class="ao-departments" aria-label="${t('Filtrar departamentos','Filter departments')}"><button class="ao-overview" data-department="all" aria-pressed="${department==='all'}">${t('VISTA GENERAL · 20 ZONAS','OVERVIEW · 20 ZONES')}</button>${life.sectors.map(s=>`<button data-department="${s.id}" aria-pressed="${department===s.id}" style="--sector:${s.color}" title="${escape(rooms.find(r=>r.id===s.id)[language()])}"><span>${s.number} ${s.icon}</span><strong>${escape(s.name[language()])}</strong><small>${escape(s.detail[language()])}</small></button>`).join('')}</div><div class="ao-room-guide" aria-live="polite"></div>
    <div class="ao-organisation" ${organisationOpen?'':'hidden'}></div>
    <div class="ao-layout"><div class="ao-stage" tabindex="0" aria-label="${t('Plano ampliable; usa las barras de desplazamiento al hacer zoom','Zoomable floor; use scroll bars when zoomed')}"><svg viewBox="${world.viewBox.join(' ')}" aria-label="${t('Fondo isométrico con 16 departamentos, 4 espacios compartidos y 64 personas; selecciona una persona o sala','Isometric fund with 16 departments, 4 shared spaces and 64 people; select a person or room')}"><g class="ao-world"><g class="ao-building">${scene()}</g><g class="ao-data-flow" aria-hidden="true"></g><g class="ao-people"></g></g></svg></div><div class="ao-map-legend"><span>${t('PERSONAJES VISUALES · AMBIENTE GUIONIZADO','VISUAL CHARACTERS · SCRIPTED AMBIENCE')}</span></div><p class="ao-scene-caption">${t('Desplazamientos y reuniones son escenificación. Los paquetes repiten visualmente mensajes recientes con su ID y fecha original; no son comunicaciones nuevas ni nuevas consultas a IA. El canal inferior muestra el registro real. Más personas no significa más aprendizaje.','Travel and meetings are staging. Packets visually replay recent messages with their original ID and date; they are not new communications or new AI queries. The channel below shows the actual ledger. More people does not mean more learning.')}</p><div class="ao-selected" aria-live="polite"></div></div><div class="ao-roster" aria-label="${t('Seleccionar especialista o puesto','Select specialist or role')}"></div><div class="ao-ledger-ticker" aria-label="${t('Últimos mensajes registrados','Latest recorded messages')}"></div>
    `;
    const worldGroup=panel.querySelector('.ao-world');
    if(exterior&&!parking){
      const exteriorDetails=document.createElement('details');exteriorDetails.className='ao-exterior';exteriorDetails.id='ao-campus-parking';exteriorDetails.open=exteriorOpen;
      const animated=!!(exteriorMotion&&exteriorAnimated);
      exteriorDetails.innerHTML=`<summary>${t('EXTERIOR // PARKING DEL CAMPUS','EXTERIOR // CAMPUS PARKING')} <small>${t('6 plazas · escena guionizada','6 bays · scripted scene')}</small></summary><div class="ao-exterior-stage" tabindex="0" aria-label="${t('Exterior isométrico; desplaza horizontalmente en pantallas pequeñas','Isometric exterior; scroll horizontally on small screens')}"><svg viewBox="${exterior.viewBox.join(' ')}" role="img" aria-label="${t('Parking con vehículos originales estilizados y llegada guionizada a la plaza eléctrica','Parking with original stylised vehicles and a scripted arrival at the electric bay')}">${exterior.scene(language(),{omitCars:animated})}<g class="ao-exterior-motion-layer">${animated?exteriorAnimated.frame(exteriorState,language()):''}</g></svg></div><p class="ao-exterior-status" role="status"></p><p>${t('Escenografía original, no marcas asociadas ni beneficios del fondo. Una llegada de 44 s al abrir: giro, aparcamiento y visitante hasta la entrada; no añade agentes ni mensajes. La pausa de la oficina también la detiene. Cerrar conserva el punto; cambiar idioma no reinicia. No representa tráfico real.','Original scenery, not associated brands or fund profits. One 44-second arrival on opening: turn, parking and visitor to the entrance; adds no agents or messages. Office pause stops this too. Closing preserves progress; language changes do not restart. Not real traffic.')}</p>`;
      exteriorDetails.ontoggle=()=>{exteriorOpen=exteriorDetails.open;renderExterior();};panel.querySelector('.ao-layout').after(exteriorDetails);renderExterior();
      const parkingButton=document.createElement('button');parkingButton.dataset.action='parking';parkingButton.setAttribute('aria-controls','ao-campus-parking');parkingButton.textContent=t('VER PARKING ↘','VIEW PARKING ↘');
      parkingButton.onclick=()=>{exteriorOpen=true;exteriorDetails.open=true;renderExterior();requestAnimationFrame(()=>{const current=panel.querySelector('.ao-exterior');if(current?.open)current.scrollIntoView({behavior:'auto',block:'start'});});};panel.querySelector('.ao-controls').append(parkingButton);
    }
    if(parking){
      const parkingButton=document.createElement('button');parkingButton.dataset.action='parking';parkingButton.textContent=t('VER PARKING ↘','VIEW PARKING ↘');parkingButton.onclick=()=>inspectParking();panel.querySelector('.ao-controls').append(parkingButton);
      const note=document.createElement('span');note.className='ao-parking-key';note.textContent=t('Parking en una franja lateral · ocho coches alineados a lo largo de la oficina, sin insignias ni animación de ruedas. Escenografía, no propiedad ni beneficios del fondo. Conexión de personajes aún pendiente.','Parking in a side strip · eight cars lined along the office, no badges or wheel animation. Scenery, not fund ownership or profits. Character connection still pending.');panel.querySelector('.ao-map-legend').append(note);
    }
    const inspectorClose=document.createElement('button');inspectorClose.className='ao-inspector-close';
    inspectorClose.textContent=t('Cerrar ficha ×','Close profile ×');
    inspectorClose.onclick=()=>{panel.classList.remove('ao-inspector-open');panel.querySelector('.ao-stage')?.focus({preventScroll:true});};
    panel.querySelector('.ao-layout').append(inspectorClose);
    const cameraControls=document.createElement('div');cameraControls.className='ao-camera-controls';
    cameraControls.innerHTML=`<span class="ao-camera-label"></span><div><button data-action="detail" aria-pressed="${focused}">${t('ACERCAR SALA','ROOM CLOSE-UP')}</button><button data-action="overview">${t('PLANO COMPLETO','FULL FLOOR')}</button></div>`;
    panel.querySelector('.ao-stage').before(cameraControls);
    cameraControls.querySelector('[data-action=detail]').onclick=()=>{focused=!focused;updateCamera();};
    cameraControls.querySelector('[data-action=overview]').onclick=()=>{focused=false;zoom=1;filterDepartment('all');applyZoom(true);updateCamera();};
    const directory=document.createElement('details');directory.className='ao-directory';directory.open=directoryOpen;
    const directorySummary=document.createElement('summary');directorySummary.textContent=t('DIRECTORIO · 16 DEPARTAMENTOS + 4 ESPACIOS','DIRECTORY · 16 DEPARTMENTS + 4 SHARED SPACES');directory.append(directorySummary);
    const directoryGrid=panel.querySelector('.ao-departments');directoryGrid.before(directory);directory.append(directoryGrid);directory.ontoggle=()=>{directoryOpen=directory.open;};
    worldGroup.insertAdjacentHTML('beforeend',`<g class="ao-dialogue-layer" font-family="monospace"></g>`);
    const signPreview=document.createElement('div');signPreview.className='ao-sign-preview';signPreview.id='ao-sign-preview';signPreview.setAttribute('role','tooltip');
    panel.querySelector('.ao-stage').before(signPreview);clearSignPreview();
    const ambientButton=document.createElement('button');ambientButton.dataset.action='ambient';ambientButton.setAttribute('aria-pressed',String(ambient));ambientButton.textContent=t('DIÁLOGOS AMBIENTALES','AMBIENT DIALOGUE')+' '+(ambient?'ON':'OFF');panel.querySelector('.ao-controls').append(ambientButton);
    ambientButton.onclick=()=>{ambient=!ambient;try{localStorage.setItem('atlas-office-ambient-v1',ambient?'on':'off');}catch{}ambientButton.setAttribute('aria-pressed',String(ambient));ambientButton.textContent=t('DIÁLOGOS AMBIENTALES','AMBIENT DIALOGUE')+' '+(ambient?'ON':'OFF');if(!ambient){dialogues.filter(d=>d.source==='ambient').forEach(d=>d.node.remove());dialogues=dialogues.filter(d=>d.source!=='ambient');}else nextAmbient=Date.now()+1000;};
    const ambientKey=document.createElement('span');ambientKey.className='ao-ambient-key';ambientKey.textContent=t('BOCADILLO ÁMBAR: AMBIENTE GUIONIZADO · NO IA','AMBER SPEECH: SCRIPTED AMBIENCE · NOT AI');panel.querySelector('.ao-map-legend').append(ambientKey);
    const motionStatus=document.createElement('p');motionStatus.className='ao-motion-status';motionStatus.setAttribute('role','status');panel.querySelector('.ao-status').after(motionStatus);
    panel.querySelector('[data-action=pause]').onclick=()=>{paused=!paused;motionChoice=paused?'off':'on';syncMotion();};
    panel.querySelector('[data-action=zoom]').onclick=()=>{zoom=zoom===1?1.5:zoom===1.5?2:1;applyZoom();};
    panel.querySelector('[data-action=speed]').onclick=()=>{speed=speed===1?2:1;panel.querySelector('[data-action=speed]').textContent=t('TRÁFICO','TRAFFIC')+' '+speed+'×';};
    panel.querySelector('[data-action=organisation]').onclick=()=>{organisationOpen=!organisationOpen;panel.querySelector('.ao-organisation').hidden=!organisationOpen;panel.querySelector('[data-action=organisation]').setAttribute('aria-expanded',String(organisationOpen));};
    panel.querySelectorAll('[data-department]').forEach(b=>b.onclick=()=>{filterDepartment(b.dataset.department);if(focused)updateCamera();});
    panel.querySelectorAll('[data-room]').forEach(n=>{const choose=()=>{const id=n.dataset.room;filterDepartment(id);select(rooms.find(r=>r.id===id).lead);if(focused)updateCamera();};n.onclick=choose;n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};});
    const amenities=document.createElement('div');amenities.className='ao-amenities';
    amenities.innerHTML=`<div><strong>${t('VIDA DE OFICINA','OFFICE LIFE')}</strong><small>${t('Ocupación visual · no actividad de IA','Visual occupancy · not AI activity')}</small></div>${world.facilities.map(r=>{const s=life.sectors.find(s=>s.id===r.id);return `<button data-amenity="${r.id}" style="--sector:${s.color}"><span>${escape(s.icon+' '+s.name[language()])}</span><b data-occupants="${r.id}">—</b><small>${t('personas · acercar','people · close-up')}</small></button>`;}).join('')}`;
    panel.querySelector('.ao-room-guide').after(amenities);
    amenities.querySelectorAll('[data-amenity]').forEach(b=>b.onclick=()=>{focused=true;filterDepartment(b.dataset.amenity);updateCamera();});

    const retainParkingFocus=parkingFocus;applyZoom(); render();updateCamera();if(retainParkingFocus&&parking)inspectParking(false);renderScreens();syncMotion();
    panController=stagePan.attach(panel.querySelector('.ao-stage'),root,{ratio:previousPan?.ratio??.5,top:previousPan?.top||0});

    
    document.dispatchEvent(new Event('atlas:office-mounted'));
  }
  function inspectParking(reveal=true){
    if(!parking)return;parkingFocus=true;focused=false;cameraRoom=null;cameraTarget=parking.parkingCamera.slice();
    panel.querySelector('.ao-camera-label').textContent=t('PARKING LATERAL // MISMO PLANO','SIDE PARKING // SAME FLOOR');
    panel.classList.remove('ao-focused');panel.querySelector('[data-action=detail]').setAttribute('aria-pressed','false');
    const stage=panel.querySelector('.ao-stage');
    if(paused||motionPreference.matches){camera=cameraTarget.slice();stage.querySelector('svg').setAttribute('viewBox',camera.join(' '));}
    if(reveal){stage.scrollIntoView({block:'center',behavior:'auto'});stage.focus({preventScroll:true});}
  }
  function renderExterior(){
    const details=panel.querySelector('.ao-exterior');if(!details)return;
    const status=details.querySelector('.ao-exterior-status');
    if(!exteriorMotion||!exteriorAnimated){status.textContent=t('Animación exterior no disponible · vista estática.','Exterior animation unavailable · static view.');return;}
    const layer=details.querySelector('.ao-exterior-motion-layer');layer.innerHTML=exteriorAnimated.frame(exteriorState,language());
    layer.dataset.scenicTime=exteriorState.time.toFixed(3);layer.dataset.scenicPhase=exteriorState.phase;
    layer.dataset.carCx=String(exteriorState.car.cx);layer.dataset.carCy=String(exteriorState.car.cy);layer.dataset.carAngle=String(exteriorState.car.angle);
    const label=exteriorMotion.labels[exteriorState.blocked?'blocked':exteriorState.phase][language()];
    if(status.textContent!==label)status.textContent=label;
  }
  function applyZoom(recenter=false){
    const stage=panel.querySelector('.ao-stage'),centre=(stage.scrollLeft+stage.clientWidth/2)/Math.max(1,stage.scrollWidth);
    stage.style.setProperty('--ao-zoom',String(zoom));stage.querySelector('svg').style.width=`${zoom*100}%`;
    stage.scrollLeft=recenter?Math.max(0,stage.scrollWidth-stage.clientWidth)/2:Math.max(0,centre*stage.scrollWidth-stage.clientWidth/2);
    panController?.remember();if(recenter)panController?.centre();
    panel.querySelector('[data-action=zoom]').textContent='ZOOM '+zoom+'×';
  }
  function settleStagePan(){
    panController?.restore();
  }
  sheet.addEventListener('load',settleStagePan);
  function syncMotion(){
    panel.classList.toggle('ao-paused',paused);panel.classList.toggle('ao-motion-on',motionChoice==='on');
    panel.querySelector('[data-action=pause]').textContent=paused?t('Animar','Animate'):t('Pausar movimiento','Pause motion');
    const status=panel.querySelector('.ao-motion-status');if(!status)return;
    status.textContent=frameError?t('ANIMACIÓN: recuperando un fallo visual.','ANIMATION: recovering from a visual fault.'):document.hidden?t('ANIMACIÓN EN ESPERA · pestaña en segundo plano','ANIMATION WAITING · background tab'):paused?t('PAUSADA · pulsa Animar.','PAUSED · press Animate.'):t('ANIMACIÓN ACTIVA · desplazamiento y gestos','ANIMATION ACTIVE · movement and gestures');
    panel.dataset.animation=frameError?'recovering':document.hidden?'background':paused?'paused':'running';
  }
  function bindScreens(){/* Public wall screens are decorative, not market tools. */}
  function clearSignPreview(){const box=panel.querySelector('.ao-sign-preview');if(!box)return;box.dataset.room='';box.classList.remove('ao-sign-expanded');box.innerHTML=`<span>${t('RÓTULOS DE PARED','WALL SIGNS')}</span><p>${t('Pasa el cursor o enfoca una placa para leer su función. Clica para seleccionar la sala.','Hover over or focus a plaque to read its purpose. Click to select the room.')}</p>`;panel.querySelectorAll('[data-sign-room]').forEach(n=>n.removeAttribute('aria-describedby'));}
  function previewSign(node){const r=rooms.find(r=>r.id===node.dataset.signRoom),s=life.sectors.find(s=>s.id===r.id),box=panel.querySelector('.ao-sign-preview');if(!box)return;panel.querySelectorAll('[aria-describedby="ao-sign-preview"]').forEach(n=>n.removeAttribute('aria-describedby'));box.dataset.room=r.id;box.style.setProperty('--sector',s.color);box.classList.add('ao-sign-expanded');box.innerHTML=`<strong>${escape(s.number+' // '+r[language()])}</strong><p>${escape(s.detail[language()])} · ${t('Responsable: ','Lead: ')}${escape(roster.find(p=>p.id===r.lead)?.name||'—')}</p>`;node.setAttribute('aria-describedby',box.id);}
  function bindSigns(){panel.querySelectorAll('[data-sign-room]').forEach(node=>{
    const choose=()=>{const id=node.dataset.signRoom;filterDepartment(id);select(rooms.find(r=>r.id===id).lead);if(focused)updateCamera();previewSign(node);};
    const leave=()=>{if(document.activeElement===node)return;if(panel.querySelector('.ao-sign-preview')?.dataset.room===node.dataset.signRoom)clearSignPreview();};
    node.onpointerenter=()=>previewSign(node);node.onpointerleave=leave;node.onfocus=()=>previewSign(node);node.onblur=leave;
    node.onclick=e=>{e.stopPropagation();choose();};node.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();clearSignPreview();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();choose();}};
  });}
  function renderScreens(){panel.querySelectorAll('[data-wall-symbol]').forEach(screen=>{
    screen.querySelector('.ao-wall-title').textContent='ATLAS';
    screen.querySelector('.ao-wall-price').textContent=t('OFICINA','OFFICE');
    screen.querySelector('.ao-wall-status').textContent=t('DECORATIVO','DECORATIVE');
    screen.setAttribute('aria-label',t('Pantalla decorativa sin datos de mercado','Decorative screen with no market data'));
  });}
  function updateCamera(){
    const id=department!=='all'?department:personIndex.get(selected)?.room||'memory',room=rooms.find(r=>r.id===id);
    parkingFocus=false;cameraRoom=focused?id:null;cameraTarget=focused?life.roomFrame(room,point,world.viewBox):(parking?.viewBox||world.viewBox).slice();
    const controls=panel.querySelector('.ao-camera-controls');if(!controls)return;
    panel.classList.toggle('ao-focused',focused);
    panel.querySelectorAll('[data-sign-room]').forEach(sign=>sign.classList.toggle('ao-camera-room',focused&&sign.dataset.signRoom===id));
    controls.querySelector('[data-action=detail]').setAttribute('aria-pressed',String(focused));
    controls.querySelector('.ao-camera-label').textContent=focused?t('DETALLE // ','CLOSE-UP // ')+room[language()]:t('PLANO GENERAL // SELECCIONA UNA SALA PARA EXPLORARLA','FULL FLOOR // SELECT A ROOM TO EXPLORE');
    const stage=panel.querySelector('.ao-stage');stage.scrollLeft=Math.max(0,stage.scrollWidth-stage.clientWidth)/2;stage.scrollTop=0;
    panController?.centre();
    stage.querySelector('svg').setAttribute('viewBox',camera.join(' '));
    // Respect pause and the OS motion preference; never animate camera in those modes.
    if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches){camera=cameraTarget.slice();stage.querySelector('svg').setAttribute('viewBox',camera.join(' '));}
  }
  function filterDepartment(id){department=id;panel.querySelectorAll('[data-department]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.department===id)));panel.querySelectorAll('[data-room],[data-sign-room]').forEach(n=>n.classList.toggle('ao-room-active',(n.dataset.room||n.dataset.signRoom)===id));peopleNodes.forEach(node=>node.classList.remove('ao-dimmed'));const s=life.sectors.find(s=>s.id===id),guide=panel.querySelector('.ao-room-guide');guide.textContent=s?s.number+' // '+rooms.find(r=>r.id===id)[language()]+' · '+s.detail[language()]+' · '+t('Responsable: ','Lead: ')+(roster.find(p=>p.id===rooms.find(r=>r.id===id).lead)?.name||'—'):t('PLANO DEL FONDO · Selecciona un rótulo, una zona o una persona. Los colores y números identifican cada departamento.','FUND FLOOR PLAN · Select a sign, a zone or a person. Colours and numbers identify each department.');}
  function select(id){selected=id;clearSignPreview();panel.classList.add('ao-inspector-open');renderProfile();panel.querySelectorAll('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===id)));if(focused&&department==='all')updateCamera();}
  function renderProfile(){
    const target=panel.querySelector('.ao-selected'),a=roster.find(x=>x.id===selected);if(!a)return;
    if(a.kind==='specialist'){
      const s=a.specialist,model=s.model,last=specialistTeam.messages.find(m=>m.agent===a.id),key=JSON.stringify([language(),selected,model,last?.id,last?.state,specialistTeam.error]);
      if(target.dataset.key===key)return;target.dataset.key=key;
      target.innerHTML=`<div><h3>${escape(a.role[language()])}</h3><p class="ao-profile-name">${escape(a.name)}</p><p>${t('ANALISTA LOCAL · RED PEQUEÑA INDEPENDIENTE','LOCAL ANALYST · INDEPENDENT SMALL NETWORK')}</p><p>${escape(a.trait[language()])}</p><p>${t('Conversación: modelo local compartido, pesos congelados. Aprendizaje: red pequeña propia, solo cierres prospectivos verificados. Sin órdenes.','Conversation: shared local model, frozen weights. Learning: own small network, only verified prospective closures. No orders.')}</p></div><div><h3>${t('APRENDIZAJE REAL REGISTRADO','RECORDED REAL LEARNING')}</h3><p>${t('Casos','Cases')}: ${model.samples} · ${t('actualizaciones','updates')}: ${model.version}<br>Brier: ${number(model.brier,5)} · ${t('Integridad','Integrity')}: ${escape(s.audit.status)}</p><p>${t('Mejora predictiva todavía no demostrada. Memoria y conversación no son entrenamiento del LLM.','Predictive improvement not yet proven. Memory and conversation are not LLM training.')}</p><button data-specialist-open="${a.id}">${t('VER EVIDENCIAS Y DIÁLOGO ↘','VIEW EVIDENCE AND DIALOGUE ↘')}</button></div><div><h3>${t('ÚLTIMA EXPLICACIÓN · NO VERIFICADA','LATEST EXPLANATION · UNVERIFIED')}</h3><p>${escape(last?.output?.['summary_'+language()]||t('Esperando respuesta local.','Waiting for local response.'))}</p></div>`;
      target.lastElementChild.querySelector('h3').insertAdjacentHTML('afterend',`<p>${t('Consulta fechada','Dated query')}: ${time(last?.at)} · ${t('no es un precio en directo','not a live price')}${specialistTeam.error?' · '+t('SERVICIO RETRASADO O NO DISPONIBLE','SERVICE DELAYED OR UNAVAILABLE'):''}</p>`);
      target.querySelector('[data-specialist-open]').onclick=()=>document.dispatchEvent(new CustomEvent('atlas:specialist-select',{detail:a.id}));return;
    }
    if(a.kind==='task'){
      const worker=a.taskWorker,manager=roster.find(p=>p.id===a.manager);
      const key=JSON.stringify([language(),selected,worker.stats,worker.recent.map(x=>[x.id,x.state])]);if(target.dataset.key===key)return;target.dataset.key=key;
      target.innerHTML=`<div><h3>${escape(a.role[language()])}</h3><p class="ao-profile-name">${escape(a.name)}</p><p>${t('CONTROL PROGRAMADO · NO ES OTRO LLM','PROGRAMMED CHECK · NOT ANOTHER LLM')}</p><p>${escape(a.trait[language()])}</p><p>${t('Reporta a','Reports to')}: ${escape(manager?.name)}</p><p>${t('Solo lectura. Sus desplazamientos reproducen tareas registradas, no nuevas consultas ni entrenamiento.','Read only. Travel replays recorded tasks, not new queries or training.')}</p></div><div><h3>${t('TRABAJO REGISTRADO','RECORDED WORK')}</h3><p>${t('Completadas','Completed')}: ${worker.stats.COMPLETED} · ${t('Bloqueadas','Blocked')}: ${worker.stats.BLOCKED} · ${t('Fallidas','Failed')}: ${worker.stats.FAILED}</p><p>${t('Tareas con hallazgos','Tasks with findings')}: ${worker.flagged_tasks} · ${t('Duración media','Mean duration')}: ${number(worker.average_ms,1)} ms</p><p>${t('Completar una comprobación no significa acertar ni aprender. Los hallazgos incluyen advertencias repetidas; no cuentan incidentes únicos.','Completing a check does not mean being correct or learning. Findings include repeated warnings; not a count of unique incidents.')}</p></div><div><h3>${t('ÚLTIMAS TAREAS REALES','LATEST REAL TASKS')}</h3>${worker.recent.map(x=>`<p><button data-workflow-task="${x.id}">TASK #${x.id} · ${time(x.created_at)}</button><br>${escape(x.summary?.[language()]||x.state)}</p>`).join('')||'—'}</div>`;
      target.querySelectorAll('[data-workflow-task]').forEach(b=>b.onclick=()=>document.dispatchEvent(new CustomEvent('atlas:workflow-task',{detail:Number(b.dataset.workflowTask)})));
      return;
    }
    if(a.kind==='unavailable'){target.dataset.key='unavailable';target.innerHTML=`<div><h3>${escape(a.role[language()])}</h3><p class="ao-profile-name">${escape(a.name)}</p><p>${t('ESPECIALISTA CONFIGURADO · REGISTRO NO DISPONIBLE','CONFIGURED SPECIALIST · LEDGER UNAVAILABLE')}</p><p>${t('Esperando conexión con el registro. No se inventan mensajes ni se confunde este especialista con un puesto visual nuevo.','Waiting for the ledger connection. No messages are invented and this specialist is not treated as a new visual role.')}</p></div>`;return;}
    const msgs=(payload?.messages||[]).filter(m=>m.agent===a.id).slice(0,5),manager=roster.find(p=>p.id===a.manager),reports=roster.filter(p=>p.manager===a.id);
    const room=rooms.find(r=>r.id===a.room);
    const profileKey=JSON.stringify([language(),selected,a.kind,msgs.map(m=>m.id)]);if(target.dataset.key===profileKey)return;target.dataset.key=profileKey;
    target.innerHTML=`<div><h3>${escape(a.role[language()])}</h3><p class="ao-profile-name">${escape(a.name)}</p><p>${escape(room[language()])} · <b>${a.kind==='worker'?t('ESPECIALISTA POR REGLAS CONECTADO','CONNECTED RULE-BASED SPECIALIST'):t('PUESTO VISUAL · NO CONECTADO','VISUAL ROLE · NOT CONNECTED')}</b></p><p class="ao-profile-trait">${escape(a.trait[language()])}</p><p>${a.kind==='worker'?t('Sus mensajes usan datos fechados del registro. Este cargo es una representación organizativa; no modifica sus permisos ni el motor.','Messages use dated ledger data. This title is an organisational representation; it changes neither permissions nor the engine.'):t('No hay una IA ni un servicio detrás de este puesto. Su movimiento y reuniones son visuales, no evidencia de trabajo ni actividad de mercado.','No AI or service is connected to this role. Its movement and meetings are visual, not evidence of work or market activity.')}</p>${a.id==='mateo'?`<a class="ao-ai-link" href="#ao-local-analyst">${t('CONSULTAR A MATEO // IA LOCAL ↘','CONSULT MATEO // LOCAL AI ↘')}</a>`:''}</div><div><h3>${t('LÍNEA DE REPORTE REPRESENTADA','REPRESENTED REPORTING LINE')}</h3><p>${t('Reporta a','Reports to')}: ${manager?`<button data-profile-select="${manager.id}">${escape(manager.name+' · '+manager.role[language()])}</button>`:t('Consejo / mandato del fondo','Board / fund mandate')}</p><p>${t('Equipo directo','Direct team')}: ${reports.map(p=>`<button data-profile-select="${p.id}">${escape(p.name)}</button>`).join(' ')||'—'}</p><p>${t('Riesgo, cumplimiento y auditoría tienen una línea independiente hacia el consejo en este organigrama. No son controles humanos ni aprobaciones reales.','Risk, compliance and audit have an independent board reporting line in this chart. These are not human controls or actual approvals.')}</p></div><div><h3>${t('INTERVENCIONES REALES DEL REGISTRO','ACTUAL LEDGER INTERVENTIONS')}</h3><div class="ao-profile-history">${msgs.map(m=>`<p><time>#${m.id} · ${time(m.at)} → ${escape(m.recipient)}</time>${escape(m[language()])}</p>`).join('')||t('Sin mensajes registrados para este puesto.','No recorded messages for this role.')}</div></div>`;
    target.querySelectorAll('[data-profile-select]').forEach(b=>b.onclick=()=>select(b.dataset.profileSelect));
  }
  function render(){
    if(!panel.querySelector('.ao-roster'))return;
    panel.querySelector('.ao-status').textContent=t('● PRESENTACIÓN PÚBLICA · NO EN VIVO','● PUBLIC PRESENTATION · NOT LIVE');
    const agents=world.roster().map(a=>({...a,kind:'visual',trait:{es:'Personaje de la oficina pública. Sin conexión con herramientas ni datos privados.',en:'Public office character. Not connected to tools or private data.'}}));roster=agents;personIndex=new Map(agents.map(a=>[a.id,a]));
    panel.querySelector('.ao-scene-caption').textContent=t('Personajes, gestos y diálogos son guionizados. Sin acceso a mercados ni registros privados; no demuestra aprendizaje ni rentabilidad.','Characters, gestures and dialogue are scripted. No market or private ledger access; not evidence of learning or profitability.');

    const people=panel.querySelector('.ao-people');
    const signature=agents.filter(a=>['worker','task','specialist'].includes(a.kind)).map(a=>a.id+':'+a.kind).join(',');
    if(!people.childElementCount||people.dataset.signature!==signature){
      const focusedControl=stageFocus.capture(panel.querySelector('.ao-stage'),document.activeElement);
      people.innerHTML=architecture()+furnishings()+(parking?parking.structures()+parking.vehicle(language()):'')+agents.map(sprite).join('');bindScreens();bindSigns();clearSignPreview();
      people.querySelectorAll('.ao-parking-car').forEach(car=>{car.onclick=()=>inspectParking();car.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspectParking();}};});
      people.dataset.signature=signature;peopleNodes=new Map();spriteParts=new Map();
      people.querySelectorAll('[data-agent]').forEach(node=>{node.onclick=()=>select(node.dataset.agent);node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(node.dataset.agent);}};});
      people.querySelectorAll('[data-agent]').forEach(node=>{peopleNodes.set(node.dataset.agent,node);spriteParts.set(node.dataset.agent,{facing:node.querySelector('.ao-facing'),talk:node.querySelector('.ao-talk'),speech:node.querySelector('.ao-speech'),poseLabel:node.querySelector('.ao-pose-label')});});
      stageFocus.restore(panel.querySelector('.ao-stage'),focusedControl);
    }
    agents.forEach((a,i)=>{if(!walkers.has(a.id)){const w={id:a.id,x:a.seat.x,y:a.seat.y,tx:a.seat.x,ty:a.seat.y,path:[],home:a.room,next:Date.now()+i*50,bubbleUntil:0,turn:i+1,velocity:0,pace:life.appearance(i).pace};walkers.set(a.id,w);if(!['task','specialist'].includes(a.kind)){const target=world.destination(a,i+1);route(w,target.x,target.y,'ambient');}}const w=walkers.get(a.id);if(a.kind==='task'&&!w.taskRole){route(w,a.seat.x,a.seat.y);w.taskRole=true;}if(a.kind==='specialist'&&!w.specialistRole){route(w,a.seat.x,a.seat.y);w.specialistRole=true;}});
    const button=a=>`<button data-select="${a.id}" aria-pressed="${selected===a.id}" title="${escape(a.role[language()])}" style="--agent-color:${a.specialist?.color||(a.kind==='task'?'#edcc74':a.kind==='worker'?'#68e4d4':'#627886')}"><i></i>${escape(a.name)}</button>`;
    const rosterTarget=panel.querySelector('.ao-roster'),rosterKey=language()+signature;
    if(rosterTarget.dataset.key!==rosterKey){
      const allOpen=rosterTarget.querySelector('details')?.open;
      rosterTarget.innerHTML=`<div class="ao-connected-roster">${agents.filter(a=>['worker','task','specialist'].includes(a.kind)).map(button).join('')}</div><details ${allOpen?'open':''}><summary>${t('VER LOS 64 PUESTOS POR DEPARTAMENTO','VIEW ALL 64 ROLES BY DEPARTMENT')}</summary><div class="ao-all-roster">${rooms.filter(r=>!r.facility).map(r=>`<div><h3>${escape(r[language()])}</h3>${agents.filter(a=>a.room===r.id).map(button).join('')}</div>`).join('')}</div></details>`;
      rosterTarget.dataset.key=rosterKey;
      rosterTarget.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>select(b.dataset.select));
    }
    renderOrganisation();filterDepartment(department);
    if(focused&&cameraRoom!==(department!=='all'?department:personIndex.get(selected)?.room))updateCamera();
    panel.classList.toggle('ao-paused',paused);
    const statsTarget=panel.querySelector('.ao-office-stats'),statsKey=language()+signature;
    if(statsTarget.dataset.key!==statsKey){statsTarget.innerHTML=`<div><b>64</b><span>${t('puestos visuales','visual roles')}</span></div><div><b>16 + 4</b><span>${t('departamentos + espacios','departments + shared spaces')}</span></div><div><b>8</b><span>${t('coches ilustrados','illustrated cars')}</span></div><div><b class="ao-moving-count">—</b><span>${t('personajes caminando','walking characters')}</span></div>`;statsTarget.dataset.key=statsKey;}
    renderProfile();
    panel.querySelector('.ao-ledger-ticker').textContent=t('DEMO PÚBLICA · Sin datos privados ni conexiones al modelo.','PUBLIC DEMO · No private data or model connections.');
  }
  function renderOrganisation(){
    const target=panel.querySelector('.ao-organisation'),orgKey=language()+roster.filter(p=>p.kind==='specialist').map(p=>p.id).join(',');if(target.dataset.key===orgKey)return;target.dataset.key=orgKey;
    const children=id=>roster.filter(a=>a.manager===id&&a.lead);
    const branch=(a,depth=0)=>`<li><button data-org-select="${a.id}">${escape(a.name)} <small>${escape(a.role[language()])}</small></button>${depth<4&&children(a.id).length?`<ul>${children(a.id).map(p=>branch(p,depth+1)).join('')}</ul>`:''}</li>`;
    target.innerHTML=`<h3>${t('ORGANIGRAMA REPRESENTADO · NO PERMISOS DEL MOTOR','REPRESENTED ORGANISATION · NOT ENGINE PERMISSIONS')}</h3><p>${t('Consejo → CEO → CIO / COO → responsables → especialistas. Riesgo, cumplimiento y auditoría reportan al consejo, fuera de la línea de inversión. Los 56 puestos nuevos son visuales.','Board → CEO → CIO / COO → heads → specialists. Risk, compliance and audit report to the board, outside the investment line. The 56 new roles are visual.')}</p><ul class="ao-org-tree">${roster.filter(a=>a.manager===null).map(a=>branch(a)).join('')}</ul><p>${t('Modelo inspirado en funciones habituales de gestoras, no copia exacta de un fondo ni asesoramiento regulatorio.','Model inspired by common asset-management functions, not an exact fund replica or regulatory advice.')} <a href="https://www.cfainstitute.org/programs/cfa-program/careers" target="_blank" rel="noopener noreferrer">CFA Institute ↗</a> · <a href="https://www.blackrock.com/aladdin/about-us/about/faqs" target="_blank" rel="noopener noreferrer">Aladdin ↗</a></p>`;
    panel.querySelectorAll('[data-org-select]').forEach(b=>b.onclick=()=>{const a=roster.find(p=>p.id===b.dataset.orgSelect);select(a.id);filterDepartment(a.room);});
    target.querySelector('p').textContent=t('Organización visual. Celia, Mia y Maia están en desarrollo y evaluación.','Visual organisation. Celia, Mia and Maia are under development and evaluation.');
  }
  function queuePacket(message,from,to,index){
    const steps=world.path(from.seat,to.seat);if(steps.length<2)return;
    const svgNS='http://www.w3.org/2000/svg',node=document.createElementNS(svgNS,'g');
    node.innerHTML=`<title>${escape(t('REPETICIÓN VISUAL','VISUAL REPLAY')+' · #'+message.id+' · '+time(message.at)+' · '+message.agent+' → '+message.recipient)}</title><circle r="4" fill="#84f4d5"/><text x="7" y="-7" fill="#d5fff1" font-size="12" font-family="monospace">#${message.id}</text>`;
    const start=point(steps[0].x,steps[0].y,23);node.setAttribute('transform',`translate(${start[0]} ${start[1]})`);node.style.display='none';
    panel.querySelector('.ao-data-flow').append(node);packets.push({node,steps,id:message.id,at:Date.now()+index*350,duration:12000+steps.length*80});
    while(packets.length>24){packets.shift().node.remove();}
  }
  function route(w,x,y,source='recorded'){
    // Geometry-backed BFS and a swept collision guard. Never retask engines.
    const at=Date.now();w.travelSource=source;
    if(!ambientDepartures.admit(Array.from(walkers.values()),w,at,source)){w.departureDeferred=true;w.retryTarget={x,y};w.next=at+500;return false;}
    w.departureDeferred=false;
    const person=roster.find(p=>walkers.get(p.id)===w),reserved=[];
    walkers.forEach(other=>{if(other!==w){reserved.push(other);if(other.goal)reserved.push(other.goal);}});
    const target=world.meetingTarget(w,{x,y},reserved,person?.seat),path=target?world.path(w,target):[];
    if(!path.length){w.path=[];w.canonical=[];w.canonicalIndex=0;w.blockedSince=0;w.tx=w.x;w.ty=w.y;w.goal=null;w.arrivalPending=false;w.retryTarget={x,y};w.next=Date.now()+1500;return false;}
    w.path=traffic.lanes(w,path,(a,b)=>world.canWalk(a,b,[person?.seat,target]))||path;w.goal=target;w.retryTarget=null;w.blockedSince=0;
    w.canonical=w.path.map(p=>({...p}));w.canonicalIndex=0;
    const next=w.path.shift();if(next){w.tx=next.x;w.ty=next.y;}
    w.arrivalPending=true;
    return true;
  }
  function speak(id,text,source,at,delay=0,reference=null){
    const person=roster.find(p=>p.id===id);if(!person)return;
    if(source==='ambient'&&dialogues.some(d=>d.person===id&&d.source==='ledger'))return;
    const previous=dialogues.find(d=>d.person===id);if(previous){previous.node.remove();dialogues=dialogues.filter(d=>d!==previous);}
    if(dialogues.length>=3){const victim=dialogues.find(d=>d.source==='ambient')||dialogues[0];if(source==='ambient'&&victim.source==='ledger')return;victim.node.remove();dialogues=dialogues.filter(d=>d!==victim);}
    const wrapped=life.wrap(text),lines=wrapped.slice(0,2);
    if(wrapped.length>2)lines[1]=lines[1].replace(/…$/,'')+'…';
    const node=document.createElementNS('http://www.w3.org/2000/svg','g'),height=51+lines.length*17;
    const tag=source==='ambient'?t('AMBIENTE · GUION','AMBIENT · SCRIPTED'):t('REGISTRO','LEDGER')+' #'+reference.id+' · '+time(reference.at);
    node.setAttribute('class','ao-dialogue ao-dialogue-'+source);node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',person.name+' · '+tag+' · '+text);
    node.innerHTML=`<title>${escape(person.name+' · '+tag+' · '+text)}</title><g class="ao-dialogue-card"><path class="ao-dialogue-tail" d="M103 ${height-1} l12 12 12 -12"/><rect width="246" height="${height}" rx="7"/><text class="ao-dialogue-tag" x="12" y="18">${escape(tag)}</text><text class="ao-dialogue-name" x="12" y="37">${escape(person.name)}</text>${lines.map((line,i)=>`<text class="ao-dialogue-text" x="12" y="${55+i*17}">${escape(line)}</text>`).join('')}</g>`;
    const choose=()=>select(id);node.onclick=choose;node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};
    panel.querySelector('.ao-dialogue-layer').append(node);node.style.display='none';
    dialogues.push({node,tail:node.querySelector('.ao-dialogue-tail'),person:id,source,start:at+delay,end:at+delay+9000,height,side:dialogues.filter(d=>d.source===source).length%2?1:-1});
    lastDialogueLayout=0;
  }
  function animateDialogue(at){
    const layout=at-lastDialogueLayout>90,obstacles=rooms.map(r=>{const p=point(r.x+3,r.y+.15,38);return{x:p[0]-98,y:p[1]-59,width:196,height:47};});
    if(layout)lastDialogueLayout=at;
    dialogues=dialogues.filter(d=>{if(at>d.end||!d.node.isConnected){d.node.remove();return false;}const w=walkers.get(d.person);if(!w){d.node.remove();return false;}
      const visible=at>=d.start;
      if(layout&&visible){const anchor=point(w.x,w.y,11),rect=life.bubblePlacement(anchor,246,d.height,obstacles,d.side,world.viewBox),sx=Math.max(18,Math.min(228,anchor[0]-rect.x)),below=rect.y>anchor[1]-42,sy=below?1:d.height-1;d.node.setAttribute('transform',`translate(${rect.x} ${rect.y})`);d.tail.setAttribute('d',`M${sx-9} ${sy} L${sx} ${sy+(below?-11:11)} L${sx+9} ${sy} Z`);obstacles.push(rect);}
      d.node.style.display=visible?'block':'none';d.node.style.opacity=String(Math.min(1,(d.end-at)/700));return true;});
    if(!ambient||at<nextAmbient)return;
    nextAmbient=at+8500;if(dialogues.filter(d=>d.source==='ledger').length>=3)return;
    const eligible=roster.filter(p=>!['task','specialist'].includes(p.kind)&&(department==='all'||life.zone(walkers.get(p.id),rooms)===department)&&!dialogues.some(d=>d.person===p.id));
    if(!eligible.length)return;
    const a=eligible[dialogueTurn%eligible.length],wa=walkers.get(a.id),b=eligible.find(p=>p.id!==a.id&&life.nearby(wa,walkers.get(p.id),rooms)),script=life.exchange(life.zone(wa,rooms),dialogueTurn,language());
    if(b){const wb=walkers.get(b.id);wa.conversationUntil=at+6500;wb.conversationUntil=at+9500;speak(a.id,script[0],'ambient',at);speak(b.id,script[1],'ambient',at,2400);}
    else{wa.conversationUntil=at+3500;speak(a.id,life.soloExchange(life.zone(wa,rooms),dialogueTurn,language()),'ambient',at);}
    dialogueTurn++;
  }
  function animateFrame(stamp){
    const dt=Math.min(.05,(stamp-lastFrame)/1000||0);lastFrame=stamp;
    if(!parking&&exteriorMotion&&exteriorAnimated&&exteriorState){
      const next=exteriorMotion.step(exteriorState,dt,exteriorSolids,{paused,hidden:document.hidden,closed:!panel.querySelector('.ao-exterior')?.open,reducedMotion:motionPreference.matches,explicitPlay:motionChoice==='on'});
      if(next!==exteriorState){exteriorState=next;if(stamp-lastExteriorPaint>=40||next.complete||next.blocked){lastExteriorPaint=stamp;renderExterior();}}
    }
    if(!document.hidden&&camera.some((v,i)=>v!==cameraTarget[i])){camera=life.cameraStep(camera,cameraTarget,dt,paused||matchMedia('(prefers-reduced-motion: reduce)').matches);panel.querySelector('.ao-stage svg').setAttribute('viewBox',camera.join(' '));}
    let moving=0;
    if(!paused&&!document.hidden){
      const at=Date.now();
      const pedestrianList=Array.from(walkers.values()),waiting=trafficBudget.pick(pedestrianList,at);
      environmentElapsed+=dt;
      if(environmentElapsed>=.2){
        environmentState=environment.step(world,pedestrianList,environmentState,environmentElapsed);environmentElapsed=0;
        for(const room of rooms){
          const state=environmentState[room.id],floor=panel.querySelector('.ao-room[data-room="'+room.id+'"]');
          floor.dataset.visualOccupants=String(state.occupants);floor.style.setProperty('--zone-light',String(state.light));
          panel.querySelectorAll('[data-wall="'+room.id+'-back"] .ao-room-light').forEach(n=>n.style.opacity=String(state.light));
          panel.querySelectorAll('[data-furniture^="'+room.id+'-"]').forEach(n=>{if(['counter','coffee'].includes(n.dataset.kind)){n.dataset.visualUse=state.coffeeNearby?'nearby':'standby';}});
          const door=panel.querySelector('[data-door-room="'+room.id+'"]');door.classList.toggle('ao-door-active',state.doorway);
        }
      }
      if(waiting){
        const person=roster.find(p=>walkers.get(p.id)===waiting),others=pedestrianList.filter(p=>p!==waiting);
        const canMove=(a,b)=>world.canWalk(a,b,[person?.seat,waiting.goal]);
        const remaining=waiting.canonical?.slice(waiting.canonicalIndex||0)||[{x:waiting.tx,y:waiting.ty},...waiting.path];
        const revised=pedestrianRecovery.recover(waiting,remaining,others,canMove,{maxNodes:250});
        if(revised){if(revised.resetCanonical){waiting.canonical=revised.points.map(p=>({...p}));waiting.canonicalIndex=0;}waiting.path=revised.points;const first=waiting.path.shift();waiting.tx=first.x;waiting.ty=first.y;waiting.velocity=0;waiting.blockedSince=0;}
      }
      walkers.forEach((w,id)=>{
        const dx=w.tx-w.x,dy=w.ty-w.y,dist=Math.hypot(dx,dy),wantsWalk=dist>.03&&at>=(w.conversationUntil||0);
        const peers=pedestrianList.filter(p=>p!==w),person=personIndex.get(id),canMove=(a,b)=>world.canWalk(a,b,[person?.seat,w.goal]);
        let walking=false;
        if(wantsWalk){const movement=life.motion(dist,w.velocity,dt,speed*w.pace,w.path.length===0),next={x:w.x+dx/dist*movement.step,y:w.y+dy/dist*movement.step};if(canMove(w,next)&&traffic.clear(w,next,peers)){moving++;walking=movement.step>0;w.velocity=movement.velocity;w.x=next.x;w.y=next.y;w.blockedSince=0;}else{w.velocity=0;w.blockedSince=w.blockedSince||at;}}
        else if(at<(w.conversationUntil||0)){} // Visual conversation: pause, then resume the same path.
        else if(w.path.length){const target={x:w.tx,y:w.ty};if(canMove(w,target)&&traffic.clear(w,target,peers)){w.x=w.tx;w.y=w.ty;w.canonicalIndex=traffic.advance(w.canonical,w.canonicalIndex||0,target);w.blockedSince=0;const next=w.path.shift();w.tx=next.x;w.ty=next.y;}else{w.velocity=0;w.blockedSince=w.blockedSince||at;}}
        else if(w.retryTarget){if(at>w.next)route(w,w.retryTarget.x,w.retryTarget.y,w.travelSource||'recorded');}
        else if(w.sayWhenArrive){w.bubbleUntil=at+4000;w.sayWhenArrive=false;w.arrivalPending=false;w.next=at+9200;if(w.recordedMessage){speak(id,w.recordedMessage[language()],'ledger',at,0,w.recordedMessage);w.recordedMessage=null;}}
        else if(w.arrivalPending){w.arrivalPending=false;w.next=at+life.rest(w.turn);}
        else if(w.returnHome&&at>w.next){route(w,w.returnHome.x,w.returnHome.y);w.returnHome=null;w.messageId=null;}
        else if(at>w.next){const person=personIndex.get(id);if(person&&!['task','specialist'].includes(person.kind)){const target=world.destination(person,++w.turn);route(w,target.x,target.y,'ambient');w.next=at+life.rest(w.turn);w.messageId=null;}}
        if(!walking&&!w.path.length)w.velocity=0;
        const node=peopleNodes.get(id);if(!node)return;
        const p=point(w.x,w.y,11);node.setAttribute('transform',`translate(${p[0]} ${p[1]})`);node.dataset.x=w.x;node.dataset.y=w.y;
        node.classList.toggle('ao-walk',walking);node.classList.toggle('ao-selected-glow',id===selected);
        node.dataset.traffic=w.departureDeferred?'queued':w.blockedSince?'yielding':walking?'walking':'idle';
        const chatting=at<(w.conversationUntil||0),parts=spriteParts.get(id),pose=w.blockedSince?'idle':life.pose(person,w,walking,chatting,w.turn,rooms);
        node.classList.toggle('ao-chatting',chatting);
        node.dataset.pose=pose;parts.poseLabel.textContent=w.departureDeferred?t('Salida pendiente · visual','Departure queued · visual'):w.blockedSince?t('Cediendo paso · visual','Yielding · visual'):life.poses[pose][language()];
        const action=actions.step(parts.actionState,{id,pose,dt,neutral:['task','specialist'].includes(person.kind)||!!w.blockedSince||!!w.departureDeferred});parts.actionState=action;
        node.dataset.lifePhase=action.phase;
        for(const [key,value]of [['left',action.left],['right',action.right],['head',action.head]])node.style.setProperty('--action-'+key,value+'deg');
        node.style.setProperty('--action-lift',action.lift+'px');node.style.setProperty('--action-lean',action.lean+'px');
        if(!['neutral','walk'].includes(action.phase))parts.poseLabel.textContent=actions.labels[action.phase][language()]+t(' · guion',' · scripted');
        if(walking)parts.facing.setAttribute('transform',`scale(${dx-dy<0?-1:1} 1)`);
        parts.talk.style.display=at<w.bubbleUntil?'block':'none';
        parts.speech.textContent=w.taskRole&&w.messageId?'T'+w.messageId:w.messageId?'#'+w.messageId:'···';
      });
      animateDialogue(at);
      const stale=!online||!payload||Date.now()-payload.last_tick_at>=45000;
      if(!stale&&at-lastReplayAt>4500){
        lastReplayAt=at;
        const recent=(payload.messages||[]).filter(m=>at-m.at<300000).slice(0,8);
        if(recent.length){const message=recent[(replayIndex++)%recent.length],from=roster.find(p=>p.id===message.agent),to=roster.find(p=>p.id===message.recipient)||roster.find(p=>p.id==='irene');if(from&&to)queuePacket(message,from,to,0);}
      }
      packets=packets.filter(packet=>{
        if(stale||!packet.node.isConnected){packet.node.remove();return false;}
        const progress=(at-packet.at)/packet.duration;
        if(progress>=1){packet.node.remove();return false;}
        packet.node.style.display=progress<0?'none':'block';
        const index=Math.max(0,progress)*(packet.steps.length-1),i=Math.floor(index),a=packet.steps[i],b=packet.steps[Math.min(i+1,packet.steps.length-1)],f=index-i;
        const p=point(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f,23);packet.node.setAttribute('transform',`translate(${p[0]} ${p[1]})`);return true;
      });
    }else{
      // Position sprites even with reduced motion or a paused scene.
      walkers.forEach((w,id)=>{const p=point(w.x,w.y,11),node=peopleNodes.get(id);if(node){node.setAttribute('transform',`translate(${p[0]} ${p[1]})`);node.classList.remove('ao-walk');node.classList.toggle('ao-selected-glow',id===selected);node.querySelector('.ao-talk').style.display='none';}});
      // Pause display time as well as movement, without inventing/replaying new messages.
      packets.forEach(p=>{p.at+=dt*1000;});
      dialogues.forEach(d=>{d.start+=dt*1000;d.end+=dt*1000;d.node.style.display='none';});
      walkers.forEach(w=>{if(w.conversationUntil)w.conversationUntil+=dt*1000;});
      nextAmbient+=dt*1000;
    }
    // The same depth ordering must also work when motion is paused or reduced.
    if(!document.hidden&&stamp-lastDepth>100){
      lastDepth=stamp;const group=panel.querySelector('.ao-people');
      const focusedControl=stageFocus.capture(panel.querySelector('.ao-stage'),document.activeElement);
      const entries=Array.from(group.children).map(node=>{
        if(node.dataset.agent){const w=walkers.get(node.dataset.agent);return {node,x:w.x-.18,y:w.y-.18,w:.36,h:.36,base:11,top:56};}
        return {node,x:Number(node.dataset.x),y:Number(node.dataset.y),w:Number(node.dataset.width),h:Number(node.dataset.height),base:10,top:node.dataset.wall?78:Number(node.dataset.top||40)};
      });
      world.drawOrder(entries).forEach((entry,i)=>{if(group.children[i]!==entry.node)group.insertBefore(entry.node,group.children[i]||null);});
      stageFocus.restore(panel.querySelector('.ao-stage'),focusedControl);
    }
    if(stamp-packetCounterAt>1000){
      packetCounterAt=stamp;
      const movingNode=panel.querySelector('.ao-moving-count'),packetNode=panel.querySelector('.ao-packet-count');
      if(movingNode)movingNode.textContent=String(moving);
      if(packetNode)packetNode.textContent=String(packets.length);
      panel.querySelectorAll('[data-occupants]').forEach(n=>{let count=0;walkers.forEach(w=>{if(world.roomAt(w.x,w.y)?.id===n.dataset.occupants)count++;});n.textContent=String(count);});
    }
    if(stamp-lastScreenAt>1000){lastScreenAt=stamp;renderScreens();}
  }
  function animate(stamp){
    // A decoration error must not permanently stop the animation loop.
    try{animateFrame(stamp);frameCount++;frameError=false;}
    catch(error){if(!frameError)console.error('Office visual frame failed',error);frameError=true;}
    finally{if(stamp-lastMotionAt>1000){lastMotionAt=stamp;panel.dataset.frames=String(frameCount);syncMotion();}requestAnimationFrame(animate);}
  }
  function refresh(){online=false;payload=null;render();}
  document.addEventListener('atlas:languagechange',()=>mount());
  document.addEventListener('atlas:specialists',e=>{
    specialistTeam=e.detail||(specialistTeam?{...specialistTeam,error:'service_unavailable'}:null);render();
    if(!e.detail)return;
    const terminal=e.detail.messages.filter(m=>m.state!=='RUNNING');
    if(specialistInitialized)terminal.filter(m=>!specialistSeen.has(m.id)&&m.state==='DONE'&&Date.now()-m.completed_at<60000).reverse().forEach(m=>{
      const w=walkers.get(m.agent),person=personIndex.get(m.agent),head=personIndex.get(person?.manager);if(!w||!head)return;
      route(w,head.seat.x,head.seat.y);w.messageId='S'+m.id;w.recordedMessage={id:'S'+m.id,at:m.at,es:m.output.summary_es,en:m.output.summary_en};w.sayWhenArrive=true;w.returnHome=person.seat;
    });
    terminal.forEach(m=>specialistSeen.add(m.id));specialistInitialized=true;
  });
  document.addEventListener('visibilitychange',()=>{lastFrame=0;syncMotion();});
  motionPreference.addEventListener('change',()=>{if(motionChoice===null)paused=motionPreference.matches;syncMotion();});
  document.addEventListener('atlas:paper-snapshot',e=>{
    marketState=e.detail;const now=Date.now();for(const symbol of market.symbols)quoteHistory.set(symbol,market.collect(quoteHistory.get(symbol),marketState,symbol,now));renderScreens();
  });
  document.addEventListener('atlas:workflow',e=>{
    workflow=e.detail;render();
    const events=workflow?.events||[],newest=events[0]?.id||workflowEventId;
    if(workflowInitialized&&workflow&&!workflow.error){
      const byOwner=new Map();events.filter(x=>x.id>workflowEventId&&Date.now()-x.at<30000&&['COMPLETED','BLOCKED','FAILED'].includes(x.to_state)).forEach(x=>{if(!byOwner.has(x.owner))byOwner.set(x.owner,x);});
      byOwner.forEach(event=>{const person=roster.find(x=>x.id===event.owner),head=roster.find(x=>x.id===person?.manager),walker=walkers.get(event.owner);if(!person||!head||!walker)return;route(walker,head.seat.x,head.seat.y);walker.messageId=event.task_id;walker.sayWhenArrive=true;walker.returnHome=person.seat;});
    }
    if(workflow){workflowEventId=newest;workflowInitialized=true;}
  });
  mount();refresh();requestAnimationFrame(animate);
})();

