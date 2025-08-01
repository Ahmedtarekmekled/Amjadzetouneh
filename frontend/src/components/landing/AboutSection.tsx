import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  UserIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

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

interface AboutSectionProps {
  profileData: ProfileData;
}

export default function AboutSection({ profileData }: AboutSectionProps) {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Meet Your Culinary Guide",
      subtitle: "Passionate about creating unforgettable dining experiences",
      readMore: "Read Full Story",
      experience: "Years of Experience",
      recipes: "Recipes Created",
      awards: "Culinary Awards",
      keyExperiences: "Key Experiences",
    },
    ar: {
      title: "تعرف على دليل الطهي الخاص بك",
      subtitle: "شغوف بخلق تجارب طعام لا تنسى",
      readMore: "اقرأ القصة كاملة",
      experience: "سنوات من الخبرة",
      recipes: "وصفات تم إنشاؤها",
      awards: "جوائز الطهي",
      keyExperiences: "الخبرات المميزة",
    },
  };

  const t = translations[language as "en" | "ar"];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={profileData?.photo || "/images/hero-bg.jpg"}
                  alt={profileData?.name || "Chef"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to a different image if the current one fails
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/hero-bg.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-full shadow-lg"
              >
                <HeartIcon className="w-6 h-6" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg"
              >
                <StarIcon className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-2xl font-bold">5+</div>
                <div className="text-sm font-medium">{t.experience}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t.recipes}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  15+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t.awards}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full text-sm font-semibold"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              {language === "ar" ? "شيف محترف" : "Professional Chef"}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {t.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {t.subtitle}
            </motion.p>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {profileData?.bio ||
                (language === "ar"
                  ? "أنا شيف شغوف بالطهي وأحب مشاركة وصفاتي مع العالم. مع سنوات من الخبرة في المطابخ العالمية، أسعى دائماً لإلهام الآخرين لاستكشاف عالم الطهي الرائع."
                  : "I'm a passionate chef who loves sharing my recipes with the world. With years of experience in international kitchens, I'm always striving to inspire others to explore the wonderful world of cooking.")}
            </motion.p>

            {/* Experience Highlights */}
            {profileData?.experiences && profileData.experiences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t.keyExperiences}
                </h3>
                <div className="space-y-3">
                  {profileData.experiences.slice(0, 3).map((exp, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {exp.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.period}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                {t.readMore}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
