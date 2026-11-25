(()=>{const root=document.createElement('details');root.id='latest-macro';root.className='events-section';
const office=document.querySelector('#atlas-office');
const macro=document.querySelector('#macro-brief');
if (!office || !macro) return;
macro.before(office,root);
const rows=[
 ['BLS / CPI','2026-10','Core CPI','IPC subyacente','339.900','Seasonally adjusted index · +0.3% monthly · 10 Nov. No annual figure published for October.','Índice desestacionalizado · +0,3 % mensual · 10 nov. BLS no publicó tasa interanual para octubre.','https://www.bls.gov/news.release/cpi.nr0.htm'],
 ['BLS / U3','2026-10','Unemployment','Desempleo','4.1%','Seasonally adjusted · 6 Nov','Desestacionalizado · 6 nov','https://www.bls.gov/news.release/empsit.nr0.htm'],
 ['FED / H.15','2026-10','Effective federal funds rate','Tipo efectivo de fondos federales','3.88%','Monthly average · 2 Nov','Media mensual · 2 nov','https://fred.stlouisfed.org/series/FEDFUNDS'],
 ['FED / H.6','2026-09','M2','M2','23,413.9','USD billions, seasonally adjusted · 27 Oct','Miles de millones de USD, desestacionalizado · 27 oct','https://www.federalreserve.gov/releases/h6/current/default.htm']
];function render(){const es=document.documentElement.lang==='es';root.innerHTML='<summary>'+(es?'Últimos datos oficiales':'Latest official readings')+'</summary><div class="latest-grid">'+rows.map(([source,month,en,sp,value,detail,detalle,url])=>'<article><small>'+source+' · '+month+'</small><h3>'+(es?sp:en)+'</h3><strong>'+value+'</strong><p>'+(es?detalle:detail)+'</p><a href="'+url+'">'+(es?'Fuente oficial':'Official source')+' ↗</a></article>').join('')+'</div><p>'+(es?'M2 limita el mes común a septiembre de 2026. Revisado el 14 de noviembre de 2026.':'M2 limits the common month to September 2026. Reviewed 14 November 2026.')+'</p>';}render();document.addEventListener('atlas:languagechange',render);})();
