import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/auth";
import { uploadController } from "../controllers/uploadController";
import { downloadFile } from "../utils/fileHelpers";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const type = req.body.type;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    switch (type) {
      case "logo":
        cb(null, "logo" + ext);
        break;
      case "favicon":
        cb(null, "favicon" + ext);
        break;
      default:
        cb(null, "file-" + uniqueSuffix + ext);
    }
  },
});

const upload = multer({ storage });

// Protected routes
router.use(authenticateToken);

// Upload endpoint
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: "File uploaded successfully",
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file" });
  }
});

// Delete endpoint
router.delete("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    const filePath = path.join(process.cwd(), "public/uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting file" });
  }
});

// Public download route
router.get("/download/:filename", downloadFile);

export default router;
