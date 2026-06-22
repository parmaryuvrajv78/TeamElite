const path = require('path');
const { supabase, supabaseBucket, isSupabaseStorageEnabled } = require('../config/supabase');

async function imageUrl(req, file, folder = 'uploads') {
  if (!file) return '';

  if (!isSupabaseStorageEnabled()) {
    throw new Error('Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const extension = path.extname(file.originalname || file.filename || '').toLowerCase();
  const safeName = path
    .basename(file.originalname || file.filename || 'image', extension)
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'image';
  const objectPath = `${folder}/${Date.now()}-${safeName}${extension || '.png'}`;
  const body = file.buffer;

  const { error } = await supabase.storage
    .from(supabaseBucket)
    .upload(objectPath, body, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

function parseJsonField(value, fallback) {
  if (value === undefined || value === '') return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function cleanBody(body) {
  const cleaned = { ...body };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === '') cleaned[key] = undefined;
  });
  return cleaned;
}

module.exports = { imageUrl, parseJsonField, cleanBody };
