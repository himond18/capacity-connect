/* Capacity Connect — single permanent UI controller */
(function(){
  const PAGES=new Set(['dashboard','profile','courses','resources','mcq','questionnaires','feedback','participants','library','users','monitoring','assessments','publish','courseDetail']);
  let booted=false;
  function visible(el){return !!el && getComputedStyle(el).display!=='none' && getComputedStyle(el).visibility!=='hidden';}
  function appActive(){const app=document.getElementById('app');return visible(app) && !app.classList.contains('hidden');}
  function unlock(){
    const modal=document.getElementById('loginModal');
    const landing=document.getElementById('landing');
    const app=document.getElementById('app');
    if(appActive()){
      if(modal){modal.classList.remove('open');modal.style.display='none';modal.style.pointerEvents='none';modal.setAttribute('aria-hidden','true');}
      if(landing)landing.style.pointerEvents='none';
      document.body.style.pointerEvents='auto';
      document.body.classList.remove('modal-open');
    }
  }
  function route(page){
    if(typeof current==='undefined'||!PAGES.has(String(page)))return false;
    current.page=String(page);
    if(typeof render==='function'){try{render();}catch(e){console.error('Capacity Connect navigation error',e);}}
    unlock();
    return true;
  }
  function install(){
    if(booted)return;
    booted=true;
    window.nav=function(page){return route(page)};
    window.capacityNavigate=route;
    document.addEventListener('click',function(e){
      if(!appActive())return;
      const el=e.target&&e.target.closest?e.target.closest('#side button, #side a, [data-cc-page]'):null;
      if(!el)return;
      let page=el.getAttribute('data-cc-page');
      if(!page){
        const onclick=el.getAttribute('onclick')||'';
        const m=onclick.match(/nav\(['\"]([^'\"]+)['\"]\)/); if(m)page=m[1];
      }
      if(!page){
        const text=String(el.textContent||'').trim().toLowerCase();
        const map={'dashboard':'dashboard','profile':'profile','courses':'courses','resources':'resources','mcq':'mcq','questionnaires':'questionnaires','feedback / help':'feedback','feedback':'feedback','participants':'participants','training library':'library','library':'library','user approval & roles':'users','users':'users','monitoring':'monitoring','assessments':'assessments','publish & announce':'publish','publish':'publish'};
        page=map[text];
      }
      if(PAGES.has(String(page))){e.preventDefault();e.stopImmediatePropagation();route(page);}
    },true);
    unlock();
    setInterval(unlock,500);
  }
  function start(){setTimeout(install,300);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
