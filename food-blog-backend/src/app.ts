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
    "https://amjadzetouneh.onrender.com",
    "http://localhost:3000",
    "http://localhost:5000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve frontend static files (for combined deployment)
app.use(express.static(path.join(process.cwd(), "public/frontend")));

// Serve _next directory for Next.js static assets
app.use("/_next", express.static(path.join(process.cwd(), "public/_next")));

// Serve images directory specifically
app.use(
  "/images",
  express.static(path.join(process.cwd(), "public/frontend/images"), {
    setHeaders: (res, path) => {
      console.log(`📁 Serving image: ${path}`);
    },
  })
);

// Serve favicon and other static assets
app.use(
  "/favicon.ico",
  express.static(path.join(process.cwd(), "public/frontend/favicon.ico"))
);
app.use(
  "/manifest.json",
  express.static(path.join(process.cwd(), "public/frontend/manifest.json"))
);

// Serve additional static assets
app.use(
  "/logo.png",
  express.static(path.join(process.cwd(), "public/frontend/images/logo.png"))
);
app.use(
  "/logo.svg",
  express.static(path.join(process.cwd(), "public/frontend/images/logo.svg"))
);

// Public uploads directory - no authentication required
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Log image requests for debugging
  if (
    req.path.includes("/images/") ||
    req.path.includes("/favicon") ||
    req.path.includes("/manifest")
  ) {
    console.log(`📁 Static asset request: ${req.method} ${req.path}`);
  }
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

  // Handle image requests with better error messages
  if (req.path.includes("/images/")) {
    const imagePath = path.join(process.cwd(), "public/frontend", req.path);
    console.log(`🔍 Looking for image: ${imagePath}`);

    if (require("fs").existsSync(imagePath)) {
      console.log(`✅ Image found: ${req.path}`);
      return res.sendFile(imagePath);
    } else {
      console.log(`❌ Image not found: ${req.path}`);
      console.log(
        `📁 Available images:`,
        require("fs").readdirSync(
          path.join(process.cwd(), "public/frontend/images")
        )
      );
      return res.status(404).json({
        message: "Image not found",
        path: req.path,
        availableImages: require("fs").readdirSync(
          path.join(process.cwd(), "public/frontend/images")
        ),
      });
    }
  }

  // Try to serve the requested file first
  const filePath = path.join(process.cwd(), "public/frontend", req.path);

  // Check if file exists
  if (require("fs").existsSync(filePath)) {
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
