/* Capacity Connect — core UI/backend bridge */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;
    if(!api)return false;
    const original={};
    ['enroll','submitFeedback','approveUser','publishCourse','logout'].forEach(k=>{if(typeof window[k]==='function')original[k]=window[k]});
    window.enroll=async function(courseId){try{await api('/api/trainee/enrollments',{method:'POST',body:JSON.stringify({course_id:courseId})});if(typeof toast==='function')toast('Enrolled successfully.');if(typeof render==='function')render()}catch(e){if(typeof toast==='function')toast(e.message);else alert(e.message)}};
    window.submitFeedback=async function(){
      try{
        const text=(document.querySelector('textarea')||{}).value||'';
        if(!text.trim()){if(typeof toast==='function')toast('Enter feedback.');return}
        await api('/api/feedback',{method:'POST',body:JSON.stringify({message:text.trim()})});
        if(typeof toast==='function')toast('Feedback submitted.');
      }catch(e){if(typeof toast==='function')toast(e.message);else alert(e.message)}
    };
    window.approveUser=async function(id,status='Approved'){
      try{await api('/api/admin/users/'+encodeURIComponent(id)+'/approval',{method:'PATCH',body:JSON.stringify({status})});if(typeof toast==='function')toast('User status updated.');if(window.syncAdminStats)window.syncAdminStats();if(typeof render==='function')render()}catch(e){if(typeof toast==='function')toast(e.message);else alert(e.message)}
    };
    window.publishCourse=async function(id){try{await api('/api/admin/courses/'+encodeURIComponent(id)+'/status',{method:'PATCH',body:JSON.stringify({status:'published'})});if(typeof toast==='function')toast('Course published.');if(typeof render==='function')render()}catch(e){if(typeof toast==='function')toast(e.message);else alert(e.message)}};
    window.logout=function(){sessionStorage.removeItem('token');sessionStorage.removeItem('user');localStorage.removeItem('token');localStorage.removeItem('user');if(original.logout)original.logout();else location.reload()};
    async function hydrate(){
      try{
        const u=JSON.parse(sessionStorage.getItem('user')||'null');if(!u)return;
        const role=String(u.role||'').toLowerCase();
        const tasks=[api('/api/platform/courses')];
        if(role==='trainee')tasks.push(api('/api/trainee/enrollments'),api('/api/trainee/progress'),api('/api/trainee/certifications'),api('/api/notifications'));
        if(role==='trainer')tasks.push(api('/api/trainer/courses'),api('/api/trainer/enrollments'),api('/api/trainer/progress'));
        if(role==='admin')tasks.push(api('/api/admin/users'),api('/api/admin/courses'),api('/api/admin/stats'));
        const r=await Promise.allSettled(tasks);
        window.capacityBackendSnapshot=r.map(x=>x.status==='fulfilled'?x.value:null);
      }catch(e){console.warn('Capacity backend hydration:',e.message)}
    }
    document.addEventListener('capacityPlatformReady',hydrate);
    setTimeout(hydrate,1500);
    return true;
  }
  if(!boot()){document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,800))}
})();
