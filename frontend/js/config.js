// Local file preview should call the local backend.
// For Vercel, replace this with your Render URL:
// window.API_BASE_URL = 'https://team-elite-api.onrender.com';
window.API_BASE_URL = window.API_BASE_URL || (location.protocol === 'file:' ? 'http://localhost:5000' : '');
