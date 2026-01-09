import { Router } from "express";
import {
  createSession,
  completeSession,
  getSessions,
  deleteSession,
  getTreeTypes,
  createSessionValidation,
} from "../controllers/sessionController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", createSessionValidation, createSession);
router.put("/:id/complete", completeSession);
router.get("/", getSessions);
router.delete("/:id", deleteSession);
router.get("/tree-types", getTreeTypes);

export default router;
