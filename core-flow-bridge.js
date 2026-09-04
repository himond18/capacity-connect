/* Capacity Connect — core submission flow bridge */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return false;
    const msg=m=>typeof toast==='function'?toast(m):alert(m);
    const val=id=>(document.getElementById(id)||{}).value||'';
    window.capacityCore={
      async enroll(courseId){try{const r=await api('/api/trainee/enrollments',{method:'POST',body:JSON.stringify({course_id:courseId})});msg('Enrollment successful.');return r}catch(e){msg(e.message)}},
      async progress(courseId,percent,completed){try{return await api('/api/trainee/progress',{method:'POST',body:JSON.stringify({course_id:courseId,progress:percent,progress_percent:percent,completed:!!completed,is_completed:!!completed})})}catch(e){msg(e.message)}},
      async attempt(assessmentId,answers,score){try{return await api('/api/trainee/assessment-attempts',{method:'POST',body:JSON.stringify({assessment_id:assessmentId,answers,score})})}catch(e){msg(e.message)}},
      async certificate(courseId){try{const r=await api('/api/trainee/certifications',{method:'POST',body:JSON.stringify({course_id:courseId})});msg(r.alreadyIssued?'Certificate already issued.':'Certificate issued successfully.');return r}catch(e){msg(e.message)}},
      async trainerCourse(data){try{const r=await api('/api/trainer/courses',{method:'POST',body:JSON.stringify({...data,is_free:true,price:0})});msg('Course created.');return r}catch(e){msg(e.message)}},
      async publish(id){try{const r=await api('/api/trainer/courses/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status:'published'})});msg('Course published.');return r}catch(e){msg(e.message)}}
    };
    return true;
  }
  if(!boot())document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1000));
})();
