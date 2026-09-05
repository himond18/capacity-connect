/* Capacity Connect — trainee published-course source-of-truth fix */
(function(){
 const API_BASE=window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com';
 const token=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
 let lastSignature='';
 async function get(path){
  const t=token();
  const r=await fetch(API_BASE+path,{headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})}});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.message||d.error||('HTTP '+r.status));
  return d;
 }
 function normalize(c){
  if(!c||c.id==null)return null;
  const status=String(c.status||'').toLowerCase();
  return {id:c.id,title:c.title||c.name||'Course',subject:c.subject||c.category||'',description:c.description||'',trainer:c.trainer||c.trainer_name||c.instructor_name||'',status:status||'published',published:c.published===true||status==='published'||(!c.status),enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:Array.isArray(c.recordedClasses)?c.recordedClasses:[],notes:Array.isArray(c.notes)?c.notes:[],liveClasses:Array.isArray(c.liveClasses)?c.liveClasses:[]};
 }
 function isPublished(c){const s=String(c.status||'').toLowerCase();return c.published===true||s==='published'||s==='active'||!s;}
 async function sync(){
  if(typeof current==='undefined'||!current||String(current.role||'').toLowerCase()!=='trainee')return;
  try{
   const results=await Promise.allSettled([get('/api/platform/courses'),get('/api/courses')]);
   const map=new Map();
   results.forEach(x=>{
    if(x.status!=='fulfilled')return;
    const d=x.value||{};const list=Array.isArray(d.courses)?d.courses:(Array.isArray(d.data)?d.data:[]);
    list.map(normalize).filter(Boolean).forEach(c=>{if(isPublished(c)||!map.has(String(c.id)))map.set(String(c.id),c)});
   });
   const courses=Array.from(map.values()).filter(isPublished);
   if(typeof db==='undefined')return;
   const sig=courses.map(c=>String(c.id)+':'+c.status+':'+c.title).sort().join('|');
   if(sig===lastSignature&&Array.isArray(db.courses)&&db.courses.length===courses.length)return;
   lastSignature=sig;
   db.courses=courses;
   if(typeof save==='function')save();
   if(String(current.page||'')==='courses'&&typeof render==='function')render();
  }catch(e){console.warn('Trainee published courses sync:',e.message)}
 }
 function start(){sync();setInterval(sync,5000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,1800));else setTimeout(start,1800);
 window.capacityTraineeCourses={refresh:sync};
})();
