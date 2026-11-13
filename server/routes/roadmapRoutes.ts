
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRoadmapProgress,
  updateRoadmapProgress,
} from "../controllers/roadmapController.js";

const router = Router();

router.use(protect);

router.get("/", getRoadmapProgress);
router.put("/", updateRoadmapProgress);

export default router;
