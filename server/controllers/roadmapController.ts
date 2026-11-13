
import { Request, Response } from "express";
import Roadmap from "../models/Roadmap.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const getRoadmapProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const roadmap = await Roadmap.findOne({
      userId: req.userId,
    });

    return res.status(200).json({
      success: true,
      completedTasks: roadmap?.completedTasks ?? [],
    });
  } catch (error) {
    console.error("Get roadmap progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap progress",
    });
  }
};

export const updateRoadmapProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { completedTasks } = req.body;

    if (
      !Array.isArray(completedTasks) ||
      !completedTasks.every((task: unknown) => typeof task === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "completedTasks must be an array of strings",
      });
    }

    const roadmap = await Roadmap.findOneAndUpdate(
      { userId: req.userId },
      { $set: { completedTasks: [...new Set(completedTasks)] } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Roadmap progress saved successfully",
      completedTasks: roadmap.completedTasks,
    });
  } catch (error) {
    console.error("Update roadmap progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save roadmap progress",
    });
  }
};
