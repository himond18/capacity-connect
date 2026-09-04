/* Capacity Connect — submission-critical UI actions */
(function(){
 function boot(){
  const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return false;
  const $=id=>document.getElementById(id), msg=m=>typeof toast==='function'?toast(m):alert(m);
  window.createCourse=async function(){
   const title=$('ctitle')?.value.trim(),subject=$('csubject')?.value.trim(),description=$('cdesc')?.value.trim();
   if(!title||!subject||!description)return msg('Fill course details.');
   try{await api('/api/trainer/courses',{method:'POST',body:JSON.stringify({title,subject,description,status:'draft',is_free:true,price:0})});msg('Course created as draft.');if(typeof render==='function')render()}catch(e){msg(e.message)}
  };
  window.addRecordedClass=async function(){
   const course_id=+$('recCourse')?.value,title=$('recTitle')?.value.trim(),url=$('recUrl')?.value.trim(),description=$('recDesc')?.value.trim();
   if(!course_id||!title||!url)return msg('Course, title and video URL are required.');
   try{await api('/api/trainer/resources',{method:'POST',body:JSON.stringify({course_id,title,url,description,type:'recorded_class'})});msg('Recorded class added.');if(typeof render==='function')render()}catch(e){msg(e.message)}
  };
  window.addCourseNote=async function(){
   const course_id=+$('noteCourse')?.value,title=$('noteTitle')?.value.trim(),url=$('noteUrl')?.value.trim(),description=$('noteDesc')?.value.trim();
   if(!course_id||!title||!url)return msg('Course, title and notes URL are required.');
   try{await api('/api/trainer/resources',{method:'POST',body:JSON.stringify({course_id,title,url,description,type:'notes'})});msg('Notes added.');if(typeof render==='function')render()}catch(e){msg(e.message)}
  };
  window.scheduleLiveClass=async function(){
   const course_id=+$('liveCourse')?.value,title=$('liveTitle')?.value.trim(),date=$('liveDate')?.value,time=$('liveTime')?.value,link=$('liveLink')?.value.trim(),duration=$('liveDuration')?.value.trim(),description=$('liveDesc')?.value.trim();
   if(!course_id||!title||!date||!time||!link)return msg('Course, title, date, time and meeting link are required.');
   try{await api('/api/trainer/live-classes',{method:'POST',body:JSON.stringify({course_id,title,date,time,link,duration,description})});msg('Live class scheduled.');if(typeof render==='function')render()}catch(e){msg(e.message)}
  };
  window.saveProfile=async function(){
   const name=$('pname')?.value.trim();if(!name)return msg('Enter your name.');
   try{const r=await api('/api/auth/me');const old=r.user;sessionStorage.setItem('user',JSON.stringify({...old,name}));if(typeof current!=='undefined')current.name=name;msg('Profile updated for this session.');if(typeof render==='function')render()}catch(e){msg(e.message)}
  };
  return true;
 }
 if(!boot())document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1200));
})();
