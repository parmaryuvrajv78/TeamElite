const express = require('express');
const Player = require('../models/Player');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl } = require('./helpers');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.admin ? {} : { status: 'active' };
    res.json(await Player.find(filter).sort({ createdAt: 1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, upload.single('photo'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.photo = await imageUrl(req, req.file, 'players');
    res.status(201).json(await Player.create(data));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, upload.single('photo'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.photo = await imageUrl(req, req.file, 'players');
    res.json(await Player.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
