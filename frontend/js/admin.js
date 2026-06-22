const token = localStorage.getItem('teamEliteToken');
if (!token) location.href = 'admin-login.html';

const resources = {
  updates: {
    label: 'Latest Updates',
    endpoint: '/api/updates?admin=1',
    save: '/api/updates',
    file: 'image',
    columns: ['title', 'category', 'date', 'status'],
    fields: [
      ['title', 'Title', 'text'], ['description', 'Description', 'textarea'], ['category', 'Category', 'text'],
      ['date', 'Date', 'date'], ['status', 'Status', 'select', ['published', 'unpublished']], ['image', 'Image', 'file']
    ]
  },
  players: {
    label: 'Players',
    endpoint: '/api/players?admin=1',
    save: '/api/players',
    file: 'photo',
    columns: ['ign', 'name', 'role', 'leadershipRole', 'status'],
    columnLabels: {
      leadershipRole: 'Leadership'
    },
    fields: [
      ['name', 'Name', 'text'], ['ign', 'IGN', 'text'], ['role', 'Role', 'text'], ['leadershipRole', 'Leadership role', 'text'], ['photo', 'Photo', 'file'],
      ['bio', 'Bio', 'textarea'], ['instagram', 'Instagram link', 'url'], ['youtube', 'YouTube link', 'url'],
      ['status', 'Status', 'select', ['active', 'inactive']]
    ]
  },
  matches: {
    label: 'Matches',
    endpoint: '/api/matches',
    save: '/api/matches',
    columns: ['tournamentName', 'organizer', 'matchNumber', 'matchDateTime', 'status'],
    columnLabels: {
      tournamentName: 'Tournament',
      organizer: 'Organizer',
      matchNumber: 'Match #',
      matchDateTime: 'Match time',
      status: 'Status'
    },
    fields: [
      ['tournamentName', 'Tournament name', 'text'], ['organizer', 'Organizer', 'text'], ['matchNumber', 'Match number', 'number'],
      ['opponentTeamName', 'Lobby / group name', 'text'],
      ['opponentLogo', 'Lobby image / logo', 'file'], ['matchDateTime', 'Match date/time', 'datetime-local'],
      ['matchType', 'Match type', 'select', ['BR', 'CS', 'Custom']], ['mapName', 'Map name', 'text'],
      ['status', 'Status', 'select', ['upcoming', 'live', 'completed']], ['result', 'Result', 'select', ['', 'win', 'loss', 'draw', 'qualified']],
      ['teamScore', 'Placement rank', 'number'], ['opponentScore', 'Placement points', 'number'], ['totalTeamKills', 'Total team kills', 'number'],
      ['resultScreenshot', 'Result screenshot', 'file'], ['playerStats', 'Player stats JSON', 'textarea']
    ]
  },
  achievements: {
    label: 'Achievements',
    endpoint: '/api/achievements',
    save: '/api/achievements',
    file: 'trophyImage',
    columns: ['title', 'tournamentName', 'position', 'year', 'tier'],
    fields: [
      ['title', 'Title', 'text'], ['tournamentName', 'Tournament name', 'text'], ['position', 'Position', 'text'],
      ['year', 'Year', 'text'], ['tier', 'Tier', 'text'], ['date', 'Year/date', 'date'],
      ['trophyImage', 'Trophy image', 'file'], ['prizePool', 'Prize pool', 'text'],
      ['description', 'Description', 'textarea']
    ]
  },
  gallery: {
    label: 'Gallery',
    endpoint: '/api/gallery',
    save: '/api/gallery',
    file: 'image',
    columns: ['caption', 'category', 'date'],
    fields: [
      ['image', 'Image', 'file'], ['caption', 'Caption', 'text'], ['category', 'Category', 'text'], ['date', 'Date', 'date']
    ]
  },
  sponsors: {
    label: 'Sponsors',
    endpoint: '/api/sponsors?admin=1',
    save: '/api/sponsors',
    file: 'logo',
    columns: ['sponsorName', 'websiteLink', 'status'],
    fields: [
      ['sponsorName', 'Sponsor name', 'text'], ['logo', 'Logo', 'file'], ['websiteLink', 'Website link', 'url'],
      ['status', 'Status', 'select', ['active', 'inactive']]
    ]
  },
  about: {
    label: 'About Org',
    endpoint: '/api/settings',
    save: '/api/settings',
    single: true,
    file: 'logo',
    fields: [
      ['logo', 'Org logo', 'file'], ['aboutText', 'About org text', 'textarea'],
      ['founder', 'Founder', 'text'], ['coFounder', 'Co-founder', 'text'],
      ['formerPlayers', 'Former players', 'textarea'], ['region', 'Region', 'text'],
      ['nation', 'Nation', 'text'], ['nationFlag', 'Nation flag code', 'text']
    ]
  },
  settings: {
    label: 'Website Settings',
    endpoint: '/api/settings',
    save: '/api/settings',
    single: true,
    file: 'logo',
    fields: [
      ['logo', 'Logo', 'file'], ['heroTitle', 'Hero title', 'text'], ['heroSubtitle', 'Hero subtitle', 'text'],
      ['email', 'Email', 'email'], ['instagram', 'Instagram', 'url'],
      ['youtube', 'YouTube', 'url'], ['discord', 'Discord', 'url'], ['facebook', 'Facebook', 'url']
    ]
  }
};

