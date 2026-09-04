/* Capacity Connect — shared role API helpers */
(function(){
  const API_BASE = window.API_BASE || 'https://capacity-connect-backend-9o1f.onrender.com';
  const token = () => sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  async function request(path, options={}) {
    const headers = Object.assign({'Content-Type':'application/json'}, options.headers || {});
    const t = token();
    if (t) headers.Authorization = 'Bearer ' + t;
    const response = await fetch(API_BASE + path, Object.assign({}, options, {headers}));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || ('HTTP ' + response.status));
    return data;
  }
  window.capacityAPI = Object.assign(window.capacityAPI || {}, {
    getCourses: () => request('/api/courses'),
    getMe: () => request('/api/auth/me'),
    getNotifications: () => request('/api/notifications')
  });
})();
