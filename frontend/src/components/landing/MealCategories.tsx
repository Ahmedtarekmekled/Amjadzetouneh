import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import CategoryLink, { getCategoryName } from "@/components/ui/CategoryLink";

export default function MealCategories() {
  const { language } = useLanguage();

  const categories = [
    {
      id: "breakfast",
      emoji: "☕",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
    },
    {
      id: "main-dishes",
      emoji: "🍽️",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
    {
      id: "appetizers",
      emoji: "🥗",
      color: "from-green-400 to-teal-500",
      bgColor: "from-green-50 to-teal-50",
      borderColor: "border-green-200",
    },
    {
      id: "desserts",
      emoji: "🍰",
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
    },
    {
      id: "beverages",
      emoji: "🥤",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    {
      id: "snacks",
      emoji: "🍪",
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full text-sm font-semibold mb-6">
            🍽️ {language === "ar" ? "فئات الطعام" : "Food Categories"}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "تصفح حسب الفئة" : "Browse by Category"}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ar"
              ? "اكتشف وصفات متنوعة لكل وقت من اليوم"
              : "Discover diverse recipes for any time of day"}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryLink
                category={category.id}
                className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${category.bgColor} border ${category.borderColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center text-center`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full translate-y-8 -translate-x-8"></div>
                </div>

                {/* Emoji Icon */}
                <div
                  className={`relative z-10 w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="text-2xl">{category.emoji}</span>
                </div>

                {/* Title */}
                <h3 className="relative z-10 font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {getCategoryName(category.id, language)}
                </h3>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </CategoryLink>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <CategoryLink
            category="all"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {language === "ar" ? "عرض جميع الوصفات" : "View All Recipes"}
            <svg
              className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </CategoryLink>
        </motion.div>
      </div>
    </section>
  );
}
