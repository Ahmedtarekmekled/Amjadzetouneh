import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({
    uploadDir: "./public/uploads", // Temporary directory
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    const fileArray = files.profilePhoto;
    if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = fileArray[0];

    try {
      // Upload to Cloudinary with enhanced quality settings
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "profile_photos",
        quality: "auto:best", // Use best for highest quality
        format: "jpg", // Convert to jpg for consistent quality
        transformation: [
          { width: 1500, height: 1500, crop: "limit" }, // Increase dimensions for better quality
          { fetch_format: "auto" }, // Automatically adjust format for best quality
        ],
      });

      // Clean up the temporary file
      fs.unlinkSync(file.filepath);

      res.status(200).json({ message: "File uploaded successfully", url: result.secure_url });
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      res.status(500).json({ error: "Error uploading to Cloudinary" });
    }
  });
} 