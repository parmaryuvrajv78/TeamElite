const page = document.body.dataset.page;

const state = {
  settings: null,
  updates: [],
  players: [],
  matches: [],
  achievements: [],
  gallery: [],
  sponsors: []
};

const GAME_KEY = 'teamEliteGame';
let activeGame = localStorage.getItem(GAME_KEY) === 'bgmi' ? 'bgmi' : 'freefire';
const SUPABASE_ASSET_BASE = 'https://xbdzrhksdgujrlujgxsd.supabase.co/storage/v1/object/public/team-elite-assets';

const games = {
  freefire: { label: 'Free Fire', logo: `${SUPABASE_ASSET_BASE}/brand/free-fire-logo.png` },
  bgmi: { label: 'BGMI', logo: `${SUPABASE_ASSET_BASE}/brand/bgmi-logo.png` }
};

const navItems = [
  ['index.html', 'Home'],
  ['about.html', 'About'],
  ['index.html#updates', 'Updates'],
  ['index.html#roster', 'Roster'],
  ['index.html#matches', 'Matches'],
  ['index.html#stats', 'Stats'],
  ['index.html#achievements', 'Achievements'],
  ['index.html#gallery', 'Gallery'],
  ['index.html#sponsors', 'Sponsors'],
  ['index.html#contact', 'Contact'],
  ['admin-login.html', 'Admin']
];

function gameItems(key) {
  return activeGame === 'freefire' ? state[key] : [];
}

function gameEmpty(label) {
  return activeGame === 'bgmi' ? `No BGMI ${label} data yet.` : `No ${label} yet.`;
}

function gameSwitcher(extraClass = '') {
  return `
    <div class="game-switcher ${extraClass}" data-game-switcher>
      ${Object.entries(games).map(([key, game]) => `
        <button class="game-button ${activeGame === key ? 'active' : ''}" type="button" data-game="${key}" aria-pressed="${activeGame === key}" aria-label="Show ${game.label} data">
          <img src="${game.logo}" alt="${game.label} logo">
        </button>
      `).join('')}
    </div>
  `;
}

function heroHighlights() {
  const highlights = activeGame === 'freefire'
    ? ['FFIC 2021 Fall Champions', 'Asia Championship Top 8', 'FFPL India Summer Top 3', 'Decorated Free Fire Roster']
    : ['BGMI slot', 'No data yet'];

  return `<div class="hero-highlights">${highlights.map((item) => `<span>${item}</span>`).join('')}</div>`;
}

function heroSubtitle() {
  return activeGame === 'bgmi'
    ? 'BGMI division data has not been added yet.'
    : state.settings.heroSubtitle;
}

function heroAboutText() {
  return activeGame === 'bgmi'
    ? 'Select Free Fire to view the current roster, achievements, matches, and stats.'
    : state.settings.aboutText;
}

function isActivePage(href) {
  const [path, hash] = href.split('#');
  const onPath = location.pathname.endsWith(path) || (path === 'index.html' && location.pathname === '/');
  if (hash) return onPath && location.hash === `#${hash}`;
  return onPath && !location.hash;
}

