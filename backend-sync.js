/* Capacity Connect — live backend admin counters */
(function(){
  const API_BASE = window.API_BASE || 'https://capacity-connect-backend-9o1f.onrender.com';
  const token = () => sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  async function api(path, options={}) {
    const headers = Object.assign({'Content-Type':'application/json'}, options.headers||{});
    const t = token(); if(t) headers.Authorization = 'Bearer '+t;
    const res = await fetch(API_BASE + path, Object.assign({}, options, {headers}));
    let data = {}; try { data = await res.json(); } catch(e) {}
    if(!res.ok) throw new Error(data.error || data.message || ('Request failed: '+res.status));
    return data;
  }
  window.capacityAPI = {api};

  function setMetric(label, value){
    const nodes = Array.from(document.querySelectorAll('.metric, .kpi, .card, .stat, [class*=metric], [class*=stat]'));
    for(const n of nodes){
      const text=(n.innerText||'').toLowerCase();
      if(text.includes(label.toLowerCase())){
        const strong=n.querySelector('strong, b, .value, [class*=value]');
        if(strong) strong.textContent=String(value);
      }
    }
  }

  async function syncAdminStats(){
    const user=sessionStorage.getItem('user');
    if(!user) return;
    let u; try{u=JSON.parse(user)}catch(e){return;}
    if((u.role||'').toLowerCase()!=='admin') return;
    try{
      let trainees=0, trainers=0, activeCourses=0, certifications=0;
      try{
        const response=await api('/api/admin/stats');
        const s=response.stats || response.data || response;
        trainees=Number(s.totalTrainees ?? 0);
        trainers=Number(s.totalTrainers ?? 0);
        activeCourses=Number(s.activeCourses ?? 0);
        certifications=Number(s.certificationsIssued ?? 0);
      }catch(e){
        // Fallback to the same live database endpoints used by the Admin users page.
        const usersResponse=await api('/api/admin/users');
        const users=Array.isArray(usersResponse)?usersResponse:(usersResponse.users||usersResponse.data||[]);
        trainees=users.filter(x=>String(x.role||'').toLowerCase()==='trainee').length;
        trainers=users.filter(x=>String(x.role||'').toLowerCase()==='trainer').length;
        try{
          const cResponse=await api('/api/admin/courses');
          const courses=Array.isArray(cResponse)?cResponse:(cResponse.courses||cResponse.data||[]);
          activeCourses=courses.filter(x=>String(x.status||'').toLowerCase()==='published').length;
        }catch(_e){}
        try{
          const certResponse=await api('/api/admin/certifications');
          const certs=Array.isArray(certResponse)?certResponse:(certResponse.certifications||certResponse.data||[]);
          certifications=certs.length;
        }catch(_e){}
      }
      setMetric('Total Trainees',trainees);
      setMetric('Total Trainers',trainers);
      setMetric('Active Courses',activeCourses);
      setMetric('Certifications Issued',certifications);
      document.querySelectorAll('.metric,.kpi,.card,.stat').forEach(n=>{
        if((n.innerText||'').toLowerCase().includes('assessments completed')) n.remove();
      });
    }catch(e){ console.warn('Capacity Connect admin stats sync:',e.message); }
  }
  window.syncAdminStats = syncAdminStats;
  function start(){ syncAdminStats(); setTimeout(syncAdminStats,1200); setInterval(syncAdminStats,10000); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
  window.addEventListener('load',()=>setTimeout(syncAdminStats,500));
})();