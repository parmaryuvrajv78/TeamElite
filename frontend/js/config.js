const LOCAL_API_BASE_URL = 'http://localhost:5000';
const PRODUCTION_API_BASE_URL = 'https://teamelite.onrender.com';
const LOCAL_HOSTS = ['localhost', '127.0.0.1', ''];

window.API_BASE_URL = window.API_BASE_URL || (
  LOCAL_HOSTS.includes(location.hostname) ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL
);
