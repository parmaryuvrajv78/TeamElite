const express = require('express');
const Achievement = require('../models/Achievement');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl } = require('./helpers');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await Achievement.find({}).sort({ date: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, upload.single('trophyImage'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.trophyImage = await imageUrl(req, req.file, 'achievements');
    res.status(201).json(await Achievement.create(data));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, upload.single('trophyImage'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.trophyImage = await imageUrl(req, req.file, 'achievements');
    res.json(await Achievement.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
