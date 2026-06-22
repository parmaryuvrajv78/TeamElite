require('dotenv').config();

const bcrypt = require('bcryptjs');
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

  await AdminUser.create({
    email: 'admin@teamelite.com',
    password: await bcrypt.hash('admin123', 12)
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

  await Achievement.insertMany([
    {
      title: 'FFIC 2021 Fall Champions',
      tournamentName: 'Free Fire India Championship 2021 Fall',
      position: '1st Place',
      year: '2021',
      tier: 'A-Tier',
      date: new Date('2021-10-01'),
      trophyImage: placeholder('FFIC 2021 Fall'),
      prizePool: 'Over $46,000',
      description: 'Team Elite won India\'s biggest official Free Fire tournament at the time, making this the organization\'s most important title.'
    },
    {
      title: 'Free Fire Tri Series Runner-up',
      tournamentName: 'Free Fire Tri Series 2021',
      position: '2nd Place',
      year: '2021',
      tier: 'A-Tier',
      date: new Date('2021-04-01'),
      trophyImage: placeholder('Tri Series'),
      prizePool: '',
      description: 'A strong runner-up finish against top Indian teams during Team Elite\'s golden year.'
    },
    {
      title: 'FFIC 2021 Spring Top 3',
      tournamentName: 'Free Fire India Championship 2021 Spring',
      position: '3rd Place',
      year: '2021',
      tier: 'A-Tier',
      date: new Date('2021-03-01'),
      trophyImage: placeholder('FFIC Spring'),
      prizePool: '',
      description: 'Finished top 3 nationally in one of India\'s premier Free Fire events.'
    },
    {
      title: 'FFPL India 2021 Summer Top 3',
      tournamentName: 'Free Fire Pro League India 2021 Summer',
      position: '3rd Place',
      year: '2021',
      tier: 'A-Tier',
      date: new Date('2021-07-01'),
      trophyImage: placeholder('FFPL Summer'),
      prizePool: '',
      description: 'Secured a top 3 finish in one of India\'s leading Free Fire leagues.'
    },
    {
      title: 'Snapdragon Conquest Pro Series S2',
      tournamentName: 'Snapdragon Conquest Free Fire Pro Series Season 2',
      position: '5th Place',
      year: '2021',
      tier: 'Major',
      date: new Date('2021-08-01'),
      trophyImage: placeholder('Snapdragon'),
      prizePool: '',
      description: 'Finished 5th in a competitive national pro series field.'
    },
    {
      title: 'Asia Championship Qualification',
      tournamentName: 'Free Fire Asia Championship 2021',
      position: 'Top 8 Asia',
      year: '2021',
      tier: 'International',
      date: new Date('2021-11-01'),
      trophyImage: placeholder('Asia Championship'),
      prizePool: '',
      description: 'Qualified internationally and finished top 8 in Asia.'
    },
    {
      title: 'Pahadi Tri Series MVP',
      tournamentName: 'Free Fire Tri Series 2021',
      position: 'MVP',
      year: '2021',
      tier: 'Individual Award',
      date: new Date('2021-04-01'),
      trophyImage: placeholder('Pahadi MVP'),
      prizePool: '',
      description: 'Pahadi earned MVP honors for his performance in Free Fire Tri Series 2021.'
    },
    {
      title: 'Pahadi Fan Vote MVP',
      tournamentName: 'Conquest Free Fire Open Season 1',
      position: 'MVP Fan Vote',
      year: '2021',
      tier: 'Individual Award',
      date: new Date('2021-01-01'),
      trophyImage: placeholder('Fan Vote MVP'),
      prizePool: '',
      description: 'Pahadi won the fan-voted MVP award in Conquest Free Fire Open Season 1.'
    },
    {
      title: 'Killer FFIC Grand Finals MVP',
      tournamentName: 'Free Fire India Championship 2021 Fall',
      position: 'Most Kills',
      year: '2021',
      tier: 'Individual Award',
      date: new Date('2021-10-01'),
      trophyImage: placeholder('Killer MVP'),
      prizePool: '',
      description: 'Killer was Grand Finals MVP for most kills during Team Elite\'s FFIC 2021 Fall championship run.'
    },
    {
      title: 'Killer FFPL League Stage MVP',
      tournamentName: 'Free Fire Pro League India 2021 Summer',
      position: 'Most Kills',
      year: '2021',
      tier: 'Individual Award',
      date: new Date('2021-07-01'),
      trophyImage: placeholder('FFPL MVP'),
      prizePool: '',
      description: 'Killer earned League Stage MVP for most kills in FFPL India 2021 Summer.'
    },
    {
      title: 'Skyesports Pro League 2025',
      tournamentName: 'Skyesports Pro League 2025',
      position: '4th Place',
      year: '2025',
      tier: 'Recent Result',
      date: new Date('2025-01-01'),
      trophyImage: placeholder('Skyesports 2025'),
      prizePool: '',
      description: 'A recent 4th place result that keeps Team Elite visible in the modern competitive scene.'
    },
    {
      title: 'FFWS Malaysia 2025 Spring',
      tournamentName: 'Free Fire World Series Malaysia 2025 Spring',
      position: 'Top 5',
      year: '2025',
      tier: 'International',
      date: new Date('2025-05-01'),
      trophyImage: placeholder('FFWS Malaysia'),
      prizePool: '',
      description: 'Participated internationally and finished top 5 at Free Fire World Series Malaysia 2025 Spring.'
    }
  ]);

  // Gallery is intentionally empty for now; add photos later from the admin panel.

  await Sponsor.insertMany([
    { sponsorName: 'NeonGear', logo: placeholder('NeonGear'), websiteLink: 'https://example.com', status: 'active' },
    { sponsorName: 'AimFuel', logo: placeholder('AimFuel'), websiteLink: 'https://example.com', status: 'active' },
    { sponsorName: 'PulseNet', logo: placeholder('PulseNet'), websiteLink: 'https://example.com', status: 'active' }
  ]);

  console.log('Seed complete. Admin: admin@teamelite.com / admin123');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
