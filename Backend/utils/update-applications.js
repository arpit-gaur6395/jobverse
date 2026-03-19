const mongoose = require('mongoose');
const Application = require('../models/Application');

mongoose.connect('mongodb://127.0.0.1:27017/JP')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Add status field to existing applications
    const result = await Application.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'pending' } }
    );
    
    console.log(`Updated ${result.modifiedCount} applications with status field`);
    
    // Verify the update
    const apps = await Application.find({});
    console.log(`Total applications: ${apps.length}`);
    
    if (apps.length > 0) {
      console.log('Sample application:', {
        id: apps[0]._id,
        status: apps[0].status,
        hasStatus: !!apps[0].status
      });
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
