const express = require('express');
const Update = require('../models/Update');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl } = require('./helpers');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.admin ? {} : { status: 'published' };
    const items = await Update.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.image = await imageUrl(req, req.file, 'updates');
    res.status(201).json(await Update.create(data));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.image = await imageUrl(req, req.file, 'updates');
    res.json(await Update.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    res.json({ message: 'Update deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
