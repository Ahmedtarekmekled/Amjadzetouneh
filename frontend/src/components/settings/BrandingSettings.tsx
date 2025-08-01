import React, { useState, useEffect } from "react";
import { Settings } from "@/services/settingsService";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import axios from "axios";
import { API_URL } from "@/config/constants";

interface BrandingSettingsProps {
  settings: Settings | null;
  onSave: (settings: Partial<Settings>) => Promise<void>;
  isSaving?: boolean;
}

interface FilePreviewProps {
  url: string;
  onDelete: () => void;
  label: string;
}

const LOGO_CONSTRAINTS = {
  maxSize: 2 * 1024 * 1024, // 2MB
  formats: ["image/png", "image/jpeg", "image/svg+xml"],
  recommendedSize: "350x100px",
};

const FAVICON_CONSTRAINTS = {
  maxSize: 100 * 1024, // 100KB
  formats: ["image/x-icon", "image/vnd.microsoft.icon"],
  recommendedSize: "32x32px",
};

const FilePreview = ({ url, onDelete, label }: FilePreviewProps) => {
  if (!url) return null;

  return (
    <div className="relative group">
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
        <div className="relative w-full h-full">
          <Image
            src={url.startsWith("/") ? url : `/${url}`}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete image"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default function BrandingSettings({
  settings,
  onSave,
  isSaving = false,
}: BrandingSettingsProps) {
  const [formData, setFormData] = useState({
    logo: settings?.branding?.logo || "",
    favicon: settings?.branding?.favicon || "",
    hero: {
      backgroundImage: settings?.branding?.hero?.backgroundImage || "",
      en: {
        title: settings?.branding?.hero?.en?.title || "",
        subtitle: settings?.branding?.hero?.en?.subtitle || "",
        ctaText: settings?.branding?.hero?.en?.ctaText || "",
      },
      ar: {
        title: settings?.branding?.hero?.ar?.title || "",
        subtitle: settings?.branding?.hero?.ar?.subtitle || "",
        ctaText: settings?.branding?.hero?.ar?.ctaText || "",
      },
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const defaultImages = {
    logo: "/images/default-logo.png",
    favicon: "/images/default-favicon.png",
    heroBackground: "/images/default-hero.jpg",
  };

  const validateFile = (file: File, type: "logo" | "favicon") => {
    const constraints =
      type === "logo" ? LOGO_CONSTRAINTS : FAVICON_CONSTRAINTS;

    if (file.size > constraints.maxSize) {
      setErrors((prev) => ({
        ...prev,
        [type]: `File size must be less than ${
          constraints.maxSize / 1024 / 1024
        }MB`,
      }));
      return false;
    }

    if (!constraints.formats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [type]: `File must be one of: ${constraints.formats.join(", ")}`,
      }));
      return false;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
    return true;
  };

  const handleFileUpload = async (
    file: File,
    type: "logo" | "favicon" | "heroBackground"
  ) => {
    if (type !== "heroBackground" && !validateFile(file, type)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const filePath = response.data.path;

      setFormData((prev) => {
        if (type === "heroBackground") {
          return {
            ...prev,
            hero: {
              ...prev.hero,
              backgroundImage: filePath,
            },
          };
        }
        return {
          ...prev,
          [type]: filePath,
        };
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrors((prev) => ({
        ...prev,
        [type]: "Failed to upload file",
      }));
    }
  };

  const handleFileDelete = async (
    type: "logo" | "favicon" | "heroBackground"
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/settings/upload/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData((prev) => ({
        ...prev,
        [type === "heroBackground" ? "hero" : type]:
          type === "heroBackground"
            ? { ...prev.hero, backgroundImage: "" }
            : "",
      }));
    } catch (error) {
      console.error("Error deleting file:", error);
      setErrors((prev) => ({
        ...prev,
        [type]: "Failed to delete file",
      }));
    }
  };

  const handleTextChange = (
    lang: "en" | "ar",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [lang]: {
          ...prev.hero[lang],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      onSave({ branding: formData });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Logo Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {formData.logo && (
              <div className="w-48 h-16">
                <FilePreview
                  url={formData.logo}
                  onDelete={() => handleFileDelete("logo")}
                  label="Logo"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo {LOGO_CONSTRAINTS.recommendedSize}
              </label>
              <input
                type="file"
                accept={LOGO_CONSTRAINTS.formats.join(",")}
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "logo")
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {errors.logo && (
                <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Favicon Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Favicon</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {formData.favicon && (
              <div className="w-8 h-8">
                <FilePreview
                  url={formData.favicon}
                  onDelete={() => handleFileDelete("favicon")}
                  label="Favicon"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Favicon {FAVICON_CONSTRAINTS.recommendedSize}
              </label>
              <input
                type="file"
                accept=".ico"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "favicon")
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {errors.favicon && (
                <p className="mt-1 text-sm text-red-600">{errors.favicon}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>

        {/* Background Image */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Background Image
          </h4>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {formData.hero.backgroundImage && (
              <div className="w-full sm:w-48 h-32">
                <FilePreview
                  url={formData.hero.backgroundImage}
                  onDelete={() => handleFileDelete("heroBackground")}
                  label="Hero Background"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "heroBackground")
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English Content */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              English Content
            </h4>
            <div>
              <label
                htmlFor="en-title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="en-title"
                value={formData.hero.en.title}
                onChange={(e) =>
                  handleTextChange("en", "title", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="en-subtitle"
                className="block text-sm font-medium text-gray-700"
              >
                Subtitle
              </label>
              <input
                type="text"
                id="en-subtitle"
                value={formData.hero.en.subtitle}
                onChange={(e) =>
                  handleTextChange("en", "subtitle", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="en-cta"
                className="block text-sm font-medium text-gray-700"
              >
                CTA Text
              </label>
              <input
                type="text"
                id="en-cta"
                value={formData.hero.en.ctaText}
                onChange={(e) =>
                  handleTextChange("en", "ctaText", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Arabic Content */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              Arabic Content
            </h4>
            <div>
              <label
                htmlFor="ar-title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="ar-title"
                value={formData.hero.ar.title}
                onChange={(e) =>
                  handleTextChange("ar", "title", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="ar-subtitle"
                className="block text-sm font-medium text-gray-700"
              >
                Subtitle
              </label>
              <input
                type="text"
                id="ar-subtitle"
                value={formData.hero.ar.subtitle}
                onChange={(e) =>
                  handleTextChange("ar", "subtitle", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="ar-cta"
                className="block text-sm font-medium text-gray-700"
              >
                CTA Text
              </label>
              <input
                type="text"
                id="ar-cta"
                value={formData.hero.ar.ctaText}
                onChange={(e) =>
                  handleTextChange("ar", "ctaText", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || Object.keys(errors).length > 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Branding Settings"}
        </button>
      </div>
    </div>
  );
}
