import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { BlogPost } from "@/types/blog";
import { postService } from "@/services/postService";
import MainLayout from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryPageProps {
  posts: BlogPost[];
  category: string;
}

export default function CategoryPage({ posts, category }: CategoryPageProps) {
  const router = useRouter();
  const { language } = useLanguage();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const categoryTitle = language === "ar" ? "وصفات" : "Recipes";
  const categoryName =
    language === "ar"
      ? translateCategory(category)
      : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <MainLayout>
      <Head>
        <title>{`${categoryName} ${categoryTitle}`}</title>
        <meta
          name="description"
          content={`Explore our ${categoryName} ${categoryTitle}`}
        />
      </Head>
      <main className="min-h-screen bg-culinary-beige dark:bg-culinary-charcoal">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-display font-bold text-culinary-charcoal dark:text-culinary-gold mb-8">
              {categoryName} {categoryTitle}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group bg-white dark:bg-culinary-brown rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <a href={`/blog/${post.slug}`} className="block">
                    <div className="relative w-full h-64">
                      <img
                        src={post.images?.[0] || "/placeholder.jpg"}
                        alt={post.content?.[language]?.title || "Recipe Image"}
                        className="object-cover object-center w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-display font-bold text-culinary-charcoal dark:text-culinary-gold mb-3">
                        {post.content?.[language]?.title || "Untitled Recipe"}
                      </h3>
                      <p className="text-culinary-brown dark:text-culinary-beige text-base line-clamp-2 mb-4">
                        {post.content?.[language]?.metaDescription ||
                          "No description available."}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-culinary-brown/80 dark:text-culinary-beige/80">
                          {new Date(post.publishDate).toLocaleDateString(
                            language === "ar" ? "ar-EG" : "en-US"
                          )}
                        </span>
                        <span className="text-culinary-gold font-medium text-sm group-hover:translate-x-1 transition-transform">
                          {language === "ar" ? "اقرأ المزيد ←" : "Read More →"}
                        </span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = [
    "breakfast",
    "main-dishes",
    "appetizers",
    "desserts",
    "beverages",
    "snacks",
  ];

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  try {
    const posts = await postService.getPostsByCategory(category);

    return {
      props: {
        posts,
        category,
      },
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    return {
      props: {
        posts: [],
        category,
      },
    };
  }
};

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
