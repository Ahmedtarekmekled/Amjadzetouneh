import express, { Router, Response } from "express";
import { postController } from "../controllers/postController";
import { authenticateToken, adminOnly, AuthRequest } from "../middleware/auth";

const router: Router = express.Router();

// Public routes - specific routes first
router.get("/featured", postController.getFeaturedPosts);

// Category routes - must come before parameterized routes
router.get(
  "/category/:category",
  (req, res, next) => {
    console.log("🔍 Category route accessed:", req.params.category);
    console.log("🔍 Request method:", req.method);
    console.log("🔍 Request path:", req.path);
    console.log("🔍 Request headers:", req.headers);
    next();
  },
  postController.getPostsByCategory
);

// Explicit public routes for frontend - must come before parameterized routes
router.get("/public", postController.getAllPosts);
router.get("/public/slug/:slug", postController.getPostBySlug);
router.get("/public/category/:category", postController.getPostsByCategory);

// Test authentication endpoint
router.get(
  "/test-auth",
  authenticateToken as express.RequestHandler,
  (req: AuthRequest, res: Response) => {
    res.json({
      message: "Authentication successful",
      user: req.user,
    });
  }
);

// General public routes - parameterized routes last
router.get("/", postController.getAllPosts);
router.get("/slug/:slug", postController.getPostBySlug);

// Protected routes - must come after all public routes
router.use(authenticateToken as express.RequestHandler);
router.get("/admin/all", postController.getAllPostsAdmin);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.get("/:id", postController.getPostById);

export default router;
