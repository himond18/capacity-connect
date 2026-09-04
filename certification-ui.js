/* Capacity Connect — trainee certification UI bridge */
(function(){
  function load(){
    const api=window.capacityRoleAPI;if(!api)return;
    window.capacityCertificationAPI={
      issue:(courseId,extra={})=>fetch((window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com')+'/api/trainee/certifications',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+(sessionStorage.getItem('token')||localStorage.getItem('token')||'')},body:JSON.stringify(Object.assign({},extra,{course_id:courseId}))}).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||d.error||'Certification request failed');return d}),
      mine:()=>fetch((window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com')+'/api/trainee/certifications',{headers:{Authorization:'Bearer '+(sessionStorage.getItem('token')||localStorage.getItem('token')||'')}}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.message||'Could not load certifications');return d})
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(load,600));else setTimeout(load,600);
})();
