/* Capacity Connect — permanent interaction controller */
(function(){
 const pages=new Set(['dashboard','profile','courses','resources','mcq','questionnaires','feedback','participants','library','users','monitoring','assessments','publish','courseDetail']);
 const textToPage={
  'dashboard':'dashboard','profile':'profile','courses':'courses','resources':'resources','mcq':'mcq','questionnaires':'questionnaires',
  'feedback / help':'feedback','feedback':'feedback','participants':'participants','training library':'library','library':'library',
  'user approval & roles':'users','users':'users','monitoring':'monitoring','assessments':'assessments','publish & announce':'publish','publish':'publish'
 };
 function pageAllowed(p){return pages.has(String(p||''))}
 function safeRender(){if(typeof window.render==='function'){try{return window.render()}catch(e){console.error('Capacity Connect render error',e);}}}
 function go(page){
  page=String(page||'').trim();
  if(!pageAllowed(page)||typeof current==='undefined'||!current)return false;
  current.page=page;
  if(page!=='courseDetail')delete current.courseId;
  safeRender();
  return true;
 }
 function install(){
  if(window.__ccInteractionRecoveryV2)return;
  window.__ccInteractionRecoveryV2=true;
  window.nav=go;
  window.capacityInteractionRecovery={go};
  document.addEventListener('pointerdown',function(e){
   const btn=e.target&&e.target.closest?e.target.closest('#side button'):null;
   if(!btn)return;
   const page=textToPage[String(btn.textContent||'').trim().toLowerCase()];
   if(!page)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
   go(page);
  },true);
  document.addEventListener('click',function(e){
   const btn=e.target&&e.target.closest?e.target.closest('#side button'):null;
   if(!btn)return;
   const page=textToPage[String(btn.textContent||'').trim().toLowerCase()];
   if(!page)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  },true);
 }
 function start(){install();setTimeout(install,500);setTimeout(install,1500)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
