
import { Response } from "express";
import Assessment from "../models/Assessment.js";
import Profile from "../models/Profile.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const saveAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const { answers, result } = req.body;

    if (!answers || !result) {
      return res.status(400).json({
        success: false,
        message: "Answers and assessment result are required",
      });
    }

    // Save assessment history
    const assessment = await Assessment.create({
      userId: req.userId,
      answers,
      result,
    });

    // Sync assessment answers into the user's profile
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          education: answers.education ?? "",
          field: answers.field ?? "",
          interests: Array.isArray(answers.interests)
            ? answers.interests
            : [],
          skills: Array.isArray(answers.skills)
            ? answers.skills
            : [],
          experience: answers.experience ?? "",
          workPreference: answers.workPreference ?? "",
          careerGoal: answers.careerGoal ?? "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Assessment saved successfully",
      assessment,
      profile,
    });
  } catch (error) {
    console.error("Save assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save assessment",
    });
  }
};

export const getLatestAssessment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const assessment = await Assessment.findOne({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Get latest assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessment",
    });
  }
};

export const getAssessmentHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const history = await Assessment.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get assessment history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessment history",
    });
  }
};

export const deleteAssessment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const assessment = await Assessment.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete assessment",
    });
  }
};

export const clearAssessmentHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await Assessment.deleteMany({
      userId: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Assessment history cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear assessment history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear assessment history",
    });
  }
};
