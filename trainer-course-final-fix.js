/* Capacity Connect — permanent trainer course source-of-truth controller */
(function(){
  const API_BASE=window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com';
  const token=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
  const role=()=>String((typeof current!=='undefined'&&current&&current.role)||'').toLowerCase();
  async function get(path){
    const t=token();
    const r=await fetch(API_BASE+path,{headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})}});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.message||d.error||('HTTP '+r.status));
    return d;
  }
  function list(d){return Array.isArray(d)?d:(Array.isArray(d&&d.courses)?d.courses:(Array.isArray(d&&d.data)?d.data:[]));}
  function normalize(c){
    if(!c||c.id==null)return null;
    const status=String(c.status||'draft').toLowerCase();
    return Object.assign({},c,{
      id:c.id,title:c.title||c.name||'Course',subject:c.subject||c.category||'',description:c.description||'',
      trainer:c.trainer||c.trainer_name||c.instructor_name||c.owner_name||'',status,
      published:status==='published',is_free:c.is_free!==false,price:Number(c.price||0),
      enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:Array.isArray(c.recordedClasses)?c.recordedClasses:[],
      notes:Array.isArray(c.notes)?c.notes:[],liveClasses:Array.isArray(c.liveClasses)?c.liveClasses:[]
    });
  }
  async function sync(){
    if(role()!=='trainer'||typeof db==='undefined')return;
    try{
      const server=list(await get('/api/trainer/courses')).map(normalize).filter(Boolean);
      const map=new Map((Array.isArray(db.courses)?db.courses:[]).map(c=>[String(c.id),c]));
      server.forEach(c=>map.set(String(c.id),Object.assign({},map.get(String(c.id))||{},c)));
      db.courses=Array.from(map.values());
      if(typeof save==='function')save();
      const page=String(current&&current.page||'');
      if((page==='library'||page==='publish'||page==='courses')&&typeof render==='function')render();
    }catch(e){console.warn('Trainer course source sync:',e.message)}
  }
  function install(){
    if(!(window.capacityAPI&&window.capacityAPI.api))return false;
    const original=window.createCourse;
    if(typeof original==='function'&&!original.__ccStable){
      const wrapped=async function(){
        const result=await original.apply(this,arguments);
        setTimeout(sync,300);
        return result;
      };
      wrapped.__ccStable=true;
      window.createCourse=wrapped;
    }
    sync();
    if(!window.__ccTrainerCourseTimer){window.__ccTrainerCourseTimer=setInterval(sync,3000)}
    return true;
  }
  if(!install())document.addEventListener('DOMContentLoaded',()=>setTimeout(install,900));
  document.addEventListener('capacityPlatformReady',install);
  window.capacityTrainerCourses={refresh:sync};
})();
