/* Capacity Connect — frontend role API bridge */
(function(){
  const api = window.capacityAPI || {};
  const request = api.api || (window.capacityPlatform && window.capacityPlatform.request);
  if(!request) return;

  window.capacityRoleAPI = {
    courses: () => request('/api/platform/courses'),
    trainerCourses: (payload) => request('/api/trainer/courses',{method:'POST',body:JSON.stringify(payload)}),
    updateTrainerCourse: (id,payload) => request('/api/trainer/courses/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify(payload)}),
    addResource: (payload) => request('/api/trainer/resources',{method:'POST',body:JSON.stringify(payload)}),
    scheduleLiveClass: (payload) => request('/api/trainer/live-classes',{method:'POST',body:JSON.stringify(payload)}),
    createAssessment: (payload) => request('/api/trainer/assessments',{method:'POST',body:JSON.stringify(payload)}),
    addQuestion: (payload) => request('/api/trainer/assessment-questions',{method:'POST',body:JSON.stringify(payload)}),
    enroll: (payload) => request('/api/trainee/enrollments',{method:'POST',body:JSON.stringify(payload)}),
    myEnrollments: () => request('/api/trainee/enrollments'),
    myProgress: () => request('/api/trainee/progress'),
    saveProgress: (payload) => request('/api/trainee/progress',{method:'POST',body:JSON.stringify(payload)}),
    submitAttempt: (payload) => request('/api/trainee/assessment-attempts',{method:'POST',body:JSON.stringify(payload)}),
    trainerEnrollments: () => request('/api/trainer/enrollments'),
    trainerProgress: () => request('/api/trainer/progress'),
    notifications: () => request('/api/notifications'),
    feedback: (payload) => request('/api/feedback',{method:'POST',body:JSON.stringify(payload)})
  };
})();
