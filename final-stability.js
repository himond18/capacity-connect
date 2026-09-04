/* Capacity Connect — final UI stability guard */
(function(){
 const allowed={trainee:['dashboard','profile','courses','resources','mcq','questionnaires','feedback','courseDetail'],trainer:['dashboard','profile','participants','questionnaires','library','feedback','courseDetail'],admin:['dashboard','users','courses','monitoring','assessments','publish','feedback']};
 let lastPage='dashboard',lastCourseId=null;
 function normalize(){
  if(typeof current==='undefined'||!current)return;
  const role=String(current.role||'trainee').toLowerCase();
  current.role=role==='admin'?'admin':role==='trainer'?'trainer':'trainee';
  if(current.page && allowed[current.role] && allowed[current.role].includes(current.page))lastPage=current.page;
  if(current.courseId!=null)lastCourseId=current.courseId;
  if(!current.page || !allowed[current.role] || !allowed[current.role].includes(current.page))current.page=lastPage||'dashboard';
  if(lastCourseId!=null && current.courseId==null)current.courseId=lastCourseId;
 }
 function install(){
  if(typeof window.render==='function' && !window.__ccStableRender){
   const original=window.render;
   window.render=function(){normalize();return original.apply(this,arguments)};
   window.__ccStableRender=true;
  }
  normalize();
 }
 function start(){install();setInterval(install,500)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,1200));else setTimeout(start,1200);
})();
