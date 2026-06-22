require('dotenv').config();

const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const { isSupabaseStorageEnabled, supabaseBucket } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;
const publicDir = path.join(__dirname, '..', 'frontend');
const indexedPages = [
  '/',
  '/about.html',
  '/updates.html',
  '/roster.html',
  '/matches.html',
  '/achievements.html',
  '/gallery.html',
  '/sponsors.html',
  '/contact.html'
];

app.set('trust proxy', true);

connectDB().catch((error) => {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
});

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app') && hostname.startsWith('team-elite');
  } catch (error) {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

function siteUrl(req) {
  const configuredUrl = process.env.PUBLIC_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

function serveSeoHtml(fileName) {
  return (req, res, next) => {
    fs.readFile(path.join(publicDir, fileName), 'utf8', (error, html) => {
      if (error) return next(error);
      res.type('html').send(html.replace(/__SITE_URL__/g, siteUrl(req)));
    });
  };
}

app.get('/', serveSeoHtml('index.html'));
indexedPages.filter((page) => page !== '/').forEach((page) => {
  app.get(page, serveSeoHtml(page.slice(1)));
});

app.use(express.static(publicDir));

app.get('/robots.txt', (req, res) => {
  const baseUrl = siteUrl(req);
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin.html',
    'Disallow: /admin-login.html',
    `Sitemap: ${baseUrl}/sitemap.xml`
  ].join('\n'));
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = siteUrl(req);
  const now = new Date().toISOString().split('T')[0];
  const urls = indexedPages.map((page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/updates', require('./routes/updates'));
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/settings', require('./routes/settings'));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'Team Elite API',
    storage: isSupabaseStorageEnabled() ? `supabase:${supabaseBucket}` : 'local'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Team Elite server running on http://localhost:${PORT}`);
});
