import { Request, Response } from "express";
import Social from "../models/Social";

export const socialController = {
  getAllSocials: async (req: Request, res: Response) => {
    try {
      const socials = await Social.find({ isActive: true });
      res.json(socials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching socials" });
    }
  },

  createSocial: async (req: Request, res: Response) => {
    try {
      const { platform, url, icon } = req.body;
      const social = new Social({
        platform,
        url,
        icon
      });
      await social.save();
      res.status(201).json(social);
    } catch (error) {
      res.status(400).json({ message: "Error creating social" });
    }
  },

  updateSocial: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { platform, url, icon, isActive } = req.body;
      const social = await Social.findByIdAndUpdate(
        id,
        { platform, url, icon, isActive },
        { new: true }
      );
      if (!social) {
        return res.status(404).json({ message: "Social not found" });
      }
      res.json(social);
    } catch (error) {
      res.status(400).json({ message: "Error updating social" });
    }
  },

  deleteSocial: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const social = await Social.findByIdAndDelete(id);
      if (!social) {
        return res.status(404).json({ message: "Social not found" });
      }
      res.json({ message: "Social deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting social" });
    }
  }
}; 