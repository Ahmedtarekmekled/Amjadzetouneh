import { ChangeEvent, useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "@/services/cloudinaryService";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export default function ImageUpload({
  onUpload,
  onError,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUpload(url);
    } catch (error) {
      onError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PhotoIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
        {isUploading ? "Uploading..." : "Upload Cover Image"}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