let active = 'dashboard';
let cache = {};
let health = null;

function isImageField(name) {
  return ['image', 'photo', 'logo', 'trophyImage', 'opponentLogo', 'resultScreenshot'].includes(name);
}

function valueFor(item, key) {
  const value = item?.[key];
  if (Array.isArray(value)) return `${value.length} players`;
  if (key.toLowerCase().includes('date') && value) return fmtDate(value, key.includes('Time'));
  return value ?? '';
}

function columnLabel(config, col) {
  return config.columnLabels?.[col] || col;
}

function makeField([name, label, type, options], item = {}) {
  const raw = item[name];
  let value = raw ?? '';
  if (type === 'date' && raw) value = new Date(raw).toISOString().slice(0, 10);
  if (type === 'datetime-local' && raw) value = new Date(raw).toISOString().slice(0, 16);
  if (name === 'playerStats') value = JSON.stringify(raw?.length ? raw : defaultStats(), null, 2);

  if (type === 'textarea') {
    return `<label class="full">${label}<textarea name="${name}">${value}</textarea></label>`;
  }

  if (type === 'select') {
    return `<label>${label}<select name="${name}">${options.map((option) => `<option value="${option}" ${String(value) === option ? 'selected' : ''}>${option || 'none'}</option>`).join('')}</select></label>`;
  }

  if (type === 'file') {
    const current = typeof raw === 'string' && raw ? assetUrl(raw) : '';
    return `
      <label class="file-field">${label}
        ${current ? `<a class="image-link" href="${current}" target="_blank" rel="noreferrer">Current cloud image</a>` : '<span class="upload-hint">Uploads save to Supabase Storage.</span>'}
        <input name="${name}" type="file" accept="image/*">
        <img class="preview" data-preview="${name}" src="${current}" alt="${label} preview" style="${current ? 'display:block' : ''}">
      </label>
    `;
  }

  return `<label>${label}<input name="${name}" type="${type}" value="${String(value).replaceAll('"', '&quot;')}"></label>`;
}

function defaultStats() {
  return [
    { playerName: 'Pahadi', kills: 0, damage: 0, assists: 0, knockdowns: 0, headshots: 0, mvp: false },
    { playerName: 'Mr jay', kills: 0, damage: 0, assists: 0, knockdowns: 0, headshots: 0, mvp: false },
    { playerName: 'cropse', kills: 0, damage: 0, assists: 0, knockdowns: 0, headshots: 0, mvp: false },
    { playerName: 'amin', kills: 0, damage: 0, assists: 0, knockdowns: 0, headshots: 0, mvp: false }
  ];
}

function shell() {
  return `
    <div class="admin-layout">
      <aside class="sidebar">
        <a class="brand" href="index.html"><img src="/assets/logo.png" onerror="fallbackLogo(this)" alt="Team Elite logo"><span>Team Elite</span></a>
        ${themeToggleMarkup('sidebar-theme-toggle')}
        <button data-section="dashboard" class="${active === 'dashboard' ? 'active' : ''}">Dashboard</button>
        ${Object.entries(resources).map(([key, config]) => `<button data-section="${key}" class="${active === key ? 'active' : ''}">${config.label}</button>`).join('')}
        <button class="logout" id="logout">Logout</button>
      </aside>
      <main class="admin-main" id="admin-content"></main>
    </div>
    <div class="modal" id="modal"><div class="modal-panel" id="modal-panel"></div></div>
  `;
}

