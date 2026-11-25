/* Presentation only: preserve a floor's pan through late CSS and DOM moves. */
(function(root,factory){
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
  else root.AtlasOfficeStagePanV1=api;
})(typeof window==='undefined'?this:window,()=>{
  'use strict';
  const clamp=v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):.5;
  function attach(stage,parent,options={}){
    let ratio=clamp(options.ratio??.5),top=Math.max(0,options.top||0),width=0,range=0;
    const view=stage.ownerDocument.defaultView;
    function restore(){
      if(!stage.isConnected||stage.clientWidth<=0)return;
      width=stage.clientWidth;range=Math.max(0,stage.scrollWidth-width);
      stage.scrollLeft=range*ratio;stage.scrollTop=top;
      stage.dataset.panRatio=String(ratio);stage.dataset.panReady='true';
      stage.dataset.panWidth=String(width);
    }
    function remember(){
      // A layout clamp is not a user's request to jump to the left edge.
      if(stage.clientWidth!==width||Math.max(0,stage.scrollWidth-stage.clientWidth)!==range){restore();return;}
      if(range>0)ratio=clamp(stage.scrollLeft/range);
      top=Math.max(0,stage.scrollTop);stage.dataset.panRatio=String(ratio);
    }
    function centre(){ratio=.5;top=0;restore();}
    // Direct panel moves (legacy insertion/hierarchy) reset native scrollLeft.
    // Mutation callbacks run before scroll events, so restore the saved view first.
    const mutations=new view.MutationObserver(restore);
    mutations.observe(parent,{childList:true});
    const resize=new view.ResizeObserver(restore);resize.observe(stage);
    stage.addEventListener('scroll',remember,{passive:true});
    restore();
    return {restore,remember,centre,snapshot:()=>({ratio,top}),destroy(){
      mutations.disconnect();resize.disconnect();stage.removeEventListener('scroll',remember);
    }};
  }
  return {attach,clamp};
});

