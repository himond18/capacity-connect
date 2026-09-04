/* Capacity Connect — Admin user approval UI fix */
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const API_BASE=window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com';
  const token=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
  async function request(path,options={}){
    const headers=Object.assign({'Content-Type':'application/json'},options.headers||{});
    const t=token(); if(t) headers.Authorization='Bearer '+t;
    const r=await fetch(API_BASE+path,Object.assign({},options,{headers}));
    const d=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(d.error||d.message||('Request failed: '+r.status));
    return d;
  }
  const admin=()=>window.capacityConnectAdmin;
  function normalize(u){
    const role=String(u.role||'').toLowerCase();
    let status=u.status??u.approval_status??u.approvalStatus??u.account_status??u.accountStatus;
    if(typeof u.is_approved==='boolean') status=u.is_approved?'Approved':'Pending';
    if(typeof u.approved==='boolean') status=u.approved?'Approved':'Pending';
    if(!status) status=role==='trainer'?'Pending':'Approved';
    status=String(status);
    if(/^pending$/i.test(status))status='Pending';
    if(/^approved$/i.test(status))status='Approved';
    if(/^rejected$/i.test(status))status='Rejected';
    return {...u,role,status};
  }
  async function load(){
    const d=await request('/api/admin/users');
    return Array.isArray(d)?d:(d.users||d.data||[]);
  }
  async function setApproval(id,status){
    const button=document.querySelector('[data-approval-id="'+CSS.escape(String(id))+'"]');
    if(button){button.disabled=true;button.textContent=status==='Approved'?'Approving...':'Rejecting...';}
    try{
      // Send the exact lowercase values required by the backend.
      await request('/api/admin/users/'+encodeURIComponent(id)+'/approval',{method:'PATCH',body:JSON.stringify({status:String(status).toLowerCase()})});
      if(typeof toast==='function')toast(status==='Approved'?'Trainer approved successfully.':'User rejected successfully.');
      const main=document.getElementById('main');
      if(main) main.innerHTML='<div class="card"><div class="empty">Updating user status...</div></div>';
      const users=(await load()).map(normalize);
      renderUsers(users);
    }catch(e){
      console.error('Admin approval error:',e);
      if(typeof toast==='function')toast(e.message||'Could not update user status.');else alert(e.message||'Could not update user status.');
      if(button){button.disabled=false;button.textContent=status==='Approved'?'Approve':'Reject';}
    }
  }
  function renderUsers(users){
    const main=document.getElementById('main');if(!main)return;
    const rows=users.map(u=>{
      const pending=u.role==='trainer'&&u.status==='Pending';
      const action=pending
        ? '<button class="btn fill" data-approval-id="'+esc(u.id)+'" onclick="capacityAdminApprove('+JSON.stringify(u.id)+')">Approve</button> <button class="btn danger" data-approval-id="'+esc(u.id)+'" onclick="capacityAdminReject('+JSON.stringify(u.id)+')">Reject</button>'
        : (u.role==='trainer'&&u.status==='Approved'?'<span class="tag">Active</span>':'—');
      const cls=u.status.toLowerCase();
      return '<tr><td>'+esc(u.name||'—')+'</td><td>'+esc(u.email||'—')+'</td><td>'+esc(u.role||'—')+'</td><td><span class="status '+esc(cls)+'">'+esc(u.status)+'</span></td><td>'+action+'</td></tr>';
    }).join('');
    main.innerHTML='<div class="pageTitle"><div><h2>User Approval &amp; Roles</h2><p style="color:#667085">Only registered accounts appear here.</p></div></div>'+
      '<div class="card"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>'+ (rows||'<tr><td colspan="5" class="empty">No registered users.</td></tr>') +'</tbody></table></div>';
  }
  window.capacityAdminApprove=function(id){return setApproval(id,'Approved')};
  window.capacityAdminReject=function(id){return setApproval(id,'Rejected')};
  window.page_users=function(){
    const box='<div class="card"><div class="empty">Loading users...</div></div>';
    setTimeout(async()=>{try{renderUsers((await load()).map(normalize));}catch(e){const main=document.getElementById('main');if(main)main.innerHTML='<div class="empty"><b>Could not load users.</b><br>'+esc(e.message||'Please try again.')+'</div>'; }},0);
    return box;
  };
})();