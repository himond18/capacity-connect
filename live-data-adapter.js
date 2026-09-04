/* Capacity Connect — live backend data adapter */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;
    if(!api)return false;
    const call=(path,method,body)=>api(path,{method:method||'GET',...(body===undefined?{}:{body:JSON.stringify(body)})});
    window.capacityLiveData={
      async courses(){return (await api('/api/platform/courses')).courses||[]},
      async enrollments(){return (await api('/api/trainee/enrollments')).enrollments||[]},
      async progress(){return (await api('/api/trainee/progress')).progress||[]},
      async notifications(){return (await api('/api/notifications')).notifications||[]},
      async certifications(){return (await api('/api/trainee/certifications')).certifications||[]},
      async trainerCourses(){return (await api('/api/trainer/courses')).courses||[]},
      async trainerEnrollments(){return (await api('/api/trainer/enrollments')).enrollments||[]},
      async trainerProgress(){return (await api('/api/trainer/progress')).progress||[]},
      async adminStats(){return (await api('/api/admin/stats')).stats||{}},
      enroll(courseId){return call('/api/trainee/enrollments','POST',{course_id:courseId})},
      saveProgress(data){return call('/api/trainee/progress','POST',data)},
      submitAttempt(data){return call('/api/trainee/assessment-attempts','POST',data)},
      feedback(data){return call('/api/feedback','POST',data)},
      issueCertification(courseId){return call('/api/trainee/certifications','POST',{course_id:courseId})},
      createCourse(data){return call('/api/trainer/courses','POST',data)},
      updateCourse(id,data){return call('/api/trainer/courses/'+encodeURIComponent(id),'PATCH',data)},
      addResource(data){return call('/api/trainer/resources','POST',data)},
      scheduleLiveClass(data){return call('/api/trainer/live-classes','POST',data)},
      createAssessment(data){return call('/api/trainer/assessments','POST',data)},
      addQuestion(data){return call('/api/trainer/assessment-questions','POST',data)}
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