function nav() {
  return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html">
          <img src="${assetUrl(state.settings?.logo || '/assets/logo.png')}" onerror="fallbackLogo(this)" alt="Team Elite logo">
          <span>Team Elite</span>
        </a>
        <div class="nav-tools">
          ${themeToggleMarkup()}
          <div class="menu-wrap">
            <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-menu">
              <span></span><span></span><span></span>
            </button>
            <nav class="menu-panel" id="main-menu">
              ${navItems.map(([href, label]) => `<a class="${isActivePage(href) ? 'active' : ''}" href="${href}">${label}</a>`).join('')}
            </nav>
          </div>
        </div>
      </div>
    </header>
  `;
}

function bindNavMenu() {
  bindThemeToggle();
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.menu-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-wrap')) {
      panel.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      panel.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function scrollToHashSection() {
  if (!location.hash) return;
  requestAnimationFrame(() => {
    document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function bindGameSwitcher() {
  document.querySelectorAll('[data-game-switcher] [data-game]').forEach((button) => {
    button.addEventListener('click', () => {
      activeGame = button.dataset.game === 'bgmi' ? 'bgmi' : 'freefire';
      localStorage.setItem(GAME_KEY, activeGame);
      renderPage(document.getElementById('app'));
    });
  });
}

function footer() {
  const sponsors = state.sponsors || [];
  const sponsorLinks = sponsors.map((sponsor) => {
    const content = `
      ${sponsor.logo ? `<img src="${assetUrl(sponsor.logo)}" alt="${sponsor.sponsorName} logo">` : ''}
      <span>${sponsor.sponsorName}</span>
    `;

    if (sponsor.websiteLink) {
      return `<a class="footer-sponsor" href="${sponsor.websiteLink}" target="_blank" rel="noreferrer">${content}</a>`;
    }

    return `<span class="footer-sponsor">${content}</span>`;
  }).join('');

  return `
    <footer class="footer" id="sponsors">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="index.html">
            <img src="${assetUrl(state.settings?.logo || '/assets/logo.png')}" onerror="fallbackLogo(this)" alt="Team Elite logo">
            <span>Team Elite</span>
          </a>
          <p>&copy; ${new Date().getFullYear()} Team Elite. Built for competitive esports.</p>
        </div>
        <div class="footer-sponsors">
          <span class="footer-title">Sponsors</span>
          <div class="footer-sponsor-list">
            ${sponsorLinks || '<span class="muted">Sponsors coming soon.</span>'}
          </div>
        </div>
      </div>
    </footer>
  `;
}

function pageTitle(title, text) {
  const hasGameData = !['About Org', 'Sponsors', 'Contact'].includes(title);

  return `
    <main>
      <section class="page-title">
        <div class="container">
          <span class="eyebrow">Team Elite</span>
          <h1>${title}</h1>
          <p class="muted">${text}</p>
          ${hasGameData ? gameSwitcher('page-game-switcher') : ''}
        </div>
      </section>
      <section class="section"><div class="container" id="page-content"></div></section>
    </main>
  `;
}

function updateCard(item) {
  return `
    <article class="card update-card">
      <div class="card-body">
        <span class="tag">${item.category || 'News'}</span>
        <h3>${item.title}</h3>
        <div class="meta"><span>${fmtDate(item.date)}</span><span>${item.status || ''}</span></div>
        <p class="muted">${item.description || ''}</p>
      </div>
    </article>
  `;
}

function splitList(value) {
  return String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function nationFlag(value) {
  const flag = String(value || '').trim();
  if (!flag || flag.toUpperCase() === 'IN' || flag.toLowerCase() === 'india') {
    return '<span class="india-flag" aria-label="India flag"></span>';
  }
  return `<span class="about-flag">${flag}</span>`;
}

function playerCard(player) {
  const playerSlug = String(player.ign || player.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `
    <article class="card player-card player-${playerSlug}">
      <div class="player-photo-frame">
        <span class="player-era">Active Free Fire roster</span>
        <img class="card-img player-photo" src="${assetUrl(player.photo)}" alt="${player.ign}">
      </div>
      <div class="card-body">
        <div class="role-tags">
          <span class="tag">${player.role}</span>
          ${player.leadershipRole ? `<span class="tag leadership-tag">${player.leadershipRole}</span>` : ''}
        </div>
        <h3>${player.ign}</h3>
        <div class="meta"><span>${player.name}</span><span>${player.status}</span></div>
        <p class="muted">${player.bio || ''}</p>
        <div class="actions">
          ${player.instagram ? `<a class="btn secondary" href="${player.instagram}" target="_blank" rel="noreferrer">Instagram</a>` : ''}
          ${player.youtube ? `<a class="btn secondary" href="${player.youtube}" target="_blank" rel="noreferrer">YouTube</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

function aboutOrgSection() {
  const settings = state.settings || {};
  const formerPlayers = splitList(settings.formerPlayers);

  return `
    <div class="about-panel">
      <div class="about-brand-card">
        <div class="about-mark">
          <img src="${assetUrl(settings.logo || '/assets/logo.png')}" onerror="fallbackLogo(this)" alt="Team Elite logo">
        </div>
        <div>
          <span class="eyebrow">Organization</span>
          <h3>${settings.heroTitle || 'Team Elite'}</h3>
          <p class="muted">${settings.aboutText || ''}</p>
        </div>
      </div>
      <div class="about-details">
        <div class="about-grid">
          <div><span>Founder</span><strong>${settings.founder || 'To be announced'}</strong></div>
          <div><span>Co-founder</span><strong>${settings.coFounder || 'To be announced'}</strong></div>
          <div><span>Region</span><strong>${settings.region || 'South Asia'}</strong></div>
          <div><span>Nation</span><strong>${nationFlag(settings.nationFlag)}${settings.nation || 'India'}</strong></div>
        </div>
        <div class="former-players">
          <span>Former players</span>
          <div>
            ${formerPlayers.length ? formerPlayers.map((name) => `<strong>${name}</strong>`).join('') : '<strong>To be announced</strong>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function statsTable(stats = []) {
  if (!stats.length) return '';
  return `
    <div class="stats-scroll">
      <table class="stats">
        <thead><tr><th>Player</th><th>K</th><th>DMG</th><th>AST</th><th>KD</th><th>HS</th><th>MVP</th></tr></thead>
        <tbody>${stats.map((s) => `
          <tr>
            <td>${s.playerName}</td><td>${s.kills}</td><td>${s.damage}</td><td>${s.assists}</td>
            <td>${s.knockdowns}</td><td>${s.headshots}</td><td>${s.mvp ? 'Yes' : '-'}</td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>
  `;
}

function tournamentSummaries() {
  const byTournament = new Map();

  gameItems('matches').forEach((match) => {
    const current = byTournament.get(match.tournamentName) || [];
    current.push(match);
    byTournament.set(match.tournamentName, current);
  });

  return [...byTournament.entries()].map(([name, matches]) => {
    const sorted = [...matches].sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));
    const nextOrLatest = sorted.find((match) => match.status !== 'completed') || sorted[sorted.length - 1];
    const status = matches.some((match) => match.status === 'live')
      ? 'live'
      : matches.every((match) => match.status === 'completed')
        ? 'completed'
        : 'upcoming';

    return { name, matches, displayMatch: nextOrLatest, status };
  }).sort((a, b) => new Date(b.displayMatch.matchDateTime) - new Date(a.displayMatch.matchDateTime));
}

function matchCard(summary) {
  const match = summary.displayMatch;

  return `
    <article class="card match-summary-card">
      <div class="card-body">
        <div class="match-summary-top">
          <span class="tag">${summary.status}</span>
        </div>
        <h3>${summary.name}</h3>
        <div class="match-summary-grid">
          <div><span>Date</span><strong>${fmtDate(match.matchDateTime, true)}</strong></div>
          <div><span>Status</span><strong>${summary.status}</strong></div>
        </div>
      </div>
    </article>
  `;
}

function matchDetail(match) {
  const placement = match.teamScore ? `#${match.teamScore}` : 'TBA';
  const points = Number(match.opponentScore || 0);
  const result = match.result ? match.result.replace('-', ' ') : 'completed';

  return `
    <div class="match-detail-card">
      <div class="match-detail-head">
        <div>
          <span class="tag">Match ${match.matchNumber || 1}</span>
          <h3>${match.tournamentName}</h3>
          <p class="muted">${match.organizer || 'Organizer TBA'} | ${fmtDate(match.matchDateTime, true)} | ${match.mapName || 'Map TBA'}</p>
        </div>
      </div>
      <div class="lobby-result">
        <div><span>Placement</span><strong>${placement}</strong></div>
        <div><span>Kills</span><strong>${match.totalTeamKills || 0}</strong></div>
        <div><span>Points</span><strong>${points}</strong></div>
        <div><span>Result</span><strong>${result}</strong></div>
      </div>
      ${statsTable(match.playerStats)}
    </div>
  `;
}

function matchExplorer() {
  const completed = gameItems('matches')
    .filter((match) => match.status === 'completed')
    .sort((a, b) => {
      const byTournament = a.tournamentName.localeCompare(b.tournamentName);
      if (byTournament) return byTournament;
      return Number(a.matchNumber || 1) - Number(b.matchNumber || 1);
    });

  if (!completed.length) {
    return `<div class="empty">Completed match stats will appear here after a tournament is finished.</div>`;
  }

  const tournaments = [...new Set(completed.map((match) => match.tournamentName))];
  const firstTournament = tournaments[0];
  const firstMatches = completed.filter((match) => match.tournamentName === firstTournament);

  return `
    <div class="match-explorer" data-match-explorer>
      <div class="match-picker">
        <label>Completed tournament
          <select data-match-tournament>
            ${tournaments.map((name) => `<option value="${encodeURIComponent(name)}">${name}</option>`).join('')}
          </select>
        </label>
        <div class="match-number-list" data-match-number-list>
          ${firstMatches.map((match, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-match-id="${match._id}">Match ${match.matchNumber || index + 1}</button>`).join('')}
        </div>
      </div>
      <div data-match-detail>${matchDetail(firstMatches[0])}</div>
    </div>
  `;
}

function matchesSection() {
  const summaries = tournamentSummaries();

  if (!summaries.length) return empty(gameEmpty('match'));

  return `
    <div class="grid match-summary-grid-list">
      ${summaries.map(matchCard).join('')}
    </div>
  `;
}

function bindMatchExplorer() {
  document.querySelectorAll('[data-match-explorer]').forEach((explorer) => {
    const select = explorer.querySelector('[data-match-tournament]');
    const numberList = explorer.querySelector('[data-match-number-list]');
    const detail = explorer.querySelector('[data-match-detail]');

    const completed = gameItems('matches').filter((match) => match.status === 'completed');

    function renderMatchButtons(tournamentName) {
      const matches = completed
        .filter((match) => match.tournamentName === tournamentName)
        .sort((a, b) => Number(a.matchNumber || 1) - Number(b.matchNumber || 1));

      numberList.innerHTML = matches.map((match, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-match-id="${match._id}">Match ${match.matchNumber || index + 1}</button>`).join('');
      detail.innerHTML = matchDetail(matches[0]);
    }

    select?.addEventListener('change', () => {
      renderMatchButtons(decodeURIComponent(select.value));
    });

    numberList?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-match-id]');
      if (!button) return;
      const match = completed.find((item) => item._id === button.dataset.matchId);
      if (!match) return;

      numberList.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      detail.innerHTML = matchDetail(match);
    });
  });
}

