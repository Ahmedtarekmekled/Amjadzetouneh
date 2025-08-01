import { useState } from "react";
import { Social } from "@/services/socialService";

interface SocialMediaFormProps {
  onSubmit: (data: Omit<Social, "_id">) => Promise<void>;
  initialData?: Social;
}

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook", icon: "facebook" },
  { value: "twitter", label: "Twitter", icon: "twitter" },
  { value: "instagram", label: "Instagram", icon: "instagram" },
  { value: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { value: "github", label: "GitHub", icon: "github" },
  { value: "youtube", label: "YouTube", icon: "youtube" },
];

export default function SocialMediaForm({
  onSubmit,
  initialData,
}: SocialMediaFormProps) {
  const [formData, setFormData] = useState({
    platform: initialData?.platform || "",
    url: initialData?.url || "",
    icon: initialData?.icon || "",
    isActive: initialData?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.platform || !formData.url) {
      return; // Add error handling here
    }

    // Set icon based on platform
    const icon = formData.platform; // Or use a mapping if icons have different names

    try {
      await onSubmit({
        ...formData,
        icon,
      });

      if (!initialData) {
        // Reset form after successful creation
        setFormData({
          platform: "",
          url: "",
          icon: "",
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => {
              const platform = e.target.value;
              const option = PLATFORM_OPTIONS.find(
                (opt) => opt.value === platform
              );
              setFormData((prev) => ({
                ...prev,
                platform,
                icon: option?.icon || "",
              }));
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select platform</option>
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://"
            required
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Active</label>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Link"
            : "Add Link"}
        </button>
      </div>
    </form>
  );
}
