
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = Router();

router.use(protect);

router.get("/", getProfile);
router.put("/", updateProfile);

export default router;
