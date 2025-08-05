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
        title: settings?.branding?.hero?.en?.title || "Culinary Adventures Await",
        subtitle: settings?.branding?.hero?.en?.subtitle || "Discover mouthwatering recipes, cooking tips, and culinary stories that will inspire your next kitchen masterpiece",
        ctaText: settings?.branding?.hero?.en?.ctaText || "Explore Recipes",
      },
      ar: {
        title: settings?.branding?.hero?.ar?.title || "مغامرات الطهي تنتظرك",
        subtitle: settings?.branding?.hero?.ar?.subtitle || "اكتشف وصفات شهية ونصائح طهي وقصص طهي ستلهمك لتحضير تحفة طهي جديدة",
        ctaText: settings?.branding?.hero?.ar?.ctaText || "استكشف الوصفات",
      },
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Update form data when settings change
  useEffect(() => {
    if (settings) {
      setFormData({
        logo: settings?.branding?.logo || "",
        favicon: settings?.branding?.favicon || "",
        hero: {
          backgroundImage: settings?.branding?.hero?.backgroundImage || "",
          en: {
            title: settings?.branding?.hero?.en?.title || "Culinary Adventures Await",
            subtitle: settings?.branding?.hero?.en?.subtitle || "Discover mouthwatering recipes, cooking tips, and culinary stories that will inspire your next kitchen masterpiece",
            ctaText: settings?.branding?.hero?.en?.ctaText || "Explore Recipes",
          },
          ar: {
            title: settings?.branding?.hero?.ar?.title || "مغامرات الطهي تنتظرك",
            subtitle: settings?.branding?.hero?.ar?.subtitle || "اكتشف وصفات شهية ونصائح طهي وقصص طهي ستلهمك لتحضير تحفة طهي جديدة",
            ctaText: settings?.branding?.hero?.ar?.ctaText || "استكشف الوصفات",
          },
        },
      });
    }
  }, [settings]);

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
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
      setErrors((prev) => ({ ...prev, [type]: "" }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [type]: progress }));
          }
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

      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));
      
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[type];
          return newProgress;
        });
      }, 2000);

    } catch (error: any) {
      console.error("Error uploading file:", error);
      setErrors((prev) => ({
        ...prev,
        [type]: error.response?.data?.message || "Failed to upload file. Please try again.",
      }));
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[type];
        return newProgress;
      });
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
              {uploadProgress.logo !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.logo}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading... {uploadProgress.logo}%
                  </p>
                </div>
              )}
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
              {uploadProgress.favicon !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.favicon}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading... {uploadProgress.favicon}%
                  </p>
                </div>
              )}
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
              {uploadProgress.heroBackground !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.heroBackground}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading... {uploadProgress.heroBackground}%
                  </p>
                </div>
              )}
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

      {/* Preview Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            {formData.logo && (
              <div className="mb-4">
                <img
                  src={formData.logo}
                  alt="Logo Preview"
                  className="h-12 mx-auto"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {formData.hero.en.title}
            </h2>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              {formData.hero.en.subtitle}
            </p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              {formData.hero.en.ctaText}
            </button>
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
