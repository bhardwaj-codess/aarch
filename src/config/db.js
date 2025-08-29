const mongoose = require('mongoose');

async function connectToDatabase(uri) {
  if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGO_URI in environment.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  return mongoose.connection;
}

module.exports = { connectToDatabase };


