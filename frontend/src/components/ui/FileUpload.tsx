import React, { useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "@/config/constants";

interface FileUploadProps {
  id?: string;
  onUpload: (url: string) => void;
  onError: (message: string) => void;
  accept?: string;
  type?: "image" | "cv";
  value?: string;
  children?: React.ReactNode;
}

const getAcceptTypes = (type: "image" | "cv") => {
  return type === "image"
    ? "image/*"
    : ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
};

export default function FileUpload({
  id,
  onUpload,
  onError,
  type = "image",
  children,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview for images
    if (type === "image" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type === "cv") {
      setFileName(file.name);
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/upload/${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onUpload(response.data.url);
    } catch (error: any) {
      console.error("Upload error:", error);
      onError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to upload file"
      );
      setPreview(null);
      setFileName(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={getAcceptTypes(type)}
        disabled={isUploading}
        style={{ display: "none" }}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer ${isUploading ? "opacity-50" : ""}`}
      >
        {children}
      </div>

      {/* Preview for images */}
      {type === "image" && preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Show filename for CV */}
      {type === "cv" && fileName && (
        <div className="mt-2 text-sm text-gray-600">Uploaded: {fileName}</div>
      )}
    </div>
  );
}
