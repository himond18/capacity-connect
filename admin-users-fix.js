/* Capacity Connect — permanent Admin approval flow */
(function(){
  const API_BASE=window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com';
  const token=()=>sessionStorage.getItem('token')||localStorage.getItem('token')||'';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  async function request(path,options={}){
    const headers=Object.assign({'Content-Type':'application/json'},options.headers||{});
    const t=token(); if(t) headers.Authorization='Bearer '+t;
    const r=await fetch(API_BASE+path,Object.assign({},options,{headers}));
    const d=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(d.error||d.message||('Request failed: '+r.status));
    return d;
  }
  function normalize(u){
    const role=String(u.role||'').toLowerCase();
    let status=u.approval_status??u.status??u.approvalStatus??u.account_status??u.accountStatus;
    if(typeof u.is_approved==='boolean') status=u.is_approved?'Approved':'Pending';
    if(typeof u.approved==='boolean') status=u.approved?'Approved':'Pending';
    if(!status) status=role==='trainer'?'Pending':'Approved';
    status=String(status).toLowerCase();
    status=status==='pending'?'Pending':status==='approved'?'Approved':status==='rejected'?'Rejected':status;
    return {...u,role,status};
  }
  async function load(){const d=await request('/api/admin/users');return (Array.isArray(d)?d:(d.users||d.data||[])).map(normalize)}
  async function change(id,status){
    const buttons=[...document.querySelectorAll('[data-approval-id]')].filter(b=>String(b.dataset.approvalId)===String(id));
    buttons.forEach(b=>{b.disabled=true;b.textContent=status==='approved'?'Approving...':'Rejecting...'});
    try{
      await request('/api/admin/users/'+encodeURIComponent(id)+'/approval',{method:'PATCH',body:JSON.stringify({status})});
      renderUsers(await load());
      if(typeof toast==='function')toast(status==='approved'?'Trainer approved successfully.':'User rejected successfully.');
    }catch(e){
      buttons.forEach(b=>{b.disabled=false;b.textContent=status==='approved'?'Approve':'Reject'});
      const main=document.getElementById('main');
      if(main) main.insertAdjacentHTML('afterbegin','<div class="notice" id="approvalError">'+esc(e.message||'Could not update user status.')+'</div>');
    }
  }
  function renderUsers(users){
    const main=document.getElementById('main');if(!main)return;
    const rows=users.map(u=>{
      const pending=u.role==='trainer'&&u.status==='Pending';
      const action=pending
        ? '<button type="button" class="btn fill" data-approval-id="'+esc(u.id)+'" data-approval-action="approve">Approve</button> <button type="button" class="btn danger" data-approval-id="'+esc(u.id)+'" data-approval-action="reject">Reject</button>'
        : (u.role==='trainer'&&u.status==='Approved'?'<span class="tag">Active</span>':'—');
      return '<tr><td>'+esc(u.name||'—')+'</td><td>'+esc(u.email||'—')+'</td><td>'+esc(u.role||'—')+'</td><td><span class="status '+esc(u.status.toLowerCase())+'">'+esc(u.status)+'</span></td><td>'+action+'</td></tr>';
    }).join('');
    main.innerHTML='<div class="pageTitle"><div><h2>User Approval &amp; Roles</h2><p style="color:#667085">Only registered accounts appear here.</p></div></div><div class="card"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>'+ (rows||'<tr><td colspan="5" class="empty">No registered users.</td></tr>') +'</tbody></table></div>';
  }
  function install(){
    if(window.__capacityAdminApprovalInstalled)return;
    window.__capacityAdminApprovalInstalled=true;
    document.addEventListener('click',function(e){
      const b=e.target.closest&&e.target.closest('[data-approval-action]');
      if(!b)return;
      e.preventDefault();e.stopImmediatePropagation();
      const id=b.getAttribute('data-approval-id');
      const action=b.getAttribute('data-approval-action');
      if(id) change(id,action==='approve'?'approved':'rejected');
    },true);
  }
  window.capacityAdminApprove=id=>change(id,'approved');
  window.capacityAdminReject=id=>change(id,'rejected');
  window.page_users=function(){
    install();
    const box='<div class="card"><div class="empty">Loading users...</div></div>';
    setTimeout(async()=>{try{renderUsers(await load())}catch(e){const main=document.getElementById('main');if(main)main.innerHTML='<div class="empty"><b>Could not load users.</b><br>'+esc(e.message||'Please try again.')+'</div>'}},0);
    return box;
  };
  install();
})();
