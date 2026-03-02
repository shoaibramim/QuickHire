import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";

import "./config/passport";
import authRoutes       from "./routes/auth";
import jobRoutes        from "./routes/jobs";
import dashboardRoutes  from "./routes/dashboard";
import messagesRoutes   from "./routes/messages";
import scheduleRoutes   from "./routes/schedule";
import newsletterRoutes from "./routes/newsletter";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// ── Security middleware ──────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 req/15min
// 5 MB limit to accommodate base64-encoded company logos (2 MB image ≈ 2.7 MB in base64)
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(passport.initialize());

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth",               authRoutes);
app.use("/api/jobs",               jobRoutes);
app.use("/api/dashboard",          dashboardRoutes);
app.use("/api/dashboard/messages", messagesRoutes);
app.use("/api/dashboard/schedule", scheduleRoutes);
app.use("/api/newsletter",         newsletterRoutes);

// ── Global error handler (must be last) ─────────────────────
app.use(errorHandler);

// ── DB + Start ───────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT ?? 5000, () =>
      console.log(`Server running on port ${process.env.PORT ?? 5000}`)
    );
  })
  .catch(err => { console.error("DB connection failed:", err); process.exit(1); });