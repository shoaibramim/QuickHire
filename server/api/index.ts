import "dotenv/config";
import mongoose from "mongoose";
import app from "../src/app";

// Cache the DB connection across warm invocations of the serverless function
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI!);
  isConnected = true;
  console.log("Connected to MongoDB Atlas");
};

// Initialise the connection (non-blocking – first request may be slightly slower)
connectDB().catch(console.error);

export default app;
