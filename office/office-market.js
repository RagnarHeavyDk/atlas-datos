/* Display-only quote traces. No candles, predictions, orders or training. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AtlasOfficeMarket=factory();})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const symbols=['BTCUSDT','ETHUSDT','SOLUSDT'];
  function reading(state,symbol,now){
    const at=state?.last_good_at,q=state?.last_quotes?.[symbol];
    const gap=Number.isFinite(state?.max_quote_gap_seconds)&&state.max_quote_gap_seconds>0?Math.min(60000,state.max_quote_gap_seconds*1000):30000;
    const valid=Number.isFinite(at)&&Number.isFinite(q?.bid)&&Number.isFinite(q?.ask)&&q.bid>0&&q.ask>=q.bid;
    return {at:valid?at:null,bid:valid?q.bid:null,ask:valid?q.ask:null,gap,fresh:valid&&state.source_fresh===true&&now>=at&&now-at<=gap};
  }
  function collect(history,state,symbol,now){
    const q=reading(state,symbol,now);
    if(!q.fresh||history.length&&q.at<=history.at(-1).at)return history;
    return [...history,{at:q.at,bid:q.bid}].slice(-120);
  }
  function trace(history,gap=30000,width=300,height=90){
    const rows=history.filter(p=>Number.isFinite(p.at)&&Number.isFinite(p.bid)&&p.bid>0);
    if(!rows.length)return {paths:[],points:[],low:null,high:null,start:null,end:null};
    const low=Math.min(...rows.map(p=>p.bid)),high=Math.max(...rows.map(p=>p.bid)),start=rows[0].at,end=rows.at(-1).at;
    const range=high-low||Math.max(.000001,low*.0001),points=rows.map(p=>({x:end===start?width/2:8+(p.at-start)/(end-start)*(width-16),y:high===low?height/2:8+(high-p.bid)/range*(height-16)}));
    const paths=[];let d='';
    points.forEach((p,i)=>{if(i&&rows[i].at-rows[i-1].at>gap){paths.push(d);d='';}d+=(d?' L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2);});if(d)paths.push(d);
    return {paths,points,low,high,start,end};
  }
  return {symbols,reading,collect,trace};
});

