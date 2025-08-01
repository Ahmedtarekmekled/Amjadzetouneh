import express, { Router } from "express";
import { postController } from "../controllers/postController";
import { authenticateToken, adminOnly, AuthRequest } from "../middleware/auth";

const router: Router = express.Router();

// Public routes - specific routes first
router.get("/featured", postController.getFeaturedPosts);

// Explicit public routes for frontend - must come before parameterized routes
router.get("/public", postController.getAllPosts);
router.get("/public/slug/:slug", postController.getPostBySlug);
router.get("/public/category/:category", postController.getPostsByCategory);

// Test authentication endpoint
router.get(
  "/test-auth",
  authenticateToken as express.RequestHandler,
  (req: AuthRequest, res) => {
    res.json({
      message: "Authentication successful",
      user: req.user,
    });
  }
);

// General public routes - parameterized routes last
router.get("/", postController.getAllPosts);
router.get("/slug/:slug", postController.getPostBySlug);
router.get("/:id", postController.getPostById);

// Protected routes
router.use(authenticateToken as express.RequestHandler);
router.get("/admin/all", postController.getAllPostsAdmin);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;
