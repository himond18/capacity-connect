/* Capacity Connect — Training Library UI + persistence repair */
(function(){
  const KEY='capacity_connect_created_courses_v1';
  const api=()=>window.capacityAPI&&window.capacityAPI.api;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}};
  const write=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}};
  const msg=m=>typeof toast==='function'?toast(m):alert(m);
  function norm(c){
    if(!c)return null;
    return {id:c.id,title:c.title||'Untitled Course',subject:c.subject||'',description:c.description||'',status:String(c.status||'draft').toLowerCase(),published:String(c.status||'').toLowerCase()==='published',trainer:c.trainer||c.trainer_name||'',enrollmentCount:Number(c.enrollment_count||c.enrollmentCount||0),recordedClasses:Array.isArray(c.recordedClasses)?c.recordedClasses:[],notes:Array.isArray(c.notes)?c.notes:[],liveClasses:Array.isArray(c.liveClasses)?c.liveClasses:[]};
  }
  function allCourses(server){
    const map=new Map();
    (Array.isArray(server)?server:[]).map(norm).filter(Boolean).forEach(c=>map.set(String(c.id),c));
    (typeof db!=='undefined'&&Array.isArray(db.courses)?db.courses:[]).map(norm).filter(Boolean).forEach(c=>{if(!map.has(String(c.id)))map.set(String(c.id),c)});
    read().map(norm).filter(Boolean).forEach(c=>{if(!map.has(String(c.id)))map.set(String(c.id),c)});
    return Array.from(map.values());
  }
  function saveCourses(list){
    const clean=list.filter(Boolean);write(clean);if(typeof db!=='undefined'){db.courses=clean;if(typeof save==='function')save()}
  }
  function findMyCoursesBox(){
    const nodes=[...document.querySelectorAll('h2,h3,h4')];
    const h=nodes.find(x=>/my\s+courses/i.test(x.textContent||''));
    if(!h)return null;
    let p=h.parentElement;
    for(let i=0;i<4&&p;i++,p=p.parentElement){
      if(p.querySelector('.empty')||/My Courses/i.test(p.textContent||'')){
        const kids=[...p.children];
        if(kids.length>=2)return kids[kids.length-1];
      }
    }
    return h.parentElement;
  }
  function renderCourses(server){
    const box=findMyCoursesBox();if(!box)return false;
    const courses=allCourses(server);
    if(!courses.length){box.innerHTML='<div class="empty">Create your first course above.</div>';return true}
    box.innerHTML='<div class="courseGrid" id="ccTrainingCourseGrid">'+courses.map(c=>{
      const published=c.status==='published'||c.published;
      return '<div class="courseCard" data-course-id="'+esc(c.id)+'">'+
        '<h3>'+esc(c.title)+'</h3>'+
        '<div style="color:#667085;font-size:13px;margin-bottom:8px">'+esc(c.subject)+'</div>'+
        '<p style="color:#667085;font-size:13px;line-height:1.5">'+esc(c.description)+'</p>'+
        '<div><span class="freeTag">FREE</span> <span class="status '+(published?'approved':'pending')+'">'+(published?'Published':'Draft')+'</span></div>'+ 
        '<div style="margin-top:10px;color:#667085;font-size:12px">Enrolled: '+Number(c.enrollmentCount||0)+'</div>'+
        '<div class="courseActions">'+
        (!published?'<button class="btn fill" data-cc-publish="'+esc(c.id)+'">Publish</button>':'<button class="btn" disabled>Published</button>')+
        '<button class="btn" data-cc-refresh="1">Refresh</button></div>'+
        '</div>';
    }).join('')+'</div>';
    return true;
  }
  async function load(){
    const A=api();if(!A)return [];
    try{
      const r=await A('/api/trainer/courses');
      const server=Array.isArray(r)?r:(r&&Array.isArray(r.courses)?r.courses:[]);
      const merged=allCourses(server);saveCourses(merged);renderCourses(server);return server;
    }catch(e){renderCourses([]);return []}
  }
  async function publish(id){
    const A=api();if(!A)return;
    try{
      await A('/api/trainer/courses/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status:'published'})});
      const next=read().map(c=>String(c.id)===String(id)?Object.assign({},c,{status:'published',published:true}):c);write(next);
      if(typeof db!=='undefined'&&Array.isArray(db.courses))db.courses=db.courses.map(c=>String(c.id)===String(id)?Object.assign({},c,{status:'published',published:true}):c);
      msg('Course published.');renderCourses(next);if(typeof render==='function')setTimeout(()=>render(),0);
    }catch(e){msg(e.message||'Could not publish course.')}
  }
  function bind(){
    if(window.__ccTrainingLibraryBound)return;
    window.__ccTrainingLibraryBound=true;
    document.addEventListener('click',e=>{
      const b=e.target.closest&&e.target.closest('[data-cc-publish]');
      if(b){e.preventDefault();e.stopPropagation();publish(b.getAttribute('data-cc-publish'));return}
      const r=e.target.closest&&e.target.closest('[data-cc-refresh]');
      if(r){e.preventDefault();e.stopPropagation();load()}
    },true);
  }
  function install(){
    if(!api())return false;
    bind();
    const oldRender=window.render;
    if(typeof oldRender==='function'&&!oldRender.__ccTrainingLibrary){
      const wrapped=function(){const out=oldRender.apply(this,arguments);setTimeout(()=>{if(typeof current!=='undefined'&&String(current.page)==='publish')renderCourses(read())},0);return out};
      wrapped.__ccTrainingLibrary=true;window.render=wrapped;
    }
    const oldCreate=window.createCourse;
    window.createCourse=async function(){
      if(typeof oldCreate==='function'){
        const result=await oldCreate.apply(this,arguments);
        setTimeout(load,250);
        return result;
      }
      throw new Error('Course creation is unavailable.');
    };
    if(typeof current!=='undefined'&&String(current.page)==='publish')load();
    return true;
  }
  if(!install())document.addEventListener('DOMContentLoaded',()=>setTimeout(install,1800));
})();
