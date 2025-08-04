// lib/db.ts
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface MongoConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnected: number | null;
}

// Initialize with proper typing
const mongoConnection: MongoConnection = {
  conn: null,
  promise: null,
  lastConnected: null,
};

// Time constants
const CONNECTION_TIMEOUT_MS = 5000;
const RECONNECT_THRESHOLD_MS = 30000; // 30 seconds

export async function connectDB(): Promise<typeof mongoose> {
  // Validate environment
  if (!process.env.MONGO_URL) {
    throw new Error("MongoDB connection URL not configured");
  }

  // Check if we have a valid cached connection
  if (mongoConnection.conn && isConnectionAlive()) {
    return mongoConnection.conn;
  }

  // Check if connection attempt is in progress
  if (!mongoConnection.promise) {
    mongoConnection.promise = createNewConnection().finally(() => {
      // Clear promise after connection settles (success or failure)
      mongoConnection.promise = null;
    });
  }

  try {
    mongoConnection.conn = await mongoConnection.promise;
    mongoConnection.lastConnected = Date.now();
    return mongoConnection.conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

function isConnectionAlive(): boolean {
  // Check mongoose connection state
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If we recently connected, consider it alive even if readyState disagrees
  if (
    mongoConnection.lastConnected &&
    Date.now() - mongoConnection.lastConnected < RECONNECT_THRESHOLD_MS
  ) {
    return true;
  }

  return false;
}

async function createNewConnection(): Promise<typeof mongoose> {
  const options: mongoose.ConnectOptions = {
    bufferCommands: false,
    serverSelectionTimeoutMS: CONNECTION_TIMEOUT_MS,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL!, options);
    setupConnectionEvents();
    console.log("MongoDB connected successfully");
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

function setupConnectionEvents() {
  mongoose.connection.on("connected", () => {
    mongoConnection.lastConnected = Date.now();
    console.log("MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
    mongoConnection.conn = null;
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);

    return NextResponse.json(
      { success: false, message: "MongoDB connection failed", error: err },
      { status: 500 }
    );
  });
}

// Utility function to check connection status
export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