function buildRecentStats() {
  const completed = gameItems('matches')
    .filter((match) => match.status === 'completed')
    .sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime));
  const playerMap = new Map();

  completed.forEach((match) => {
    (match.playerStats || []).forEach((stat) => {
      const key = stat.playerName || 'Unknown';
      const current = playerMap.get(key) || {
        playerName: key,
        kills: 0,
        damage: 0,
        assists: 0,
        knockdowns: 0,
        headshots: 0,
        mvps: 0
      };

      current.kills += Number(stat.kills || 0);
      current.damage += Number(stat.damage || 0);
      current.assists += Number(stat.assists || 0);
      current.knockdowns += Number(stat.knockdowns || 0);
      current.headshots += Number(stat.headshots || 0);
      current.mvps += stat.mvp ? 1 : 0;
      playerMap.set(key, current);
    });
  });

  const players = [...playerMap.values()].sort((a, b) => b.kills - a.kills);
  const wins = completed.filter((match) => match.result === 'win').length;
  const totalKills = completed.reduce((sum, match) => sum + Number(match.totalTeamKills || 0), 0);

  return {
    completed,
    players,
    wins,
    totalKills,
    winRate: completed.length ? Math.round((wins / completed.length) * 100) : 0,
    avgKills: completed.length ? (totalKills / completed.length).toFixed(1) : '0.0',
    topPlayer: players[0]
  };
}

