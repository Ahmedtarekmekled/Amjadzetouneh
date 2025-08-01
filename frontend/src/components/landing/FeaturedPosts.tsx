import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost } from "@/types/blog";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Featured Recipes",
      subtitle: "Handpicked culinary delights for your kitchen",
      readMore: "Read Recipe",
      noPosts: "No featured posts available",
    },
    ar: {
      title: "وصفات مميزة",
      subtitle: "وصفات طهي مختارة بعناية لمطبخك",
      readMore: "اقرأ الوصفة",
      noPosts: "لا توجد مشاركات مميزة متاحة",
    },
  };

  const t = translations[language as "en" | "ar"];

  // Sample data for when no posts are available
  const samplePosts: BlogPost[] = [
    {
      _id: "1",
      content: {
        en: {
          title: "Classic Italian Pasta",
          content: "A delicious traditional Italian pasta recipe",
          metaTitle: "Classic Italian Pasta Recipe",
          metaDescription: "Learn how to make authentic Italian pasta at home",
          keywords: ["pasta", "italian", "recipe"],
        },
        ar: {
          title: "باستا إيطالية كلاسيكية",
          content: "وصفة باستا إيطالية تقليدية لذيذة",
          metaTitle: "وصفة باستا إيطالية كلاسيكية",
          metaDescription: "تعلم كيفية صنع باستا إيطالية أصيلة في المنزل",
          keywords: ["باستا", "إيطالية", "وصفة"],
        },
      },
      slug: "classic-italian-pasta",
      images: ["/images/default-hero.jpg"],
      author: "Chef Sarah",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["Italian", "Pasta", "Main Course"],
      publishDate: new Date().toISOString(),
      status: "published",
      cookTime: 30,
      prepTime: 15,
      difficulty: "easy",
      mealTimes: ["lunch", "dinner"],
    },
    {
      _id: "2",
      content: {
        en: {
          title: "Mediterranean Salad",
          content: "Fresh and healthy Mediterranean salad",
          metaTitle: "Mediterranean Salad Recipe",
          metaDescription:
            "A refreshing Mediterranean salad with fresh vegetables",
          keywords: ["salad", "mediterranean", "healthy"],
        },
        ar: {
          title: "سلطة البحر المتوسط",
          content: "سلطة البحر المتوسط الطازجة والصحية",
          metaTitle: "وصفة سلطة البحر المتوسط",
          metaDescription: "سلطة البحر المتوسط المنعشة مع الخضروات الطازجة",
          keywords: ["سلطة", "بحر المتوسط", "صحي"],
        },
      },
      slug: "mediterranean-salad",
      images: ["/images/default-hero.jpg"],
      author: "Chef Sarah",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["Salad", "Mediterranean", "Healthy"],
      publishDate: new Date().toISOString(),
      status: "published",
      cookTime: 15,
      prepTime: 10,
      difficulty: "easy",
      mealTimes: ["lunch", "dinner"],
    },
  ];

  const displayPosts = posts && posts.length > 0 ? posts : samplePosts;
  const isUsingSampleData = !posts || posts.length === 0;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full text-sm font-semibold mb-6">
            🍽️ {language === "ar" ? "وصفات مميزة" : "Featured Recipes"}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          {isUsingSampleData && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
              <p className="text-sm">
                {language === "ar"
                  ? "عرض بيانات تجريبية - قم بإضافة وصفات من لوحة التحكم"
                  : "Showing sample data - Add recipes from the dashboard"}
              </p>
            </div>
          )}
        </motion.div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.slice(0, 6).map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={
                    post.images?.[0] ||
                    post.coverImage ||
                    "/images/default-hero.jpg"
                  }
                  alt={
                    post.content?.[language]?.title ||
                    post.title?.[language] ||
                    "Recipe"
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Category Badge */}
                {post.tags && post.tags.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full">
                      {post.tags[0]}
                    </span>
                  </div>
                )}

                {/* Read Time */}
                <div className="absolute top-4 right-4 flex items-center space-x-1 text-white text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span>5 min</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(post.createdAt || Date.now()).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {post.content?.[language]?.title ||
                    post.title?.[language] ||
                    "Recipe Title"}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {post.content?.[language]?.metaDescription ||
                    post.excerpt?.[language] ||
                    "Discover this amazing recipe that will delight your taste buds and impress your guests."}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Button */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-yellow-600 dark:text-yellow-400 font-semibold hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors group"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {t.readMore}
                  <ArrowRightIcon
                    className={`w-4 h-4 ${
                      language === "ar" ? "mr-2 rotate-180" : "ml-2"
                    } group-hover:translate-x-1 transition-transform`}
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        {displayPosts.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {language === "ar" ? "عرض جميع الوصفات" : "View All Recipes"}
              <ArrowRightIcon
                className={`w-5 h-5 ${
                  language === "ar" ? "mr-2 rotate-180" : "ml-2"
                }`}
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
