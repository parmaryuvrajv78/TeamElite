const express = require('express');
const Sponsor = require('../models/Sponsor');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cleanBody, imageUrl } = require('./helpers');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.admin ? {} : { status: 'active' };
    res.json(await Sponsor.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, upload.single('logo'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.logo = await imageUrl(req, req.file, 'sponsors');
    res.status(201).json(await Sponsor.create(data));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, upload.single('logo'), async (req, res, next) => {
  try {
    const data = cleanBody(req.body);
    if (req.file) data.logo = await imageUrl(req, req.file, 'sponsors');
    res.json(await Sponsor.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Sponsor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sponsor deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