function recentStatsSection() {
  const stats = buildRecentStats();
  const completedMatches = gameItems('matches').filter((match) => match.status === 'completed');

  if (!completedMatches.length) {
    if (activeGame === 'bgmi') return empty('No BGMI stats data yet.');

    const activePlayers = gameItems('players').filter((player) => player.status === 'active');
    const upcomingMatches = gameItems('matches').filter((match) => match.status !== 'completed');
    const roleCounts = activePlayers.reduce((counts, player) => {
      const role = player.role || 'Player';
      counts[role] = (counts[role] || 0) + 1;
      return counts;
    }, {});
    const leaders = activePlayers.filter((player) => player.leadershipRole);
    const nextMatch = upcomingMatches
      .slice()
      .sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime))[0];

    return `
      <div class="stats-panel">
        <div class="stats-summary">
          <div class="stat-card"><span>Active Players</span><strong>${activePlayers.length}</strong><small>Free Fire roster</small></div>
          <div class="stat-card"><span>Upcoming</span><strong>${upcomingMatches.length}</strong><small>scheduled matches</small></div>
          <div class="stat-card"><span>Leadership</span><strong>${leaders.length}</strong><small>${leaders.map((player) => player.ign).join(', ') || 'to be assigned'}</small></div>
          <div class="stat-card"><span>Roles</span><strong>${Object.keys(roleCounts).length}</strong><small>${Object.entries(roleCounts).map(([role, count]) => `${count} ${role}`).join(' / ') || 'roster roles'}</small></div>
        </div>
        <div class="stats-detail">
          <div class="card">
            <div class="card-body">
              <span class="tag">Next match</span>
              <h3>${nextMatch?.tournamentName || 'TBA'}</h3>
              <div class="score compact">
                <div><strong>${nextMatch ? fmtDate(nextMatch.matchDateTime, true) : '-'}</strong><br><span class="muted">Time</span></div>
                <div><strong>${nextMatch?.matchType || '-'}</strong><br><span class="muted">Mode</span></div>
                <div><strong>${nextMatch?.mapName || '-'}</strong><br><span class="muted">Map</span></div>
              </div>
            </div>
          </div>
          <div class="stats-table-card">
            <table class="stats player-stats-table">
              <thead><tr><th>Player</th><th>Role</th><th>Leadership</th><th>Status</th></tr></thead>
              <tbody>${activePlayers.map((player) => `
                <tr>
                  <td>${player.ign}</td>
                  <td>${player.role || '-'}</td>
                  <td>${player.leadershipRole || '-'}</td>
                  <td>${player.status}</td>
                </tr>
              `).join('')}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="stats-panel">
      <div class="stats-summary">
        <div class="stat-card"><span>Completed</span><strong>${stats.completed.length}</strong><small>recent matches</small></div>
        <div class="stat-card"><span>Win Rate</span><strong>${stats.winRate}%</strong><small>${stats.wins} wins</small></div>
        <div class="stat-card"><span>Total Kills</span><strong>${stats.totalKills}</strong><small>team output</small></div>
        <div class="stat-card"><span>Avg Kills</span><strong>${stats.avgKills}</strong><small>per match</small></div>
      </div>
      <div class="stats-detail">
        <div class="card">
          <div class="card-body">
            <span class="tag">Top performer</span>
            <h3>${stats.topPlayer?.playerName || 'TBA'}</h3>
            <div class="score compact">
              <div><strong>${stats.topPlayer?.kills || 0}</strong><br><span class="muted">Kills</span></div>
              <div><strong>${stats.topPlayer?.damage || 0}</strong><br><span class="muted">Damage</span></div>
              <div><strong>${stats.topPlayer?.mvps || 0}</strong><br><span class="muted">MVPs</span></div>
            </div>
          </div>
        </div>
        <div class="stats-table-card">
          <table class="stats player-stats-table">
            <thead><tr><th>Player</th><th>Kills</th><th>Damage</th><th>Assists</th><th>KD</th><th>HS</th><th>MVP</th></tr></thead>
            <tbody>${stats.players.map((player) => `
              <tr>
                <td>${player.playerName}</td>
                <td>${player.kills}</td>
                <td>${player.damage}</td>
                <td>${player.assists}</td>
                <td>${player.knockdowns}</td>
                <td>${player.headshots}</td>
                <td>${player.mvps}</td>
              </tr>
            `).join('')}</tbody>
          </table>
        </div>
      </div>
      <div>
        <div class="section-head compact"><div><span class="eyebrow">Match selector</span><h3>Tournament Match Stats</h3></div></div>
        ${matchExplorer()}
      </div>
    </div>
  `;
}

