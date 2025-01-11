// lib/db.ts
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Declare global variable to store the connection
declare const global: GlobalWithMongoose;

// Initialize the global mongoose object
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB with caching
 */
export async function connectToDatabase() {
  if (global.mongoose.conn) {
    // Use existing connection if available
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase() {
  if (global.mongoose.conn) {
    await global.mongoose.conn.disconnect();
    global.mongoose.conn = null;
    global.mongoose.promise = null;
    console.log('Disconnected from MongoDB');
  }
}

// Optional: Add event listeners for connection status
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export default mongoose;