import { BlogPostFormData } from "@/types/blog";

interface RecipePreviewProps {
  data: BlogPostFormData;
  language: "en" | "ar";
}

export default function RecipePreview({ data, language }: RecipePreviewProps) {
  const content = data.content[language];

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>

        {data.images.length > 0 && (
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <img
              src={data.images[0]}
              alt={content.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div
          className="recipe-content"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
    </div>
  );
}
