/* Wall-mounted wayfinding only. No model, market or navigation changes. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AtlasOfficeSignage=factory();})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const screenRooms=['data','technical','macro','execution'];
  const shortNames={direction:{es:'DIRECCIÓN',en:'EXEC'},operations:{es:'OPERAC.',en:'OPS'},compliance:{es:'NORMAS',en:'COMPLY'},investors:{es:'INVERS.',en:'INVESTORS'},technology:{es:'TECNO.',en:'TECH'},cafe:{es:'CAFÉ',en:'CAFÉ'}};
  function plan(room,point){
    // Market screens occupy the left wall; the huddle whiteboard occupies the back.
    const wall=room.id==='huddle'?'left':'back',width=118,height=22;
    const anchor=wall==='back'?point(room.x+.35,room.y+.025,74):point(room.x+.025,room.y+5.7,74);
    const matrix=wall==='back'?[1,.5,0,1,...anchor]:[.9,-.45,0,.9,...anchor];
    const corners=[[0,0],[width,0],[width,height],[0,height]].map(([x,y])=>[matrix[0]*x+matrix[2]*y+matrix[4],matrix[1]*x+matrix[3]*y+matrix[5]]);
    return {wall,width,height,matrix,corners};
  }
  function name(sector,lang){return shortNames[sector.id]?.[lang]||sector.name[lang];}
  return {screenRooms,plan,name};
});

