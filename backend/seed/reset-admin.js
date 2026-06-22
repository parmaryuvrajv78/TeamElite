require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AdminUser = require('../models/AdminUser');

async function resetAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@teamelite.com';
  const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');
  const hash = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate(
    { email },
    { email, password: hash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin login ready\nEmail: ${email}\nPassword: ${password}`);
  await mongoose.disconnect();
}

resetAdmin().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
