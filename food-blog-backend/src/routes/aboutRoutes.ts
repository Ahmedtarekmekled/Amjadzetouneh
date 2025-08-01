import express, { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { authenticateToken } from "../middleware/auth";

const router: Router = express.Router();

// Public route to get about data
router.get("/", aboutController.getAbout);

// Protected routes
router.use(authenticateToken);
router.put("/", aboutController.updateAbout);
router.delete("/profile-image", aboutController.deleteProfileImage);
router.delete("/cv", aboutController.deleteCv);

export default router;