function achievementCard(item) {
  const description = item.description || '';
  const hasLongDescription = description.length > 118;

  return `
    <article class="card achievement-card">
      <div class="card-body">
        <span class="tag">${item.position}</span>
        <h3>${item.title}</h3>
        <div class="meta"><span>${item.tournamentName}</span><span>${item.year || fmtDate(item.date)}</span><span>${item.tier || ''}</span><span>${item.prizePool || ''}</span></div>
        <p class="muted achievement-desc ${hasLongDescription ? 'is-collapsed' : ''}">${description}</p>
        ${hasLongDescription ? '<button class="text-button" type="button" data-toggle-achievement-desc>Read more</button>' : ''}
      </div>
    </article>
  `;
}

function achievementsBlock(items, initialCount = 6) {
  if (!items.length) return empty(gameEmpty('achievement'));

  return `
    <div class="achievement-block">
      <div class="grid achievement-grid">
        ${items.map((item, index) => {
          const card = achievementCard(item);
          return index >= initialCount ? card.replace('achievement-card', 'achievement-card achievement-extra is-hidden') : card;
        }).join('')}
      </div>
      ${items.length > initialCount ? `
        <div class="section-actions">
          <button class="btn secondary" type="button" data-show-achievements>
            Read more achievements
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function bindAchievementControls() {
  document.querySelectorAll('[data-show-achievements]').forEach((button) => {
    button.addEventListener('click', () => {
      const block = button.closest('.achievement-block');
      block.querySelectorAll('.achievement-extra').forEach((card) => card.classList.remove('is-hidden'));
      button.closest('.section-actions').remove();
    });
  });

  document.querySelectorAll('[data-toggle-achievement-desc]').forEach((button) => {
    button.addEventListener('click', () => {
      const description = button.previousElementSibling;
      const expanded = description.classList.toggle('is-expanded');
      description.classList.toggle('is-collapsed', !expanded);
      button.textContent = expanded ? 'Show less' : 'Read more';
    });
  });
}

function galleryCard(item) {
  const index = gameItems('gallery').indexOf(item);

  return `
    <button class="gallery-card ${index === 0 ? 'is-featured' : ''}" type="button" data-gallery-index="${index}" data-gallery-category="${item.category || 'Gallery'}">
      <img src="${assetUrl(item.image)}" alt="${item.caption || 'Team Elite gallery image'}" loading="lazy" decoding="async">
      <div class="gallery-overlay">
        <span>${item.category || 'Gallery'}</span>
        <strong>${item.caption || 'Team Elite moment'}</strong>
        <small>${fmtDate(item.date)}</small>
      </div>
    </button>
  `;
}

function galleryBlock(items) {
  if (!items.length) return empty(gameEmpty('gallery'));

  const categories = [...new Set(items.map((item) => item.category || 'Gallery'))];
  const previewItems = items.slice(0, 4);

  return `
    <div class="gallery-block">
      <div class="gallery-stack">
        <div class="gallery-stack-images" aria-hidden="true">
          ${previewItems.map((item, index) => `
            <img src="${assetUrl(item.image)}" alt="" loading="lazy" decoding="async" style="--stack-index:${index}">
          `).join('')}
        </div>
        <div class="gallery-stack-copy">
          <img class="gallery-stack-icon" src="${assetUrl(state.settings?.logo || '/assets/logo.png')}" onerror="fallbackLogo(this)" alt="Team Elite logo">
          <span class="eyebrow">Team archive</span>
          <h3>Gallery moments</h3>
          <p class="muted">A cleaner preview of roster portraits, brand shots, and team moments.</p>
          <button class="btn secondary" type="button" data-open-gallery>Show all images</button>
        </div>
      </div>
      <div class="gallery-full is-hidden" data-gallery-full>
        <div class="gallery-full-head">
          <div class="gallery-toolbar" aria-label="Gallery filters">
            <button class="gallery-filter active" type="button" data-gallery-filter="all">All</button>
            ${categories.map((category) => `<button class="gallery-filter" type="button" data-gallery-filter="${category}">${category}</button>`).join('')}
          </div>
          <button class="gallery-filter gallery-close-view" type="button" data-close-gallery-view>Close gallery</button>
        </div>
        <div class="gallery-grid">
          ${items.map(galleryCard).join('')}
        </div>
      </div>
      <dialog class="gallery-dialog" data-gallery-dialog>
        <button class="gallery-close" type="button" data-gallery-close aria-label="Close gallery">Close</button>
        <img data-gallery-lightbox-image alt="">
        <div class="gallery-dialog-copy">
          <span class="tag" data-gallery-lightbox-category></span>
          <h3 data-gallery-lightbox-caption></h3>
          <p class="muted" data-gallery-lightbox-date></p>
        </div>
      </dialog>
    </div>
  `;
}

function bindGalleryControls() {
  document.querySelectorAll('.gallery-block').forEach((block) => {
    const cards = [...block.querySelectorAll('.gallery-card')];
    const dialog = block.querySelector('[data-gallery-dialog]');
    const image = block.querySelector('[data-gallery-lightbox-image]');
    const caption = block.querySelector('[data-gallery-lightbox-caption]');
    const category = block.querySelector('[data-gallery-lightbox-category]');
    const date = block.querySelector('[data-gallery-lightbox-date]');

    block.querySelector('[data-open-gallery]')?.addEventListener('click', () => {
      block.querySelector('[data-gallery-full]')?.classList.remove('is-hidden');
      block.querySelector('[data-open-gallery]')?.closest('.gallery-stack')?.classList.add('is-open');
    });

    block.querySelector('[data-close-gallery-view]')?.addEventListener('click', () => {
      block.querySelector('[data-gallery-full]')?.classList.add('is-hidden');
      block.querySelector('.gallery-stack')?.classList.remove('is-open');
    });

    block.querySelectorAll('[data-gallery-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.galleryFilter;
        block.querySelectorAll('[data-gallery-filter]').forEach((item) => item.classList.toggle('active', item === button));
        cards.forEach((card) => {
          card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.galleryCategory !== filter);
        });
      });
    });

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const item = gameItems('gallery')[Number(card.dataset.galleryIndex)];
        if (!item || !dialog) return;

        image.src = assetUrl(item.image);
        image.alt = item.caption || 'Team Elite gallery image';
        caption.textContent = item.caption || 'Team Elite moment';
        category.textContent = item.category || 'Gallery';
        date.textContent = fmtDate(item.date);

        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      });
    });

    block.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

