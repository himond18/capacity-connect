/* Capacity Connect — permanent Training Library controller */
(function(){
  const KEY='capacity_connect_created_courses_v1';
  const api=()=>window.capacityAPI&&window.capacityAPI.api;
  const msg=m=>typeof toast==='function'?toast(m):alert(m);
  const esc=s=>String(s==null?'':s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}};
  const write=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}};
  function norm(c){if(!c)return null;return {id:c.id,title:c.title||'Untitled Course',subject:c.subject||'',description:c.description||'',status:String(c.status||'draft').toLowerCase(),published:String(c.status||'').toLowerCase()==='published'||c.published===true,trainer:c.trainer||c.trainer_name||'',enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:Array.isArray(c.recordedClasses)?c.recordedClasses:[],notes:Array.isArray(c.notes)?c.notes:[],liveClasses:Array.isArray(c.liveClasses)?c.liveClasses:[]}};
  function merged(server){
    const map=new Map();
    (Array.isArray(server)?server:[]).map(norm).filter(Boolean).forEach(c=>map.set(String(c.id),c));
    (typeof db!=='undefined'&&Array.isArray(db.courses)?db.courses:[]).map(norm).filter(Boolean).forEach(c=>{if(!map.has(String(c.id)))map.set(String(c.id),c)});
    read().map(norm).filter(Boolean).forEach(c=>{if(!map.has(String(c.id)))map.set(String(c.id),c)});
    return [...map.values()];
  }
  function persist(list){const clean=list.filter(Boolean);write(clean);if(typeof db!=='undefined'){db.courses=clean;if(typeof save==='function')save()}}
  function isLibrary(){return typeof current!=='undefined'&&current&&String(current.role||'').toLowerCase()==='trainer'&&String(current.page||'')==='publish'}
  function box(){
    const h=[...document.querySelectorAll('h2,h3,h4')].find(x=>/^My Courses$/i.test((x.textContent||'').trim()));
    if(!h)return null;
    let p=h.parentElement;
    for(let i=0;i<6&&p;i++,p=p.parentElement){const kids=[...p.children];if(kids.some(k=>k!==h&&/course/i.test(k.textContent||'')))return kids[kids.length-1]||p}
    return h.parentElement;
  }
  function renderCards(list){
    const b=box();if(!b)return false;
    if(!list.length){b.innerHTML='<div class="empty">Create your first course above.</div>';return true}
    b.innerHTML='<div class="courseGrid" id="ccTrainingCourseGrid">'+list.map(c=>{
      const pub=c.published||c.status==='published';
      return '<div class="courseCard" data-course-id="'+esc(c.id)+'"><h3>'+esc(c.title)+'</h3><div style="color:#667085;font-size:13px;margin-bottom:8px">'+esc(c.subject)+'</div><p style="color:#667085;font-size:13px;line-height:1.5">'+esc(c.description)+'</p><div><span class="freeTag">FREE</span> <span class="status '+(pub?'approved':'pending')+'">'+(pub?'Published':'Draft')+'</span></div><div style="margin-top:10px;color:#667085;font-size:12px">Enrolled: '+Number(c.enrollmentCount||0)+'</div><div class="courseActions">'+(pub?'<button type="button" class="btn" disabled>Published</button>':'<button type="button" class="btn fill" data-cc-final-publish="'+esc(c.id)+'">Publish</button>')+'<button type="button" class="btn" data-cc-final-refresh="1">Refresh</button></div></div>';
    }).join('')+'</div>';
    return true;
  }
  function selects(list){['recCourse','noteCourse','liveCourse','acourse'].forEach(id=>{const s=document.getElementById(id);if(!s)return;const old=String(s.value||'');s.innerHTML='<option value="">Select course</option>'+list.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.title)+'</option>').join('');if(old&&list.some(c=>String(c.id)===old))s.value=old})}
  async function refresh(){
    const A=api();
    let server=[];
    if(A){try{const r=await A('/api/trainer/courses');server=Array.isArray(r)?r:(r&&Array.isArray(r.courses)?r.courses:[])}catch(e){server=[]}}
    /* An empty response is not a deletion signal. Preserve the local/previous list. */
    const list=merged(server);
    if(list.length)persist(list);
    selects(list);renderCards(list);return list;
  }
  async function publish(id){
    const A=api();if(!A)return msg('Backend connection is unavailable.');
    const btn=document.querySelector('[data-cc-final-publish="'+CSS.escape(String(id))+'"]');if(btn){btn.disabled=true;btn.textContent='Publishing...'}
    try{
      let done=false,lastError=null;
      for(const method of ['PATCH','PUT']){
        try{await A('/api/trainer/courses/'+encodeURIComponent(id),{method,body:JSON.stringify({status:'published',published:true})});done=true;break}
        catch(e){lastError=e;if(!/HTTP\s*(404|405)/i.test(String(e.message||'')))break}
      }
      if(!done)throw lastError||new Error('Could not publish course.');
      const list=merged([]).map(c=>String(c.id)===String(id)?Object.assign({},c,{status:'published',published:true}):c);
      persist(list);selects(list);renderCards(list);msg('Course published successfully.');
    }catch(e){if(btn){btn.disabled=false;btn.textContent='Publish'}msg(e&&e.message?e.message:'Could not publish course.')}
  }
  function bind(){
    if(window.__ccPermanentLibraryBound)return;window.__ccPermanentLibraryBound=true;
    document.addEventListener('click',function(e){
      const p=e.target.closest&&e.target.closest('[data-cc-final-publish]');
      if(p){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();publish(p.getAttribute('data-cc-final-publish'));return}
      const q=e.target.closest&&e.target.closest('[data-cc-final-refresh]');
      if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();refresh();}
    },true);
  }
  function install(){
    if(!api())return false;
    bind();
    /* Snapshot whatever is already visible before any delayed backend refresh. */
    if(typeof db!=='undefined'&&Array.isArray(db.courses)&&db.courses.length){
      const old=read();const map=new Map(old.map(c=>[String(c.id),c]));db.courses.map(norm).filter(Boolean).forEach(c=>map.set(String(c.id),c));write([...map.values()]);
    }
    const r=window.render;
    if(typeof r==='function'&&!r.__ccPermanentLibrary){
      const wrapped=function(){if(isLibrary()&&!window.__ccPermanentLibraryAllowRender)return;return r.apply(this,arguments)};
      wrapped.__ccPermanentLibrary=true;window.render=wrapped;
    }
    const oldCreate=window.createCourse;
    if(typeof oldCreate==='function'&&!oldCreate.__ccPermanentCreate){
      const create=async function(){const result=await oldCreate.apply(this,arguments);setTimeout(refresh,250);return result};
      create.__ccPermanentCreate=true;window.createCourse=create;
    }
    if(isLibrary())setTimeout(refresh,100);
    setInterval(()=>{if(isLibrary())refresh()},3000);
    window.capacityTrainingLibraryFinal={refresh,publish,merged};
    return true;
  }
  if(!install())document.addEventListener('DOMContentLoaded',()=>setTimeout(install,2200));
})();
