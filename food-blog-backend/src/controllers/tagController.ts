import { Request, Response } from "express";
import Tag from "../models/Tag";

export const tagController = {
  getAllTags: async (req: Request, res: Response) => {
    try {
      const tags = await Tag.find().lean();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tags" });
    }
  },

  createTag: async (req: Request, res: Response) => {
    try {
      const { name, color } = req.body;
      const tag = new Tag({ name, color });
      await tag.save();
      res.status(201).json(tag.toObject());
    } catch (error) {
      res.status(400).json({ message: "Error creating tag" });
    }
  },

  updateTag: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, color } = req.body;
      const tag = await Tag.findByIdAndUpdate(
        id,
        { name, color },
        { new: true }
      ).lean();
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.json(tag);
    } catch (error) {
      res.status(400).json({ message: "Error updating tag" });
    }
  },

  deleteTag: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tag = await Tag.findByIdAndDelete(id);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.json({ message: "Tag deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting tag" });
    }
  },
};
