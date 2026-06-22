const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tournamentName: { type: String, required: true },
  position: { type: String, required: true },
  year: { type: String, default: '' },
  tier: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  trophyImage: { type: String, default: '' },
  prizePool: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
