/* Capacity Connect — role API/UI bootstrap */
(function(){
  function load(src){
    if(document.querySelector('script[src="'+src+'"]')) return;
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  function boot(){
    load('platform-loaders.js');
    setTimeout(()=>load('role-api-ui.js'),250);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
