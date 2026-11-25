/* Pure, finite, scripted arrival rehearsal. Not loaded by the office yet (05B1).
   No roster mutations, live occupancy, clocks, records, inference or trades. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasOfficeExteriorMotionV1=api;})(typeof window==='undefined'?this:window,function(){
  'use strict';
  const carWidth=2.3,carLength=4.6,radius=.18,clearance=.04;
  const labels=Object.freeze({
    waiting:{es:'Espera · guion',en:'Waiting · scripted'},
    approach:{es:'Llegada · guion',en:'Arrival · scripted'},
    turn:{es:'Giro de acceso · guion',en:'Access turn · scripted'},
    park:{es:'Aparcando · guion',en:'Parking · scripted'},
    settle:{es:'Estacionado · guion',en:'Parked · scripted'},
    walkToPath:{es:'Hacia el paseo · guion',en:'To the walkway · scripted'},
    walkToEntry:{es:'Hacia la entrada · guion',en:'To the entrance · scripted'},
    approachEntry:{es:'Acceso al edificio · guion',en:'Building access · scripted'},
    enter:{es:'Entrada · guion',en:'Entry · scripted'},
    complete:{es:'Escena terminada · guion',en:'Scene finished · scripted'},
    blocked:{es:'Trayectoria bloqueada · visual',en:'Path blocked · visual'}
  });
  const smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
  const mix=(a,b,u)=>a+(b-a)*u;
  const rect=r=>[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];
  function corners(car){
    const ca=Math.cos(car.angle),sa=Math.sin(car.angle);
    return [[-carWidth/2,-carLength/2],[carWidth/2,-carLength/2],[carWidth/2,carLength/2],[-carWidth/2,carLength/2]].map(([x,y])=>({x:car.cx+x*ca-y*sa,y:car.cy+x*sa+y*ca}));
  }
  function overlap(a,b,gap=0){
    for(const p of [a,b])for(let i=0;i<p.length;i++){
      const next=p[(i+1)%p.length],dx=next.x-p[i].x,dy=next.y-p[i].y,length=Math.hypot(dx,dy);if(!length)continue;
      const ax=-dy/length,ay=dx/length,pa=a.map(v=>v.x*ax+v.y*ay),pb=b.map(v=>v.x*ax+v.y*ay);
      if(Math.max(...pa)+gap<=Math.min(...pb)||Math.max(...pb)+gap<=Math.min(...pa))return false;
    }
    return true;
  }
  function obstacles(exterior){
    return [...exterior.cars.map(c=>({...c})),
      {id:'charger-left',x:10.7,y:1.65,w:.34,h:.26},
      {id:'charger-ev',x:22.7,y:1.65,w:.34,h:.26},
      {id:'barrier-post',x:.3,y:9,w:.28,h:.3},
      {id:'barrier-arm',x:.3,y:9,w:2.3,h:.12},
      {id:'planter-left',x:.6,y:16,w:.9,h:.9},
      {id:'planter-right',x:24,y:16,w:.9,h:.9},
      {id:'bench-left',x:5,y:17,w:2.3,h:.65},
      {id:'bench-right',x:19,y:17,w:2.3,h:.65}];
  }
  // This is deliberately a single visible arrival, not a loop that teleports a
  // car or erases the visitor to pretend constant real activity.
  function at(time=0){
    if(!Number.isFinite(time)||time<0)throw Error('Invalid scenic time');
    const t=Math.min(44,time);let phase='waiting',car={cx:4,cy:11.7,angle:Math.PI/2},visitor=null;
    if(t>=3&&t<15){phase='approach';car.cx=mix(4,19.8,smooth((t-3)/12));}
    else if(t>=15&&t<19){phase='turn';const a=smooth((t-15)/4)*Math.PI/2;car={cx:19.8+3*Math.sin(a),cy:8.7+3*Math.cos(a),angle:Math.PI/2-a};}
    else if(t>=19&&t<24){phase='park';car={cx:22.8,cy:mix(8.7,5,smooth((t-19)/5)),angle:0};}
    else if(t>=24){
      phase='settle';car={cx:22.8,cy:5,angle:0};
      if(t>=26&&t<30){phase='walkToPath';visitor={x:mix(24.2,26.8,smooth((t-26)/4)),y:5};}
      else if(t>=30&&t<36.5){phase='walkToEntry';visitor={x:26.8,y:mix(5,.8,smooth((t-30)/6.5))};}
      else if(t>=36.5&&t<41){phase='approachEntry';visitor={x:mix(26.8,24,smooth((t-36.5)/4.5)),y:.8};}
      else if(t>=41&&t<44){phase='enter';visitor={x:24,y:mix(.8,.25,smooth((t-41)/3))};}
      else if(t>=44){phase='complete';visitor={x:24,y:.25};}
    }
    return {time:t,phase,car,visitor,door:phase==='enter'||phase==='complete',complete:t===44};
  }
  function collision(sample,items){
    const hull=corners(sample.car);
    if(hull.some(p=>p.x<0||p.x>26||p.y<0||p.y>14.6))return 'vehicle-boundary';
    for(const item of items)if(overlap(hull,rect(item),clearance))return item.id||'obstacle';
    if(sample.visitor){
      const v=sample.visitor,foot=rect({x:v.x-radius,y:v.y-radius,w:radius*2,h:radius*2});
      if(v.x-radius<0||v.x+radius>28||v.y-radius<0||v.y+radius>19)return 'visitor-boundary';
      if(overlap(foot,hull,clearance))return 'visitor-vehicle';
      for(const item of items)if(overlap(foot,rect(item),clearance))return 'visitor-'+(item.id||'obstacle');
    }
    return null;
  }
  function sweep(from,to,items){
    const d=Math.hypot(to.car.cx-from.car.cx,to.car.cy-from.car.cy),angle=Math.abs(to.car.angle-from.car.angle);
    const vd=from.visitor&&to.visitor?Math.hypot(to.visitor.x-from.visitor.x,to.visitor.y-from.visitor.y):0;
    const n=Math.ceil(Math.max(1,d/.04,angle/.01,vd/.04));
    if(n>256)return 'sweep-budget';
    for(let i=0;i<=n;i++){
      const u=i/n,car={cx:mix(from.car.cx,to.car.cx,u),cy:mix(from.car.cy,to.car.cy,u),angle:mix(from.car.angle,to.car.angle,u)};
      const visitor=from.visitor&&to.visitor?{x:mix(from.visitor.x,to.visitor.x,u),y:mix(from.visitor.y,to.visitor.y,u)}:(i===n?to.visitor:from.visitor);
      const hit=collision({car,visitor},items);if(hit)return hit;
    }
    return null;
  }
  function step(state,dt,items=[],options={}){
    state=state||at(0);
    if(options.paused||options.hidden||options.closed||(options.reducedMotion&&!options.explicitPlay)||state.complete)return state;
    if(!Number.isFinite(dt)||dt<0)throw Error('Invalid scenic delta');
    const next=at(state.time+Math.min(.05,dt)),hit=sweep(state,next,items);
    // No clock progress on blockage, no path skip, disappearance or fallback.
    if(hit)return {...state,blocked:hit};
    return next;
  }
  return Object.freeze({carWidth,carLength,radius,clearance,labels,smooth,rect,corners,overlap,obstacles,at,collision,sweep,step});
});

