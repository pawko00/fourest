import { Router } from "express";
import {
  getStats,
  getWeeklyStats,
  getMonthlyStats,
  getDashboardStats,
} from "../controllers/statsController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getStats);
router.get("/weekly", getWeeklyStats);
router.get("/monthly", getMonthlyStats);
router.get("/dashboard", getDashboardStats);

export default router;
