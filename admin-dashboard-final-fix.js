/* Capacity Connect — permanent Admin Dashboard state lock */
(function(){
 const API_BASE=window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com';
 const token=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
 let cached=null;
 let dashboardLocked=false;
 let lastPage='';
 function isAdminDashboard(){return typeof current!=='undefined'&&current&&String(current.role||'').toLowerCase()==='admin'&&String(current.page||'').toLowerCase()==='dashboard'}
 function extract(d){const s=d&&((d.stats)||d.data||d)||{};return{totalTrainees:Number(s.totalTrainees??0),totalTrainers:Number(s.totalTrainers??0),activeCourses:Number(s.activeCourses??0),certificationsIssued:Number(s.certificationsIssued??0)}}
 function setMetric(label,value){
  const nodes=[...document.querySelectorAll('.metric,.kpi,.stat,[class*=metric],[class*=stat]')];
  for(const n of nodes){
   const text=(n.innerText||'').toLowerCase();
   if(text.includes(label.toLowerCase())){const v=n.querySelector('strong,b,.value,[class*=value]');if(v)v.textContent=String(value)}
  }
 }
 function apply(){if(!isAdminDashboard()||!cached)return;setMetric('Total Trainees',cached.totalTrainees);setMetric('Total Trainers',cached.totalTrainers);setMetric('Active Courses',cached.activeCourses);setMetric('Certifications Issued',cached.certificationsIssued);document.querySelectorAll('.metric,.kpi,.card,.stat').forEach(n=>{if((n.innerText||'').toLowerCase().includes('assessments completed'))n.remove()})}
 async function fetchStats(){
  const t=token();if(!t||!isAdminDashboard())return;
  try{const r=await fetch(API_BASE+'/api/admin/stats',{headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'}});if(!r.ok)return;const d=await r.json();cached=extract(d);window.capacityServerStats=d.stats||d.data||d;apply()}catch(e){}
 }
 function lockRender(){
  if(typeof window.render!=='function'||window.render.__ccAdminDashboardLock)return;
  const original=window.render;
  const wrapped=function(){
   const now=isAdminDashboard();
   if(now&&dashboardLocked){apply();return;}
   const result=original.apply(this,arguments);
   if(now){dashboardLocked=true;setTimeout(apply,0)}else dashboardLocked=false;
   return result;
  };
  wrapped.__ccAdminDashboardLock=true;
  window.render=wrapped;
 }
 function install(){
  lockRender();
  if(typeof current!=='undefined'&&current){
   const page=String(current.page||'');
   if(page!==lastPage){lastPage=page;if(page!=='dashboard')dashboardLocked=false;}
  }
  if(isAdminDashboard()){apply();fetchStats()}
 }
 function start(){
  install();
  setInterval(install,500);
  setInterval(fetchStats,2000);
  const observer=new MutationObserver(()=>{if(isAdminDashboard())apply()});
  observer.observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,1500));else setTimeout(start,1500);
 window.capacityAdminDashboardFinal={refresh:fetchStats,apply};
})();
