import { Request, Response, RequestHandler } from "express";
import cloudinary from "../config/cloudinary";
import About from "../models/About";
import fs from "fs";
import path from "path";

export const uploadController = {
  uploadImage: (async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!req.file.path) {
        throw new Error("File upload failed - no path returned");
      }

      // Upload to Cloudinary with quality settings
      const uploadOptions = {
        quality: "auto:good",
        fetch_format: "auto",
        width: 1200,
        height: 1200,
        crop: "limit",
        folder: "food-blog",
      };

      const result = await cloudinary.uploader.upload(
        req.file.path,
        uploadOptions
      );

      // Update the About document with the new image URL
      const about = await About.findOne().lean();
      if (about) {
        // If there's an existing image, delete it from Cloudinary
        if (about.profileImage) {
          try {
            const publicId = about.profileImage.split("/").pop()?.split(".")[0];
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (deleteError) {
            // Continue even if deletion fails
          }
        }
        about.profileImage = result.secure_url;
        await about.save();
      }

      // Clean up the temporary file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Error uploading image",
        error: error.message,
      });
    }
  }) as RequestHandler,

  uploadCV: (async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, "../../public/uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate a unique filename with timestamp and original extension
      const timestamp = Date.now();
      const fileExt = path.extname(req.file.originalname);
      const cvFilename = `cv_${timestamp}${fileExt}`;
      const cvPath = path.join(uploadsDir, cvFilename);

      // Delete existing CV if it exists
      const about = await About.findOne().lean();
      if (about?.cvFile) {
        const oldCvPath = path.join(uploadsDir, path.basename(about.cvFile));
        if (fs.existsSync(oldCvPath)) {
          fs.unlinkSync(oldCvPath);
        }
      }

      // Save the new CV file
      fs.writeFileSync(cvPath, req.file.buffer);

      // Update database with new CV path
      if (about) {
        about.cvFile = `/uploads/${cvFilename}`;
        await about.save();
      }

      res.json({
        url: `/uploads/${cvFilename}`,
        filename: cvFilename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Error uploading CV",
        error: error.message,
      });
    }
  }) as RequestHandler,

  deleteFile: (async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      const about = await About.findOne().lean();

      if (!about) {
        return res.status(404).json({ message: "About not found" });
      }

      if (type === "cv") {
        // Delete CV file
        if (about.cvFile) {
          const cvPath = path.join(__dirname, "../../public", about.cvFile);
          if (fs.existsSync(cvPath)) {
            fs.unlinkSync(cvPath);
          }
          about.cvFile = undefined;
          await about.save();
        }
      } else {
        // Delete image from Cloudinary
        if (about.profileImage) {
          try {
            // Extract public ID from Cloudinary URL
            const urlParts = about.profileImage.split("/");
            const filename = urlParts[urlParts.length - 1];
            const publicId = filename.split(".")[0];

            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (cloudinaryError) {
            // Continue even if deletion fails
          }
          about.profileImage = undefined;
          await about.save();
        }
      }

      res.json({ message: "File deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting file",
        error: error.message,
      });
    }
  }) as RequestHandler,
};
