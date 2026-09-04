/* Capacity Connect — frontend role API bridge */
(function(){
  function install(){
    const request=(window.capacityAPI&&window.capacityAPI.api)||(window.capacityPlatform&&window.capacityPlatform.request);
    if(!request)return false;
    window.capacityRoleAPI=Object.assign(window.capacityRoleAPI||{},{
      courses:()=>request('/api/platform/courses'),
      trainerCourses:p=>request('/api/trainer/courses',{method:'POST',body:JSON.stringify(p)}),
      updateTrainerCourse:(id,p)=>request('/api/trainer/courses/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify(p)}),
      addResource:p=>request('/api/trainer/resources',{method:'POST',body:JSON.stringify(p)}),
      scheduleLiveClass:p=>request('/api/trainer/live-classes',{method:'POST',body:JSON.stringify(p)}),
      createAssessment:p=>request('/api/trainer/assessments',{method:'POST',body:JSON.stringify(p)}),
      addQuestion:p=>request('/api/trainer/assessment-questions',{method:'POST',body:JSON.stringify(p)}),
      enroll:p=>request('/api/trainee/enrollments',{method:'POST',body:JSON.stringify(p)}),
      myEnrollments:()=>request('/api/trainee/enrollments'),
      myProgress:()=>request('/api/trainee/progress'),
      saveProgress:p=>request('/api/trainee/progress',{method:'POST',body:JSON.stringify(p)}),
      submitAttempt:p=>request('/api/trainee/assessment-attempts',{method:'POST',body:JSON.stringify(p)}),
      trainerEnrollments:()=>request('/api/trainer/enrollments'),
      trainerProgress:()=>request('/api/trainer/progress'),
      notifications:()=>request('/api/notifications'),
      feedback:p=>request('/api/feedback',{method:'POST',body:JSON.stringify(p)}),
      issueCertification:(courseId,extra={})=>request('/api/trainee/certifications',{method:'POST',body:JSON.stringify({...extra,course_id:courseId})}),
      myCertifications:()=>request('/api/trainee/certifications')
    });
    return true;
  }
  if(!install()){
    document.addEventListener('DOMContentLoaded',()=>{if(!install())setTimeout(install,500)});
  }
})();
