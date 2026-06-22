const express = require('express');
const Setting = require('../models/Setting');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl } = require('./helpers');

const router = express.Router();

async function getSettings() {
  let settings = await Setting.findOne({});
  if (!settings) settings = await Setting.create({});
  return settings;
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await getSettings());
  } catch (error) {
    next(error);
  }
});

router.put('/', protect, upload.single('logo'), async (req, res, next) => {
  try {
    const settings = await getSettings();
    const data = cleanBody(req.body);
    if (req.file) data.logo = await imageUrl(req, req.file, 'settings');
    Object.assign(settings, data);
    res.json(await settings.save());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
