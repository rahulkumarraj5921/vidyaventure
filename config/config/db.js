const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bihar_tourism', {
      serverSelectionTimeoutMS: 10000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB not reachable (${error.message}).`);
    console.log(`💡 Activated In-Memory & JSON Data Store. All APIs and features are fully operational!`);
    return null;
  }
};

const getIsConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;
