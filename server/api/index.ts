import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import app from "../src/app";

// Cache the connection promise — one real connection across warm invocations
let connectionPromise: Promise<typeof mongoose> | null = null;

function getConnection(): Promise<typeof mongoose> {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((m) => { console.log("Connected to MongoDB Atlas"); return m; })
      .catch((err) => {
        // Reset so the next request retries
        connectionPromise = null;
        return Promise.reject(err);
      });
  }
  return connectionPromise;
}

// Middleware wrapper: every request awaits the DB connection before proceeding
const handler = express();
handler.use(async (_req, _res, next) => {
  try {
    await getConnection();
    next();
  } catch (err) {
    next(err);
  }
});
handler.use(app);

export default handler;
