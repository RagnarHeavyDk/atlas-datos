/* Local visual pedestrian clearance. No tasks, signals, messages or learning. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AtlasOfficeTrafficV1=factory();})(typeof window==='undefined'?globalThis:window,()=>{
 'use strict';
 const gap=.4;
 const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
 function segmentDistance(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;
  const t=l?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)):0;
  return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);
 }
 function clear(from,to,others,spacing=gap){
  if(!finite(from)||!finite(to)||!Array.isArray(others)||!Number.isFinite(spacing)||spacing<=0)return false;
  return others.every(p=>{
   if(!finite(p))return false;
   const start=Math.hypot(from.x-p.x,from.y-p.y),end=Math.hypot(to.x-p.x,to.y-p.y);
   if(start<spacing-1e-8){
    // Existing overlap may only separate, never get closer or cross the other.
    const away=(from.x-p.x)*(to.x-from.x)+(from.y-p.y)*(to.y-from.y);
    return away>=0&&end>start+1e-8;
   }
   return segmentDistance(p,from,to)>=spacing-1e-8;
  });
 }
 function detour(from,to,others,canMove,options={}){
  if(!finite(from)||!finite(to)||!Array.isArray(others)||others.some(p=>!finite(p))||typeof canMove!=='function')return null;
  const step=.2,margin=options.margin??1.25,maxNodes=options.maxNodes??700;
  if(!Number.isFinite(margin)||margin<.25||margin>3||!Number.isInteger(maxNodes)||maxNodes<1||maxNodes>2000)return null;
  // Small local A*: cannot replace the room/door graph or jump through a wall.
  const minX=Math.min(from.x,to.x)-margin,maxX=Math.max(from.x,to.x)+margin;
  const minY=Math.min(from.y,to.y)-margin,maxY=Math.max(from.y,to.y)+margin;
  const key=(i,j)=>i+','+j,point=(i,j)=>({x:from.x+i*step,y:from.y+j*step});
  const nodes=new Map([['0,0',{i:0,j:0,g:0,parent:null}]]),open=new Set(['0,0']);
  let visited=0;
  while(open.size&&visited++<maxNodes){
   let currentKey=null,best=Infinity;
   for(const k of open){const n=nodes.get(k),p=point(n.i,n.j),score=n.g+Math.abs(p.x-to.x)+Math.abs(p.y-to.y);if(score<best){best=score;currentKey=k;}}
   open.delete(currentKey);const n=nodes.get(currentKey),p=point(n.i,n.j);
   if(Math.hypot(p.x-to.x,p.y-to.y)<=.36&&canMove(p,to)&&clear(p,to,others)){
    const result=[to];for(let k=currentKey;k!=='0,0';k=nodes.get(k).parent){const a=nodes.get(k);result.push(point(a.i,a.j));}
    return result.reverse();
   }
   for(const [di,dj]of [[1,0],[0,1],[-1,0],[0,-1]]){
    const i=n.i+di,j=n.j+dj,q=point(i,j),k=key(i,j),g=n.g+step;
    if(q.x<minX||q.x>maxX||q.y<minY||q.y>maxY||nodes.has(k)&&nodes.get(k).g<=g)continue;
    if(!canMove(p,q)||!clear(p,q,others))continue;
    nodes.set(k,{i,j,g,parent:currentKey});open.add(k);
   }
  }
  return null; // Pending, not a fabricated arrival or teleport.
 }
 function sidestep(from,target,others,canMove){
  if(!finite(from)||!finite(target)||!Array.isArray(others)||others.some(p=>!finite(p))||typeof canMove!=='function')return null;
  const dx=target.x-from.x,dy=target.y-from.y,l=Math.hypot(dx,dy);
  if(l<1e-8)return null;
  // Right-hand passing first. Both opposite travellers must make room in a
  // narrow aisle; never claim one can pass a stationary centred obstruction.
  for(const sign of [1,-1]){
   const p={x:from.x-dy/l*.24*sign,y:from.y+dx/l*.24*sign};
   if(canMove(from,p)&&clear(from,p,others))return p;
  }
  return null;
 }
 function reroute(from,remaining,others,canMove,options={}){
  if(!Array.isArray(remaining)||!remaining.length||remaining.some(p=>!finite(p)))return null;
  // Rejoin the SAME visual route. Never change the task/meeting destination.
  let index=-1;
  for(let i=Math.min(2,remaining.length-1);i>=0;i--)if(Math.hypot(remaining[i].x-from.x,remaining[i].y-from.y)<=2.3&&clear(remaining[i],remaining[i],others)){index=i;break;}
  if(index>=0){const route=detour(from,remaining[index],others,canMove,{maxNodes:options.maxNodes??250,margin:1});if(route)return {points:route.concat(remaining.slice(index+1)),mode:'detour'};}
  const side=sidestep(from,remaining[0],others,canMove);
  return side?{points:[side,...remaining],mode:'sidestep'}:null;
 }
 function lanes(from,route,canMove){
  if(!finite(from)||!Array.isArray(route)||route.some(p=>!finite(p))||typeof canMove!=='function')return null;
  // Opposite travellers must not repeatedly aim at the SAME cell centre.
  // Preserve first/last interaction points; offset only legal intermediate
  // segments to the right. No obstacle/person guard is relaxed by this plan.
  const right=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy);return l?{x:-dy/l*.24,y:dx/l*.24}:{x:0,y:0};};
  const result=route.map((p,i)=>{
   if(i===0||i===route.length-1)return {...p};
   const a=right(route[i-1],p),b=right(p,route[i+1]);
   const straight=Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<1e-8;
   return {x:p.x+(straight?a.x:a.x+b.x),y:p.y+(straight?a.y:a.y+b.y)};
  });
  // At furniture and chair approaches a lane may not fit. Restore original
  // points until every complete edge is legal, rather than clipping corners.
  for(let pass=0;pass<route.length;pass++){
   let changed=false,previous=from;
   for(let i=0;i<result.length;i++){
    if(!canMove(previous,result[i])){
     for(const j of [i-1,i])if(j>=0&&(result[j].x!==route[j].x||result[j].y!==route[j].y)){result[j]={...route[j]};changed=true;}
    }
    previous=result[i];
   }
   if(!changed)break;
  }
  let previous=from;for(const p of result){if(!canMove(previous,p))return null;previous=p;}
  return result;
 }
 function budget(){
  let cursor=0,last=-Infinity;
  return Object.freeze({pick(people,at){
   if(!Array.isArray(people)||!people.length||!Number.isFinite(at)||at-last<150)return null;
   for(let n=0;n<people.length;n++){
    const i=(cursor+n)%people.length,w=people[i];
    if(w.blockedSince&&at-w.blockedSince>=400&&at>=(w.nextTrafficAt||0)&&at>=(w.conversationUntil||0)){
     cursor=(i+1)%people.length;last=at;w.nextTrafficAt=at+800;return w;
    }
   }
   return null;
  }});
 }
 function advance(route,index,position){
  if(!Array.isArray(route)||!Number.isInteger(index)||index<0||!finite(position))return index;
  const reached=route.findIndex((p,i)=>i>=index&&finite(p)&&Math.hypot(p.x-position.x,p.y-position.y)<1e-8);
  return reached<0?index:reached+1;
 }
 function recovery(world){
  if(!world||!Number.isInteger(world.width)||!Number.isInteger(world.height)||world.width<=0||world.height<=0||world.width*world.height>4096||typeof world.edge!=='function')throw Error('invalid_visual_recovery_world');
  function alternate(from,others,canMove){
   if(!finite(from)||!finite(from.goal)||!Array.isArray(others)||others.some(p=>!finite(p))||typeof canMove!=='function')return null;
   const sx=Math.floor(from.x),sy=Math.floor(from.y),tx=Math.floor(from.goal.x),ty=Math.floor(from.goal.y);
   const key=(x,y)=>x+','+y,start=key(sx,sy),end=key(tx,ty),queue=[{x:sx,y:sy}],previous=new Map([[start,null]]);
   const blocked=new Set(others.map(p=>key(Math.floor(p.x),Math.floor(p.y))));
   for(let i=0;i<queue.length&&!previous.has(end);i++){
    const a=queue[i];
    for(const [dx,dy]of [[1,0],[0,1],[-1,0],[0,-1]]){
     const x=a.x+dx,y=a.y+dy,k=key(x,y);
     if(x<0||y<0||x>=world.width||y>=world.height||previous.has(k)||(blocked.has(k)&&k!==end)||!world.edge(a.x,a.y,x,y))continue;
     if(!canMove({x:a.x+.5,y:a.y+.5},{x:x+.5,y:y+.5}))continue;
     previous.set(k,key(a.x,a.y));queue.push({x,y});
    }
   }
   if(!previous.has(end))return null;
   const path=[];for(let k=end;k!==null;k=previous.get(k)){const [x,y]=k.split(',').map(Number);path.push({x:x+.5,y:y+.5});}path.reverse();
   const planned=lanes(from,path,canMove);if(!planned)return null;
   const joined=reroute(from,planned,others,canMove,{maxNodes:250});
   return joined?{...joined,mode:'alternate',resetCanonical:true}:null;
  }
  function backoff(from,target,others,canMove){
   if(!finite(from)||!finite(target)||!Array.isArray(others)||others.some(p=>!finite(p))||typeof canMove!=='function')return null;
   const dx=target.x-from.x,dy=target.y-from.y,l=Math.hypot(dx,dy);if(l<1e-8)return null;
   const blockers=others.filter(p=>Math.hypot(p.x-from.x,p.y-from.y)<.8&&(p.x-from.x)*dx+(p.y-from.y)*dy>0);
   if(!blockers.length||!blockers.some(p=>String(from.id)>String(p.id)))return null;
   const vx=dx/l,vy=dy/l;
   for(const distance of [.4,.24,.6])for(const angle of [Math.PI,Math.PI*.75,-Math.PI*.75]){
    const c=Math.cos(angle),s=Math.sin(angle),p={x:from.x+(vx*c-vy*s)*distance,y:from.y+(vx*s+vy*c)*distance};
    if(canMove(from,p)&&clear(from,p,others))return p;
   }
   return null;
  }
  function recover(from,remaining,others,canMove,options={}){
   if(!finite(from)||!Array.isArray(remaining)||!remaining.length||remaining.some(p=>!finite(p))||!Array.isArray(others)||others.some(p=>!finite(p))||typeof canMove!=='function')return null;
   const alternative=alternate(from,others,canMove);if(alternative)return alternative;
   const p=backoff(from,remaining[0],others,canMove),revised=p?null:reroute(from,remaining,others,canMove,options);
   return p?{points:[p,...remaining],mode:'backoff'}:revised;
  }
  return Object.freeze({alternate,backoff,recover});
 }
 function departures(limit=16,interval=500){
  if(!Number.isInteger(limit)||limit<1||limit>64||!Number.isFinite(interval)||interval<150||interval>5000)throw Error('invalid_visual_departure_budget');
  let last=-Infinity;const pending=new Map();
  return Object.freeze({admit(people,actor,at,source='ambient'){
   if(source==='recorded'){pending.delete(actor);return true;}
   if(source!=='ambient'||!Array.isArray(people)||!actor||!finite(actor)||!Number.isFinite(at))return false;
   if(!pending.has(actor))pending.set(actor,at);
   const active=people.filter(p=>p!==actor&&p.travelSource==='ambient'&&p.arrivalPending).length;
   const blocking=people.some(p=>p!==actor&&p.arrivalPending&&Number.isFinite(p.tx)&&Number.isFinite(p.ty)&&Math.hypot(actor.x-p.tx,actor.y-p.ty)<.65);
   const oldest=[...pending.keys()].find(p=>people.includes(p));
   if(at-last<interval||(!blocking&&(active>=limit||oldest!==actor)))return false;
   // Soft cap: let a queued obstruction depart without inventing a new trip.
   last=at;pending.delete(actor);return true;
  }});
 }
 return Object.freeze({gap,clear,detour,sidestep,reroute,lanes,budget,segmentDistance,advance,recovery,departures});
});

