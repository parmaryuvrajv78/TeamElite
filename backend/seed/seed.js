require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AdminUser = require('../models/AdminUser');
const Update = require('../models/Update');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Achievement = require('../models/Achievement');
const Gallery = require('../models/Gallery');
const Sponsor = require('../models/Sponsor');
const Setting = require('../models/Setting');
const defaultAchievements = require('../data/defaultAchievements');

const placeholder = (label) => `https://placehold.co/900x600/07111f/22d3ee?text=${encodeURIComponent(label)}`;

async function seed() {
  await connectDB();

  await Promise.all([
    AdminUser.deleteMany({}),
    Update.deleteMany({}),
    Player.deleteMany({}),
    Match.deleteMany({}),
    Achievement.deleteMany({}),
    Gallery.deleteMany({}),
    Sponsor.deleteMany({}),
    Setting.deleteMany({})
  ]);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is required before seeding admin credentials.');
  }

  await AdminUser.create({
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 12)
  });

  await Setting.create({
    logo: '/assets/logo.png',
    heroTitle: 'Team Elite',
    heroSubtitle: 'FFIC 2021 Fall Champions and one of India\'s most decorated Free Fire rosters.',
    aboutText: 'Team Elite is a championship Free Fire roster known for national titles, Asia-level qualification, and elite individual firepower.',
    founder: 'To be announced',
    coFounder: 'To be announced',
    formerPlayers: 'Killer',
    region: 'South Asia',
    nation: 'India',
    nationFlag: 'IN',
    email: 'contact@teamelite.com',
    instagram: 'https://instagram.com/teamelite',
    youtube: 'https://youtube.com/@teamelite',
    discord: 'https://discord.gg/teamelite',
    facebook: 'https://facebook.com/teamelite'
  });

  await Update.insertMany([
    {
      title: 'Team Elite announces summer roster',
      description: 'A refined lineup enters the season with stronger leadership and sharper support roles.',
      category: 'Roster',
      date: new Date('2026-06-01'),
      image: placeholder('Roster Update'),
      status: 'published'
    },
    {
      title: 'Qualified for Elite Masters Finals',
      description: 'A composed final map secured qualification after a 16-kill team performance.',
      category: 'Tournament',
      date: new Date('2026-06-10'),
      image: placeholder('Finals Qualified'),
      status: 'published'
    },
    {
      title: 'New training schedule begins',
      description: 'The squad moves into a focused scrim block ahead of the next championship circuit.',
      category: 'Team',
      date: new Date('2026-06-15'),
      image: placeholder('Training Block'),
      status: 'published'
    }
  ]);

  await Player.insertMany([
    { name: 'Pahadi', ign: 'Pahadi', role: 'Sniper', leadershipRole: 'IGL', photo: '/assets/players/pahadi.jpeg', bio: 'Sniper and in-game leader who calls the pace while holding sharp long-range angles.', instagram: '#', youtube: '#', status: 'active' },
    { name: 'Mr jay', ign: 'Mr jay', role: 'Rusher', photo: '/assets/players/mr-jay.jpeg', bio: 'Aggressive entry player who creates early fight pressure.', instagram: '#', youtube: '#', status: 'active' },
    { name: 'cropse', ign: 'cropse', role: 'Rusher', photo: '/assets/players/cropse.jpeg', bio: 'Fast-paced rusher focused on opening space for the squad.', instagram: '#', youtube: '#', status: 'active' },
    { name: 'amin', ign: 'amin', role: 'Bomber', photo: '/assets/players/amin.jpeg', bio: 'Explosive utility player built for calculated chaos.', instagram: '#', youtube: '#', status: 'active' }
  ]);

  await Match.insertMany([
    {
      tournamentName: 'Elite Masters Finals',
      organizer: 'Elite Masters',
      matchNumber: 1,
      opponentTeamName: 'Grand Finals Lobby',
      opponentLogo: placeholder('Final Lobby'),
      matchDateTime: new Date('2026-07-05T19:00:00+05:30'),
      matchType: 'BR',
      mapName: 'Erangel',
      status: 'upcoming'
    },
    {
      tournamentName: 'Neon Cup Semi Final',
      organizer: 'Neon Esports',
      matchNumber: 1,
      opponentTeamName: 'Semi Final Lobby A',
      opponentLogo: placeholder('Lobby A'),
      matchDateTime: new Date('2026-06-12T20:30:00+05:30'),
      matchType: 'CS',
      mapName: 'Bermuda',
      status: 'completed',
      result: 'win',
      teamScore: 1,
      opponentScore: 43,
      totalTeamKills: 31,
      resultScreenshot: placeholder('Match Result'),
      playerStats: [
        { playerName: 'Pahadi', kills: 8, damage: 1420, assists: 3, knockdowns: 6, headshots: 5, mvp: false },
        { playerName: 'Mr jay', kills: 10, damage: 1760, assists: 2, knockdowns: 8, headshots: 3, mvp: true },
        { playerName: 'cropse', kills: 7, damage: 1280, assists: 4, knockdowns: 6, headshots: 2, mvp: false },
        { playerName: 'amin', kills: 6, damage: 1110, assists: 7, knockdowns: 5, headshots: 1, mvp: false }
      ]
    },
    {
      tournamentName: 'Neon Cup Semi Final',
      organizer: 'Neon Esports',
      matchNumber: 2,
      opponentTeamName: 'Semi Final Lobby B',
      opponentLogo: placeholder('Lobby B'),
      matchDateTime: new Date('2026-06-12T21:10:00+05:30'),
      matchType: 'BR',
      mapName: 'Purgatory',
      status: 'completed',
      result: 'qualified',
      teamScore: 2,
      opponentScore: 37,
      totalTeamKills: 26,
      resultScreenshot: placeholder('Match 2 Result'),
      playerStats: [
        { playerName: 'Pahadi', kills: 7, damage: 1320, assists: 4, knockdowns: 5, headshots: 3, mvp: false },
        { playerName: 'Mr jay', kills: 8, damage: 1490, assists: 3, knockdowns: 6, headshots: 2, mvp: true },
        { playerName: 'cropse', kills: 6, damage: 1090, assists: 5, knockdowns: 5, headshots: 2, mvp: false },
        { playerName: 'amin', kills: 5, damage: 940, assists: 6, knockdowns: 4, headshots: 1, mvp: false }
      ]
    },
    {
      tournamentName: 'Skyesports Pro League 2025',
      organizer: 'Skyesports',
      matchNumber: 1,
      opponentTeamName: 'League Stage Lobby',
      opponentLogo: placeholder('League Lobby'),
      matchDateTime: new Date('2025-12-18T19:00:00+05:30'),
      matchType: 'BR',
      mapName: 'Kalahari',
      status: 'completed',
      result: 'qualified',
      teamScore: 4,
      opponentScore: 28,
      totalTeamKills: 24,
      resultScreenshot: placeholder('Skyesports Result'),
      playerStats: [
        { playerName: 'Pahadi', kills: 9, damage: 1510, assists: 2, knockdowns: 7, headshots: 4, mvp: true },
        { playerName: 'Mr jay', kills: 6, damage: 1170, assists: 4, knockdowns: 5, headshots: 2, mvp: false },
        { playerName: 'cropse', kills: 5, damage: 930, assists: 5, knockdowns: 4, headshots: 1, mvp: false },
        { playerName: 'amin', kills: 4, damage: 880, assists: 6, knockdowns: 3, headshots: 1, mvp: false }
      ]
    },
    {
      tournamentName: 'FFWS Malaysia 2025 Spring',
      organizer: 'Garena',
      matchNumber: 1,
      opponentTeamName: 'International Lobby',
      opponentLogo: placeholder('FFWS Lobby'),
      matchDateTime: new Date('2025-05-22T20:00:00+05:30'),
      matchType: 'Custom',
      mapName: 'Bermuda',
      status: 'completed',
      result: 'draw',
      teamScore: 5,
      opponentScore: 31,
      totalTeamKills: 27,
      resultScreenshot: placeholder('FFWS Result'),
      playerStats: [
        { playerName: 'Pahadi', kills: 7, damage: 1290, assists: 3, knockdowns: 5, headshots: 3, mvp: false },
        { playerName: 'Mr jay', kills: 8, damage: 1460, assists: 2, knockdowns: 6, headshots: 2, mvp: true },
        { playerName: 'cropse', kills: 7, damage: 1220, assists: 4, knockdowns: 5, headshots: 2, mvp: false },
        { playerName: 'amin', kills: 5, damage: 960, assists: 5, knockdowns: 4, headshots: 1, mvp: false }
      ]
    }
  ]);

  await Achievement.insertMany(defaultAchievements.map((achievement) => ({
    ...achievement,
    trophyImage: placeholder(achievement.title)
  })));

  // Gallery is intentionally empty for now; add photos later from the admin panel.

  await Sponsor.insertMany([
    { sponsorName: 'NeonGear', logo: placeholder('NeonGear'), websiteLink: 'https://example.com', status: 'active' },
    { sponsorName: 'AimFuel', logo: placeholder('AimFuel'), websiteLink: 'https://example.com', status: 'active' },
    { sponsorName: 'PulseNet', logo: placeholder('PulseNet'), websiteLink: 'https://example.com', status: 'active' }
  ]);

  console.log(`Seed complete. Admin email: ${adminEmail}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(`Generated admin password: ${adminPassword}`);
  }
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
