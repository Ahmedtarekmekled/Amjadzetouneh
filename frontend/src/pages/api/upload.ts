import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Upload API called");

  // Set proper headers
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get absolute paths
  const rootDir = process.cwd();
  const uploadDir = path.join(rootDir, "public", "uploads");
  const publicDir = path.join(rootDir, "public");

  console.log("Directories:", {
    rootDir,
    uploadDir,
    publicDir,
  });

  // Create directories if they don't exist
  try {
    if (!fs.existsSync(publicDir)) {
      console.log("Creating public directory");
      await fs.promises.mkdir(publicDir, { recursive: true });
    }
    if (!fs.existsSync(uploadDir)) {
      console.log("Creating uploads directory");
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }
  } catch (error) {
    console.error("Directory creation error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create upload directory" });
  }

  try {
    // Configure formidable
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    });

    console.log("Parsing form data");
    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          reject(err);
        } else {
          resolve([fields, files]);
        }
      });
    });

    console.log("Files received:", files);
    console.log("Fields received:", fields);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = fields.type?.[0];
    if (!fileType) {
      return res.status(400).json({ message: "File type not specified" });
    }

    let url;
    if (fileType === "favicon") {
      const ext = path.extname(file.originalFilename || "");
      const faviconPath = path.join(publicDir, `favicon${ext}`);
      console.log("Favicon path:", faviconPath);

      // Remove old favicons
      try {
        const existingFiles = await fs.promises.readdir(publicDir);
        const faviconFiles = existingFiles.filter((f) =>
          f.startsWith("favicon.")
        );
        console.log("Existing favicon files:", faviconFiles);

        for (const f of faviconFiles) {
          const filePath = path.join(publicDir, f);
          console.log("Removing old favicon:", filePath);
          await fs.promises
            .unlink(filePath)
            .catch((err) => console.error("Error removing file:", f, err));
        }
      } catch (error) {
        console.error("Error removing old favicons:", error);
      }

      // Copy new favicon
      try {
        console.log(
          "Copying new favicon from:",
          file.filepath,
          "to:",
          faviconPath
        );
        await fs.promises.copyFile(file.filepath, faviconPath);
        await fs.promises.unlink(file.filepath);

        if (ext.toLowerCase() !== ".ico") {
          const icoPath = path.join(publicDir, "favicon.ico");
          console.log("Creating .ico version at:", icoPath);
          await sharp(faviconPath).resize(32, 32).toFile(icoPath);
        }

        url = `/favicon${ext}`;
      } catch (error) {
        console.error("Error processing favicon:", error);
        return res.status(500).json({ message: "Failed to process favicon" });
      }
    } else {
      const timestamp = Date.now();
      const ext = path.extname(file.originalFilename || "");
      const newFilename = `${fileType}-${timestamp}${ext}`;
      const newPath = path.join(uploadDir, newFilename);

      try {
        console.log("Copying upload from:", file.filepath, "to:", newPath);
        await fs.promises.copyFile(file.filepath, newPath);
        await fs.promises.unlink(file.filepath);
        url = `/uploads/${newFilename}`;
      } catch (error) {
        console.error("Error processing upload:", error);
        return res.status(500).json({ message: "Failed to process upload" });
      }
    }

    console.log("Success, returning URL:", url);
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Server error during upload",
    });
  }
}
