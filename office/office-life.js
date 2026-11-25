/* Presentation only. No data collection, trades, agent messages or learning. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AtlasOfficeLife=factory();})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const sectors=[
    ['committee','COMITÉ','BOARD','Mandato y supervisión','Mandate & oversight','#efcc79','◇'],
    ['direction','DIRECCIÓN','EXECUTIVE','Coordinación del fondo','Fund coordination','#c7a1ff','◆'],
    ['risk','RIESGO','RISK','Control independiente','Independent control','#f18fb5','△'],
    ['operations','OPERACIONES','OPERATIONS','Procesos y coordinación','Processes & coordination','#7cdbe3','▤'],
    ['data','DATOS','DATA','Fuentes y calidad','Sources & quality','#68e4d4','◈'],
    ['technical','ANÁLISIS','ANALYSIS','Precio y estructura','Price & structure','#80bdf5','⌁'],
    ['macro','MACRO','MACRO','Contexto de mercado','Market context','#e9ba82','◎'],
    ['memory','QUANT','QUANT','Memoria y validación','Memory & validation','#c9dd73','∑'],
    ['portfolio','CARTERA','PORTFOLIO','Asignación simulada','Simulated allocation','#a9b5ff','▥'],
    ['execution','EJECUCIÓN','EXECUTION','Mesa de simulación','Simulation desk','#79d4eb','⇄'],
    ['compliance','CUMPLIMIENTO','COMPLIANCE','Políticas y límites','Policies & limits','#d6a4ef','⊡'],
    ['audit','AUDITORÍA','AUDIT','Evidencia y trazabilidad','Evidence & traceability','#70d9c6','✓'],
    ['investors','INVERSORES','INVESTORS','Informes y comunicación','Reporting & communication','#e9c994','◉'],
    ['finance','FINANZAS','FINANCE','Valoración y contabilidad','Valuation & accounting','#97ceb5','▦'],
    ['technology','TECNOLOGÍA','TECHNOLOGY','Infraestructura local','Local infrastructure','#82bbff','⌘'],
    ['support','SERVICIOS','SERVICES','Personas y administración','People & administration','#efac95','☕'],
    ['cafe','CAFETERÍA','CAFETERIA','Cocina · café · agua','Kitchen · coffee · water','#f1c186','☕'],
    ['lounge','DESCANSO','LOUNGE','Sofás · biblioteca · pausa','Sofas · library · break','#c5a7ec','◒'],
    ['bathrooms','BAÑOS','RESTROOMS','Cabinas · lavabos · taquillas','Stalls · basins · lockers','#8bd7e0','◫'],
    ['huddle','REUNIÓN','HUDDLE','Mesa común y pizarra','Shared table & whiteboard','#a8b5ff','▱']
  ].map(([id,es,en,detailEs,detailEn,color,icon],i)=>({id,number:String(i+1).padStart(2,'0'),name:{es,en},detail:{es:detailEs,en:detailEn},color,icon}));
  // Scripted, mundane exchanges. Never imply a trade, finding or completed task.
  const exchanges=[
    {es:['¿Un café antes de seguir?','Sí, y luego volvemos a la mesa.'],en:['Coffee before we continue?','Yes, then back to our desks.']},
    {es:['¿Nos vemos en la sala?','Claro. Te acompaño.'],en:['Meet in the meeting room?','Sure. I will join you.']},
    {es:['He dejado el cuaderno aquí.','Lo tienes junto a la pantalla.'],en:['I left my notebook here.','It is beside your screen.']},
    {es:['Una pausa para estirar.','Buena idea. Vamos al pasillo.'],en:['Time for a stretch break.','Good idea. Into the corridor.']},
    {es:['¿Se lee bien esta pantalla?','Mejor con un poco más de zoom.'],en:['Can you read this screen?','Better with a little more zoom.']},
    {es:['Vamos por partes, sin prisas.','Primero los datos, después las ideas.'],en:['One step at a time.','Data first, ideas afterwards.']},
    {es:['¿Dónde está la sala de descanso?','En el ala de servicios, sector dieciocho.'],en:['Where is the lounge?','In the amenities wing, sector eighteen.']},
    {es:['Voy a por agua a la cocina.','Nos vemos después en la sala.'],en:['Getting water from the kitchen.','See you in the meeting room afterwards.']},
    {es:['¿Dejamos libre este pasillo?','Sí, la entrada está al fondo.'],en:['Shall we keep this corridor clear?','Yes, the entrance is at the end.']},
    {es:['¿Compartimos mesa un momento?','Adelante, hay sitio.'],en:['Share a desk for a moment?','Go ahead, there is room.']}
  ];
  const solo={es:['Primero los datos.','Hora de estirar un poco.','¿Dónde dejé el café?','Vamos paso a paso.'],en:['Data first.','Time for a little stretch.','Where did I leave my coffee?','One step at a time.']};
  const roomSolo={
    cafe:{es:['Un vaso de agua y vuelvo.','Dejo la taza en la bandeja.'],en:['A glass of water, then back.','Leaving my cup on the tray.']},
    lounge:{es:['Descanso la vista un momento.','Unas páginas antes de volver.'],en:['Resting my eyes for a moment.','A few pages before heading back.']},
    bathrooms:{es:['Ahora vuelvo.','Dejo libre la entrada.'],en:['Back in a moment.','Keeping the entrance clear.']},
    huddle:{es:['Dejo el cuaderno junto a la mesa.','Hay sitio para reunirnos.'],en:['Leaving my notebook by the table.','There is room for a meeting.']},
    corridor:{es:['Mantengamos libre el paso.','Voy por el pasillo de la derecha.'],en:['Let us keep the way clear.','Taking the right-hand corridor.']}
  };
  function soloExchange(room,turn,language){const rows=(roomSolo[room]||solo)[language];return rows[Math.abs(turn)%rows.length];}
  const amenityExchanges={
    cafe:{es:['¿Café o un vaso de agua?','Agua, gracias. Luego vuelvo a mi mesa.'],en:['Coffee or a glass of water?','Water, thanks. Back to my desk afterwards.']},
    lounge:{es:['Voy a descansar la vista un momento.','Buena idea. Aquí se está tranquilo.'],en:['Resting my eyes for a moment.','Good idea. It is quiet here.']},
    bathrooms:{es:['Dejo libre la entrada.','Gracias, paso un momento.'],en:['Keeping the entrance clear.','Thanks, just passing through.']},
    huddle:{es:['¿Nos juntamos aquí un momento?','Sí. Dejamos el pasillo libre.'],en:['Shall we gather here for a moment?','Yes. Keep the corridor clear.']}
  };
  function exchange(room,turn,language){return (amenityExchanges[room]||exchanges[Math.abs(turn)%exchanges.length])[language];}
  function wrap(text,width=29,maxLines=3){
    const words=String(text??'').replace(/\s+/g,' ').trim().match(new RegExp('.{1,'+width+'}(?:\\s|$)|\\S{1,'+width+'}','g'))||[];
    const lines=words.map(x=>x.trim()).filter(Boolean).slice(0,maxLines);
    if(words.length>maxLines)lines[maxLines-1]=lines[maxLines-1].slice(0,width-1)+'…';
    return lines;
  }
  function zone(position,rooms){return rooms.find(r=>position.x>=r.x&&position.x<r.x+r.w&&position.y>=r.y&&position.y<r.y+r.h)?.id||'corridor';}
  function nearby(a,b,rooms){return Math.hypot(a.x-b.x,a.y-b.y)<=2.8&&zone(a,rooms)===zone(b,rooms);}
  const rest=turn=>4000+((Math.abs(turn)*1379)%5000);
  // Deterministic visual variety, unrelated to a worker's real task or capability.
  function appearance(index){
    const i=Math.abs(Math.trunc(index));
    return {hair:['#28313c','#533c35','#b39b63','#8d6966','#182b38','#c3bca5'][i%6],style:i%5,glasses:i%5===0,beard:i%9===4,pace:.87+(i%7)*.045,delay:-(i%11)*.43};
  }
  function pose(person,position,walking,chatting,turn,rooms=[]){
    if(chatting)return 'chat';if(walking)return 'walk';
    const desk=Math.hypot(position.x-person.seat.x,position.y-person.seat.y)<.12;
    // Task-linked roles retain a neutral pose: do not stage fake task activity.
    if(person.kind==='task'||person.kind==='specialist')return 'idle';
    if(desk)return Math.abs(turn)%5===0?'read':'desk';
    const facility=rooms.find(r=>r.facility&&zone(position,[r])===r.id);
    if(facility){if(facility.id==='cafe')return 'coffee';if(facility.id==='lounge')return Math.abs(turn)%2?'read':'stretch';if(facility.id==='bathrooms')return 'idle';return 'read';}
    if(!rooms.length&&position.y>=29){if(position.x<7)return 'coffee';if(position.x<14)return Math.abs(turn)%2?'read':'stretch';if(position.x<21)return 'idle';return 'read';}
    return ['idle','read','coffee','stretch'][Math.abs(turn)%4];
  }
  const poses={
    walk:{es:'Paseo · visual',en:'Walk · visual'},chat:{es:'Charla · visual',en:'Chat · visual'},
    desk:{es:'Teclado · visual',en:'Typing · visual'},read:{es:'Lectura · visual',en:'Reading · visual'},
    coffee:{es:'Café · visual',en:'Coffee · visual'},stretch:{es:'Estirar · visual',en:'Stretch · visual'},idle:{es:'Reposo · visual',en:'Rest · visual'}
  };
  function motion(distance,velocity,dt,multiplier=1,final=false){
    if(!Number.isFinite(distance)||distance<=0||!Number.isFinite(dt)||dt<=0)return {step:0,velocity:0};
    const frame=Math.min(.05,dt),top=2.3*Math.max(.5,Math.min(2.5,Number.isFinite(multiplier)?multiplier:1));
    const target=final?Math.min(top,Math.sqrt(2*5*distance)):top;
    const previous=Number.isFinite(velocity)?Math.max(0,velocity):0;
    const next=previous+Math.max(-7*frame,Math.min(7*frame,target-previous));
    return {step:Math.min(distance,next*frame),velocity:next};
  }
  function overlaps(a,b,gap=8){return a.x<b.x+b.width+gap&&a.x+a.width+gap>b.x&&a.y<b.y+b.height+gap&&a.y+a.height+gap>b.y;}
  // Camera only: no change to the room geometry or walkable graph.
  function roomFrame(room,project,fullFrame=[0,0,1690,930]){
    if(!room)return fullFrame.slice();
    const points=[];
    for(const x of [room.x,room.x+room.w])for(const y of [room.y,room.y+room.h])for(const z of [0,105])points.push(project(x,y,z));
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),ratio=fullFrame[2]/fullFrame[3];
    const width=Math.min(fullFrame[2],Math.max(560,Math.max(...xs)-Math.min(...xs)+130,(Math.max(...ys)-Math.min(...ys)+100)*ratio));
    const height=width/ratio,cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
    return [Math.max(0,Math.min(fullFrame[2]-width,cx-width/2)),Math.max(0,Math.min(fullFrame[3]-height,cy-height/2)),width,height];
  }
  function cameraStep(current,target,dt,snap=false){
    if(snap)return target.slice();
    const blend=1-Math.exp(-9*Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0)));
    return current.map((v,i)=>Math.abs(target[i]-v)<.03?target[i]:v+(target[i]-v)*blend);
  }
  function bubblePlacement(anchor,width,height,obstacles=[],side=-1,fullFrame=[0,0,1690,930]){
    const clamp=(x,y)=>({x:Math.max(12,Math.min(fullFrame[2]-width-12,x)),y:Math.max(12,Math.min(fullFrame[3]-height-12,y)),width,height});
    const start=side>0?anchor[0]+20:anchor[0]-width-14;
    const candidates=[clamp(start,anchor[1]-height-60),clamp(start,anchor[1]+25),clamp(side>0?anchor[0]-width-14:anchor[0]+20,anchor[1]-height-60),clamp(anchor[0]-width/2,anchor[1]+50),clamp(start,anchor[1]-height-155)];
    return candidates.reduce((best,c)=>obstacles.filter(b=>overlaps(c,b)).length<obstacles.filter(b=>overlaps(best,b)).length?c:best,candidates[0]);
  }
  return {sectors,exchanges,exchange,solo,soloExchange,roomSolo,wrap,zone,nearby,rest,appearance,pose,poses,motion,overlaps,bubblePlacement,roomFrame,cameraStep};
});

