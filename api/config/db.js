const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  if (global._mongoosePromise) {
    console.log('Waiting for existing connection promise...');
    cachedConnection = await global._mongoosePromise;
    const host = cachedConnection.connection?.host || mongoose.connection?.host || 'connected';
    console.log(`MongoDB Connected: ${host}`);
    return cachedConnection;
  }

  try {
    console.log('Connecting to MongoDB...');
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    
    global._mongoosePromise = mongoose.connect(process.env.MONGO_URI, opts);
    cachedConnection = await global._mongoosePromise;
    
    const host = cachedConnection.connection?.host || mongoose.connection?.host || 'connected';
    console.log(`MongoDB Connected: ${host}`);
    
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    global._mongoosePromise = null;
    throw error;
  }
};

module.exports = connectDB;
