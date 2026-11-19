import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Reading profiles data...');
    const dataPath = path.resolve(__dirname, '../data/profiles.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const profiles = JSON.parse(rawData);

    console.log('[Seed] Cleaning old database collections...');
    await Profile.deleteMany({});
    await Swipe.deleteMany({});
    await Match.deleteMany({});

    console.log(`[Seed] Inserting ${profiles.length} mock profiles...`);
    const insertedProfiles = await Profile.insertMany(profiles);

    const incomingLikesCount = profiles.filter((p) => p.likedDemoUser).length;
    console.log(`[Seed] Successfully seeded ${insertedProfiles.length} profiles!`);
    console.log(`[Seed] Incoming secret likes for demo user: ${incomingLikesCount} profiles.`);
    console.log('[Seed] Swipes & Matches reset to clean state.');

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

