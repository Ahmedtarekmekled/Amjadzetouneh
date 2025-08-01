import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/postRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import multer from "multer";
import jwt from "jsonwebtoken";
import socialRoutes from "./routes/socialRoutes";
import settingsRoutes from "./routes/settings";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), "public")));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Authenticated file downloads
app.use("/uploads", (req: Request, res: Response, next: NextFunction) => {
  // Check for token in query string
  const token = req.query.token as string;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET!);

    // If token is valid, proceed with download
    const filePath = path.join(__dirname, "../public/uploads", req.path);
    res.download(filePath, (err: any) => {
      if (err) {
        // If file doesn't exist or other error, continue to next middleware
        next();
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

// Health check route for Render
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api/settings", settingsRoutes);

// Serve frontend static files (for combined deployment)
app.use(express.static(path.join(process.cwd(), "public/frontend")));

// Serve frontend for all other routes (SPA fallback)
app.get("*", (req: Request, res: Response) => {
  // Skip API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }

  // Serve frontend index.html for all other routes
  res.sendFile(path.join(process.cwd(), "public/frontend/index.html"));
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }

  if (err.message) {
    return res.status(400).json({
      message: "Request error",
      error: err.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: "An unexpected error occurred",
  });
});

export default app;
