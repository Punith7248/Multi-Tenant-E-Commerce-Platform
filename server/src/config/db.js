const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    // Give up after 10s instead of the 30s default: a wrong URI or a blocked IP should fail fast.
    const { connection } = await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log(`[db] MongoDB connected -> ${connection.host}:${connection.port}/${connection.name}`);
  } catch (error) {
    // Never print MONGO_URI itself: it contains the password.
    console.error(`[db] MongoDB connection FAILED: ${error.message}`);
    console.error('[db] Check MONGO_URI in your .env, that MongoDB is running, and (Atlas) that your IP is allowed under Network Access.');
    process.exit(1);
  }

  // The driver reconnects on its own after this point; these just make drops visible in the terminal.
  mongoose.connection.on('disconnected', () => console.warn('[db] MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('[db] MongoDB reconnected'));
  mongoose.connection.on('error', (error) => console.error(`[db] MongoDB error: ${error.message}`));
};

module.exports = connectDB;
