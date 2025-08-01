import React, { useState, useEffect } from "react";
import { Settings } from "@/services/settingsService";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import FileUpload from "../ui/FileUpload";

interface SeoSettingsProps {
  settings: Settings | null;
  onSave: (settings: Partial<Settings>) => Promise<void>;
  isSaving?: boolean;
}

export default function SeoSettings({
  settings,
  onSave,
  isSaving = false,
}: SeoSettingsProps) {
  const defaultSeo = {
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    ogImage: "",
    en: {
      metaTitle: "",
      metaDescription: "",
    },
    ar: {
      metaTitle: "",
      metaDescription: "",
    },
    analytics: {
      googleAnalyticsId: "",
      facebookPixelId: "",
    },
  };

  // Initialize state with defaultSeo
  const [seoData, setSeoData] = useState(defaultSeo);

  // Update seoData when settings prop changes
  useEffect(() => {
    if (settings?.seo) {
      // Ensure all required properties exist by merging with defaultSeo
      setSeoData({
        ...defaultSeo,
        ...settings.seo,
        en: {
          ...defaultSeo.en,
          ...settings.seo.en,
        },
        ar: {
          ...defaultSeo.ar,
          ...settings.seo.ar,
        },
        analytics: {
          ...defaultSeo.analytics,
          ...settings.seo.analytics,
        },
      });
    }
  }, [settings]);

  const handleSeoChange = (lang: "en" | "ar", field: string, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleAnalyticsChange = (field: string, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        [field]: value,
      },
    }));
  };

  const handleOgImageUpload = (url: string) => {
    setSeoData((prev) => ({
      ...prev,
      ogImage: url,
    }));
  };

  const handleSave = () => {
    onSave({ seo: seoData });
  };

  return (
    <div className="space-y-8">
      {/* English SEO */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">English SEO</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="en-meta-title"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="en-meta-title"
              value={seoData.en.metaTitle}
              onChange={(e) =>
                handleSeoChange("en", "metaTitle", e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="en-meta-description"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Description
            </label>
            <textarea
              id="en-meta-description"
              value={seoData.en.metaDescription}
              onChange={(e) =>
                handleSeoChange("en", "metaDescription", e.target.value)
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Arabic SEO */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Arabic SEO</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="ar-meta-title"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="ar-meta-title"
              value={seoData.ar.metaTitle}
              onChange={(e) =>
                handleSeoChange("ar", "metaTitle", e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ar-meta-description"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Description
            </label>
            <textarea
              id="ar-meta-description"
              value={seoData.ar.metaDescription}
              onChange={(e) =>
                handleSeoChange("ar", "metaDescription", e.target.value)
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="google-analytics"
              className="block text-sm font-medium text-gray-700"
            >
              Google Analytics ID
            </label>
            <input
              type="text"
              id="google-analytics"
              value={seoData.analytics.googleAnalyticsId}
              onChange={(e) =>
                handleAnalyticsChange("googleAnalyticsId", e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="facebook-pixel"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook Pixel ID
            </label>
            <input
              type="text"
              id="facebook-pixel"
              value={seoData.analytics.facebookPixelId}
              onChange={(e) =>
                handleAnalyticsChange("facebookPixelId", e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* OG Image */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Open Graph Image
        </h3>
        <FileUpload
          onUpload={handleOgImageUpload}
          onError={(error) => console.error("Upload error:", error)}
          type="image"
          value={seoData.ogImage}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save SEO Settings"}
        </button>
      </div>
    </div>
  );
}
