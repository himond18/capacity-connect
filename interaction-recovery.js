/* Capacity Connect — deterministic navigation interaction recovery */
(function(){
 const pageNames=['dashboard','profile','courses','resources','mcq','questionnaires','feedback','participants','library','users','monitoring','assessments','publish','courseDetail'];
 function go(page){
  if(!pageNames.includes(page)||typeof current==='undefined')return;
  current.page=page;
  if(typeof render==='function')render();
 }
 function install(){
  if(window.__ccInteractionRecovery)return;
  window.__ccInteractionRecovery=true;
  document.addEventListener('click',function(e){
   const btn=e.target.closest&&e.target.closest('#side button');
   if(!btn)return;
   const text=String(btn.textContent||'').trim().toLowerCase();
   const map={
    'dashboard':'dashboard','profile':'profile','courses':'courses','resources':'resources','mcq':'mcq','questionnaires':'questionnaires',
    'feedback / help':'feedback','feedback':'feedback','participants':'participants','training library':'library','library':'library',
    'user approval & roles':'users','users':'users','monitoring':'monitoring','assessments':'assessments','publish & announce':'publish','publish':'publish'
   };
   const page=map[text];
   if(!page)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();go(page);
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,1000));else setTimeout(install,1000);
 window.capacityInteractionRecovery={go};
})();
