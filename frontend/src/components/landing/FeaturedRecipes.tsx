import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ClockIcon,
  FireIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { BlogPost } from "@/types/blog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { findCategoryById } from "@/config/categories";

interface FeaturedRecipesProps {
  recipes: BlogPost[];
}

export default function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  const { language } = useLanguage();
  const [currentImages, setCurrentImages] = useState<{ [key: string]: number }>(
    {}
  );

  const translations = {
    en: {
      title: "Featured Recipes",
      subtitle: "Discover our most loved and seasonal recipes",
      viewAll: "View All Recipes",
      readMore: "Read More",
      minutes: "min",
      views: "views",
      published: "Published",
      draft: "Draft",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    },
    ar: {
      title: "وصفات مميزة",
      subtitle: "اكتشف أشهى الوصفات الموسمية والمفضلة لدينا",
      viewAll: "عرض جميع الوصفات",
      readMore: "اقرأ المزيد",
      minutes: "دقيقة",
      views: "مشاهدات",
      published: "منشور",
      draft: "مسودة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
    },
  };

  const t = translations[language as "en" | "ar"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "⭐";
      case "medium":
        return "⭐⭐";
      case "hard":
        return "⭐⭐⭐";
      default:
        return "⭐";
    }
  };

  const nextImage = (recipeId: string, totalImages: number) => {
    setCurrentImages((prev) => ({
      ...prev,
      [recipeId]: ((prev[recipeId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (recipeId: string, totalImages: number) => {
    setCurrentImages((prev) => ({
      ...prev,
      [recipeId]: ((prev[recipeId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const getRecipeImages = (recipe: BlogPost) => {
    const images = [];
    if (recipe.coverImage) images.push(recipe.coverImage);
    if (recipe.images && recipe.images.length > 0) {
      images.push(...recipe.images);
    }
    return images.length > 0 ? images : ["/images/default-hero.jpg"];
  };

  // Limit to maximum 3 recipes
  const displayRecipes = recipes.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t.title}
          </motion.h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayRecipes.map((recipe, index) => {
            const recipeImages = getRecipeImages(recipe);
            const currentImageIndex = currentImages[recipe._id] || 0;
            const hasMultipleImages = recipeImages.length > 1;

            return (
              <motion.article
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden
                         hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
                         border border-gray-200 dark:border-gray-700"
              >
                {/* Enhanced Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={recipeImages[currentImageIndex]}
                    alt={recipe.title?.[language] || "Blog post image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Carousel Navigation */}
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          prevImage(recipe._id, recipeImages.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800 z-10"
                      >
                        <ChevronLeftIcon className="h-4 w-4 text-gray-800 dark:text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          nextImage(recipe._id, recipeImages.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800 z-10"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-gray-800 dark:text-white" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {recipeImages.map((_, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              imgIndex === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Categories Overlay */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {recipe.categories?.slice(0, 2).map((categoryId) => {
                        const category = findCategoryById(categoryId, language);
                        return category ? (
                          <span
                            key={categoryId}
                            className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white 
                                     text-xs font-medium rounded-full backdrop-blur-sm"
                            dir={language === "ar" ? "rtl" : "ltr"}
                          >
                            <span
                              className={language === "ar" ? "ml-1" : "mr-1"}
                            >
                              {category.icon}
                            </span>
                            {category.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  {recipe.difficulty && (
                    <div
                      className={`absolute top-4 ${
                        language === "ar" ? "left-4" : "right-4"
                      }`}
                    >
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${getDifficultyColor(
                          recipe.difficulty
                        )}`}
                      >
                        {getDifficultyIcon(recipe.difficulty)}
                      </span>
                    </div>
                  )}

                  {/* Date Overlay */}
                  <div
                    className={`absolute bottom-4 ${
                      language === "ar" ? "left-4" : "right-4"
                    }`}
                  >
                    <div
                      className="flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-800/90 
                                   text-gray-800 dark:text-white text-xs font-medium rounded-full backdrop-blur-sm"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(recipe.publishDate).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Content Section */}
                <div className="p-6">
                  <h2
                    className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2
                               group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    {recipe.title?.[language] || "Untitled Post"}
                  </h2>

                  <p
                    className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    {recipe.excerpt?.[language] ||
                      recipe.content?.[language]?.metaDescription ||
                      ""}
                  </p>

                  {/* Recipe Details */}
                  {(recipe.prepTime || recipe.cookTime) && (
                    <div
                      className={`flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {recipe.prepTime > 0 && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {recipe.prepTime} {t.minutes}
                          </span>
                        </div>
                      )}
                      {recipe.cookTime > 0 && (
                        <div className="flex items-center gap-1">
                          <FireIcon className="h-4 w-4" />
                          <span>
                            {recipe.cookTime} {t.minutes}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {recipe.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{recipe.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div
                    className={`flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400 ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {recipe.views && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {recipe.views} {t.views}
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      {recipe.status === "published" ? t.published : t.draft}
                    </span>
                  </div>

                  {/* Enhanced Read More Button - Gold Color */}
                  <Link
                    href={`/blog/${recipe.slug}`}
                    className="inline-flex items-center justify-center w-full py-3 px-4 
                             bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-lg
                             hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300
                             transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95
                             group-hover:shadow-xl"
                  >
                    {t.readMore}
                    <svg
                      className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${
                        language === "ar" ? "mr-2 rotate-180" : "ml-2"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-colors"
          >
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
