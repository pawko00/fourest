import { Router } from "express";
import {
  updateProfile,
  updateProfileValidation,
  changePassword,
  changePasswordValidation,
  getProfile,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfileValidation, updateProfile);
router.put("/password", changePasswordValidation, changePassword);

export default router;
