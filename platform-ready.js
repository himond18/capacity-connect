/* Capacity Connect — integration readiness + certification bridge */
(function(){
  function boot(){
    if(window.capacityRoleAPI){
      window.capacityPlatformReady=true;
      document.dispatchEvent(new CustomEvent('capacityPlatformReady'));
    }
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1000));
  window.addEventListener('capacityPlatformDataReady',boot);
})();
