import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

if (fs.existsSync('./.env')) {
    dotenv.config({ path: './.env' });
} else if (fs.existsSync('../.env')) {
    dotenv.config({ path: '../.env' });
} else if (fs.existsSync('../../.env')) {
    dotenv.config({ path: '../../.env' });
} else {
    dotenv.config();
}

const immediateCounterFix = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SIH';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);
    
    // Delete ALL existing counters
    await mongoose.connection.db.collection('counters').deleteMany({});
    console.log('Cleared all counters');
    
    // Find the highest complaintId in your reports
    const highestReport = await mongoose.connection.db.collection('reports')
      .findOne({}, { sort: { complaintId: -1 } });
    
    const nextId = highestReport ? highestReport.complaintId + 500 : 2000;
    console.log('Highest existing complaintId:', highestReport?.complaintId || 0);
    console.log('Setting counter to:', nextId);
    
    // Set counter to next available ID
    await mongoose.connection.db.collection('counters').insertOne({
      _id: 'complaintId',
      seq: nextId
    });
    
    console.log(`Counter set to ${nextId} successfully`);
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error during counter fix:', error);
    process.exit(1);
  }
};

immediateCounterFix();
