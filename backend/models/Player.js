const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ign: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  leadershipRole: { type: String, default: '', trim: true },
  photo: { type: String, default: '' },
  bio: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
