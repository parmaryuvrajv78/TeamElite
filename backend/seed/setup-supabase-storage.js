require('dotenv').config();

const { supabase, supabaseBucket, isSupabaseStorageEnabled } = require('../config/supabase');

async function setupSupabaseStorage() {
  if (!isSupabaseStorageEnabled()) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.');
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = buckets.some((bucket) => bucket.name === supabaseBucket);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(supabaseBucket, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    });
    if (createError) throw createError;
    console.log(`Created public Supabase bucket: ${supabaseBucket}`);
    return;
  }

  const { error: updateError } = await supabase.storage.updateBucket(supabaseBucket, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  });
  if (updateError) throw updateError;
  console.log(`Supabase bucket ready: ${supabaseBucket}`);
}

setupSupabaseStorage().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
