/* Capacity Connect — live backend data adapter */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;
    if(!api)return false;
    window.capacityLiveData={
      async courses(){return (await api('/api/platform/courses')).courses||[]},
      async enrollments(){return (await api('/api/trainee/enrollments')).enrollments||[]},
      async progress(){return (await api('/api/trainee/progress')).progress||[]},
      async notifications(){return (await api('/api/notifications')).notifications||[]},
      async certifications(){return (await api('/api/trainee/certifications')).certifications||[]},
      async trainerEnrollments(){return (await api('/api/trainer/enrollments')).enrollments||[]},
      async trainerProgress(){return (await api('/api/trainer/progress')).progress||[]},
      async adminStats(){return (await api('/api/admin/stats')).stats||{}}
    };
    window.capacityLiveDataReady=true;
    document.dispatchEvent(new CustomEvent('capacityLiveDataReady'));
    return true;
  }
  if(!boot()){
    document.addEventListener('capacityPlatformReady',boot);
    document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1200));
  }
})();