function renderDashboard() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-top"><div><span class="eyebrow">Control center</span><h1 style="font-size:2.7rem">Dashboard</h1></div></div>
    <div class="admin-cloud-status">
      <span class="tag">Storage</span>
      <strong>${health?.storage || 'checking'}</strong>
      <small>New admin uploads are stored in Supabase cloud storage.</small>
    </div>
    <div class="grid four">
      ${['updates', 'players', 'matches', 'achievements'].map((key) => `
        <div class="card"><div class="card-body"><span class="tag">${resources[key].label}</span><h2>${cache[key]?.length || 0}</h2></div></div>
      `).join('')}
    </div>
  `;
}

function renderTable(key) {
  const config = resources[key];
  const items = Array.isArray(cache[key]) ? cache[key] : [];
  const content = document.getElementById('admin-content');

  content.innerHTML = `
    <div class="admin-top">
      <div><span class="eyebrow">Manage</span><h1 style="font-size:2.4rem">${config.label}</h1></div>
      <button class="btn" data-add="${key}">Add New</button>
    </div>
    <div class="message" id="message"></div>
    <div class="table-wrap">
      <table>
        <thead><tr>${config.columns.map((col) => `<th>${columnLabel(config, col)}</th>`).join('')}<th>Actions</th></tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              ${config.columns.map((col) => `<td>${isImageField(col) && item[col] ? `<img class="admin-thumb" src="${assetUrl(item[col])}" alt="">` : valueFor(item, col)}</td>`).join('')}
              <td><button class="btn secondary" data-edit="${key}" data-id="${item._id}">Edit</button> <button class="btn secondary" data-delete="${key}" data-id="${item._id}">Delete</button></td>
            </tr>
          `).join('') || `<tr><td colspan="${config.columns.length + 1}">No records yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderSingleForm(key) {
  const config = resources[key];
  const item = cache[key] || {};
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-top"><div><span class="eyebrow">Manage</span><h1 style="font-size:2.4rem">${config.label}</h1></div></div>
    <form class="card" data-single-form="${key}"><div class="card-body form-grid">
      ${config.fields.map((field) => makeField(field, item)).join('')}
      <div class="full"><button class="btn" type="submit">Save ${config.label}</button></div>
      <div class="message full" id="message"></div>
    </div></form>
  `;
  bindPreviews(document.querySelector(`[data-single-form="${key}"]`));
}

function openForm(key, item = {}) {
  const config = resources[key];
  const modal = document.getElementById('modal');
  document.getElementById('modal-panel').innerHTML = `
    <div class="admin-top">
      <h2>${item._id ? 'Edit' : 'Add'} ${config.label}</h2>
      <button class="btn secondary" data-close>Close</button>
    </div>
    <form id="crud-form" class="form-grid">
      ${config.fields.map((field) => makeField(field, item)).join('')}
      <div class="full"><button class="btn" type="submit">Save</button></div>
      <div class="message full" id="modal-message"></div>
    </form>
  `;
  modal.classList.add('show');
  bindPreviews(document.getElementById('crud-form'));

  document.getElementById('crud-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    await saveItem(key, item._id, event.currentTarget, 'modal-message');
    modal.classList.remove('show');
  });
}

function bindPreviews(scope) {
  scope.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener('change', () => {
      const img = scope.querySelector(`[data-preview="${input.name}"]`);
      if (img && input.files[0]) {
        img.src = URL.createObjectURL(input.files[0]);
        img.style.display = 'block';
      }
    });
  });
}

function formToBody(form) {
  const data = new FormData();
  [...form.elements].forEach((field) => {
    if (!field.name) return;
    if (field.type === 'file') {
      if (field.files[0]) data.append(field.name, field.files[0]);
    } else {
      data.append(field.name, field.value);
    }
  });
  return data;
}

async function saveItem(key, id, form, messageId) {
  const config = resources[key];
  const message = document.getElementById(messageId);
  try {
    await api(`${config.save}${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : (config.single ? 'PUT' : 'POST'),
      body: formToBody(form)
    });
    message.textContent = 'Saved successfully.';
    await refresh();
    renderActive();
  } catch (error) {
    message.textContent = error.message;
  }
}

async function removeItem(key, id) {
  if (!confirm('Delete this record?')) return;
  await api(`${resources[key].save}/${id}`, { method: 'DELETE' });
  await refresh();
  renderActive();
}

async function refresh() {
  const [healthData, entries] = await Promise.all([
    api('/api/health'),
    Promise.all(Object.entries(resources).map(async ([key, config]) => [key, await api(config.endpoint)]))
  ]);
  health = healthData;
  cache = Object.fromEntries(entries);
}

function renderActive() {
  document.querySelectorAll('.sidebar button[data-section]').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === active);
  });
  if (active === 'dashboard') renderDashboard();
  else if (resources[active]?.single) renderSingleForm(active);
  else renderTable(active);
}

function bindEvents() {
  document.addEventListener('click', async (event) => {
    const section = event.target.dataset.section;
    if (section) {
      active = section;
      renderActive();
    }

    if (event.target.id === 'logout') {
      localStorage.removeItem('teamEliteToken');
      location.href = 'admin-login.html';
    }

    if (event.target.dataset.add) openForm(event.target.dataset.add);
    if (event.target.dataset.edit) {
      const key = event.target.dataset.edit;
      openForm(key, cache[key].find((item) => item._id === event.target.dataset.id));
    }
    if (event.target.dataset.delete) await removeItem(event.target.dataset.delete, event.target.dataset.id);
    if (event.target.closest('[data-close]') || event.target.id === 'modal') {
      document.getElementById('modal').classList.remove('show');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.getElementById('modal')?.classList.remove('show');
    }
  });

  document.addEventListener('submit', async (event) => {
    const singleKey = event.target.dataset.singleForm;
    if (singleKey) {
      event.preventDefault();
      await saveItem(singleKey, null, event.target, 'message');
    }
  });
}

async function initAdmin() {
  document.getElementById('admin-app').innerHTML = shell();
  bindThemeToggle();
  bindEvents();
  try {
    await refresh();
    renderActive();
  } catch (error) {
    document.getElementById('admin-content').innerHTML = `<div class="empty">${error.message}</div>`;
  }
}

initAdmin();
