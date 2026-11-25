/* Eight illustrated vehicles, static presentation; no vehicle/wheel animation. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AtlasOfficeParkingIntegratedV8=factory();})(typeof window==='undefined'?this:window,function(){
 'use strict';
 const definitions=Object.freeze([
  ['porsche','Porsche · coupé ilustrado','Porsche · illustrated coupe',6.2,2.65],
  ['huracan','Lamborghini · deportivo ilustrado','Lamborghini · illustrated sports car',6.3,2.8],
  ['bmw','BMW · coupé ilustrado','BMW · illustrated coupe',6.7,2.8],
  ['mercedes','Mercedes · gran turismo ilustrado','Mercedes · illustrated grand tourer',6.8,2.8],
  ['rolls','Rolls-Royce · berlina ilustrada','Rolls-Royce · illustrated saloon',7.5,3],
  ['aventador','Lamborghini · superdeportivo ilustrado','Lamborghini · illustrated supercar',6.9,2.9],
  ['f40','Ferrari F40 · deportivo ilustrado','Ferrari F40 · illustrated sports car',6.3,2.8],
  ['gclass','Mercedes Clase G · todoterreno ilustrado','Mercedes G-Class · illustrated SUV',6.5,3]
 ].map(Object.freeze));
 function create(world){
  if(world.width!==39||world.height!==47)throw Error('parking_v8_requires_widened_floor');
  const pad=Object.freeze({x:world.width,y:0,w:13,h:world.height,z:9});
  const walk=Object.freeze({x:39,y:0,w:3.35,h:47});
  const pedestrianLane=Object.freeze({x:39,y:0,w:2,h:47});
  const port=Object.freeze({inside:{x:38.5,y:18.5},outside:{x:40.5,y:18.5},width:2});
  const bays=Object.freeze([...Array.from({length:6},(_,i)=>Object.freeze({id:'C'+(i+1),x:43,y:7+i*5.6,w:8.8,h:5})),Object.freeze({id:'C7',x:43,y:1.4,w:8.8,h:5}),Object.freeze({id:'C8',x:43,y:40.6,w:8.8,h:5})]);
  const cars=Object.freeze(definitions.map(([id,es,en,length,breadth],i)=>{const w=length*.74,h=breadth*.74,b=bays[i];return Object.freeze({id,es,en,x:b.x+(b.w-w)/2,y:b.y+(b.h-h)/2,w,h,base:10,top:id==='gclass'?66:52,asset:i<6?'parking-'+id+'-toon-v6.svg?v=1':'parking-'+id+'-toon-v8.png.png?v=1',bay:b.id});}));

  const props=Object.freeze([
   ...[5,23.4,42].map((y,i)=>Object.freeze({id:'lamp-'+(i+1),kind:'lamp',x:41,y,w:1.3,h:.32,base:9,top:84,solid:true})),
   ...bays.map((b,i)=>Object.freeze({id:'stop-'+(i+1),kind:'stop',x:b.x+.15,y:b.y+1,w:.32,h:3,base:9,top:13,solid:true})),
   Object.freeze({id:'curb-north',kind:'curb',x:42.35,y:0,w:.15,h:17.5,base:9,top:12,solid:true}),
   Object.freeze({id:'curb-south',kind:'curb',x:42.35,y:19.5,w:.15,h:27.5,base:9,top:12,solid:true})
  ]);
  const corners=f=>[[f.x,f.y],[f.x+f.w,f.y],[f.x+f.w,f.y+f.h],[f.x,f.y+f.h]];
  const contains=(a,b)=>b.x>=a.x&&b.y>=a.y&&b.x+b.w<=a.x+a.w&&b.y+b.h<=a.y+a.h;
  const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const paint=car=>{const g=corners(car).map(p=>world.point(...p,10)),w=(car.w+car.h)*22+20,h=w*2/3;return {x:Math.min(...g.map(p=>p[0]))-10,y:Math.max(...g.map(p=>p[1]))-h+14,w,h};};
  const viewBox=Object.freeze([0,0,world.point(52,0)[0]+72,world.point(52,47)[1]+80]);
  const g=corners(pad).map(p=>world.point(...p,9));
  const parkingCamera=Object.freeze([Math.min(...g.map(p=>p[0]))-30,Math.min(...g.map(p=>p[1]))-40,Math.max(...g.map(p=>p[0]))-Math.min(...g.map(p=>p[0]))+60,Math.max(...g.map(p=>p[1]))-Math.min(...g.map(p=>p[1]))+80]);
  const tile=(r,z,fill,stroke='#718b9b66')=>`<polygon points="${corners(r).map(p=>world.point(...p,z).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}"/>`;

  const poly=(pts,fill,stroke='#7c96a480')=>'<polygon points="'+pts.map(p=>world.point(...p).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'"/>';
  const box=(x,y,w,h,base,top,c)=>poly([[x,y,top],[x+w,y,top],[x+w,y+h,top],[x,y+h,top]],c)+poly([[x+w,y,base],[x+w,y+h,base],[x+w,y+h,top],[x+w,y,top]],'#314955')+poly([[x,y+h,base],[x+w,y+h,base],[x+w,y+h,top],[x,y+h,top]],'#405967');
  function structures(){
   return props.map(f=>{let art='';
    if(f.kind==='lamp'){art+=box(f.x+f.w-.25,f.y+.04,.18,.22,9,80,'#536d7b');art+=box(f.x,f.y,f.w,f.h,78,84,'#718995');art+=tile({x:f.x+.08,y:f.y+.04,w:.9,h:.24},78,'#dcdbc0');}
    else art+=box(f.x,f.y,f.w,f.h,f.base,f.top,f.kind==='stop'?'#a6a990':'#647f8b');
    return '<g class="ao-parking-prop" data-parking-prop="'+f.id+'" data-kind="'+f.kind+'" data-x="'+f.x+'" data-y="'+f.y+'" data-width="'+f.w+'" data-height="'+f.h+'" data-top="'+f.top+'" data-solid="true" aria-hidden="true">'+art+'</g>';
   }).join('');
  }
  function floor(lang){
   let out=`<defs><filter id="ao-parking-contact" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="2"/></filter></defs><g class="ao-parking-ground" data-parking-width="${pad.w}" data-office-width="${world.width}" aria-hidden="true">${tile(pad,8,'#203447')}${tile(pad,9,'#293e4e')}${tile(walk,10.5,'#526b76')}`;
   for(let x=43;x<52;x+=2)for(let y=1;y<47;y+=2)out+=tile({x,y,w:1.95,h:1.95},9.15,(x+y)%4?'#2b4251':'#293e4e','#86aeb516');
   for(let x=39.2;x<42.3;x+=.6)for(let y=.2;y<47;y+=1.2)out+=tile({x,y,w:.56,h:1.16},10.65,'#59747e','#8da3ac20');
   for(const f of props.filter(f=>f.kind==='lamp')){const p=world.point(f.x+.4,f.y+.2,10);out+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="48" ry="23" fill="#e5dfb1" opacity=".055"/>';}
   for(const b of bays){out+=tile(b,9.3,'#2a414e','#7894a333');const points=[[b.x+b.w,b.y],[b.x,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]].map(p=>world.point(...p,10));
    out+='<polyline class="ao-parking-mark" points="'+points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#d4d6bcb5" stroke-width="2"/>';
    const p=world.point(b.x+.4,b.y+.65,11);out+='<text x="'+p[0]+'" y="'+p[1]+'" fill="#b7c7c6" font-size="10" font-family="monospace">'+b.id+'</text>';
   }
   for(let y=17.55;y<19.5;y+=.42)out+=tile({x:41.8,y,w:1.2,h:.22},12,'#d5d8c0aa');
   out+=tile({x:38,y:17.5,w:4.5,h:2},10,'#70a3a188');
   const p=world.point(43.2,.3,14);out+=`<text x="${p[0]}" y="${p[1]}" fill="#8fe2d8" font-size="15" font-family="monospace">${lang==='en'?'PARKING // 8 BAYS':'PARKING // 8 PLAZAS'}</text></g>`;return out;
  }
  function vehicle(lang){return cars.map(car=>{const r=paint(car),label=(lang==='en'?car.en:car.es)+(lang==='en'?' · scenery, no manufacturer association':' · escenografía, sin vinculación con el fabricante');const c=world.point(car.x+car.w/2,car.y+car.h/2,9.15);return `<g class="ao-parking-car" data-parking-car="${car.id}" data-bay="${car.bay}" data-x="${car.x}" data-y="${car.y}" data-width="${car.w}" data-height="${car.h}" data-top="${car.top}" role="button" tabindex="0" aria-label="${label}"><title>${label}</title><ellipse class="ao-car-contact-shadow" cx="0" cy="0" rx="${car.w*12.4}" ry="${car.h*9.8}" transform="translate(${c[0]} ${c[1]}) rotate(26.565)" fill="#07131c" opacity=".28" filter="url(#ao-parking-contact)" pointer-events="none"/><image class="ao-parking-body" href="${car.asset}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/></g>`;}).join('');}
  return Object.freeze({pad,walk,port,bays,cars,viewBox,parkingCamera,corners,contains,intersects,paint,floor,vehicle,props,structures,pedestrianLane});
 }
 return Object.freeze({create,definitions});
});