function sponsorCard(item) {
  return `
    <article class="card">
      <img class="card-img" src="${assetUrl(item.logo)}" alt="${item.sponsorName}">
      <div class="card-body">
        <h3>${item.sponsorName}</h3>
        <div class="meta"><span>${item.status}</span></div>
        ${item.websiteLink ? `<a class="btn secondary" href="${item.websiteLink}" target="_blank" rel="noreferrer">Visit sponsor</a>` : ''}
      </div>
    </article>
  `;
}

function contactContent() {
  const socials = [
    ['Instagram', state.settings.instagram],
    ['YouTube', state.settings.youtube],
    ['Discord', state.settings.discord],
    ['Facebook', state.settings.facebook]
  ].filter(([, url]) => url);

  return `
    <div class="contact-panel">
      <div class="contact-copy">
        <img class="contact-logo" src="${assetUrl(state.settings.logo)}" onerror="fallbackLogo(this)" alt="Team Elite logo">
        <span class="eyebrow">Partnerships / Scrims / Media</span>
        <h3>Contact Team Elite</h3>
        <p class="muted">${state.settings.aboutText}</p>
        <div class="contact-methods">
          <a href="mailto:${state.settings.email}"><span>Email</span><strong>${state.settings.email}</strong></a>
          ${socials.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer"><span>${label}</span><strong>Open channel</strong></a>`).join('')}
        </div>
      </div>
      <form class="contact-form" data-contact-form>
        <label>Name<input name="name" type="text" placeholder="Your name" required></label>
        <label>Email<input name="email" type="email" placeholder="you@example.com" required></label>
        <label class="full">Topic<select name="topic">
          <option>Partnership</option>
          <option>Scrim request</option>
          <option>Media inquiry</option>
          <option>Fan message</option>
        </select></label>
        <label class="full">Message<textarea name="message" placeholder="Tell us what you need..." required></textarea></label>
        <button class="btn full" type="submit">Send Inquiry</button>
        <p class="muted full">This opens your email app with the message prepared.</p>
      </form>
    </div>
  `;
}

function bindContactForm() {
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const subject = encodeURIComponent(`Team Elite ${data.topic} Inquiry`);
      const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nTopic: ${data.topic}\n\n${data.message}`);
      location.href = `mailto:${state.settings.email}?subject=${subject}&body=${body}`;
    });
  });
}

