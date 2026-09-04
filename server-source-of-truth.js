/* Capacity Connect — server is source of truth for shared data */
(function(){
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function boot(){
  const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return;
  const token=sessionStorage.getItem('token')||localStorage.getItem('token');if(!token)return;
  const user=JSON.parse(sessionStorage.getItem('user')||'null');if(!user)return;
  try{
   const fresh=await api('/api/auth/me');
   if(fresh.user){sessionStorage.setItem('user',JSON.stringify(fresh.user));if(typeof current!=='undefined')current=fresh.user;}
   if(typeof db==='undefined')return;
   const role=(fresh.user||user).role;
   if(role==='trainee'){
    const [courses,enrollments,progress,notifications,certs,assessments]=await Promise.all([
     api('/api/platform/courses').catch(()=>({courses:[]})),api('/api/trainee/enrollments').catch(()=>({enrollments:[]})),api('/api/trainee/progress').catch(()=>({progress:[]})),api('/api/notifications').catch(()=>({notifications:[]})),api('/api/trainee/certifications').catch(()=>({certifications:[]})),api('/api/platform/assessments').catch(()=>({assessments:[]}))
    ]);
    db.courses=(courses.courses||[]).map(c=>({id:c.id,title:c.title||'Course',subject:c.subject||'',description:c.description||'',trainer:c.trainer||c.trainer_name||'',published:true,status:c.status||'published',enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:[],notes:[],liveClasses:[]}));
    const u=db.users?.find(x=>String(x.email).toLowerCase()===String((fresh.user||user).email).toLowerCase());
    if(u){u.enrolled=(enrollments.enrollments||[]).map(e=>e.course_id??e.courseId).filter(x=>x!=null);u.certifications=certs.certifications||[];}
    db.assessments=(assessments.assessments||[]).map(a=>({...a,questions:Array.isArray(a.questions)?a.questions:[]}));
    db.notifications=notifications.notifications||db.notifications||[];db.courseProgress=progress.progress||db.courseProgress||[];
   }else if(role==='trainer'){
    const [courses,resources,live,assessments,enrollments,progress]=await Promise.all([
     api('/api/trainer/courses').catch(()=>({courses:[]})),api('/api/trainer/resources').catch(()=>({resources:[]})),api('/api/trainer/live-classes').catch(()=>({liveClasses:[]})),api('/api/trainer/assessments').catch(()=>({assessments:[]})),api('/api/trainer/enrollments').catch(()=>({enrollments:[]})),api('/api/trainer/progress').catch(()=>({progress:[]}))
    ]);
    db.courses=(courses.courses||[]).map(c=>({id:c.id,title:c.title||'Course',subject:c.subject||'',description:c.description||'',trainer:(fresh.user||user).name,published:String(c.status||'').toLowerCase()==='published',status:c.status||'draft',enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:(resources.resources||[]).filter(r=>String(r.course_id??r.courseId)===String(c.id)&&String(r.type||'').toLowerCase().includes('recorded')),notes:(resources.resources||[]).filter(r=>String(r.course_id??r.courseId)===String(c.id)&&String(r.type||'').toLowerCase().includes('note')),liveClasses:(live.liveClasses||[]).filter(x=>String(x.course_id??x.courseId)===String(c.id))}));
    db.assessments=assessments.assessments||db.assessments||[];db.enrollments=enrollments.enrollments||db.enrollments||[];db.courseProgress=progress.progress||db.courseProgress||[];
   }else if(role==='admin'){
    const [stats,users,courses,certs]=await Promise.all([api('/api/admin/stats').catch(()=>({stats:{}})),api('/api/admin/users').catch(()=>({users:[]})),api('/api/admin/courses').catch(()=>({courses:[]})),api('/api/admin/certifications').catch(()=>({certifications:[]}))]);
    db.users=users.users||db.users||[];db.courses=courses.courses||db.courses||[];db.certifications=certs.certifications||db.certifications||[];window.capacityServerStats=stats.stats||{};
   }
   if(typeof render==='function')render();
  }catch(e){console.warn('Capacity server sync:',e.message)}
 }
 function start(){boot();setInterval(boot,10000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,1500));else setTimeout(start,1500);
 window.capacityServerSync=boot;
})();
