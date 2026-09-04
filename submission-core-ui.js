/* Capacity Connect — submission-critical UI actions */
(function(){
 function boot(){
  const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return false;
  const $=id=>document.getElementById(id), msg=m=>typeof toast==='function'?toast(m):alert(m);
  const syncCourse=c=>c?{id:c.id,title:c.title||'Course',subject:c.subject||'',description:c.description||'',trainer:c.trainer||c.trainer_name||'',published:(c.status||'').toLowerCase()==='published',status:c.status||'draft',enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:[],notes:[],liveClasses:[]}:null;
  window.createCourse=async function(){
   const title=$('ctitle')?.value.trim(),subject=$('csubject')?.value.trim(),description=$('cdesc')?.value.trim();
   if(!title||!subject||!description)return msg('Fill course details.');
   try{const r=await api('/api/trainer/courses',{method:'POST',body:JSON.stringify({title,subject,description,status:'draft',is_free:true,price:0})});if(typeof db!=='undefined'&&r.course){db.courses=db.courses||[];db.courses.unshift(syncCourse(r.course));if(typeof save==='function')save()}msg('Course created as draft.');if(typeof render==='function')render()}catch(e){msg(e.message)}
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
  window.createAssessment=async function(){
   const course_id=+$('acourse')?.value,title=$('atitle')?.value.trim(),topic=$('atopic')?.value.trim(),question=$('aq')?.value.trim();
   const options=[0,1,2,3].map(i=>($('ao'+i)?.value||'').trim()),correct=Number($('aans')?.value);
   if(!course_id||!title||!question||options.some(x=>!x)||!Number.isInteger(correct)||correct<0||correct>3)return msg('Complete the assessment question and all options.');
   try{
    const r=await api('/api/trainer/assessments',{method:'POST',body:JSON.stringify({course_id,title,topic,status:'published',published:true})});
    const assessmentId=r.assessment?.id||r.id||r.data?.id;if(!assessmentId)throw new Error('Assessment was created but its ID was not returned.');
    await api('/api/trainer/assessment-questions',{method:'POST',body:JSON.stringify({assessment_id:assessmentId,question,options,correct_answer:correct,correct:correct,answer:correct})});
    msg('Assessment created and published.');if(typeof render==='function')render();
   }catch(e){msg(e.message)}
  };
  window.saveProfile=async function(){
   const name=$('pname')?.value.trim();if(!name)return msg('Enter your name.');
   try{const r=await api('/api/auth/me');const old=r.user;sessionStorage.setItem('user',JSON.stringify({...old,name}));if(typeof current!=='undefined')current.name=name;msg('Profile updated for this session.');if(typeof render==='function')render()}catch(e){msg(e.message)}
  };
  return true;
 }
 if(!boot())document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1200));
})();
