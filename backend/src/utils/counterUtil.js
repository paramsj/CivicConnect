import mongoose from 'mongoose';

export const getNextComplaintId = async () => {
    try {
        // Use the existing mongoose connection (already connected via db/index.js)
        if (mongoose.connection.readyState !== 1) {
            console.warn('MongoDB not connected in counter util – the app connection should already be established.');
            const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SIH';
            await mongoose.connect(mongoUri);
        }
        
        const counter = await mongoose.connection.db.collection('counters').findOneAndUpdate(
            { _id: 'complaintId' },
            { $inc: { seq: 1 } },
            { 
                upsert: true, 
                returnDocument: 'after',
                maxTimeMS: 5000
            }
        );
        
        console.log('Counter result:', counter);
        return counter.seq || 2001;
    } catch (error) {
        console.error('Counter error, using timestamp fallback:', error.message);
        return Date.now();
    }
};
