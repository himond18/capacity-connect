/* Capacity Connect — load shared platform API modules */
(function(){
  const scripts = ['platform-integration.js','platform-api.js'];
  function load(i){
    if(i >= scripts.length) return;
    if(document.querySelector('script[src="'+scripts[i]+'"]')) return load(i+1);
    const s=document.createElement('script');
    s.src=scripts[i];
    s.async=false;
    s.onload=()=>load(i+1);
    document.head.appendChild(s);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',()=>load(0));
  else load(0);
})();
