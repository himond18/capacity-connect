/* Capacity Connect — production integration layer */
(function(){
  const API=window.capacityAPI&&window.capacityAPI.api;
  if(!API)return;
  const token=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
  async function request(path,options={}){return API(path,options)}
  window.capacityProduction={
    courses:()=>request('/api/platform/courses'),
    me:()=>request('/api/auth/me'),
    notifications:()=>request('/api/notifications'),
    enroll:course_id=>request('/api/trainee/enrollments',{method:'POST',body:JSON.stringify({course_id})}),
    enrollments:()=>request('/api/trainee/enrollments'),
    progress:()=>request('/api/trainee/progress'),
    saveProgress:data=>request('/api/trainee/progress',{method:'POST',body:JSON.stringify(data)}),
    assessments:()=>request('/api/platform/assessments'),
    submitAttempt:data=>request('/api/trainee/assessment-attempts',{method:'POST',body:JSON.stringify(data)}),
    trainerCourses:()=>request('/api/trainer/courses'),
    trainerEnrollments:()=>request('/api/trainer/enrollments'),
    trainerProgress:()=>request('/api/trainer/progress'),
    feedback:data=>request('/api/feedback',{method:'POST',body:JSON.stringify(data)}),
    certifications:()=>request('/api/trainee/certifications'),
    issueCertification:course_id=>request('/api/trainee/certifications',{method:'POST',body:JSON.stringify({course_id})}),
    authToken:token
  };
})();
