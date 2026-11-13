
import { Response } from "express";
import mongoose from "mongoose";
import Profile from "../models/Profile.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    let profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      profile = await Profile.create({
        userId: new mongoose.Types.ObjectId(req.userId),
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const {
      name,
      email,
      education,
      field,
      interests,
      skills,
      experience,
      workPreference,
      careerGoal,
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          name: typeof name === "string" ? name.trim() : "",
          email: typeof email === "string" ? email.trim() : "",
          education: typeof education === "string" ? education : "",
          field: typeof field === "string" ? field : "",
          interests: Array.isArray(interests) ? interests : [],
          skills: Array.isArray(skills) ? skills : [],
          experience: typeof experience === "string" ? experience : "",
          workPreference:
            typeof workPreference === "string" ? workPreference : "",
          careerGoal: typeof careerGoal === "string" ? careerGoal : "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
    });
  }
};
