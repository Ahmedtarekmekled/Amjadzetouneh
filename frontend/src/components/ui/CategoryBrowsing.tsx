import { useLanguage } from "@/contexts/LanguageContext";
import CategoryLink, { getCategoryName } from "./CategoryLink";

interface CategoryBrowsingProps {
  className?: string;
  showTitle?: boolean;
  variant?: "grid" | "list" | "pills";
}

export default function CategoryBrowsing({
  className = "",
  showTitle = true,
  variant = "grid",
}: CategoryBrowsingProps) {
  const { language } = useLanguage();

  const categories = [
    "breakfast",
    "main-dishes",
    "appetizers",
    "desserts",
    "beverages",
    "snacks",
  ];

  const translations = {
    en: {
      title: "Browse by Category",
      subtitle: "Explore our recipes by category",
    },
    ar: {
      title: "تصفح حسب الفئة",
      subtitle: "استكشف وصفاتنا حسب الفئة",
    },
  };

  const t = translations[language as "en" | "ar"];

  const renderCategories = () => {
    switch (variant) {
      case "pills":
        return (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <CategoryLink
                key={category}
                category={category}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full text-sm font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {getCategoryName(category, language)}
              </CategoryLink>
            ))}
          </div>
        );

      case "list":
        return (
          <div className="space-y-2">
            {categories.map((category) => (
              <CategoryLink
                key={category}
                category={category}
                className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-900 dark:text-white font-medium">
                  {getCategoryName(category, language)}
                </span>
              </CategoryLink>
            ))}
          </div>
        );

      case "grid":
      default:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryLink
                key={category}
                category={category}
                className="p-6 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-xl hover:bg-gradient-to-br hover:from-yellow-400/20 hover:to-yellow-600/20 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-black font-bold text-lg">
                      {getCategoryName(category, language).charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {getCategoryName(category, language)}
                  </h3>
                </div>
              </CategoryLink>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
        </div>
      )}
      {renderCategories()}
    </div>
  );
}
