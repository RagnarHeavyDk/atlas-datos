/* Original SVG workstation designs. Decorative, not real charts or IA work. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AtlasOfficeRoomDesignV1=factory();})(typeof globalThis==='undefined'?this:globalThis,()=>{
 'use strict';
 const definitions={
  executive:{surface:'#9c8273',side:'#544858',mat:'#283346',monitors:1,display:'brief',es:'Dirección y mandato',en:'Leadership and mandate'},
  analysis:{surface:'#93adb9',side:'#405c73',mat:'#152c42',monitors:2,display:'trace',es:'Análisis y estructura',en:'Analysis and structure'},
  risk:{surface:'#9f92a9',side:'#52475f',mat:'#29213a',monitors:2,display:'limits',es:'Riesgo y controles',en:'Risk and controls'},
  macro:{surface:'#b2a48c',side:'#655743',mat:'#2c3037',monitors:2,display:'calendar',es:'Calendario y contexto',en:'Calendar and context'},
  quant:{surface:'#a3b49d',side:'#475a51',mat:'#17302d',monitors:2,display:'matrix',es:'Investigación cuantitativa',en:'Quantitative research'},
  execution:{surface:'#86a7b4',side:'#354f65',mat:'#152b3c',monitors:2,display:'levels',es:'Mesa de simulación',en:'Simulation desk'},
  finance:{surface:'#a2b4a7',side:'#4d635b',mat:'#23392f',monitors:1,display:'ledger',es:'Cartera y contabilidad',en:'Portfolio and accounting'},
  audit:{surface:'#96ada8',side:'#405958',mat:'#183536',monitors:1,display:'checklist',es:'Auditoría y trazabilidad',en:'Audit and traceability'},
  technology:{surface:'#879dae',side:'#394c64',mat:'#132639',monitors:2,display:'terminal',es:'Infraestructura',en:'Infrastructure'},
  support:{surface:'#b8a394',side:'#61504d',mat:'#333344',monitors:1,display:'brief',es:'Personas y servicios',en:'People and services'}
 };
 Object.values(definitions).forEach(Object.freeze);Object.freeze(definitions);
 const assignments=Object.freeze({committee:'executive',direction:'executive',operations:'executive',data:'analysis',technical:'analysis',risk:'risk',compliance:'risk',macro:'macro',memory:'quant',execution:'execution',portfolio:'finance',finance:'finance',audit:'audit',technology:'technology',investors:'support',support:'support'});
 const theme=room=>definitions[assignments[room]||'support'];
 function plan(room,w,h,z){
  if(![w,h,z].every(Number.isFinite)||w<1.5||h<.7||z<10)throw Error('workstation_geometry');
  const spec=theme(room),single=spec.monitors===1;
  const monitors=single?[{x:.23,y:.24,w:w-.6,bottom:8,top:27}]:[{x:.13,y:.24,w:(w-.6)/2,bottom:8,top:27},{x:w/2-.04,y:.24,w:(w-.6)/2,bottom:8,top:27}];
  const props=[{kind:'keyboard',x:.32,y:h-.28,w:.68,h:.15,top:1.5},{kind:'mouse',x:w-.48,y:h-.28,w:.11,h:.15,top:1.5},
   {kind:'notebook',x:w-.28,y:h-.31,w:.15,h:.19,top:2},{kind:'computer',x:w-.22,y:.13,w:.14,h:.25,top:10}];
  return {theme:assignments[room]||'support',spec,monitors,props,top:z+27,decorative:true,market_data:false};
 }
 function drawScreens(f,color,point){
  const p=plan(f.room,f.w,f.h,f.z);
  const polygon=(coords,fill,stroke='none')=>`<polygon points="${coords.map(c=>point(f.x+c[0],f.y+c[1],f.z+c[2]).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
  const result=p.monitors.map((m,index)=>{
   let out=polygon([[m.x,m.y,m.bottom],[m.x+m.w,m.y,m.bottom],[m.x+m.w,m.y,m.top],[m.x,m.y,m.top]],'#071521','#94b3c5');
   const stripe=(x,width,bottom,top,fill)=>polygon([[x,m.y-.006,bottom],[x+width,m.y-.006,bottom],[x+width,m.y-.006,top],[x,m.y-.006,top]],fill);
   const left=m.x+.06,inner=m.w-.12;
   out+=stripe(left,inner,23,25,color);
   if(p.spec.display==='trace'){
    const coords=[[0,13],[.2,16],[.4,14],[.6,19],[.8,17],[1,20]].map(([a,z])=>point(f.x+left+a*inner,f.y+m.y-.01,f.z+z));
    out+=`<path d="${coords.map((c,i)=>`${i?'L':'M'}${c.join(' ')}`).join(' ')}" fill="none" stroke="${index?'#b19aff':color}" stroke-width="1.3"/>`;
   }else if(['matrix','calendar','limits'].includes(p.spec.display)){
    for(let row=0;row<2;row++)for(let col=0;col<3;col++)out+=stripe(left+col*inner/3,inner/4,11+row*5,14+row*5,p.spec.display==='limits'&&col===2?'#e5be79':color+'88');
   }else{
    for(let row=0;row<3;row++)out+=stripe(left,inner*(row===1?.65:.88),10+row*4,12+row*4,index?'#8fafbd':color+'88');
   }
   return `<g class="ao-decorative-monitor" data-display="${p.spec.display}" data-market-data="false">${out}</g>`;
  }).join('');
  return `<g data-workstation-theme="${p.theme}" aria-hidden="true">${result}</g>`;
 }
 function chairPlan(room,w,h,z){
  if(![w,h,z].every(Number.isFinite)||w<.4||h<.4||z<10)throw Error('chair_geometry');
  const executive=assignments[room]==='executive',fabric=executive?'#947b6b':'#557994',side=executive?'#55453e':'#293f54';
  const part=(kind,x,y,pw,ph,base,top,fill,pside=side)=>({kind,x,y,w:pw,h:ph,base,top,fill,side:pside});
  return {theme:executive?'executive-leather':'ergonomic-fabric',top:z+16,parts:[
   part('wheel-base',.02,h/2-.035,w-.04,.07,0,4,'#344856','#213341'),
   part('wheel-base',w/2-.035,.02,.07,h-.04,0,4,'#344856','#213341'),
   part('pedestal',w/2-.045,h/2-.045,.09,.09,4,z-2,'#7c929f','#3e5263'),
   part('padded-seat',.02,.02,w-.04,h-.04,z-3,z,fabric),
   part('padded-back',.03,h-.105,w-.06,.085,z-1,z+16,fabric),
   part('armrest',.02,.1,.05,h-.14,z-1,z+5,'#80929d'),
   part('armrest',w-.07,.1,.05,h-.14,z-1,z+5,'#80929d')
  ]};
 }
 return Object.freeze({theme,plan,drawScreens,chairPlan,assignments,definitions});
});

