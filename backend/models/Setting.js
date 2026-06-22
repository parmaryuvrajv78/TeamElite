const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  logo: { type: String, default: '/assets/logo.png' },
  heroTitle: { type: String, default: 'Team Elite' },
  heroSubtitle: { type: String, default: 'Precision. Discipline. Victory.' },
  aboutText: { type: String, default: 'Team Elite is a competitive esports roster built on sharp strategy, clean teamwork, and relentless improvement.' },
  founder: { type: String, default: 'To be announced' },
  coFounder: { type: String, default: 'To be announced' },
  formerPlayers: { type: String, default: 'Killer' },
  region: { type: String, default: 'South Asia' },
  nation: { type: String, default: 'India' },
  nationFlag: { type: String, default: 'IN' },
  email: { type: String, default: 'contact@teamelite.com' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  discord: { type: String, default: '' },
  facebook: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
