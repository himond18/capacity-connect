/* Capacity Connect — Admin data layer */
(function(){
  const API_BASE='https://capacity-connect-backend-9o1f.onrender.com';
  const getToken=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
  async function request(path,options={}){
    const headers={...(options.headers||{})};
    if(!headers['Content-Type']) headers['Content-Type']='application/json';
    const t=getToken(); if(t) headers.Authorization='Bearer '+t;
    const r=await fetch(API_BASE+path,{...options,headers});
    const d=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(d.error||d.message||`HTTP ${r.status}`);
    return d;
  }
  window.capacityConnectAdmin={
    stats:()=>request('/api/admin/stats'),
    users:()=>request('/api/admin/users'),
    approve:(id,status)=>request('/api/admin/users/'+encodeURIComponent(id)+'/approval',{method:'PATCH',body:JSON.stringify({status})}),
    remove:(id)=>request('/api/admin/users/'+encodeURIComponent(id),{method:'DELETE'}),
    courses:()=>request('/api/admin/courses'),
    courseStatus:(id,status)=>request('/api/admin/courses/'+encodeURIComponent(id)+'/status',{method:'PATCH',body:JSON.stringify({status})})
  };
})();
