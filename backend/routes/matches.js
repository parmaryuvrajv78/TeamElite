const express = require('express');
const Match = require('../models/Match');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl, parseJsonField } = require('./helpers');

const router = express.Router();
const files = upload.fields([
  { name: 'opponentLogo', maxCount: 1 },
  { name: 'resultScreenshot', maxCount: 1 }
]);

router.get('/', async (req, res, next) => {
  try {
    res.json(await Match.find({}).sort({ matchDateTime: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, files, async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    data.playerStats = parseJsonField(req.body.playerStats, []);
    if (req.files?.opponentLogo?.[0]) data.opponentLogo = await imageUrl(req, req.files.opponentLogo[0], 'matches/logos');
    if (req.files?.resultScreenshot?.[0]) data.resultScreenshot = await imageUrl(req, req.files.resultScreenshot[0], 'matches/results');
    res.status(201).json(await Match.create(data));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, files, async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    data.playerStats = parseJsonField(req.body.playerStats, []);
    if (req.files?.opponentLogo?.[0]) data.opponentLogo = await imageUrl(req, req.files.opponentLogo[0], 'matches/logos');
    if (req.files?.resultScreenshot?.[0]) data.resultScreenshot = await imageUrl(req, req.files.resultScreenshot[0], 'matches/results');
    res.json(await Match.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
