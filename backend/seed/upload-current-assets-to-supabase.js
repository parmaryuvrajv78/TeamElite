require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { supabase, supabaseBucket, isSupabaseStorageEnabled } = require('../config/supabase');
const Player = require('../models/Player');
const Setting = require('../models/Setting');

const publicDir = path.join(__dirname, '..', '..', 'frontend');

const assets = [
  { local: 'assets/logo.png', remote: 'brand/logo.png', contentType: 'image/png', settingField: 'logo' },
  { local: 'assets/icon.png', remote: 'brand/icon.png', contentType: 'image/png' },
  { local: 'assets/roster-bg.png', remote: 'brand/roster-bg.png', contentType: 'image/png' },
  { local: 'assets/free-fire-logo.png', remote: 'brand/free-fire-logo.png', contentType: 'image/png' },
  { local: 'assets/bgmi-logo.png', remote: 'brand/bgmi-logo.png', contentType: 'image/png' },
  { local: 'assets/players/pahadi-roster.png', remote: 'players/pahadi-roster.png', contentType: 'image/png', ign: 'Pahadi' },
  { local: 'assets/players/mr-jay-roster.png', remote: 'players/mr-jay-roster.png', contentType: 'image/png', ign: 'Mr Jay' },
  { local: 'assets/players/cropse-roster.png', remote: 'players/cropse-roster.png', contentType: 'image/png', ign: 'Cropse' },
  { local: 'assets/players/amin-roster.png', remote: 'players/amin-roster.png', contentType: 'image/png', ign: 'Amin' }
];

async function uploadAsset(asset) {
  const body = await fs.readFile(path.join(publicDir, asset.local));
  const { error } = await supabase.storage
    .from(supabaseBucket)
    .upload(asset.remote, body, {
      contentType: asset.contentType,
      upsert: true
    });

  if (error) throw new Error(`${asset.local}: ${error.message}`);

  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(asset.remote);
  return data.publicUrl;
}

async function uploadCurrentAssets() {
  if (!isSupabaseStorageEnabled()) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.');
  }

  await connectDB();

  const uploaded = {};
  for (const asset of assets) {
    const publicUrl = await uploadAsset(asset);
    uploaded[asset.local] = publicUrl;
    console.log(`${asset.local} -> ${publicUrl}`);

    if (asset.ign) {
      await Player.findOneAndUpdate({ ign: asset.ign }, { photo: publicUrl }, { new: true });
    }

    if (asset.settingField) {
      const settings = await Setting.findOne();
      if (settings) {
        settings[asset.settingField] = publicUrl;
        await settings.save();
      }
    }
  }

  await mongoose.disconnect();
  console.log('Current assets uploaded to Supabase and database paths updated.');
}

uploadCurrentAssets().catch(async (error) => {
  console.error(error.message || error);
  await mongoose.disconnect();
  process.exit(1);
});
