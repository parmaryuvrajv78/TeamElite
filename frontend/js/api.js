const API_BASE = window.API_BASE_URL || '';
const THEME_KEY = 'teamEliteTheme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme = getTheme()) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
  updateThemeButtons(nextTheme);
}

function updateThemeButtons(theme = getTheme()) {
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    const targetTheme = theme === 'light' ? 'dark' : 'light';
    button.dataset.themeState = theme;
    button.setAttribute('aria-label', `Switch to ${targetTheme} mode`);
    const label = button.querySelector('[data-theme-label]');
    if (label) label.textContent = targetTheme === 'light' ? 'Light' : 'Dark';
  });
}

function themeToggleMarkup(extraClass = '') {
  return `
    <button class="theme-toggle ${extraClass}" type="button" data-theme-toggle data-theme-state="${getTheme()}" aria-label="Switch theme">
      <span class="theme-toggle-track" aria-hidden="true"></span>
      <span data-theme-label>${getTheme() === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  `;
}

function bindThemeToggle(scope = document) {
  updateThemeButtons(getTheme());
  scope.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    if (button.dataset.themeBound) return;
    button.dataset.themeBound = 'true';
    button.addEventListener('click', () => {
      applyTheme(getTheme() === 'light' ? 'dark' : 'light');
    });
  });
}

applyTheme(getTheme());

function assetUrl(path) {
  if (!path) return '/assets/logo.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

async function api(path, options = {}) {
  const headers = options.headers || {};
  const token = localStorage.getItem('teamEliteToken');

  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function fmtDate(value, withTime = false) {
  if (!value) return 'TBA';
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  });
}

function fallbackLogo(img) {
  img.onerror = null;
  img.src = '/assets/logo.svg';
}
