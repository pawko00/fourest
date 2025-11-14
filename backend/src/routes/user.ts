import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileValidation,
  changePasswordValidation,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/password', changePasswordValidation, changePassword);

export default router;
