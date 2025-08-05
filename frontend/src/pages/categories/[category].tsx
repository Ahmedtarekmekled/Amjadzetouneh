import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { BlogPost } from "@/types/blog";
import { postService } from "@/services/postService";
import MainLayout from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category && typeof category === "string") {
      loadCategoryPosts(category);
    }
  }, [category]);

  const loadCategoryPosts = async (categorySlug: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPosts = await postService.getPostsByCategory(categorySlug);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error(`Error fetching posts for category ${categorySlug}:`, error);
      setError("Failed to load posts for this category");
    } finally {
      setIsLoading(false);
    }
  };

  if (router.isFallback || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <LoadingSpinner />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600 font-medium"
            >
              Loading delicious recipes...
            </motion.p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-red-500 text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const categoryTitle = language === "ar" ? "وصفات" : "Recipes";
  const categoryName =
    language === "ar"
      ? translateCategory(category as string)
      : (category as string)?.charAt(0).toUpperCase() + (category as string)?.slice(1);

  return (
    <MainLayout>
      <Head>
        <title>{`${categoryName} ${categoryTitle}`}</title>
        <meta
          name="description"
          content={`Explore our ${categoryName} ${categoryTitle}`}
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                {categoryName} {categoryTitle}
              </h1>
              <p className="text-xl text-gray-600">
                {posts.length} {language === "ar" ? "وصفة" : "recipe"}
                {posts.length !== 1 ? (language === "ar" ? "ات" : "s") : ""} found
              </p>
            </motion.div>

            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center py-20"
              >
                <div className="text-gray-400 text-8xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  {language === "ar" ? "لا توجد وصفات بعد" : "No recipes yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {language === "ar" 
                    ? "سنضيف وصفات رائعة لهذه الفئة قريباً" 
                    : "We'll add amazing recipes to this category soon"
                  }
                </p>
                <button
                  onClick={() => router.push("/blog")}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  {language === "ar" ? "تصفح جميع الوصفات" : "Browse All Recipes"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-200"
                  >
                    <a href={`/blog/${post.slug}`} className="block">
                      <div className="relative w-full h-64">
                        <img
                          src={post.images?.[0] || "/images/default-hero.jpg"}
                          alt={post.content?.[language]?.title || "Recipe Image"}
                          className="object-cover object-center w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                          {post.difficulty || "Medium"}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                          {post.content?.[language]?.title || "Untitled Recipe"}
                        </h3>
                        <p className="text-gray-600 text-base line-clamp-2 mb-4">
                          {post.content?.[language]?.metaDescription ||
                            "No description available."}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>⏱️ {post.prepTime || 0}min</span>
                            <span>👥 {post.servings || 2}</span>
                          </div>
                          <span className="text-amber-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            {language === "ar" ? "اقرأ المزيد ←" : "Read More →"}
                          </span>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>
    </MainLayout>
  );
}

// Helper function to translate category names to Arabic
function translateCategory(category: string): string {
  const translations: { [key: string]: string } = {
    breakfast: "الإفطار",
    "main-dishes": "الأطباق الرئيسية",
    appetizers: "المقبلات",
    desserts: "الحلويات",
    beverages: "المشروبات",
    snacks: "الوجبات الخفيفة",
  };
  return translations[category] || category;
}
