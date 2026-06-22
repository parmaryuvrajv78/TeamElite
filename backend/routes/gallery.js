const express = require('express');
const Gallery = require('../models/Gallery');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl } = require('./helpers');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await Gallery.find({}).sort({ date: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.image = await imageUrl(req, req.file, 'gallery');
    res.status(201).json(await Gallery.create(data));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.image = await imageUrl(req, req.file, 'gallery');
    res.json(await Gallery.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
