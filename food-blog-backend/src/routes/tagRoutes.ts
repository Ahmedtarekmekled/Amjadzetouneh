import express from "express";
import { tagController } from "../controllers/tagController";
import { authenticateToken, adminOnly } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", tagController.getAllTags);

// Protected routes
router.use(authenticateToken);
router.use(adminOnly);
router.post("/", tagController.createTag);
router.put("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

export default router; 