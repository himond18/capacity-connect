/* Capacity Connect — persistent trainer course list fix */
(function(){
 const KEY='capacity_connect_created_courses_v1';
 const api=()=>window.capacityAPI&&window.capacityAPI.api;
 const val=id=>String((document.getElementById(id)||{}).value||'').trim();
 const msg=m=>typeof toast==='function'?toast(m):alert(m);
 function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
 function write(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
 function normalize(c){return c?{id:c.id,title:c.title||'Course',subject:c.subject||'',description:c.description||'',trainer:c.trainer||c.trainer_name||'',published:String(c.status||'').toLowerCase()==='published',status:c.status||'draft',enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:Array.isArray(c.recordedClasses)?c.recordedClasses:[],notes:Array.isArray(c.notes)?c.notes:[],liveClasses:Array.isArray(c.liveClasses)?c.liveClasses:[]}:null}
 function merge(){
  if(typeof db==='undefined')return;
  const shadows=read();if(!Array.isArray(db.courses))db.courses=[];
  shadows.forEach(s=>{if(s&&s.id!=null&&!db.courses.some(c=>String(c.id)===String(s.id)))db.courses.unshift(s)});
 }
 function reconcile(serverCourses){
  const server=Array.isArray(serverCourses)?serverCourses:[];
  const ids=new Set(server.map(c=>String(c.id)));
  const shadows=read().filter(c=>!ids.has(String(c.id)));
  write(shadows);
  merge();
 }
 function install(){
  const API=api();if(!API)return false;
  merge();
  const originalRender=window.render;
  if(typeof originalRender==='function'&&!originalRender.__coursePersistenceWrapped){
   const wrapped=function(){merge();return originalRender.apply(this,arguments)};
   wrapped.__coursePersistenceWrapped=true;window.render=wrapped;
  }
  window.createCourse=async function(){
   const title=val('ctitle'),subject=val('csubject'),description=val('cdesc');
   if(!title||!subject||!description)return msg('Fill course details.');
   try{
    const r=await API('/api/trainer/courses',{method:'POST',body:JSON.stringify({title,subject,description,status:'draft',is_free:true,price:0})});
    const course=normalize(r&&r.course);
    if(!course)throw new Error('Course was created but the server did not return the course record.');
    const shadows=read().filter(c=>String(c.id)!==String(course.id));shadows.unshift(course);write(shadows);
    if(typeof db!=='undefined'){db.courses=db.courses||[];db.courses=db.courses.filter(c=>String(c.id)!==String(course.id));db.courses.unshift(course);if(typeof save==='function')save()}
    msg('Course created as draft.');
    if(typeof render==='function')render();
    return r;
   }catch(e){msg(e.message||'Could not create course.');throw e}
  };
  window.capacityCoursePersistence={merge,reconcile,read,write};
  setInterval(merge,1500);
  return true;
 }
 if(!install())document.addEventListener('DOMContentLoaded',()=>setTimeout(install,1200));
})();
