const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  sponsorName: { type: String, required: true },
  logo: { type: String, default: '' },
  websiteLink: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
