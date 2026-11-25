/* Pure, scripted visual gestures. No claims about intelligence or completed work. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasOfficeActionsV1=api;})(typeof window==='undefined'?this:window,()=>{
  'use strict';
  // Each row: phase, seconds, left arm, right arm, head, prop lift, body lean.
  const cycles={
    desk:[['settle',.8,30,-30,0,0,0],['type',5.2,42,-42,-3,0,-1],['review',2.4,24,-20,6,0,1],['rest',1.7,10,-10,0,0,0]],
    coffee:[['lift',.8,0,-42,-2,-10,0],['sip',1,0,-44,-3,-11,0],['lower',.8,0,0,0,0,0],['rest',3.4,0,0,4,0,0]],
    read:[['open',.6,12,-35,-7,0,0],['scan',3.5,14,-35,-8,0,-1],['page',.7,22,-28,-5,1,0],['scan',3.2,14,-35,-8,0,-1],['close',.7,8,-26,0,0,0]],
    chat:[['listen',1.4,0,0,-2,0,0],['gesture',1.6,8,-30,4,0,0],['nod',.8,0,-10,-5,0,0],['listen',1.7,0,0,0,0,0]],
    stretch:[['raise',1.2,-105,105,-2,0,0],['hold',1.1,-108,108,2,0,-1],['lower',1.2,0,0,0,0,0],['rest',2,0,0,3,0,0]],
    idle:[['look',2.2,0,0,-5,0,0],['rest',3.5,0,0,0,0,0],['look',2.2,0,0,5,0,0],['rest',3.5,0,0,0,0,0]]
  };
  const labels=Object.fromEntries(Object.entries({settle:['Se acomoda','Settling'],type:['Teclea','Typing'],review:['Mira la pantalla','Screen glance'],rest:['Pausa','Pause'],lift:['Levanta la taza','Lifting cup'],sip:['Da un sorbo','Sipping'],lower:['Baja las manos','Lowering hands'],open:['Abre el cuaderno','Opening notebook'],scan:['Mira el cuaderno','Notebook glance'],page:['Pasa una página','Turning page'],close:['Cierra el cuaderno','Closing notebook'],listen:['Escucha','Listening'],gesture:['Gesticula','Gesturing'],nod:['Asiente','Nodding'],raise:['Estira los brazos','Stretching arms'],hold:['Mantiene el estiramiento','Holding stretch'],look:['Mira alrededor','Looking around'],walk:['Camina','Walking'],neutral:['Reposo','Rest']}).map(([key,[es,en]])=>[key,Object.freeze({es,en})]));
  function seed(id){return Array.from(String(id)).reduce((n,c)=>(n*31+c.charCodeAt(0))%997,0);}
  function step(previous,{id,pose,dt=0,neutral=false,frozen=false}){
    const same=previous?.pose===pose,clock=same?previous.clock:seed(id)/997*1.2;
    const next={pose,clock:clock+(frozen?0:Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0)))};
    if(neutral||pose==='walk'||!cycles[pose])return {...next,phase:pose==='walk'?'walk':'neutral',left:0,right:0,head:0,lift:0,lean:0};
    const rows=cycles[pose],total=rows.reduce((n,r)=>n+r[1],0),time=next.clock%total;
    let start=0,index=0;for(;index<rows.length-1&&time>=start+rows[index][1];index++)start+=rows[index][1];
    const row=rows[index],prior=rows[(index+rows.length-1)%rows.length];
    const p=Math.max(0,Math.min(1,(time-start)/Math.min(.65,row[1]))),ease=p*p*(3-2*p);
    const mix=i=>prior[i]+(row[i]-prior[i])*ease;
    return {...next,phase:row[0],left:mix(2),right:mix(3),head:mix(4),lift:mix(5),lean:mix(6)};
  }
  return {cycles,labels,step};
});

