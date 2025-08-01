import { useState } from "react";
import { BlogPostFormData } from "@/types/blog";
import ImageUpload from "@/components/ui/ImageUpload";
import FoodPhotoUpload from "@/components/ui/FoodPhotoUpload";
import TagInput from "@/components/ui/TagInput";
import CategorySelect from "@/components/ui/CategorySelect";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ClockIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface BlogPostFormProps {
  initialData?: BlogPostFormData;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function BlogPostForm({
  initialData,
  onSubmit,
  isSubmitting,
}: BlogPostFormProps) {
  const { language } = useLanguage();

  // Ensure we have proper default structure
  const defaultFormData = {
    title: {
      en: "",
      ar: "",
    },
    excerpt: {
      en: "",
      ar: "",
    },
    content: {
      en: {
        title: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
      ar: {
        title: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    },
    slug: "",
    coverImage: "",
    categories: [],
    category: "",
    tags: [],
    publishDate: new Date().toISOString().split("T")[0],
    images: [],
    status: "draft" as const,
    cookTime: 0,
    prepTime: 0,
    difficulty: "medium" as const,
    servings: 0,
    calories: 0,
    mealTimes: [],
  };

  const [formData, setFormData] = useState<BlogPostFormData>(() => {
    if (initialData) {
      return {
        ...defaultFormData,
        ...initialData,
        title: {
          ...defaultFormData.title,
          ...initialData.title,
        },
        excerpt: {
          ...defaultFormData.excerpt,
          ...initialData.excerpt,
        },
        content: {
          ...defaultFormData.content,
          ...initialData.content,
        },
      };
    }
    return defaultFormData;
  });

  const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string>(
    formData.coverImage || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title?.en?.trim() && !formData.title?.ar?.trim()) {
      setError("Please provide a title in at least one language");
      return;
    }

    if (
      !formData.content?.en?.content?.trim() &&
      !formData.content?.ar?.content?.trim()
    ) {
      setError("Please provide content in at least one language");
      return;
    }

    await onSubmit({
      ...formData,
      coverImage: coverImage,
    });
  };

  const handleChange = (
    lang: "en" | "ar",
    field: "title" | "excerpt" | "content",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleContentChange = (
    lang: "en" | "ar",
    field: "title" | "content" | "metaTitle" | "metaDescription",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [field]: value,
        },
      },
    }));
  };

  const handleCoverImageUpload = (url: string) => {
    setCoverImage(url);
  };

  const handleFoodImagesChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: images,
    }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags: tags,
    }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFormData((prev) => ({
      ...prev,
      categories: categories,
    }));
  };

  const handleImageError = (error: string) => {
    setError(error);
    setTimeout(() => setError(null), 5000);
  };

  const generateSlug = () => {
    const title = formData.title?.[activeLanguage] || formData.title?.en || "";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setFormData((prev) => ({
      ...prev,
      slug: slug,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 rounded-md">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Language Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => setActiveLanguage("en")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeLanguage === "en"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLanguage("ar")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeLanguage === "ar"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-medium text-gray-900">
                Title ({activeLanguage === "en" ? "English" : "Arabic"})
              </label>
              <button
                type="button"
                onClick={generateSlug}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Generate Slug
              </button>
            </div>
            <input
              type="text"
              value={formData.title?.[activeLanguage] || ""}
              onChange={(e) =>
                handleChange(activeLanguage, "title", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder={`Enter title in ${
                activeLanguage === "en" ? "English" : "Arabic"
              }`}
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Excerpt ({activeLanguage === "en" ? "English" : "Arabic"})
            </label>
            <textarea
              value={formData.excerpt?.[activeLanguage] || ""}
              onChange={(e) =>
                handleChange(activeLanguage, "excerpt", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Enter excerpt in ${
                activeLanguage === "en" ? "English" : "Arabic"
              }`}
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Content ({activeLanguage === "en" ? "English" : "Arabic"})
            </label>
            <textarea
              value={formData.content?.[activeLanguage]?.content || ""}
              onChange={(e) =>
                handleContentChange(activeLanguage, "content", e.target.value)
              }
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Enter content in ${
                activeLanguage === "en" ? "English" : "Arabic"
              }`}
            />
          </div>

          {/* Food Photos Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <FoodPhotoUpload
              images={formData.images || []}
              onChange={handleFoodImagesChange}
              onError={handleImageError}
              maxImages={10}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Cover Image</h3>
            </div>
            <ImageUpload
              onUpload={handleCoverImageUpload}
              onError={handleImageError}
              className="w-full"
            />
            {coverImage && (
              <div className="mt-4 relative">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <CategorySelect
              selectedCategories={formData.categories || []}
              onChange={handleCategoriesChange}
              multiple={true}
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <TagInput
              tags={formData.tags || []}
              onChange={handleTagsChange}
              placeholder="Add tags for your recipe..."
              maxTags={15}
            />
          </div>

          {/* Recipe Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recipe Details
            </h3>

            <div className="space-y-4">
              {/* Prep Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.prepTime || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prepTime: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>

              {/* Cook Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.cookTime || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cookTime: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      value: "easy",
                      label: "Easy",
                      color: "bg-green-100 text-green-800 border-green-300",
                    },
                    {
                      value: "medium",
                      label: "Medium",
                      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    },
                    {
                      value: "hard",
                      label: "Hard",
                      color: "bg-red-100 text-red-800 border-red-300",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: option.value as
                            | "easy"
                            | "medium"
                            | "hard",
                        }))
                      }
                      className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                        formData.difficulty === option.value
                          ? `${option.color} border-current`
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Servings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  value={formData.servings || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      servings: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  placeholder="Number of servings"
                />
              </div>

              {/* Calories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories per serving
                </label>
                <input
                  type="number"
                  value={formData.calories || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      calories: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  placeholder="Calories per serving"
                />
              </div>
            </div>
          </div>

          {/* Publishing */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Publishing
            </h3>

            <div className="space-y-4">
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="recipe-url-slug"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || "draft"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as "draft" | "published",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={formData.publishDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publishDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Save Post
            </>
          )}
        </button>
      </div>
    </form>
  );
}