function empty(label) {
  return `<div class="empty">${label}</div>`;
}

function renderHome(root) {
  root.innerHTML = `
    ${nav()}
    <main>
      <section class="hero" id="home">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">Esports organization</span>
            <h1>${state.settings.heroTitle}</h1>
            <p>${heroSubtitle()}</p>
            <p>${heroAboutText()}</p>
            ${heroHighlights()}
            <div class="actions">
              <a class="btn" href="#achievements">View Achievements</a>
              <a class="btn secondary" href="#roster">Meet Roster</a>
            </div>
          </div>
          <div class="hero-emblem">
            <img class="hero-logo" src="${assetUrl(state.settings.logo)}" onerror="fallbackLogo(this)" alt="Team Elite logo">
            <a class="hero-about-link" href="about.html">
              <span>About Org</span>
              <strong>Profile & legacy</strong>
            </a>
          </div>
          <div class="hero-game-row">
            ${gameSwitcher('hero-game-switcher')}
          </div>
        </div>
      </section>
      <section class="section" id="updates"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Latest</span><h2>Updates</h2></div></div>
        <div class="grid">${gameItems('updates').slice(0, 3).map(updateCard).join('') || empty(gameEmpty('updates'))}</div>
      </div></section>
      <section class="section" id="roster"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Squad</span><h2>Roster</h2></div></div>
        <div class="grid four roster-grid">${gameItems('players').map(playerCard).join('') || empty(gameEmpty('roster'))}</div>
      </div></section>
      <section class="section" id="matches"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Schedule</span><h2>Matches</h2></div></div>
        ${matchesSection()}
      </div></section>
      <section class="section" id="stats"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Recent form</span><h2>Stats</h2></div></div>
        ${recentStatsSection()}
      </div></section>
      <section class="section" id="achievements"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Legacy</span><h2>Achievements</h2></div></div>
        ${achievementsBlock(gameItems('achievements'))}
      </div></section>
      <section class="section" id="gallery"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Moments</span><h2>Gallery</h2></div></div>
        ${galleryBlock(gameItems('gallery'))}
      </div></section>
      <section class="section" id="contact"><div class="container">
        <div class="section-head"><div><span class="eyebrow">Connect</span><h2>Contact</h2></div></div>
        ${contactContent()}
      </div></section>
    </main>
    ${footer()}
  `;
  bindNavMenu();
  bindGameSwitcher();
  bindAchievementControls();
  bindGalleryControls();
  bindContactForm();
  bindMatchExplorer();
  scrollToHashSection();
}

