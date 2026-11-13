
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes from "../routes/authRoutes.js";
import assessmentRoutes from "../routes/assessmentRoutes.js";
import roadmapRoutes from "../routes/roadmapRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";

import { protect, type AuthRequest } from "../middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CareerVerse backend is running!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/profile", profileRoutes);

// Current authenticated user
app.get("/api/auth/me", protect, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    userId: req.userId,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`CareerVerse backend running at http://localhost:${PORT}`);
      console.log("MongoDB connected successfully!");
      console.log("Auth API: /api/auth");
      console.log("Assessment API: /api/assessment");
      console.log("Roadmap API: /api/roadmap");
      console.log("Profile API: /api/profile");
      console.log("Health check: /api/health");
      console.log("--------------------------------------");
      console.log("CareerVerse backend is ready!");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

export default app;
