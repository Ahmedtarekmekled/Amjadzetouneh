import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  FireIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost } from "@/types/blog";
import { postService } from "@/services/postService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getCategoriesByLanguage, findCategoryById } from "@/config/categories";

interface FilterOptions {
  category: string;
  sortBy: "latest" | "oldest" | "popular";
  difficulty?: "easy" | "medium" | "hard";
}

export default function BlogPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    sortBy: "latest",
  });

  // Handle URL parameters for category browsing
  useEffect(() => {
    if (router.isReady) {
      const { category, search } = router.query;

      if (category && typeof category === "string") {
        setFilters((prev) => ({ ...prev, category }));
      }

      if (search && typeof search === "string") {
        setSearchQuery(search);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Apply filters when filters or search query changes
  useEffect(() => {
    if (posts.length > 0) {
      filterPosts(searchQuery, filters);
    }
  }, [posts, searchQuery, filters]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      // Use public endpoint for blog page
      const fetchedPosts = await postService.getPublicPosts();
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    en: {
      title: "Our Blog",
      searchPlaceholder: "Search recipes, ingredients, or categories...",
      categories: "Category",
      sortBy: "Sort By",
      applyFilters: "Apply Filters",
      activeFilters: "Active Filters",
      allCategories: "All Categories",
      readMore: "Read More",
      noResults: "No posts found",
      errorMessage: "Failed to load blog posts",
      clearFilters: "Clear Filters",
      difficulty: "Difficulty",
      prepTime: "Prep Time",
      cookTime: "Cook Time",
      totalTime: "Total Time",
      minutes: "min",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      published: "Published",
      draft: "Draft",
      views: "views",
    },
    ar: {
      title: "مدونتنا",
      searchPlaceholder: "ابحث عن وصفات أو مكونات أو فئات...",
      categories: "الفئة",
      sortBy: "ترتيب حسب",
      applyFilters: "تطبيق الفلاتر",
      activeFilters: "الفلاتر النشطة",
      allCategories: "جميع الفئات",
      readMore: "اقرأ المزيد",
      noResults: "لم يتم العثور على مشاركات",
      errorMessage: "فشل في تحميل مشاركات المدونة",
      clearFilters: "مسح الفلاتر",
      difficulty: "الصعوبة",
      prepTime: "وقت التحضير",
      cookTime: "وقت الطهي",
      totalTime: "الوقت الإجمالي",
      minutes: "دقيقة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      published: "منشور",
      draft: "مسودة",
      views: "مشاهدات",
    },
  };

  const categories = [
    { id: "all", name: translations[language].allCategories, icon: "📂" },
    ...getCategoriesByLanguage(language),
  ];

  const sortOptions = [
    { value: "latest", label: language === "ar" ? "الأحدث" : "Latest" },
    { value: "oldest", label: language === "ar" ? "الأقدم" : "Oldest" },
    { value: "popular", label: language === "ar" ? "الأكثر شعبية" : "Popular" },
  ];

  const difficultyOptions = [
    { value: "easy", label: translations[language].easy },
    { value: "medium", label: translations[language].medium },
    { value: "hard", label: translations[language].hard },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    updateURL({ search: query });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    filterPosts(searchQuery, filters);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (key === "category") {
      updateURL({ category: value });
    }
  };

  const updateURL = (params: { category?: string; search?: string }) => {
    const currentQuery = { ...router.query };

    if (params.category !== undefined) {
      if (params.category === "all") {
        delete currentQuery.category;
      } else {
        currentQuery.category = params.category;
      }
    }

    if (params.search !== undefined) {
      if (params.search === "") {
        delete currentQuery.search;
      } else {
        currentQuery.search = params.search;
      }
    }

    router.push(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const clearFilters = () => {
    setFilters({ category: "all", sortBy: "latest" });
    setSearchQuery("");
    updateURL({ category: "all", search: "" });
  };

  const filterPosts = (query: string, currentFilters: FilterOptions) => {
    let filtered = [...posts];

    // Apply search query
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          (post.title?.[language]?.toLowerCase() || "").includes(searchLower) ||
          (post.excerpt?.[language]?.toLowerCase() || "").includes(
            searchLower
          ) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          post.categories?.some((cat) => {
            const category = findCategoryById(cat, language);
            return category?.name.toLowerCase().includes(searchLower);
          })
      );
    }

    // Apply category filter
    if (currentFilters.category !== "all") {
      filtered = filtered.filter((post) =>
        post.categories?.includes(currentFilters.category)
      );
    }

    // Apply difficulty filter
    if (currentFilters.difficulty) {
      filtered = filtered.filter(
        (post) => post.difficulty === currentFilters.difficulty
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "latest":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    setFilteredPosts(filtered);
  };

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{`${translations[language].title} - Culinary Tales`}</title>
      </Head>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 sm:pb-12 bg-gray-50 dark:bg-gray-900 min-h-screen"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {translations[language].title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ar"
              ? "اكتشف وصفات لذيذة ونصائح طهي من خبرائنا"
              : "Discover delicious recipes and cooking tips from our experts"}
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="mb-12">
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            {/* Enhanced Search Bar */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={translations[language].searchPlaceholder}
                  className="w-full py-4 px-6 pl-14 pr-16 text-lg border-2 border-gray-200 rounded-xl shadow-sm 
                           focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                           bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-300 hover:shadow-md"
                />
                <MagnifyingGlassIcon
                  className={`h-6 w-6 text-gray-400 absolute top-1/2 transform -translate-y-1/2
                            ${language === "ar" ? "right-4" : "left-4"}`}
                />

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute top-1/2 transform -translate-y-1/2 p-2 
                           text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400
                           transition-colors duration-200
                           ${language === "ar" ? "left-4" : "right-4"}`}
                  title={language === "ar" ? "عرض الفلاتر" : "Show Filters"}
                >
                  <FunnelIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Enhanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6
                           border border-gray-200 dark:border-gray-700"
                >
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {translations[language].categories}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            handleFilterChange("category", category.id)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.category === category.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {translations[language].difficulty}
                    </label>
                    <div className="flex gap-3">
                      {difficultyOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleFilterChange("difficulty", option.value)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.difficulty === option.value
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {translations[language].sortBy}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {translations[language].clearFilters}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Active Filters Display */}
        {(filters.category !== "all" ||
          filters.sortBy !== "latest" ||
          searchQuery ||
          filters.difficulty) && (
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations[language].activeFilters}:
            </span>
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                "{searchQuery}"
              </span>
            )}
            {filters.category !== "all" && (
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                {categories.find((c) => c.id === filters.category)?.name}
              </span>
            )}
            {filters.sortBy !== "latest" && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm">
                {sortOptions.find((s) => s.value === filters.sortBy)?.label}
              </span>
            )}
            {filters.difficulty && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-sm">
                {
                  difficultyOptions.find((d) => d.value === filters.difficulty)
                    ?.label
                }
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            {language === "ar"
              ? `تم العثور على ${filteredPosts.length} مشاركة`
              : `Found ${filteredPosts.length} posts`}
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-600 py-12">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
              <p className="text-lg font-medium">
                {translations[language].errorMessage}
              </p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-medium mb-2">
                {translations[language].noResults}
              </p>
              <p className="text-gray-400">
                {language === "ar"
                  ? "جرب تغيير كلمات البحث أو الفلاتر"
                  : "Try changing your search terms or filters"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden
                         hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
                         border border-gray-200 dark:border-gray-700"
              >
                {/* Enhanced Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={
                      post.coverImage ||
                      post.images?.[0] ||
                      "/images/default-hero.jpg"
                    }
                    alt={post.title?.[language] || "Blog post image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Categories Overlay */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {post.categories?.slice(0, 2).map((categoryId) => {
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
                  {post.difficulty && (
                    <div
                      className={`absolute top-4 ${
                        language === "ar" ? "left-4" : "right-4"
                      }`}
                    >
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${getDifficultyColor(
                          post.difficulty
                        )}`}
                      >
                        {getDifficultyIcon(post.difficulty)}
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
                      {new Date(post.publishDate).toLocaleDateString(
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
                               group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    {post.title?.[language] || "Untitled Post"}
                  </h2>

                  <p
                    className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    {post.excerpt?.[language] ||
                      post.content?.[language]?.metaDescription ||
                      ""}
                  </p>

                  {/* Recipe Details */}
                  {(post.prepTime || post.cookTime) && (
                    <div
                      className={`flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {post.prepTime > 0 && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {post.prepTime} {translations[language].minutes}
                          </span>
                        </div>
                      )}
                      {post.cookTime > 0 && (
                        <div className="flex items-center gap-1">
                          <FireIcon className="h-4 w-4" />
                          <span>
                            {post.cookTime} {translations[language].minutes}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{post.tags.length - 3}
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
                      {post.views && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {post.views} {translations[language].views}
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      {post.status === "published"
                        ? translations[language].published
                        : translations[language].draft}
                    </span>
                  </div>

                  {/* Enhanced Read More Button - Gold Color */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center w-full py-3 px-4 
                             bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-lg
                             hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300
                             transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95
                             group-hover:shadow-xl"
                  >
                    {translations[language].readMore}
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
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
