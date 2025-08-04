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

// CORS configuration
const corsOptions = {
  origin: [
    'https://amjadzetouneh.onrender.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve frontend static files first (for combined deployment)
app.use(express.static(path.join(process.cwd(), "public/frontend")));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Serve favicon and other static assets
app.use("/favicon.ico", express.static(path.join(process.cwd(), "public/frontend/favicon.ico")));
app.use("/manifest.json", express.static(path.join(process.cwd(), "public/frontend/manifest.json")));

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



// Serve frontend for all other routes (SPA fallback)
app.get("*", (req: Request, res: Response) => {
  // Skip API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }

  // Try to serve the requested file first
  const filePath = path.join(process.cwd(), "public/frontend", req.path);
  
  // Check if file exists
  if (require('fs').existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // If file doesn't exist, serve index.html for SPA routing
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
