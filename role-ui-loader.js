/* Capacity Connect — single ordered integration loader */
(function(){
  const scripts=[
    'platform-api.js',
    'backend-sync.js',
    'auth-backend-bridge.js',
    'role-api-ui.js',
    'core-flow-bridge.js',
    'admin-users-fix.js',
    'trainee-courses-final-fix.js',
    'enrollment-final-fix.js',
    'trainer-course-final-fix.js'
  ];
  function load(i){
    if(i>=scripts.length){document.dispatchEvent(new Event('capacityPlatformReady'));return;}
    if(document.querySelector('script[src="'+scripts[i]+'"]'))return load(i+1);
    const s=document.createElement('script');s.src=scripts[i];s.async=false;
    s.onload=function(){load(i+1)};
    s.onerror=function(){console.warn('Capacity Connect integration failed:',scripts[i]);load(i+1)};
    document.head.appendChild(s);
  }
  function boot(){load(0)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
