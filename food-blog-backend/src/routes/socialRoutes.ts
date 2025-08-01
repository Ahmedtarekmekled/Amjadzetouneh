import express from "express";
import { socialController } from "../controllers/socialController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", socialController.getAllSocials);

// Protected routes
router.use(authenticateToken);
router.post("/", socialController.createSocial);
router.put("/:id", socialController.updateSocial);
router.delete("/:id", socialController.deleteSocial);

export default router; 