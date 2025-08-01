import express from "express";
import { settingsController } from "../controllers/settingsController";
import { authenticateToken, adminOnly } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", settingsController.getAllSettings);

// Protected routes
router.use(authenticateToken);
router.use(adminOnly);
router.put("/", settingsController.updateSettings);
router.get("/export", settingsController.exportSettings);
router.post("/import", settingsController.importSettings);
router.post("/reset", settingsController.resetSettings);

export default router; 