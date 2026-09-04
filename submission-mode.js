/* Capacity Connect — submission/demo safety layer */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;
    if(!api)return false;
    window.capacitySubmission={
      async refresh(){
        const user=JSON.parse(sessionStorage.getItem('user')||'null');
        if(!user)return;
        const role=String(user.role||'').toLowerCase();
        try{
          if(role==='admin'&&window.syncAdminStats)await window.syncAdminStats();
          const courses=await api('/api/platform/courses');
          window.capacitySubmission.courses=(courses.courses||courses||[]);
          if(typeof render==='function')render();
        }catch(e){console.warn('Submission refresh:',e.message)}
      },
      clearDemoSession(){sessionStorage.removeItem('token');sessionStorage.removeItem('user')}
    };
    document.addEventListener('capacityPlatformReady',()=>window.capacitySubmission.refresh());
    return true;
  }
  if(!boot())document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1000));
})();
