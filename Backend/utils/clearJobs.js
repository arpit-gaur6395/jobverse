import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

const clearJobs = async () => {
    try {
        console.log('Clearing all jobs from database...');
        
        // Clear all jobs
        const jobResult = await Job.deleteMany({});
        console.log(`Deleted ${jobResult.deletedCount} jobs`);
        
        // Clear all applications
        const applicationResult = await Application.deleteMany({});
        console.log(`Deleted ${applicationResult.deletedCount} applications`);
        
        console.log('Database cleared successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

// Connect to database and clear
mongoose.connect('mongodb://127.0.0.1:27017/JP')
    .then(() => {
        console.log('Connected to database');
        clearJobs();
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });
