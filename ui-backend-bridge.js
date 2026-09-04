/* Capacity Connect — core UI/backend bridge */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return false;
    const msg=m=>typeof toast==='function'?toast(m):alert(m);
    const bodyFrom=(ids)=>{const o={};ids.forEach(([key,id])=>{const e=document.getElementById(id);if(e&&String(e.value||'').trim())o[key]=e.value.trim()});return o};
    window.enroll=async id=>{try{await api('/api/trainee/enrollments',{method:'POST',body:JSON.stringify({course_id:id})});msg('Enrolled successfully.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.submitFeedback=async()=>{try{const e=document.querySelector('#feedbackText, textarea[name="feedback"], textarea');const message=e?.value?.trim()||'';if(!message)return msg('Enter feedback.');await api('/api/feedback',{method:'POST',body:JSON.stringify({message})});msg('Feedback submitted.');if(e)e.value=''}catch(e){msg(e.message)}};
    window.approveUser=async(id,status='approved')=>{try{await api('/api/admin/users/'+encodeURIComponent(id)+'/approval',{method:'PATCH',body:JSON.stringify({status:String(status).toLowerCase()})});msg('User status updated.');if(window.syncAdminStats)window.syncAdminStats();if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.publishCourse=async id=>{try{await api('/api/admin/courses/'+encodeURIComponent(id)+'/status',{method:'PATCH',body:JSON.stringify({status:'published'})});msg('Course published.');if(window.syncAdminStats)window.syncAdminStats();if(typeof render==='function')render()}catch(e){msg(e.message)}};
    const originalLogout=window.logout;
    window.logout=()=>{sessionStorage.removeItem('token');sessionStorage.removeItem('user');localStorage.removeItem('token');localStorage.removeItem('user');if(originalLogout)originalLogout();else location.reload()};
    window.capacityCoreActions={
      createCourse:async data=>api('/api/trainer/courses',{method:'POST',body:JSON.stringify({...data,is_free:true,price:0})}),
      updateCourse:async(id,data)=>api('/api/trainer/courses/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify(data)}),
      addResource:async data=>api('/api/trainer/resources',{method:'POST',body:JSON.stringify(data)}),
      scheduleLiveClass:async data=>api('/api/trainer/live-classes',{method:'POST',body:JSON.stringify(data)}),
      createAssessment:async data=>api('/api/trainer/assessments',{method:'POST',body:JSON.stringify(data)}),
      addQuestion:async data=>api('/api/trainer/assessment-questions',{method:'POST',body:JSON.stringify(data)}),
      saveProgress:async data=>api('/api/trainee/progress',{method:'POST',body:JSON.stringify(data)}),
      submitAttempt:async data=>api('/api/trainee/assessment-attempts',{method:'POST',body:JSON.stringify(data)}),
      issueCertificate:async id=>api('/api/trainee/certifications',{method:'POST',body:JSON.stringify({course_id:id})})
    };
    async function hydrate(){try{const u=JSON.parse(sessionStorage.getItem('user')||'null');if(!u)return;const role=String(u.role||'').toLowerCase();const r=await Promise.allSettled([api('/api/platform/courses'),...(role==='trainee'?[api('/api/trainee/enrollments'),api('/api/trainee/progress'),api('/api/trainee/certifications'),api('/api/notifications')]:[]),...(role==='trainer'?[api('/api/trainer/courses'),api('/api/trainer/enrollments'),api('/api/trainer/progress')]:[]),...(role==='admin'?[api('/api/admin/users'),api('/api/admin/courses'),api('/api/admin/stats')]:[])]);window.capacityBackendSnapshot=r.map(x=>x.status==='fulfilled'?x.value:null)}catch(e){console.warn('Backend hydration:',e.message)}}
    document.addEventListener('capacityPlatformReady',hydrate);setTimeout(hydrate,1200);return true;
  }
  if(!boot())document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));
})();
