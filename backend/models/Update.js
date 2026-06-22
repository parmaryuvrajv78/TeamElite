const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, default: 'News' },
  date: { type: Date, default: Date.now },
  image: { type: String, default: '' },
  status: { type: String, enum: ['published', 'unpublished'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Update', updateSchema);
