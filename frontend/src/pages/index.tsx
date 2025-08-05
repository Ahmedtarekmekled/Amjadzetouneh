import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturedRecipes from "@/components/landing/FeaturedRecipes";
import MealCategories from "@/components/landing/MealCategories";
import SocialLinks from "@/components/landing/SocialLinks";
import NewsletterForm from "@/components/landing/NewsletterForm";
import Footer from "@/components/landing/Footer";
import CurvedDivider from "@/components/ui/CurvedDivider";
import { postService } from "@/services/postService";
import { settingsService } from "@/services/settingsService";
import { BlogPost } from "@/types/blog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MainLayout from "@/components/layouts/MainLayout";

// Improved type definitions
interface ProfileData {
  name: string;
  bio: string;
  photo: string;
  cv: string;
  experiences: Array<{
    title: string;
    period: string;
    description: string;
  }>;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Default settings moved outside component for better maintainability
const defaultSettings = {
  siteTitle: "Culinary Tales - Food Blog",
  siteDescription:
    "Discover delicious recipes, cooking tips, and culinary adventures from around the world",
  heroImage: "/images/default-hero.jpg",
  profileData: {
    name: "Chef Sarah",
    bio: "Passionate chef with over 5 years of experience in international cuisine. I love sharing my recipes and inspiring others to explore the wonderful world of cooking.",
    photo: "/images/hero-bg.jpg",
    cv: "",
    experiences: [
      {
        title: "Head Chef at Le Gourmet",
        period: "2020 - Present",
        description: "Leading a team of 15 chefs in a fine dining restaurant",
      },
      {
        title: "Sous Chef at Mediterranean Kitchen",
        period: "2018 - 2020",
        description: "Specialized in Mediterranean and Middle Eastern cuisine",
      },
      {
        title: "Culinary Institute Graduate",
        period: "2016 - 2018",
        description: "Professional culinary arts degree with honors",
      },
    ],
  },
  socialLinks: [],
  seo: {
    metaTitle: "Culinary Tales - Discover Amazing Recipes",
    metaDescription:
      "Explore delicious recipes, cooking tips, and culinary stories. From traditional dishes to modern cuisine, find inspiration for your next kitchen adventure.",
  },
  branding: {
    hero: {
      backgroundImage: "/images/hero-bg.jpg",
      en: {
        title: "Culinary Adventures Await",
        description:
          "Discover mouthwatering recipes, cooking tips, and culinary stories that will inspire your next kitchen masterpiece",
        buttonText: "Explore Recipes",
      },
      ar: {
        title: "مغامرات الطهي تنتظرك",
        description:
          "اكتشف وصفات شهية ونصائح طهي وقصص طهي ستلهمك لتحضير تحفة طهي جديدة",
        buttonText: "استكشف الوصفات",
      },
    },
  },
};

export default function LandingPage() {
  const { theme } = useTheme();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [featuredPostsData, settingsData] = await Promise.all([
          postService.getFeaturedPosts(),
          settingsService.getAllSettings(),
        ]);
        setFeaturedPosts(featuredPostsData);
        setSettings(settingsData);
      } catch (error) {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {settings.seo?.metaTitle || defaultSettings.seo.metaTitle}
        </title>
        <meta
          name="description"
          content={
            settings.seo?.metaDescription || defaultSettings.seo.metaDescription
          }
        />
        <meta
          name="keywords"
          content="food blog, recipes, cooking, culinary, chef, kitchen, cooking tips"
        />
        <meta
          property="og:title"
          content={settings.seo?.metaTitle || defaultSettings.seo.metaTitle}
        />
        <meta
          property="og:description"
          content={
            settings.seo?.metaDescription || defaultSettings.seo.metaDescription
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            settings.branding?.hero?.backgroundImage ||
            defaultSettings.heroImage
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={settings.seo?.metaTitle || defaultSettings.seo.metaTitle}
        />
        <meta
          name="twitter:description"
          content={
            settings.seo?.metaDescription || defaultSettings.seo.metaDescription
          }
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Website",
              name: settings.siteTitle || defaultSettings.siteTitle,
              description:
                settings.siteDescription || defaultSettings.siteDescription,
              url: process.env.NEXT_PUBLIC_SITE_URL,
              publisher: {
                "@type": "Person",
                name:
                  settings.profileData?.name ||
                  defaultSettings.profileData?.name ||
                  "Amjad Zetouneh",
              },
            }),
          }}
        />
      </Head>

      <MainLayout 
        logoUrl={(settings.branding as any)?.logo}
        backgroundImageUrl={settings.branding?.hero?.backgroundImage}
      >
        <main className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        {/* Hero Section */}
        <section className="relative w-full">
                  <HeroSection
          content={{
            en: {
              title: (settings.branding?.hero?.en as any)?.title || "Culinary Adventures Await",
              description: (settings.branding?.hero?.en as any)?.subtitle || "Discover mouthwatering recipes, cooking tips, and culinary stories that will inspire your next kitchen masterpiece",
              buttonText: (settings.branding?.hero?.en as any)?.ctaText || "Explore Recipes",
            },
            ar: {
              title: (settings.branding?.hero?.ar as any)?.title || "مغامرات الطهي تنتظرك",
              description: (settings.branding?.hero?.ar as any)?.subtitle || "اكتشف وصفات شهية ونصائح طهي وقصص طهي ستلهمك لتحضير تحفة طهي جديدة",
              buttonText: (settings.branding?.hero?.ar as any)?.ctaText || "استكشف الوصفات",
            },
          }}
          backgroundImage={
            settings.branding?.hero?.backgroundImage ||
            defaultSettings.branding?.hero?.backgroundImage
          }
        />
        </section>

        {/* Curved Divider: Hero → Featured Recipes */}
        <CurvedDivider
          type="wave"
          direction="down"
          color={theme === "dark" ? "#1f2937" : "#fef3c7"}
        />

        {/* Featured Recipes */}
        <section className="w-full">
          <FeaturedRecipes recipes={featuredPosts} />
        </section>

        {/* Curved Divider: Featured Recipes → About */}
        <CurvedDivider
          type="curve"
          direction="up"
          color={theme === "dark" ? "#1f2937" : "#ffffff"}
        />

        {/* About Section */}
        <section className="w-full">
          <AboutSection
            profileData={settings.profileData || defaultSettings.profileData}
          />
        </section>

        {/* Curved Divider: About → Newsletter */}
        <CurvedDivider
          type="angled"
          direction="down"
          color={theme === "dark" ? "#374151" : "#fef3c7"}
        />

        {/* Newsletter Section */}
        <section className="w-full bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <NewsletterForm />
          </div>
        </section>

        {/* Social Media Section */}
        <section className="w-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Follow Our Culinary Journey
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join our community of food lovers and get daily inspiration,
                behind-the-scenes content, and exclusive recipes
              </p>
            </div>
            <SocialLinks
              links={settings.socialLinks || defaultSettings.socialLinks}
            />
          </div>
        </section>

        {/* Footer */}
        <Footer />
        </main>
      </MainLayout>
    </>
  );
}
