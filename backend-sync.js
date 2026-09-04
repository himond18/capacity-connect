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
    const nodes = Array.from(document.querySelectorAll('.metric, .kpi, .card, .stat, [class*=metric]'));
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
      const response=await api('/api/admin/stats');
      const s=response.stats || response.data || response;
      setMetric('Total Trainees',s.totalTrainees??0);
      setMetric('Total Trainers',s.totalTrainers??0);
      setMetric('Active Courses',s.activeCourses??0);
      setMetric('Certifications Issued',s.certificationsIssued??0);
      document.querySelectorAll('.metric,.kpi').forEach(n=>{
        if((n.innerText||'').toLowerCase().includes('assessments completed')) n.remove();
      });
    }catch(e){ console.warn('Capacity Connect admin stats sync:',e.message); }
  }
  window.syncAdminStats = syncAdminStats;

  document.addEventListener('DOMContentLoaded',()=>{
    syncAdminStats();
    setTimeout(syncAdminStats,1200);
    setInterval(syncAdminStats,10000);
  });
  window.addEventListener('load',()=>setTimeout(syncAdminStats,500));
})();
