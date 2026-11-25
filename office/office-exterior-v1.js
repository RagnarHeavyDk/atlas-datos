/* Original vector scenery. No brands, traffic sensors, assets or financial data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasOfficeExteriorV1=api;})(typeof window==='undefined'?this:window,function(){
  'use strict';
  const width=28,height=19,viewBox=Object.freeze([0,0,1200,740]);
  const point=(x,y,z=0)=>[height*24+36+(x-y)*24,128+(x+y)*12-z];
  const stalls=Object.freeze(Array.from({length:6},(_,i)=>Object.freeze({id:'P'+String(i+1).padStart(2,'0'),x:1+i*4,y:2,w:3.6,h:6})));
  const models=Object.freeze([
    {id:'coupe',es:'Coupé deportivo',en:'Sports coupe',color:'#e0b559',side:'#866b35',roof:31,cabinY:1.5,cabinH:1.65,spoiler:true},
    {id:'tourer',es:'Gran turismo',en:'Grand tourer',color:'#a9becb',side:'#5b7186',roof:34,cabinY:1.35,cabinH:1.9},
    {id:'electric',es:'Berlina eléctrica',en:'Electric saloon',color:'#59c7bf',side:'#2b787d',roof:35,cabinY:1.1,cabinH:2.3},
    {id:'utility',es:'SUV de lujo',en:'Luxury SUV',color:'#9e85ca',side:'#58456e',roof:48,cabinY:1,cabinH:2.65},
    {id:'roadster',es:'Roadster',en:'Roadster',color:'#d57592',side:'#884259',roof:28,cabinY:1.55,cabinH:1.45,open:true}
  ].map(Object.freeze));
  const cars=Object.freeze(models.map((m,i)=>Object.freeze({id:'exterior-'+m.id,model:m.id,stall:stalls[i].id,x:stalls[i].x+.65,y:2.7,w:2.3,h:4.6,top:m.open?m.roof+1:m.roof+.01})));
  const zones=Object.freeze({lane:Object.freeze({x:0,y:8.6,w:26,h:6}),walk:Object.freeze({x:26,y:0,w:2,h:19}),forecourt:Object.freeze({x:0,y:15,w:26,h:4})});
  const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const contains=(a,b)=>b.x>=a.x&&b.y>=a.y&&b.x+b.w<=a.x+a.w&&b.y+b.h<=a.y+a.h;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const poly=(pts,fill,stroke='#718c9c55')=>`<polygon points="${pts.map(p=>point(...p).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
  const tile=(x,y,w,h,z,fill,stroke)=>poly([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],fill,stroke);
  const box=(x,y,w,h,top,fill,side,base=0)=>tile(x,y,w,h,top,fill)+poly([[x+w,y,top],[x+w,y+h,top],[x+w,y+h,base],[x+w,y,base]],side)+poly([[x,y+h,top],[x+w,y+h,top],[x+w,y+h,base],[x,y+h,base]],side);
  const text=(x,y,z,label,size=12,fill='#c4dce4')=>{const p=point(x,y,z);return `<text x="${p[0]}" y="${p[1]}" fill="${fill}" font-size="${size}" text-anchor="middle" font-family="monospace">${esc(label)}</text>`;};
  function vehicle(c,lang='es'){
    const m=models.find(m=>m.id===c.model);if(!m)throw Error('Unknown exterior model');
    const {x,y,w,h}=c;
    let out=tile(x,y,w,h,2,'#0008');
    // All wheels, lamps, mirrors and spoiler stay inside the advertised footprint.
    for(const dy of [.7,3.55])for(const dx of [0,w-.14])out+=box(x+dx,y+dy,.14,.48,12,'#222b37','#070e17',2);
    const outline=[[x+.36,y+.12,19],[x+w-.36,y+.12,19],[x+w-.14,y+.4,19],[x+w-.14,y+h-.4,19],[x+w-.36,y+h-.12,19],[x+.36,y+h-.12,19],[x+.14,y+h-.4,19],[x+.14,y+.4,19]];
    out+=poly(outline,m.color);
    out+=poly([[x+w-.14,y+.4,19],[x+w-.14,y+h-.4,19],[x+w-.14,y+h-.4,6],[x+w-.14,y+.4,6]],m.side);
    out+=poly([[x+.36,y+h-.12,19],[x+w-.36,y+h-.12,19],[x+w-.36,y+h-.12,6],[x+.36,y+h-.12,6]],m.side);
    out+=tile(x+.22,y+.3,w-.44,.85,20,m.color);
    const cy=y+m.cabinY,cw=w-.56;
    out+=box(x+.28,cy,cw,m.cabinH,m.roof,m.open?'#172a3a':m.color,m.side,19);
    out+=poly([[x+.3,cy,20],[x+w-.3,cy,20],[x+w-.3,cy+.26,m.roof-1],[x+.3,cy+.26,m.roof-1]],'#224251','#88c4d799');
    if(!m.open)out+=tile(x+.4,cy+.36,w-.8,m.cabinH-.6,m.roof+.01,'#193546','#87c1cc77');
    else{out+=box(x+.4,cy+.5,.55,.65,m.roof+1,'#c3a47c','#756855',m.roof);out+=box(x+w-.95,cy+.5,.55,.65,m.roof+1,'#c3a47c','#756855',m.roof);}
    out+=poly([[x+w-.27,cy+.34,m.roof-1],[x+w-.27,cy+m.cabinH-.13,m.roof-1],[x+w-.27,cy+m.cabinH-.13,21],[x+w-.27,cy+.1,21]],'#17394a','#8ebdcb');
    out+=tile(x+.25,y+.12,.52,.19,20,'#eef7b0')+tile(x+w-.77,y+.12,.52,.19,20,'#eef7b0');
    out+=tile(x+.25,y+h-.32,.55,.17,20,'#ec6b8b')+tile(x+w-.8,y+h-.32,.55,.17,20,'#ec6b8b');
    out+=tile(x+w/2-.35,y+h-.28,.7,.12,20,'#e1e5d7');
    if(m.spoiler)out+=box(x+.17,y+h-.48,w-.34,.18,26,'#293b4e','#0e1e2e',22);
    for(const dy of [.95,3.65]){const q=point(x+w-.36,y+dy,8);out+=`<ellipse cx="${q[0]}" cy="${q[1]}" rx="6" ry="8" fill="#08101a" stroke="#273d50" stroke-width="2"/><ellipse cx="${q[0]}" cy="${q[1]}" rx="3" ry="4.5" fill="#aabac3"/><path d="M${q[0]-3} ${q[1]} h6 M${q[0]} ${q[1]-4} v8" stroke="#445768"/>`;}
    out+=poly([[x+.17,y+.3,20],[x+.17,y+h-.6,20]],'none','#fff5');
    return `<g data-exterior-car="${c.id}" data-exterior-model="${m.id}" data-stall="${c.stall}" data-x="${x}" data-y="${y}" data-width="${w}" data-height="${h}" role="img" aria-label="${esc(m[lang]+' · '+c.stall)}"><title>${esc(m[lang])} · ${c.stall}</title>${out}</g>`;
  }
  function scene(lang='es',options={}){
    lang=lang==='en'?'en':'es';
    let out=box(0,0,width,height,0,'#182d40','#081727',-7);
    out+=tile(0,0,26,1.6,1,'#3e5869')+tile(26,0,2,19,1,'#466172');
    for(let x=0;x<26;x+=2)out+=tile(x,15,1.96,3.96,1,'#253d4d');
    out+=tile(0,8.6,26,6,1,'#101f30');
    for(let x=1;x<25;x+=3)out+=tile(x,11.5,1.5,.07,2,'#d4ba7977');
    out+=poly([[4,12.7,2],[5,12.7,2],[5,12.4,2],[5.7,12.9,2],[5,13.4,2],[5,13.1,2],[4,13.1,2]],'#68cbbb88');
    // Rear facade before vehicles: never a floating divider in the floor.
    out+=box(0,-.35,28,.35,87,'#284255','#13283b',1);
    for(let x=1;x<22;x+=3)out+=poly([[x,0,18],[x+2.3,0,18],[x+2.3,0,72],[x,0,72]],'#285366','#6f9ca777');
    out+=poly([[23,0,1],[25,0,1],[25,0,68],[23,0,68]],'#153548','#67d9d1');
    out+=poly([[24,0,1],[24,0,68]],'none','#85d9d8');
    out+=text(24,0,77,lang==='es'?'ENTRADA':'ENTRY',11,'#91e7d3');
    out+=text(8,0,89,'ATLAS // CAMPUS',18,'#b7f5e9');
    for(const s of stalls){out+=tile(s.x,s.y,s.w,s.h,1,'#233747');out+=tile(s.x,s.y,.05,s.h,2,'#9cabb9')+tile(s.x+s.w-.05,s.y,.05,s.h,2,'#9cabb9');out+=text(s.x+s.w/2,7.85,3,s.id,10,'#b6cbd4');}
    out+=tile(21.15,2.15,3.3,5.6,2,'#264952')+text(22.8,5.2,3,'EV',17,'#76dacc');
    // Crossing is at the lane end, physically away from the parked vehicles.
    for(let y=9;y<14;y+=.65)out+=tile(25.1,y,2.7,.32,2,'#c2d1cc');
    for(const x of [10.7,22.7]){out+=box(x,1.65,.34,.26,32,'#6a9eac','#325d70',1);out+=poly([[x+.08,1.92,13],[x+.27,1.92,13],[x+.27,1.92,27],[x+.08,1.92,27]],'#79dfc5');}
    out+=box(.6,16,.9,.9,23,'#75858a','#394e5e',1)+box(24,16,.9,.9,23,'#75858a','#394e5e',1);
    for(const x of [1,24.4]){const p=point(x,16.4,43);out+=`<path d="M${p[0]} ${p[1]+21} v-22" stroke="#619886" stroke-width="3"/><ellipse cx="${p[0]}" cy="${p[1]-2}" rx="14" ry="17" fill="#527e69" stroke="#80ad85"/>`;}
    for(const x of [5,19]){out+=box(x,17,2.3,.65,13,'#8d8267','#455066',1);out+=box(x,17,2.3,.12,28,'#756e5c','#3f4b59',13);}
    // Access barrier is drawn at the road boundary, not across parking bays.
    out+=box(.3,9,.28,.3,28,'#c6ae77','#675741',1)+box(.3,9,2.3,.12,28,'#e2cf8f','#a88157',25);
    out+=text(12,18,3,lang==='es'?'EXTERIOR · ESCENOGRAFÍA':'EXTERIOR · SCENERY',13,'#91abb8');
    if(!options.omitCars)out+=cars.slice().sort((a,b)=>(a.x+a.y)-(b.x+b.y)).map(c=>vehicle(c,lang)).join('');
    return out;
  }
  return Object.freeze({width,height,viewBox,point,stalls,models,cars,zones,intersects,contains,vehicle,scene});
});

