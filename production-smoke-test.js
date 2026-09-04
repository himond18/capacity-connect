/* Capacity Connect — deployment smoke test helper */
(function(){
  async function run(){
    const base=window.API_BASE||'https://capacity-connect-backend-9o1f.onrender.com';
    const checks=['/api/health','/api/db-test'];
    const out=[];
    for(const path of checks){try{const r=await fetch(base+path);const d=await r.json().catch(()=>({}));out.push({path,ok:r.ok,data:d});}catch(e){out.push({path,ok:false,error:e.message});}}
    console.table(out);window.capacitySmokeTest=out;return out;
  }
  window.runCapacitySmokeTest=run;
})();
