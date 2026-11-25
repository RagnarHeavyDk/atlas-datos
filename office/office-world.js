/* Presentation-only organisation and walkable floor. No inference or orders. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AtlasOfficeWorld = api;
})(typeof window === 'undefined' ? this : window, function () {
  'use strict';
  // One additional cell in every shared corridor, perimeter and workstation
  // aisle. Rooms grow rather than shrinking furniture or removing roles.
  const width = 39, height = 47, corridorWidth=2;
  const viewBox=Object.freeze([0,0,(width+height)*22+48,(width+height)*11+90]);
  const rooms = [
    ['committee',1,1,6,6,'#354953','COMITÉ / CONSEJO','COMMITTEE / BOARD','irene'],
    ['direction',8,1,6,6,'#3f4353','DIRECCIÓN GENERAL','EXECUTIVE OFFICE','elena'],
    ['risk',15,1,6,6,'#493649','RIESGO INDEPENDIENTE','INDEPENDENT RISK','noa'],
    ['operations',22,1,6,6,'#344952','DIRECCIÓN OPERATIVA','OPERATING OFFICE','adrian'],
    ['data',1,8,6,6,'#294954','DATOS / INVESTIGACIÓN','DATA / RESEARCH','nora'],
    ['technical',8,8,6,6,'#304452','ANÁLISIS DE MERCADO','MARKET ANALYSIS','diego'],
    ['macro',15,8,6,6,'#42464b','MACRO / REGÍMENES','MACRO / REGIMES','lucia'],
    ['memory',22,8,6,6,'#344b48','QUANT / APRENDIZAJE','QUANT / LEARNING','mateo'],
    ['portfolio',1,15,6,6,'#39465b','GESTIÓN DE CARTERA','PORTFOLIO MANAGEMENT','clara'],
    ['execution',8,15,6,6,'#304754','MESA DE EJECUCIÓN','EXECUTION DESK','eva'],
    ['compliance',15,15,6,6,'#443d4e','CUMPLIMIENTO','COMPLIANCE','valeria'],
    ['audit',22,15,6,6,'#304a55','AUDITORÍA / CONTROL','AUDIT / CONTROL','samuel'],
    ['investors',1,22,6,6,'#3c4850','RELACIÓN INVERSORES','INVESTOR RELATIONS','olivia'],
    ['finance',8,22,6,6,'#3c494a','FINANZAS / NAV','FINANCE / NAV','hugo'],
    ['technology',15,22,6,6,'#2b4559','TECNOLOGÍA / SERVIDORES','TECHNOLOGY / SERVERS','leo'],
    ['support',22,22,6,6,'#424650','PERSONAS / SERVICIOS','PEOPLE / SERVICES','ines']
  ].map(([id,x,y,w,h,c,es,en,lead])=>({id,x:2+Math.floor((x-1)/7)*9,y:2+Math.floor((y-1)/7)*9,w:w+1,h:h+1,c,es,en,lead,doorStart:3,doorWidth:2}));
  // Amenities are shared space, never additional agents or departments.
  const facilities=[
    ['cafe',1,29,'#3f4945','CAFETERÍA / COCINA','CAFETERIA / KITCHEN'],
    ['lounge',8,29,'#454252','DESCANSO / BIBLIOTECA','LOUNGE / LIBRARY'],
    ['bathrooms',15,29,'#355057','BAÑOS / VESTUARIO','RESTROOMS / LOCKERS'],
    ['huddle',22,29,'#3e4558','REUNIÓN / COLABORACIÓN','HUDDLE / COLLABORATION']
  ].map(([id,x,y,c,es,en])=>({id,x:2+Math.floor((x-1)/7)*9,y:38,w:7,h:7,c,es,en,lead:'ines',facility:true,doorStart:3,doorWidth:2}));
  rooms.push(...facilities);
  const leads = {
    irene:['Irene','Secretaría del comité','Committee secretary','bruno'],
    elena:['Elena','Dirección general · CEO','Chief executive · CEO','bruno'],
    noa:['Noa','Dirección de riesgo · CRO','Chief risk officer · CRO','bruno'],
    adrian:['Adrián','Dirección operativa · COO','Chief operating officer · COO','elena'],
    nora:['Nora','Responsable de datos','Head of data','clara'],
    diego:['Diego','Responsable de análisis','Head of market analysis','clara'],
    lucia:['Lucía','Responsable de macro','Head of macro research','clara'],
    mateo:['Mateo','Responsable quant','Head of quantitative research','clara'],
    clara:['Clara','Dirección de inversión · CIO','Chief investment officer · CIO','elena'],
    eva:['Eva','Responsable de ejecución','Head of execution','clara'],
    valeria:['Valeria','Dirección de cumplimiento · CCO','Chief compliance officer · CCO','bruno'],
    samuel:['Samuel','Responsable de auditoría','Head of audit','bruno'],
    olivia:['Olivia','Relación con inversores','Head of investor relations','elena'],
    hugo:['Hugo','Finanzas y valoración','Head of finance and valuation','adrian'],
    leo:['Leo','Dirección tecnológica · CTO','Chief technology officer · CTO','adrian'],
    ines:['Inés','Personas y servicios','Head of people and services','adrian']
  };
  const specialties = {
    committee:[['Presidencia del consejo','Board chair'],['Secretaría','Committee support'],['Revisión de mandatos','Mandate review']],
    direction:[['Estrategia de producto','Product strategy'],['Planificación','Planning'],['Coordinación ejecutiva','Executive coordination']],
    risk:[['Exposición y límites','Exposure and limits'],['Escenarios de estrés','Stress scenarios'],['Riesgo de liquidez','Liquidity risk']],
    operations:[['Control operativo','Operational control'],['Procesos','Process management'],['Continuidad','Business continuity']],
    data:[['Calidad de datos','Data quality'],['Ingesta de mercado','Market ingestion'],['Investigación de fuentes','Source research']],
    technical:[['Estructura de precio','Price structure'],['Volumen y liquidez','Volume and liquidity'],['Microestructura','Market microstructure']],
    macro:[['Regímenes de mercado','Market regimes'],['Análisis de volatilidad','Volatility analysis'],['Contexto de activos','Asset context']],
    memory:[['Modelos estadísticos','Statistical models'],['Evaluación de modelos','Model evaluation'],['Gestión de evidencias','Evidence management']],
    portfolio:[['Asignación de capital','Capital allocation'],['Construcción de cartera','Portfolio construction'],['Atribución de resultados','Performance attribution']],
    execution:[['Simulación de ejecución','Execution simulation'],['Costes y spread','Costs and spread'],['Revisión de fills','Fill review']],
    compliance:[['Revisión de políticas','Policy review'],['Control preoperación','Pre-trade control'],['Registro de excepciones','Exception records']],
    audit:[['Trazabilidad','Traceability'],['Integridad de registros','Record integrity'],['Validación independiente','Independent validation']],
    investors:[['Informes','Reporting'],['Atención a inversores','Investor support'],['Documentación','Documentation']],
    finance:[['Conciliación','Reconciliation'],['Valoración NAV','NAV valuation'],['Tesorería','Treasury']],
    technology:[['Infraestructura','Infrastructure'],['Servicios de datos','Data services'],['Mantenimiento','Maintenance']],
    support:[['Administración','Administration'],['Personas','People operations'],['Servicios internos','Internal services']]
  };
  const names=['Alex','Julia','Eric','Lara','Alan','Vera','Pablo','Maia','Marc','Luna','Dario','Alba','Ian','Aina','Gael','Celia','Teo','Ada','Ivan','Mia','Ruben','Iris','Joel','Elsa','Omar','Nina','Axel','Sara','Pol','Emma','Saul','Zoe','Luis','Lea','Enzo','Elia','Raul','Nora B.','Hector','Lia','Max','Carla','Dani','Ana','Nico','Rita','Ismael','Luz'];
  const anchors = r => r.facility?[
    {x:r.x+4.5,y:r.y+6.5},{x:r.x+3.5,y:r.y+4.5},
    {x:r.x+1.5,y:r.y+(r.id==='bathrooms'?4.5:5.5)},{x:r.x+5.5,y:r.y+5.5}
  ]:[
    {x:r.x+1.5,y:r.y+2.5},{x:r.x+5.5,y:r.y+2.5},
    {x:r.x+1.5,y:r.y+5.5},{x:r.x+5.5,y:r.y+5.5}
  ];
  function roster(workers=[],taskWorkers=[],specialists=[]) {
    const byId=new Map(workers.map(a=>[a.id,a]));
    const byTaskId=new Map(taskWorkers.map(a=>[a.id,a]));
    const bySpecialistId=new Map(specialists.map(a=>[a.id,a]));
    const configured=new Set(['nora','diego','lucia','noa','eva','mateo','samuel','irene']);
    const result=[];
    rooms.filter(r=>!r.facility).forEach((r,ri)=>{
      const [name,es,en,manager]=leads[r.lead];
      const base=byId.get(r.lead);
      const kind=base?'worker':configured.has(r.lead)?'unavailable':'visual';
      result.push({...base,id:r.lead,name,room:r.id,role:{es,en},manager,kind,lead:true,seat:anchors(r)[0],trait:base?.trait||(kind==='unavailable'?{es:'Especialista configurado; esperando confirmación del registro.',en:'Configured specialist; waiting for ledger confirmation.'}:{es:'Puesto organizativo representado; aún sin agente conectado.',en:'Represented organisational role; no connected agent yet.'})});
      specialties[r.id].forEach(([es,en],si)=>{
        const chair=r.id==='committee'&&si===0;
        const id=chair?'bruno':`${r.id}-staff-${si}`,task=byTaskId.get(id),specialist=bySpecialistId.get(id);
        result.push({id,name:chair?'Bruno':names[ri*3+si],room:r.id,
          role:{es,en},manager:chair?null:r.lead,kind:'visual',lead:chair,seat:anchors(r)[si+1],
          trait:{es:'Puesto organizativo visual: no calcula señales ni genera mensajes reales.',en:'Visual organisational role: does not compute signals or generate real messages.'},
          ...(task?{name:task.name,role:task.role,kind:'task',trait:task.trait,taskWorker:task}:{}),
          ...(specialist?{name:specialist.name,role:specialist.role,kind:'specialist',trait:specialist.trait,specialist}:{})});
      });
    });
    return result;
  }
  const roomAt=(x,y)=>rooms.find(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
  const radius=.18;
  // Single geometry source for BOTH rendering and navigation. Chairs are
  // intentionally occupiable seats, not solid desks or hallway obstacles.
  const furniture=rooms.flatMap(r=>{
    const items=[];
    if(r.facility){
      const add=(kind,id,dx,dy,w,h,z=26,solid=true)=>items.push({id:r.id+'-'+id,room:r.id,kind,x:r.x+dx,y:r.y+dy,w,h,z,solid});
      if(r.id==='cafe'){
        add('counter','kitchen',.4,.25,4.9,.65,28);
        add('table','table-a',.6,2,1.5,.9,26);add('table','table-b',5,2,1.5,.9,26);
        add('stool','seat-a',1.2,4.25,.55,.45,17,false);add('stool','seat-b',5.45,4.25,.55,.45,17,false);
      }
      if(r.id==='lounge'){
        add('sofa','sofa-a',.5,.5,1.8,.8,22);add('sofa','sofa-b',4.8,.5,1.8,.8,22);
        add('table','low-table',3.3,2.9,1.4,.75,18);
        add('bookshelf','books',.1,3.5,.35,1.5,52);
        add('plant','plant',6.4,2,.3,.3,14);
      }
      if(r.id==='bathrooms'){
        // Private stalls include their fixtures in ONE occupied footprint.
        add('stall','stall-a',.35,.25,2.15,2.35,58);
        add('stall','stall-b',4.8,.25,1.85,2.35,58);
        add('sink','basin',.45,5,1.8,.6,27);
        add('locker','lockers',6.4,4.2,.35,2,46);
      }
      if(r.id==='huddle'){
        add('meeting-table','table',1.9,1.2,3.2,1.35,26);
        add('stool','seat-a',1.1,3.8,.55,.45,17,false);add('stool','seat-b',5.6,3.8,.55,.45,17,false);
        add('whiteboard','board',1.1,.08,4.7,.18,50);
      }
      return items.map(f=>Object.freeze({...f,depth:f.x+f.y+(f.w+f.h)/2}));
    }
    // Preserve workstation IDs, roles and furniture sizes. Right/lower stations
    // move one cell within enlarged rooms; rendering and routing share geometry.
    const executive=['committee','direction','operations'].includes(r.id);
    const doubleDesk=['data','technical','macro','memory','execution','technology'].includes(r.id);
    for(const dx of [1,4])for(const dy of [1,3]){
      const localX=dx===4?5:dx,localY=dy===3?4:dy;
      const leadDesk=executive&&dx===1&&dy===1;
      const deskWidth=leadDesk?2.1:r.id==='execution'&&dx===1?2:doubleDesk?1.9:1.7;
      const deskHeight=leadDesk?1:r.id==='memory'?.9:.8;
      items.push({id:r.id+'-desk-'+dx+'-'+dy,room:r.id,kind:'desk',x:r.x+localX,y:r.y+localY,w:deskWidth,h:deskHeight,z:32,solid:true});
      items.push({id:r.id+'-chair-'+dx+'-'+dy,room:r.id,kind:'chair',x:r.x+localX+.23,y:r.y+localY+1.24,w:.54,h:.48,z:18,solid:false});
    }
    if(r.id!=='technology'&&r.id!=='support')items.push({id:r.id+'-plant',room:r.id,kind:'plant',x:r.x+r.w-.32,y:r.y+.08,w:.24,h:.24,z:14,solid:true});
    if(['audit','compliance','finance','investors','committee','direction','operations'].includes(r.id))items.push({id:r.id+'-cabinet',room:r.id,kind:'cabinet',x:r.x+4,y:r.y+.04,w:1.1,h:.22,z:30,solid:true});
    // Equipment strip is below the room signs, opposite the live left-wall
    // charts, outside seats and the central door approach. No fake live data.
    if(['risk','macro','memory','data','technical'].includes(r.id)){
      const kind=r.id==='memory'?'server':r.id==='risk'?'cabinet':'bookshelf';
      items.push({id:r.id+'-equipment',room:r.id,kind,x:r.x+4,y:r.y+.04,w:1.1,h:.22,z:30,solid:true});
    }
    if(r.id==='technology')for(let i=0;i<5;i++)items.push({id:r.id+'-server-'+i,room:r.id,kind:'server',x:r.x+.85+i*.88,y:r.y+.04,w:.5,h:.22,z:37,solid:true});
    if(r.id==='support')items.push({id:r.id+'-coffee',room:r.id,kind:'coffee',x:r.x+5.2,y:r.y+.04,w:.55,h:.26,z:24,solid:true});
    return items.map(f=>Object.freeze({...f,depth:f.x+f.y+(f.w+f.h)/2}));
  });
  const furnitureCells=new Map();
  const chairCells=new Set(furniture.filter(f=>['chair','stool'].includes(f.kind)).map(f=>Math.floor(f.x+f.w/2)+','+Math.floor(f.y+f.h/2)));
  for(const f of furniture.filter(f=>f.solid))for(let x=Math.floor(f.x-radius);x<=Math.floor(f.x+f.w+radius);x++)for(let y=Math.floor(f.y-radius);y<=Math.floor(f.y+f.h+radius);y++){
    const key=x+','+y;if(!furnitureCells.has(key))furnitureCells.set(key,[]);furnitureCells.get(key).push(f);
  }
  // Continuous body clearance from the same room boundaries used by edge().
  // Right boundaries are cut-away in the artwork, not walk-through openings.
  const walls=rooms.flatMap(r=>[
    {ax:r.x,ay:r.y,bx:r.x+r.w,by:r.y},
    {ax:r.x,ay:r.y,bx:r.x,by:r.y+r.h},
    {ax:r.x+r.w,ay:r.y,bx:r.x+r.w,by:r.y+r.h},
    {ax:r.x,ay:r.y+r.h,bx:r.x+r.doorStart,by:r.y+r.h},
    {ax:r.x+r.doorStart+r.doorWidth,ay:r.y+r.h,bx:r.x+r.w,by:r.y+r.h}
  ]);
  const wallCells=new Map();
  for(const wall of walls)for(let x=Math.floor(Math.min(wall.ax,wall.bx)-radius);x<=Math.floor(Math.max(wall.ax,wall.bx)+radius);x++)for(let y=Math.floor(Math.min(wall.ay,wall.by)-radius);y<=Math.floor(Math.max(wall.ay,wall.by)+radius);y++){
    const key=x+','+y;if(!wallCells.has(key))wallCells.set(key,[]);wallCells.get(key).push(wall);
  }
  function collides(position,clearance=radius){
    if(!Number.isFinite(position.x)||!Number.isFinite(position.y)||position.x<clearance||position.y<clearance||position.x>width-clearance||position.y>height-clearance)return true;
    const nearby=clearance===radius?(furnitureCells.get(Math.floor(position.x)+','+Math.floor(position.y))||[]):furniture;
    if(nearby.some(f=>f.solid&&Math.hypot(position.x-Math.max(f.x,Math.min(f.x+f.w,position.x)),position.y-Math.max(f.y,Math.min(f.y+f.h,position.y)))<clearance))return true;
    const boundaries=clearance===radius?(wallCells.get(Math.floor(position.x)+','+Math.floor(position.y))||[]):walls;
    return boundaries.some(a=>Math.hypot(position.x-Math.max(Math.min(a.ax,a.bx),Math.min(Math.max(a.ax,a.bx),position.x)),position.y-Math.max(Math.min(a.ay,a.by),Math.min(Math.max(a.ay,a.by),position.y)))<clearance-1e-8);
  }
  function canWalk(from,to,allowedSeats=[]){
    if(!canMove(from,to))return false;
    const allowed=new Set([Math.floor(from.x)+','+Math.floor(from.y),...allowedSeats.filter(Boolean).map(p=>Math.floor(p.x)+','+Math.floor(p.y))]);
    const steps=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/.06));
    for(let i=0;i<=steps;i++){const q=i/steps,x=from.x+(to.x-from.x)*q,y=from.y+(to.y-from.y)*q,key=Math.floor(x)+','+Math.floor(y);if(chairCells.has(key)&&!allowed.has(key))return false;}
    return true;
  }
  function canMove(from,to){
    // Swept-circle samples prevent tunnelling even if a frame or speed jumps.
    const steps=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/.06));
    for(let i=0;i<=steps;i++){const q=i/steps,p={x:from.x+(to.x-from.x)*q,y:from.y+(to.y-from.y)*q};if(collides(p))return false;}
    // Also respect walls and doors, never cut a corner through a boundary.
    const ax=Math.floor(from.x),ay=Math.floor(from.y),bx=Math.floor(to.x),by=Math.floor(to.y);
    return ax===bx&&ay===by?true:edge(ax,ay,bx,by);
  }
  const depth=(person)=>person.x+person.y;
  const blocked = new Set();
  for(let x=0;x<width;x++)for(let y=0;y<height;y++)if(collides({x:x+.5,y:y+.5}))blocked.add(`${x},${y}`);
  const inside=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&!blocked.has(`${x},${y}`);
  function edge(ax,ay,bx,by) {
    if(!inside(ax,ay)||!inside(bx,by)||Math.abs(ax-bx)+Math.abs(ay-by)!==1)return false;
    const a=roomAt(ax,ay),b=roomAt(bx,by);
    if(a===b)return true;
    const throughDoor = (r,ix,iy,ox,oy)=>!r||(ix>=r.x+r.doorStart&&ix<r.x+r.doorStart+r.doorWidth&&iy===r.y+r.h-1&&ox===ix&&oy===r.y+r.h);
    return throughDoor(a,ax,ay,bx,by)&&throughDoor(b,bx,by,ax,ay);
  }
  function path(from,to) {
    const sx=Math.floor(from.x),sy=Math.floor(from.y),tx=Math.floor(to.x),ty=Math.floor(to.y);
    if(collides(from)||collides(to)||!inside(sx,sy)||!inside(tx,ty))return [];
    const key=(x,y)=>`${x},${y}`,start=key(sx,sy),end=key(tx,ty),queue=[[sx,sy]],previous=new Map([[start,null]]);
    for(let i=0;i<queue.length&&!previous.has(end);i++){
      const [x,y]=queue[i];
      for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
        const nx=x+dx,ny=y+dy,k=key(nx,ny);
        // Seats are interaction endpoints, not shortcuts through another chair.
        if(!previous.has(k)&&(!chairCells.has(k)||k===start||k===end)&&edge(x,y,nx,ny)){previous.set(k,key(x,y));queue.push([nx,ny]);}
      }
    }
    if(!previous.has(end))return [];
    const route=[];
    for(let k=end;k!==null;k=previous.get(k)){const [x,y]=k.split(',').map(Number);route.push({x:x+.5,y:y+.5});}
    return route.reverse();
  }
  function destination(person,turn) {
    const home=rooms.find(r=>r.id===person.room);
    // All trips are presentation only, not a task scheduler or a fabricated event.
    if(turn%3===0)return person.seat;
    if(turn%4===1)return anchors(facilities[(Math.floor(turn/4)+rooms.indexOf(home))%facilities.length])[turn%4];
    const options=[home,rooms.find(r=>r.id==='committee'),rooms.find(r=>r.id==='cafe'),rooms.find(r=>r.id==='operations'),rooms[(rooms.indexOf(home)+turn)%rooms.length]];
    const room=options[turn%options.length];
    return anchors(room)[turn%4];
  }
  const point=(x,y,z=0)=>[height*22+24+(x-y)*22,65+(x+y)*11-z];
  // Enclose the artwork as well as the occupied floor footprint. Previous
  // z+20 estimates missed mirror tops, foliage, steam and whiteboard frames.
  function renderTop(f){
    const tops={desk:f.z+27,chair:f.z+16,plant:51,cabinet:f.z,
      server:f.z,coffee:49,table:f.z+10,'meeting-table':f.z+2,
      stool:f.z,sofa:f.z+17,counter:f.z+38,bookshelf:f.z+1,
      locker:f.z+1,sink:f.z+25,stall:Math.max(f.z,39),whiteboard:f.z+22};
    if(!Number.isFinite(tops[f.kind]))throw Error('unknown_furniture_render_extent');
    return Math.max(40,tops[f.kind]);
  }
  // Draw actual footprints, not only centre points. A tall wall in front of a
  // neighbouring room must occlude its people, even though floors draw first.
  function projectedBounds(item){
    const corners=[];
    for(const x of [item.x,item.x+item.w])for(const y of [item.y,item.y+item.h])for(const z of [item.base??10,item.top??60])corners.push(point(x,y,z));
    return {left:Math.min(...corners.map(p=>p[0]))-12,right:Math.max(...corners.map(p=>p[0]))+12,top:Math.min(...corners.map(p=>p[1]))-2,bottom:Math.max(...corners.map(p=>p[1]))+8};
  }
  function drawOrder(items){
    const entries=items.map((item,i)=>({item,i,bounds:projectedBounds(item),depth:item.x+item.y+(item.w+item.h)/2}));
    const outgoing=entries.map(()=>[]),incoming=entries.map(()=>0),eps=.001;
    for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
      const a=entries[i],b=entries[j],aa=a.bounds,bb=b.bounds;
      if(aa.left>=bb.right||bb.left>=aa.right||aa.top>=bb.bottom||bb.top>=aa.bottom)continue;
      const before=a.item.x+a.item.w<=b.item.x+eps||a.item.y+a.item.h<=b.item.y+eps;
      const after=b.item.x+b.item.w<=a.item.x+eps||b.item.y+b.item.h<=a.item.y+eps;
      if(before===after)continue; // Opposing axes: no valid occlusion constraint.
      const from=before?i:j,to=before?j:i;outgoing[from].push(to);incoming[to]++;
    }
    const remaining=new Set(entries.map((_,i)=>i)),result=[];
    while(remaining.size){
      const ready=[...remaining].filter(i=>incoming[i]===0);
      // Cyclic/overlapping artwork has a deterministic fallback, never hangs.
      const candidates=ready.length?ready:[...remaining];
      candidates.sort((i,j)=>entries[i].depth-entries[j].depth||i-j);
      const index=candidates[0];remaining.delete(index);result.push(entries[index].item);
      outgoing[index].forEach(j=>incoming[j]--);
    }
    return result;
  }
  function meetingTarget(from,target,reserved=[],ownSeat=null){
    const room=roomAt(target.x,target.y),candidates=[];
    const own=ownSeat&&Math.hypot(target.x-ownSeat.x,target.y-ownSeat.y)<.05;
    if(own)candidates.push(target);
    if(room)for(let x=room.x;x<room.x+room.w;x++)for(let y=room.y;y<room.y+room.h;y++){
      const p={x:x+.5,y:y+.5};
      if(!chairCells.has(x+','+y)&&!collides(p))candidates.push(p);
    }
    candidates.sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y));
    return candidates.find(p=>!reserved.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<.85)&&path(from,p).length)||null;
  }
  return Object.freeze({width,height,viewBox,corridorWidth,rooms,facilities,roster,anchors,roomAt,edge,path,destination,point,furniture:Object.freeze(furniture),radius,collides,canMove,canWalk,depth,projectedBounds,drawOrder,meetingTarget,renderTop});
});

