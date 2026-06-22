const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team_elite';

  // For Render deployment, replace MONGO_URI with your MongoDB Atlas connection string.
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = connectDB;
