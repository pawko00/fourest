import { Router } from 'express';
import {
  getStats,
  getWeeklyStats,
  getMonthlyStats,
} from '../controllers/statsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getStats);
router.get('/weekly', getWeeklyStats);
router.get('/monthly', getMonthlyStats);

export default router;
