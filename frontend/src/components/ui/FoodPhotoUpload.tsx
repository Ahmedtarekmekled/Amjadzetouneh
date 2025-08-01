import { ChangeEvent, useRef, useState } from "react";
import { PhotoIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/services/cloudinaryService";

interface FoodPhotoUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  onError: (error: string) => void;
  maxImages?: number;
  className?: string;
}

export default function FoodPhotoUpload({
  images = [],
  onChange,
  onError,
  maxImages = 10,
  className = "",
}: FoodPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      onError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload image files only");
        }

        if (file.size > 10 * 1024 * 1024) {
          // Increased to 10MB
          throw new Error("Image size should be less than 10MB");
        }

        // Upload with quality settings
        return await uploadToCloudinary(file, {
          quality: "auto:good",
          fetch_format: "auto",
          width: 1200,
          height: 1200,
          crop: "limit",
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to upload images"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    if (!imageUrl) return;

    setDeletingIndex(index);
    try {
      // Extract public ID from Cloudinary URL
      const publicId = extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }

      // Remove from local state
      onChange(images.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      onError("Failed to delete image from cloud storage");
    } finally {
      setDeletingIndex(null);
    }
  };

  const extractPublicIdFromUrl = (url: string): string | null => {
    try {
      // Extract public ID from Cloudinary URL
      // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image_name.jpg
      const match = url.match(/\/upload\/[^\/]+\/(.+)$/);
      if (match) {
        // Remove file extension
        return match[1].replace(/\.[^/.]+$/, "");
      }
      return null;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Food Photos
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Button */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            <PhotoIcon className="-ml-1 mr-2 h-5 w-5" />
            {isUploading ? "Uploading..." : "Add Food Photos"}
          </button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload up to {maxImages - images.length} more images (Max 10MB each)
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Images will be automatically optimized for web
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={image}
                alt={`Food photo ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={deletingIndex === index}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                    title="Remove image"
                  >
                    {deletingIndex === index ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <XMarkIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Image number badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Upload progress indicator */}
              {deletingIndex === index && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-white text-sm">Deleting...</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drag and drop hint */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-2 text-sm">
            Upload photos of your delicious food to showcase your recipe
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            High-quality images will be automatically optimized
          </p>
        </div>
      )}
    </div>
  );
}