function renderCollection(root, title, text, html) {
  root.innerHTML = `${nav()}${pageTitle(title, text)}${footer()}`;
  document.getElementById('page-content').innerHTML = html;
  bindNavMenu();
  bindGameSwitcher();
  bindAchievementControls();
  bindGalleryControls();
  bindContactForm();
  bindMatchExplorer();
}

async function loadData() {
  state.settings = await api('/api/settings');
  const [updates, players, matches, achievements, gallery, sponsors] = await Promise.all([
    api('/api/updates'),
    api('/api/players'),
    api('/api/matches'),
    api('/api/achievements'),
    api('/api/gallery'),
    api('/api/sponsors')
  ]);
  Object.assign(state, { updates, players, matches, achievements, gallery, sponsors });
}

function renderPage(root) {
  if (page === 'home') renderHome(root);
  if (page === 'about') renderCollection(root, 'About Org', 'Organization profile, leadership, former players, region, and national identity.', aboutOrgSection());
  if (page === 'updates') renderCollection(root, 'Latest Updates', 'News, announcements, and competitive notes from Team Elite.', `<div class="grid">${gameItems('updates').map(updateCard).join('') || empty(gameEmpty('updates'))}</div>`);
  if (page === 'roster') renderCollection(root, 'Roster', 'The active lineup carrying Team Elite into every lobby.', `<div class="grid four roster-grid">${gameItems('players').map(playerCard).join('') || empty(gameEmpty('roster'))}</div>`);
  if (page === 'matches') renderCollection(root, 'Matches', 'Tournament schedule, completion status, and selectable match stats.', matchesSection());
  if (page === 'achievements') renderCollection(root, 'Achievements', 'Trophies, placements, qualifications, and milestone finishes.', achievementsBlock(gameItems('achievements')));
  if (page === 'gallery') renderCollection(root, 'Gallery', 'Team moments from training, tournaments, and wins.', galleryBlock(gameItems('gallery')));
  if (page === 'sponsors') renderCollection(root, 'Sponsors', 'Partners supporting the Team Elite competitive journey.', `<div class="grid">${state.sponsors.map(sponsorCard).join('') || empty('No sponsors yet.')}</div>`);
  if (page === 'contact') renderCollection(root, 'Contact', 'Reach Team Elite for partnerships, scrims, media, and community.', contactContent());
}

async function init() {
  const root = document.getElementById('app');
  try {
    await loadData();
    renderPage(root);
  } catch (error) {
    root.innerHTML = `${nav()}<main class="section"><div class="container empty">${error.message}. Start the backend and seed MongoDB.</div></main>${footer()}`;
    bindNavMenu();
  }
}

if (page) init();
