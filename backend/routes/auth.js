const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email: String(email || '').toLowerCase() });

    if (!admin || !(await bcrypt.compare(password || '', admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'dev_secret_change_me',
      { expiresIn: '7d' }
    );

    return res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
