/* Capacity Connect — Admin user approval UI fix */
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
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
    const a=admin();
    if(!a||typeof a.users!=='function')return [];
    const d=await a.users();
    return Array.isArray(d)?d:(d.users||d.data||[]);
  }
  async function setApproval(id,status){
    try{
      await admin().approve(id,status);
      if(typeof toast==='function')toast(status==='Approved'?'Trainer approved successfully.':'User status updated.');
      if(typeof render==='function')render();
    }catch(e){
      console.error(e);
      if(typeof toast==='function')toast(e.message||'Could not update user status.');else alert(e.message||'Could not update user status.');
    }
  }
  window.capacityAdminApprove=function(id){return setApproval(id,'Approved')};
  window.capacityAdminReject=function(id){return setApproval(id,'Rejected')};
  window.page_users=async function(){
    const box='<div class="card"><div class="empty">Loading users...</div></div>';
    // render() is synchronous, so start the API load and replace the page when it returns.
    setTimeout(async()=>{
      try{
        const users=(await load()).map(normalize);
        const main=document.getElementById('main');if(!main)return;
        const rows=users.map(u=>{
          const pending=String(u.role)==='trainer'&&u.status==='Pending';
          const action=pending
            ? '<button class="btn fill" onclick="capacityAdminApprove('+JSON.stringify(u.id)+')">Approve</button> <button class="btn danger" onclick="capacityAdminReject('+JSON.stringify(u.id)+')">Reject</button>'
            : (u.role==='trainer'&&u.status==='Approved'?'<span class="tag">Active</span>':'—');
          const cls=u.status.toLowerCase();
          return '<tr><td>'+esc(u.name||'—')+'</td><td>'+esc(u.email||'—')+'</td><td>'+esc(u.role||'—')+'</td><td><span class="status '+esc(cls)+'">'+esc(u.status)+'</span></td><td>'+action+'</td></tr>';
        }).join('');
        main.innerHTML='<div class="pageTitle"><div><h2>User Approval &amp; Roles</h2><p style="color:#667085">Only registered accounts appear here.</p></div></div>'+
          '<div class="card"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>'+ (rows||'<tr><td colspan="5" class="empty">No registered users.</td></tr>') +'</tbody></table></div>';
      }catch(e){
        console.error(e);
        const main=document.getElementById('main');if(main)main.innerHTML='<div class="empty"><b>Could not load users.</b><br>'+esc(e.message||'Please try again.')+'</div>';
      }
    },0);
    return box;
  };
})();
