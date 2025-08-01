import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authenticateToken from "../middleware/auth";
import Settings from "../models/Settings";
import Social, { ISocial } from "../models/Social";

const router = express.Router();

// Add type for file types
type FileType = "logo" | "favicon" | "heroBackground";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    const frontendPublicDir = path.join(
      process.cwd(),
      "../../../frontend/public"
    );
    if (!fs.existsSync(frontendPublicDir)) {
      fs.mkdirSync(frontendPublicDir, { recursive: true });
    }
    cb(null, frontendPublicDir);
  },
  filename: (req: Request, file: any, cb: Function) => {
    const type = req.body.type as FileType;
    let filename;

    switch (type) {
      case "logo":
        filename = "logo.png";
        break;
      case "favicon":
        filename = "favicon.ico";
        break;
      case "heroBackground":
        filename = "hero-background.jpg";
        break;
      default:
        filename = file.originalname;
    }

    cb(null, filename);
  },
});

const upload = multer({ storage });

// Get all settings
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ error: "Error fetching settings" });
  }
});

// Update settings
router.put("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Error updating settings" });
  }
});

// Upload file
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const type = req.body.type as FileType;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let fileUrl;
      switch (type) {
        case "logo":
          fileUrl = "/logo.png";
          break;
        case "favicon":
          fileUrl = "/favicon.ico";
          break;
        case "heroBackground":
          fileUrl = "/hero-background.jpg";
          break;
        default:
          fileUrl = `/${file.filename}`;
      }

      await Settings.findOneAndUpdate(
        {},
        type === "heroBackground"
          ? { "branding.hero.backgroundImage": fileUrl }
          : { [`branding.${type}`]: fileUrl },
        { upsert: true }
      );

      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// Delete file
router.delete(
  "/upload/:type",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const type = req.params.type as FileType;

      const settings = await Settings.findOne({});
      let filePath: string | undefined;

      // Type-safe way to access branding properties
      if (type === "heroBackground") {
        filePath = settings?.branding?.hero?.backgroundImage;
      } else if (type === "logo" || type === "favicon") {
        filePath = settings?.branding?.[type];
      }

      if (filePath) {
        const fullPath = path.join(
          process.cwd(),
          "../../../frontend/public",
          filePath
        );
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }

        // Update settings with type-safe way
        if (type === "heroBackground") {
          await Settings.findOneAndUpdate(
            {},
            { "branding.hero.backgroundImage": "" }
          );
        } else if (type === "logo" || type === "favicon") {
          await Settings.findOneAndUpdate({}, { [`branding.${type}`]: "" });
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  }
);

export default router;
