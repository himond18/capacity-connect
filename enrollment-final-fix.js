/* Capacity Connect — permanent trainee enrollment controller */
(function(){
 function boot(){
  const api=window.capacityAPI&&window.capacityAPI.api;if(!api)return false;
  const msg=m=>typeof toast==='function'?toast(m):alert(m);
  const getUser=()=>{try{return JSON.parse(sessionStorage.getItem('user')||localStorage.getItem('user')||'{}')}catch(e){return{}}};
  window.capacityEnroll=async function(id,button){
   if(id==null||String(id)==='')return msg('Course ID is missing.');
   const b=button||null;if(b){b.disabled=true;b.dataset.oldText=b.textContent;b.textContent='Enrolling...'}
   try{
    const r=await api('/api/trainee/enrollments',{method:'POST',body:JSON.stringify({course_id:id})});
    if(typeof db!=='undefined'){
     const u=db.users&&db.users.find(x=>String(x.email||'').toLowerCase()===String(getUser().email||'').toLowerCase());
     if(u){u.enrolled=Array.isArray(u.enrolled)?u.enrolled:[];if(!u.enrolled.some(x=>String(x)===String(id)))u.enrolled.push(id)}
     const c=db.courses&&db.courses.find(x=>String(x.id)===String(id));if(c)c.enrollmentCount=Number(c.enrollmentCount||0)+(r&&r.alreadyEnrolled?0:1);
     if(typeof save==='function')save();
    }
    msg(r&&r.alreadyEnrolled?'You are already enrolled.':'Enrolled successfully.');
    if(typeof render==='function')render();
    return r;
   }catch(e){if(b){b.disabled=false;b.textContent=b.dataset.oldText||'Enroll'}msg(e.message||'Could not enroll in course.');throw e}
  };
  window.enroll=window.capacityEnroll;
  document.addEventListener('click',function(e){
   let b=e.target&&e.target.closest?e.target.closest('button,a'):null;if(!b)return;
   const raw=b.getAttribute('onclick')||'';
   const m=raw.match(/(?:window\.)?enroll\s*\(\s*['"]?([^,'")\s]+)['"]?/i);
   if(!m)return;
   e.preventDefault();e.stopImmediatePropagation();
   window.capacityEnroll(m[1],b).catch(()=>{});
  },true);
  return true;
 }
 if(!boot())document.addEventListener('capacityPlatformReady',boot);
})();
