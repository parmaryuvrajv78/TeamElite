// Local file preview should call the local backend.
window.API_BASE_URL = window.API_BASE_URL || (
  location.protocol === 'file:' ? 'http://localhost:5000' : 'https://teamelite.onrender.com'
);
