import { Request, Response, RequestHandler } from "express";
import About from "../models/About";

export const aboutController = {
  getAbout: (async (_req: Request, res: Response) => {
    try {
      let about = await About.findOne();

      if (!about) {
        // Create default about data if none exists
        about = await About.create({
          content: {
            en: {
              description: "",
              experience: "",
              skills: [],
              education: []
            },
            ar: {
              description: "",
              experience: "",
              skills: [],
              education: []
            }
          },
          showCV: true
        });
      }

      res.json(about.toObject());
    } catch (error) {
      console.error("Error fetching about:", error);
      res.status(500).json({ message: "Error fetching about data" });
    }
  }) as RequestHandler,

  updateAbout: (async (req: Request, res: Response) => {
    try {
      const { content, profileImage, cvFile, showCV } = req.body;

      let about = await About.findOne();

      if (about) {
        about.content = content;
        if (profileImage !== undefined) about.profileImage = profileImage;
        if (cvFile !== undefined) about.cvFile = cvFile;
        if (showCV !== undefined) about.showCV = showCV;
        await about.save();
      } else {
        about = await About.create({
          content,
          profileImage,
          cvFile,
          showCV
        });
      }

      res.json(about.toObject());
    } catch (error) {
      console.error("Error updating about:", error);
      res.status(500).json({ message: "Error updating about data" });
    }
  }) as RequestHandler,

  deleteProfileImage: (async (_req: Request, res: Response) => {
    try {
      const about = await About.findOne();
      if (about) {
        about.profileImage = undefined;
        await about.save();
      }
      res.json(about?.toObject() || null);
    } catch (error) {
      console.error("Error deleting profile image:", error);
      res.status(500).json({ message: "Error deleting profile image" });
    }
  }) as RequestHandler,

  deleteCv: (async (_req: Request, res: Response) => {
    try {
      const about = await About.findOne();
      if (about) {
        about.cvFile = undefined;
        await about.save();
      }
      res.json(about?.toObject() || null);
    } catch (error) {
      console.error("Error deleting CV:", error);
      res.status(500).json({ message: "Error deleting CV" });
    }
  }) as RequestHandler
};
