import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ImageGalleryProps {
  images: string[];
  onRemove: (index: number) => void;
}

export default function ImageGallery({ images, onRemove }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="relative group">
          <img
            src={image}
            alt={`Gallery image ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
