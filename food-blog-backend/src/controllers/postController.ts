import { Request, Response, RequestHandler } from "express";
import { AuthRequest } from "../middleware/auth";
import Post from "../models/Post";

export const postController = {
  createPost: (async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        excerpt,
        content,
        images,
        coverImage,
        categories,
        tags,
        status,
        publishDate,
        prepTime,
        cookTime,
        difficulty,
        servings,
        calories,
        slug: providedSlug,
      } = req.body;

      // Generate slug from English title if not provided
      const slug =
        providedSlug ||
        (title?.en || content?.en?.title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const post = new Post({
        title,
        excerpt,
        content,
        images,
        coverImage,
        categories,
        tags,
        status,
        publishDate,
        prepTime: prepTime || 0,
        cookTime: cookTime || 0,
        difficulty: difficulty || "medium",
        servings: servings || 0,
        calories: calories || 0,
        author: req.user!._id,
        slug,
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({ message: "Error creating post" });
    }
  }) as RequestHandler,

  getAllPosts: (async (_req: Request, res: Response) => {
    try {
      const posts = await Post.find({ status: "published" })
        .sort({ createdAt: -1 })
        .populate("author", "username");
      res.json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  }) as RequestHandler,

  // Admin method to get all posts including drafts
  getAllPostsAdmin: (async (req: AuthRequest, res: Response) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author", "username");
      res.json(posts);
    } catch (error) {
      console.error("Get all posts error:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  }) as RequestHandler,

  getFeaturedPosts: (async (_req: Request, res: Response) => {
    try {
      const posts = await Post.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("author", "username");
      res.json(posts);
    } catch (error) {
      console.error("Get featured posts error:", error);
      res.status(500).json({ message: "Error fetching featured posts" });
    }
  }) as RequestHandler,

  getPostById: (async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id).populate(
        "author",
        "username"
      );

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Get post by ID error:", error);
      res.status(500).json({ message: "Error fetching post" });
    }
  }) as RequestHandler,

  getPostBySlug: (async (req: Request, res: Response) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug }).populate(
        "author",
        "username"
      );

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Get post by slug error:", error);
      res.status(500).json({ message: "Error fetching post" });
    }
  }) as RequestHandler,

  updatePost: (async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        excerpt,
        content,
        images,
        coverImage,
        categories,
        tags,
        status,
        publishDate,
        prepTime,
        cookTime,
        difficulty,
        servings,
        calories,
        slug: providedSlug,
      } = req.body;

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user is author or admin
      if (
        post.author.toString() !== req.user!._id.toString() &&
        !req.user!.isAdmin
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Generate new slug if title changed
      const slug =
        providedSlug ||
        (title?.en || content?.en?.title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          excerpt,
          content,
          images,
          coverImage,
          categories,
          tags,
          status,
          publishDate,
          prepTime: prepTime || 0,
          cookTime: cookTime || 0,
          difficulty: difficulty || "medium",
          servings: servings || 0,
          calories: calories || 0,
          slug,
        },
        { new: true }
      ).populate("author", "username");

      res.json(updatedPost);
    } catch (error) {
      console.error("Update post error:", error);
      res.status(500).json({ message: "Error updating post" });
    }
  }) as RequestHandler,

  deletePost: (async (req: AuthRequest, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user is author or admin
      if (
        post.author.toString() !== req.user!._id.toString() &&
        !req.user!.isAdmin
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ message: "Error deleting post" });
    }
  }) as RequestHandler,

  getPostsByCategory: (async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({
        categories: req.params.category,
        status: "published",
      })
        .sort({ createdAt: -1 })
        .populate("author", "username");
      res.json(posts);
    } catch (error) {
      console.error("Get posts by category error:", error);
      res.status(500).json({ message: "Error fetching posts by category" });
    }
  }) as RequestHandler,
};
