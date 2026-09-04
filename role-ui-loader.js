/* Capacity Connect — deterministic role API/UI bootstrap */
(function(){
 const scripts=['platform-integration.js','platform-api.js','role-api-ui.js','certification-ui.js','production-integration.js','live-data-adapter.js','auth-backend-bridge.js','ui-backend-bridge.js','core-flow-bridge.js','submission-core-ui.js','submission-mode.js','server-source-of-truth.js','render-fix.js','platform-ready.js','final-stability.js','admin-users-fix.js','course-persistence-fix.js'];
 function load(i){if(i>=scripts.length)return; if(document.querySelector('script[src="'+scripts[i]+'"]'))return load(i+1);const s=document.createElement('script');s.src=scripts[i];s.async=false;s.onload=()=>load(i+1);s.onerror=()=>{console.warn('Capacity Connect loader failed:',scripts[i]);load(i+1)};document.head.appendChild(s)}
 function boot(){load(0)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
