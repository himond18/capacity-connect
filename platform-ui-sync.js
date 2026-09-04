/* Capacity Connect — live role dashboard synchronization */
(function(){
  function role(){try{return (JSON.parse(sessionStorage.getItem('user')||'{}').role||'').toLowerCase()}catch(e){return ''}}
  async function run(){
    const api=window.capacityRoleAPI;if(!api)return;
    try{
      if(role()==='trainee'){
        const [courses,enrollments,progress,notifications]=await Promise.allSettled([api.courses(),api.myEnrollments(),api.myProgress(),api.notifications()]);
        window.capacityPlatformData={courses:courses.value?.courses||[],enrollments:enrollments.value?.enrollments||[],progress:progress.value?.progress||[],notifications:notifications.value?.notifications||[]};
      } else if(role()==='trainer'){
        const [enrollments,progress,notifications]=await Promise.allSettled([api.trainerEnrollments(),api.trainerProgress(),api.notifications()]);
        window.capacityPlatformData={enrollments:enrollments.value?.enrollments||[],progress:progress.value?.progress||[],notifications:notifications.value?.notifications||[]};
      }
      document.dispatchEvent(new CustomEvent('capacityPlatformDataReady',{detail:window.capacityPlatformData||{}}));
    }catch(e){console.warn('Capacity Connect UI sync:',e.message)}
  }
  window.syncCapacityPlatform=run;
  document.addEventListener('DOMContentLoaded',()=>setTimeout(run,700));
  window.addEventListener('load',()=>setTimeout(run,1200));
})();
