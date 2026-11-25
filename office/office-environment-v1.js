/* Visual occupancy only. Not room sensors, hardware telemetry or AI activity. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasOfficeEnvironmentV1=api;})(typeof window==='undefined'?this:window,()=>{
  'use strict';
  const inside=(p,r)=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&p.x>=r.x&&p.x<r.x+r.w&&p.y>=r.y&&p.y<r.y+r.h;
  function nearFurniture(p,f,range=.85){
    if(!Number.isFinite(p?.x)||!Number.isFinite(p?.y))return false;
    const dx=Math.max(f.x-p.x,0,p.x-f.x-f.w),dy=Math.max(f.y-p.y,0,p.y-f.y-f.h);
    return Math.hypot(dx,dy)<=range;
  }
  function step(world,actors,previous={},dt=.2,frozen=false){
    if(frozen)return previous;
    const blend=1-Math.exp(-3*Math.max(0,Math.min(.5,Number.isFinite(dt)?dt:0))),result={};
    for(const room of world.rooms){
      const occupants=actors.filter(p=>inside(p,room)),coffeeObjects=world.furniture.filter(f=>f.room===room.id&&['coffee','counter'].includes(f.kind));
      const target=occupants.length?.96:.45,prior=previous[room.id]?.light??.45;
      const coffeeNearby=coffeeObjects.some(f=>occupants.some(p=>nearFurniture(p,f)));
      result[room.id]={occupants:occupants.length,light:prior+(target-prior)*blend,coffeeNearby,
        doorway:actors.some(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&Math.abs(p.y-room.y-room.h)<.9&&p.x>=room.x+room.doorStart-.25&&p.x<=room.x+room.doorStart+room.doorWidth+.25)};
    }
    return result;
  }
  return {inside,nearFurniture,step};
});

