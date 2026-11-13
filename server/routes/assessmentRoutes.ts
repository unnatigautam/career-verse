
import { Router } from "express";
import {
  saveAssessment,
  getLatestAssessment,
  getAssessmentHistory,
  deleteAssessment,
  clearAssessmentHistory,
} from "../controllers/assessmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/", saveAssessment);
router.get("/", getLatestAssessment);
router.get("/history", getAssessmentHistory);

// Delete all history — keep this route before /:id
router.delete("/history", clearAssessmentHistory);

// Delete one assessment by MongoDB ID
router.delete("/:id", deleteAssessment);

export default router;
