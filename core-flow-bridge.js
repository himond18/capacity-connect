/* Capacity Connect — minimum submission flow bridge */
(function(){
  function boot(){
    const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return false;
    const msg=m=>typeof toast==='function'?toast(m):alert(m);const v=id=>(document.getElementById(id)||{}).value||'';
    window.createCourse=async function(){const title=v('ctitle').trim(),subject=v('csubject').trim(),description=v('cdesc').trim();if(!title||!subject||!description)return msg('Fill course details.');try{await api('/api/trainer/courses',{method:'POST',body:JSON.stringify({title,subject,description,status:'draft',is_free:true,price:0})});msg('Course created as draft.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.publishCourse=async function(id){try{await api('/api/trainer/courses/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status:'published'})});msg('Course published.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.addRecordedClass=async function(){const course_id=v('recCourse'),title=v('recTitle').trim(),url=v('recUrl').trim(),description=v('recDesc').trim();if(!course_id||!title||!url)return msg('Course, title and video URL are required.');try{await api('/api/trainer/resources',{method:'POST',body:JSON.stringify({course_id,title,url,description,type:'recorded'})});msg('Recorded class added.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.addCourseNote=async function(){const course_id=v('noteCourse'),title=v('noteTitle').trim(),url=v('noteUrl').trim(),description=v('noteDesc').trim();if(!course_id||!title||!url)return msg('Course, title and notes URL are required.');try{await api('/api/trainer/resources',{method:'POST',body:JSON.stringify({course_id,title,url,description,type:'notes'})});msg('Notes added.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.scheduleLiveClass=async function(){const course_id=v('liveCourse'),title=v('liveTitle').trim(),date=v('liveDate'),time=v('liveTime'),link=v('liveLink').trim(),duration=v('liveDuration').trim(),description=v('liveDesc').trim();if(!course_id||!title||!date||!time||!link)return msg('Course, title, date, time and meeting link are required.');try{await api('/api/trainer/live-classes',{method:'POST',body:JSON.stringify({course_id,title,date,time,link,duration,description})});msg('Live class scheduled.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.enroll=async function(id){try{await api('/api/trainee/enrollments',{method:'POST',body:JSON.stringify({course_id:id})});msg('Enrolled successfully.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.submitFeedback=async function(){const category=v('fcat'),message=v('fmsg').trim();if(!message)return msg('Enter your feedback.');try{await api('/api/feedback',{method:'POST',body:JSON.stringify({category,message})});msg('Feedback submitted.');if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.approveUser=async function(id){try{await api('/api/admin/users/'+encodeURIComponent(id)+'/approval',{method:'PATCH',body:JSON.stringify({status:'approved'})});msg('User approved.');if(window.syncAdminStats)window.syncAdminStats();if(typeof render==='function')render()}catch(e){msg(e.message)}};
    window.logout=function(){sessionStorage.clear();localStorage.removeItem('token');localStorage.removeItem('user');location.reload()};
    return true;
  }
  if(!boot())document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,800));
})();
