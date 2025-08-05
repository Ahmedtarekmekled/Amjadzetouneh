import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { FULL_IMAGE_URLS } from "@/config/constants";

interface HeroSectionProps {
  content?: {
    en: {
      title: string;
      description: string;
      buttonText: string;
    };
    ar: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
  backgroundImage?: string;
}

export default function HeroSection({
  content,
  backgroundImage,
}: HeroSectionProps) {
  const { language } = useLanguage();
  const currentContent = content?.[language];

  return (
    <section
      className={`relative h-screen flex items-center overflow-hidden ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || FULL_IMAGE_URLS.HERO_BG}
          alt="Culinary background"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            language === "ar"
              ? "from-transparent to-culinary-charcoal/80"
              : "from-culinary-charcoal/80 to-transparent"
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`max-w-xl ${language === "ar" ? "ml-auto" : ""}`}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-3xl font-display font-bold text-white mb-6 leading-tight tracking-wide"
          >
            {currentContent?.title || "Discover the Art of"}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-culinary-gold"
            >
              {" "}
              {currentContent?.description}
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed tracking-wide"
          >
            {currentContent?.description}
          </motion.p>
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/blog"
                className="px-8 py-4 bg-gradient-to-r from-culinary-gold to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {currentContent?.buttonText || "Explore Recipes"}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
