# Team Elite Website

Team Elite is split into two deployment folders:

- `frontend/` - static HTML/CSS/JS for Vercel
- `backend/` - Express API for Render, MongoDB Atlas, and Supabase Storage

## Local Backend

Install and run from the root:

```bash
npm install
npm start
```

Or directly from backend:

```bash
cd backend
npm install
npm start
```

Local API:

```text
http://localhost:5000/api/health
```

## Frontend Config

For local same-server testing, `frontend/js/config.js` can stay empty:

```js
window.API_BASE_URL = window.API_BASE_URL || '';
```

For Vercel, set it to your Render backend URL:

```js
window.API_BASE_URL = 'https://your-render-api.onrender.com';
```

## Render Backend

Use:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set env vars:

```text
MONGO_URI
JWT_SECRET
CLIENT_URLS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
PUBLIC_SITE_URL=https://your-custom-domain.com
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET=team-elite-assets
```

## Vercel Frontend

Use:

- Root Directory: `frontend`
- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty

Before deploying, edit:

```text
frontend/js/config.js
```

and set your Render API URL.

## Admin

- Admin page: `/admin-login.html`
- Email: `admin@teamelite.com`
- Password: the password currently set in MongoDB

## Supabase Storage

Uploads from admin go directly to Supabase Storage. To create/update the bucket:

```bash
npm run setup:supabase
```
