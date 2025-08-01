import { useState } from "react";

export default function ProfilePhotoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profilePhoto", selectedFile);

    try {
      const response = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadedUrl(data.url);
      alert("Profile photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Error uploading profile photo");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        {preview ? (
          <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-primary text-white py-2 px-4 rounded-md shadow hover:bg-primary-dark transition"
      >
        Upload Photo
      </button>
      {uploadedUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded Profile" className="w-32 h-32 rounded-full object-cover" />
        </div>
      )}
    </div>
  );
} 