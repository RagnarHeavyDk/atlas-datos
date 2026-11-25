/* Keep keyboard focus on the same visible control through SVG reparent/redraw. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasOfficeStageFocusV1=api;})(typeof window==='undefined'?this:window,()=>{
  'use strict';
  const attributes=['data-sign-room','data-agent','data-wall-symbol','data-room'];
  function capture(stage,active){
    if(!stage||!active||!stage.contains(active))return null;
    const node=active.closest(attributes.map(a=>'['+a+']').join(','));if(!node||!stage.contains(node))return null;
    const attribute=attributes.find(a=>node.hasAttribute(a));return {attribute,value:node.getAttribute(attribute)};
  }
  function restore(stage,key){
    if(!stage||!key||!attributes.includes(key.attribute))return false;
    const node=Array.from(stage.querySelectorAll('['+key.attribute+']')).find(n=>n.getAttribute(key.attribute)===key.value);
    if(!node)return false;if(stage.ownerDocument.activeElement!==node)node.focus({preventScroll:true});return true;
  }
  return {capture,restore};
});

