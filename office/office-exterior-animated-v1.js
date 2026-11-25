/* Original exterior rotation/dynamic renderer. Pure SVG, no IO or clocks. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./office-exterior-v1.js'),require('./office-exterior-motion-v1.js'));else root.AtlasOfficeExteriorAnimatedV1=factory(root.AtlasOfficeExteriorV1,root.AtlasOfficeExteriorMotionV1);})(typeof window==='undefined'?this:window,function(base,motion){
  'use strict';
  const models=base.models;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function rotated(c,x,y,z=0){
    const cx=c.x+c.w/2,cy=c.y+c.h/2,a=c.angle||0,ca=Math.cos(a),sa=Math.sin(a);
    return [cx+(x-cx)*ca-(y-cy)*sa,cy+(x-cx)*sa+(y-cy)*ca,z];
  }
  function geometry(c){
    const point=(x,y,z=0)=>base.point(...rotated(c,x,y,z));
    const poly=(pts,fill,stroke='#718c9c55')=>`<polygon points="${pts.map(p=>point(...p).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
    const tile=(x,y,w,h,z,fill,stroke)=>poly([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],fill,stroke);
    const box=(x,y,w,h,top,fill,side,low=0)=>{
      let out=tile(x,y,w,h,top,fill);
      const a=c.angle||0;
      if(Math.cos(a)+Math.sin(a)>0)out+=poly([[x+w,y,top],[x+w,y+h,top],[x+w,y+h,low],[x+w,y,low]],side);
      else out+=poly([[x,y,top],[x,y+h,top],[x,y+h,low],[x,y,low]],side);
      if(Math.cos(a)-Math.sin(a)>0)out+=poly([[x,y+h,top],[x+w,y+h,top],[x+w,y+h,low],[x,y+h,low]],side);
      else out+=poly([[x,y,top],[x+w,y,top],[x+w,y,low],[x,y,low]],side);
      return out;
    };
    return {point,poly,tile,box};
  }
  function vehicle(c,lang='es'){
    const {point,poly,tile,box}=geometry(c);
    const m=models.find(m=>m.id===c.model);if(!m)throw Error('Unknown exterior model');
    const {x,y,w,h}=c;
    let out=tile(x,y,w,h,2,'#0008');
    // All wheels, lamps, mirrors and spoiler stay inside the advertised footprint.
    for(const dy of [.7,3.55])for(const dx of [0,w-.14])out+=box(x+dx,y+dy,.14,.48,12,'#222b37','#070e17',2);
    const outline=[[x+.36,y+.12,19],[x+w-.36,y+.12,19],[x+w-.14,y+.4,19],[x+w-.14,y+h-.4,19],[x+w-.36,y+h-.12,19],[x+.36,y+h-.12,19],[x+.14,y+h-.4,19],[x+.14,y+.4,19]];
    out+=poly(outline,m.color);
    if(Math.cos(c.angle||0)+Math.sin(c.angle||0)>0)out+=poly([[x+w-.14,y+.4,19],[x+w-.14,y+h-.4,19],[x+w-.14,y+h-.4,6],[x+w-.14,y+.4,6]],m.side);
    if(Math.cos(c.angle||0)-Math.sin(c.angle||0)>0)out+=poly([[x+.36,y+h-.12,19],[x+w-.36,y+h-.12,19],[x+w-.36,y+h-.12,6],[x+.36,y+h-.12,6]],m.side);
    if(Math.sin(c.angle||0)-Math.cos(c.angle||0)>0)out+=poly([[x+.36,y+.12,19],[x+w-.36,y+.12,19],[x+w-.36,y+.12,6],[x+.36,y+.12,6]],m.side);
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

  function car(sample){
    return {id:'exterior-visitor-car',model:'electric',stall:'P06',x:sample.car.cx-motion.carWidth/2,y:sample.car.cy-motion.carLength/2,w:motion.carWidth,h:motion.carLength,angle:sample.car.angle,top:35.01};
  }
  function visitor(sample,lang){
    if(!sample.visitor)return '';
    const p=base.point(sample.visitor.x,sample.visitor.y,2),walk=!['complete','enter'].includes(sample.phase),stride=walk?Math.sin(sample.time*8)*2:0;
    return `<g data-exterior-visitor="scripted" data-x="${sample.visitor.x}" data-y="${sample.visitor.y}" transform="translate(${p[0]} ${p[1]})" role="img" aria-label="${lang==='es'?'Visitante · guion':'Visitor · scripted'}"><ellipse rx="8" ry="4" fill="#08142299"/><ellipse rx="10" ry="5" fill="none" stroke="#dec17b"/><rect x="-5" y="${-10+stride}" width="4" height="${10-stride}" fill="#19263c"/><rect x="2" y="${-10-stride}" width="4" height="${10+stride}" fill="#19263c"/><rect x="-8" y="-24" width="16" height="16" rx="3" fill="#bd9a6d"/><rect x="-2" y="-24" width="4" height="12" fill="#dce9dc"/><rect x="-5" y="-36" width="11" height="12" rx="3" fill="#dcb188"/><path d="M-5 -33v-5q6 -6 11 0v4" fill="#354451"/><rect x="-10" y="-22" width="3" height="12" rx="1" fill="#dcb188"/><rect x="7" y="-22" width="3" height="12" rx="1" fill="#dcb188"/><rect x="8" y="-11" width="9" height="7" rx="1" fill="#445566"/><path d="M10 -11v-2h5v2" fill="none" stroke="#a9b5b8"/></g>`;
  }
  function frame(sample,lang='es'){
    lang=lang==='en'?'en':'es';
    const cars=[...base.cars,car(sample)].map(c=>({depth:c.x+c.w/2+c.y+c.h/2,svg:vehicle(c,lang)}));
    if(sample.visitor)cars.push({depth:sample.visitor.x+sample.visitor.y,svg:visitor(sample,lang)});
    const p=base.point(24,0,72);
    return `<g class="ao-exterior-depth">${cars.sort((a,b)=>a.depth-b.depth).map(n=>n.svg).join('')}</g><circle data-exterior-entry-led="scripted" cx="${p[0]}" cy="${p[1]}" r="2.5" fill="${sample.door?'#b0f2b6':'#73a5b6'}"/>`;
  }
  return Object.freeze({rotated,geometry,vehicle,car,visitor,frame});
});


