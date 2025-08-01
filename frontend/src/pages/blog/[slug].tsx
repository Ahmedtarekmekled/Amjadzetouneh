import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost } from "@/types/blog";
import { postService } from "@/services/postService";
import Head from "next/head";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  FireIcon,
  UserIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { findCategoryById } from "@/config/categories";
// import { analyticsService } from "@/services/analyticsService"; // Temporarily disabled

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug as string);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setIsLoading(true);
      // Try public endpoint first, fallback to authenticated endpoint
      let fetchedPost = await postService.getPublicPostBySlug(postSlug);

      // If public endpoint doesn't work, try the authenticated one
      if (!fetchedPost) {
        fetchedPost = await postService.getPostBySlug(postSlug);
      }

      if (!fetchedPost) {
        setError("Post not found");
        return;
      }
      setPost(fetchedPost);
    } catch (error) {
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  // Track analytics when post is loaded (only for authenticated users)
  useEffect(() => {
    if (post?._id && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Temporarily disabled analytics tracking until backend endpoint is ready
        // analyticsService.trackView(post._id);
      }
    }
  }, [post?._id]);

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

  const translations = {
    en: {
      backToBlog: "Back to Blog",
      prepTime: "Prep Time",
      cookTime: "Cook Time",
      totalTime: "Total Time",
      minutes: "minutes",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      categories: "Categories",
      tags: "Tags",
      published: "Published",
      draft: "Draft",
      views: "views",
      imageGallery: "Image Gallery",
      relatedRecipes: "Related Recipes",
      publishedOn: "Published on",
      readTime: "min read",
    },
    ar: {
      backToBlog: "عودة للمدونة",
      prepTime: "وقت التحضير",
      cookTime: "وقت الطهي",
      totalTime: "الوقت الإجمالي",
      minutes: "دقائق",
      difficulty: "الصعوبة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      categories: "الفئات",
      tags: "العلامات",
      published: "منشور",
      draft: "مسودة",
      views: "مشاهدات",
      imageGallery: "معرض الصور",
      relatedRecipes: "وصفات ذات صلة",
      publishedOn: "نشر في",
      readTime: "دقائق للقراءة",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Post not found"}
          </h1>
          <Link
            href="/blog"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {translations[language].backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const content = post.content?.[language];
  const title = post.title?.[language] || content?.title || "Recipe";
  const excerpt = post.excerpt?.[language] || content?.metaDescription || "";
  const totalTime = (post.prepTime || 0) + (post.cookTime || 0);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
      </Head>

      <main
        className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        {/* Hero Image */}
        <div className="relative h-[60vh]">
          <Image
            src={
              post.coverImage || post.images?.[0] || "/images/default-hero.jpg"
            }
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default-hero.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Back Button - Gold Color */}
          <div className="absolute top-6 lg:top-20 left-6 z-10">
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black 
                       rounded-lg backdrop-blur-sm hover:from-yellow-500 hover:to-yellow-700 transition-colors shadow-lg"
            >
              {language === "ar" ? (
                <>
                  {translations[language].backToBlog}
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                </>
              ) : (
                <>
                  <ArrowLeftIcon className="h-5 w-5 ml-2" />
                  {translations[language].backToBlog}
                </>
              )}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative pb-20 sm:pb-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12"
          >
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h1>

            {/* Recipe Details Card */}
            {(post.prepTime || post.cookTime || post.difficulty) && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Prep Time */}
                  {post.prepTime > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {translations[language].prepTime}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {post.prepTime} {translations[language].minutes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cook Time */}
                  {post.cookTime > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {translations[language].cookTime}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {post.cookTime} {translations[language].minutes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Difficulty */}
                  {post.difficulty && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <StarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {translations[language].difficulty}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {getDifficultyIcon(post.difficulty)}{" "}
                          {translations[language][post.difficulty]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Time */}
                {totalTime > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {translations[language].totalTime}:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalTime} {translations[language].minutes}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.publishDate}>
                  {translations[language].publishedOn}{" "}
                  {new Date(post.publishDate).toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
              </div>

              {post.views && (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>
                    {post.views} {translations[language].views}
                  </span>
                </div>
              )}

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === "published"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {translations[language][post.status]}
              </span>
            </div>

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {translations[language].categories}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((categoryId) => {
                    const category = findCategoryById(categoryId, language);
                    return category ? (
                      <span
                        key={categoryId}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 
                                 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {translations[language].tags}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                               rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt */}
            {excerpt && (
              <div className="mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div
              className="prose dark:prose-invert prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white 
                       prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400
                       prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                       prose-ol:text-gray-700 dark:prose-ol:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content?.content || "" }}
            />

            {/* Image Gallery */}
            {post.images && post.images.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {translations[language].imageGallery}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Image
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/default-hero.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        </div>
      </main>
    </>
  );
}
