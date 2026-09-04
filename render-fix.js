/* Capacity Connect — robust dashboard page renderer */
(function(){
  function install(){
    if(typeof window.render !== 'function') return false;
    window.render=function(){
      const role=String(current&&current.role||'trainee').toLowerCase();
      const menu=(menus&&menus[role])||[];
      const side=document.getElementById('side');
      const main=document.getElementById('main');
      const roleEl=document.getElementById('userRole');
      if(roleEl) roleEl.textContent=role.toUpperCase();
      if(side){
        side.innerHTML='<div class="sideTitle">'+role.toUpperCase()+' MODULE</div>'+menu.map(function(p){
          return '<button class="'+(p===current.page?'active':'')+'" onclick="nav(\''+p+'\')">'+(labels[p]||p)+'</button>';
        }).join('');
      }
      if(!main) return;
      const name=String(current.page||'dashboard');
      const aliases={
        dashboard:'page_dashboard', profile:'page_profile', courses:'page_courses',
        resources:'page_resources', mcq:'page_mcq', questionnaires:'page_questionnaires',
        feedback:'page_feedback', participants:'page_participants', library:'page_library',
        users:'page_users', monitoring:'page_monitoring', assessments:'page_assessments',
        publish:'page_publish', courseDetail:'page_courseDetail'
      };
      let fn=window[aliases[name]];
      if(typeof fn!=='function') fn=window['page_'+name];
      if(typeof fn!=='function' && name==='feedback') fn=window.page_feedback_admin;
      try{ main.innerHTML=typeof fn==='function' ? fn() : '<div class="empty"><b>Page temporarily unavailable.</b><br>Please select another section.</div>'; }
      catch(e){ console.error('Capacity Connect page render error:',e); main.innerHTML='<div class="empty"><b>Unable to load this section.</b><br>Please try again.</div>'; }
    };
    return true;
  }
  if(!install()) document.addEventListener('DOMContentLoaded',function(){setTimeout(install,1500)});
})();
