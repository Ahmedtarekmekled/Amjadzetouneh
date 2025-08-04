interface UploadOptions {
  quality?: string;
  fetch_format?: string;
  width?: number;
  height?: number;
  crop?: string;
  folder?: string;
}

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  // Add upload options (only folder is allowed for unsigned uploads)
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  // Add additional optimization parameters
  formData.append("transformation", "f_auto,q_auto:good,w_1200,h_1200,c_limit");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Failed to upload file");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("public_id", publicId);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary delete error:", data);
      throw new Error(data.error?.message || "Failed to delete file");
    }

    console.log("Successfully deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}
