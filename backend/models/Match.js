const mongoose = require('mongoose');

const playerStatSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  kills: { type: Number, default: 0 },
  damage: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  knockdowns: { type: Number, default: 0 },
  headshots: { type: Number, default: 0 },
  mvp: { type: Boolean, default: false }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  tournamentName: { type: String, required: true },
  organizer: { type: String, default: '' },
  matchNumber: { type: Number, default: 1 },
  opponentTeamName: { type: String, required: true },
  opponentLogo: { type: String, default: '' },
  matchDateTime: { type: Date, required: true },
  matchType: { type: String, enum: ['BR', 'CS', 'Custom'], default: 'BR' },
  mapName: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  result: { type: String, enum: ['win', 'loss', 'draw', 'qualified', ''], default: '' },
  teamScore: { type: Number, default: 0 },
  opponentScore: { type: Number, default: 0 },
  totalTeamKills: { type: Number, default: 0 },
  resultScreenshot: { type: String, default: '' },
  playerStats: [playerStatSchema]
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
