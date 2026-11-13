
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Compiled TypeScript routes
import authRoutes from "./dist/routes/authRoutes.js";
import assessmentRoutes from "./dist/routes/assessmentRoutes.js";

// Existing JavaScript routes
import profileRoutes from "./routes/profile.cjs";
import recommendationRoutes from "./routes/recommendations.cjs";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerVerse backend is running",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerVerse server running on port ${PORT}`);
});
