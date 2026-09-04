/* Capacity Connect platform integration helper */
(function(){
  const API_BASE = window.API_BASE || 'https://capacity-connect-backend-9o1f.onrender.com';
  const token = () => sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  async function request(path, options={}) {
    const headers = Object.assign({'Content-Type':'application/json'}, options.headers || {});
    const t = token();
    if (t) headers.Authorization = 'Bearer ' + t;
    const res = await fetch(API_BASE + path, Object.assign({}, options, {headers}));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || ('HTTP ' + res.status));
    return data;
  }
  window.capacityPlatform = { request };
})();
