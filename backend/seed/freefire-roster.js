require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Player = require('../models/Player');

const players = [
  {
    name: 'Pahadi',
    ign: 'Pahadi',
    role: 'Sniper',
    leadershipRole: 'IGL',
    photo: '/assets/players/pahadi-roster.png',
    bio: 'Active Team Elite Free Fire roster player known for sharp calls and long-range impact.',
    instagram: '#',
    youtube: '#',
    status: 'active'
  },
  {
    name: 'Mr Jay',
    ign: 'Mr Jay',
    role: 'Rusher',
    leadershipRole: '',
    photo: '/assets/players/mr-jay-roster.png',
    bio: 'Active Team Elite Free Fire roster player who creates early fight pressure.',
    instagram: '#',
    youtube: '#',
    status: 'active'
  },
  {
    name: 'Cropse',
    ign: 'Cropse',
    role: 'Rusher',
    leadershipRole: '',
    photo: '/assets/players/cropse-roster.png',
    bio: 'Active Team Elite Free Fire roster player with fast entries and aggressive pacing.',
    instagram: '#',
    youtube: '#',
    status: 'active'
  },
  {
    name: 'Amin',
    ign: 'Amin',
    role: 'Bomber',
    leadershipRole: '',
    photo: '/assets/players/amin-roster.png',
    bio: 'Active Team Elite Free Fire roster player focused on utility and clutch support.',
    instagram: '#',
    youtube: '#',
    status: 'active'
  }
];

async function seedRoster() {
  await connectDB();

  for (const player of players) {
    await Player.findOneAndUpdate(
      { ign: player.ign },
      player,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Free Fire roster ready: ${players.map((player) => player.ign).join(', ')}`);
  await mongoose.disconnect();
}

seedRoster().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
