require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Player = require('../models/Player');

const cutoutPhotos = [
  ['Pahadi', '/assets/players/pahadi-roster.png'],
  ['Mr Jay', '/assets/players/mr-jay-roster.png'],
  ['Cropse', '/assets/players/cropse-roster.png'],
  ['Amin', '/assets/players/amin-roster.png']
];

async function updateCutouts() {
  await connectDB();

  for (const [ign, photo] of cutoutPhotos) {
    await Player.findOneAndUpdate({ ign }, { photo }, { new: true });
  }

  console.log(`Roster photos updated to cutouts: ${cutoutPhotos.map(([ign]) => ign).join(', ')}`);
  await mongoose.disconnect();
}

updateCutouts().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
