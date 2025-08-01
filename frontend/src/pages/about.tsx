import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { aboutService, AboutData } from "@/services/aboutService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  StarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function About() {
  const router = useRouter();
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await aboutService.getAbout();
      setAboutData(data);
    } catch (error) {
      setError("Failed to load about page");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCV = async (cvUrl: string) => {
    try {
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
      window.open(cvUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <StarIcon className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || "Failed to load about page"}
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.reload()}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Try again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const content =
    aboutData.content[language as "en" | "ar"] || aboutData.content.en;

  const translations = {
    en: {
      heroSubtitle:
        "Passionate about creating delicious recipes and sharing culinary experiences",
      expertise: "Expertise",
      expertiseDesc: "Culinary arts, recipe development, and food photography",
      resume: "Resume",
      downloadCV: "Download CV",
      aboutMe: "About Me",
      skillsExpertise: "Skills & Expertise",
      education: "Education",
      experience: "Experience",
      administrator: "Administrator",
      culinaryPassion: "Culinary Passion",
      creativeRecipes: "Creative Recipes",
      foodPhotography: "Food Photography",
    },
    ar: {
      heroSubtitle: "شغوف بإنشاء وصفات لذيذة ومشاركة التجارب الطهي",
      expertise: "الخبرة",
      expertiseDesc: "الفنون الطهي، تطوير الوصفات، وتصوير الطعام",
      resume: "السيرة الذاتية",
      downloadCV: "تحميل السيرة الذاتية",
      aboutMe: "نبذة عني",
      skillsExpertise: "المهارات والخبرات",
      education: "التعليم",
      experience: "الخبرات",
      administrator: "مدير",
      culinaryPassion: "الشغف الطهي",
      creativeRecipes: "الوصفات الإبداعية",
      foodPhotography: "تصوير الطعام",
    },
  };

  const t = translations[language as "en" | "ar"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <HeartIcon className="h-12 w-12 text-black" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              {language === "ar" ? "نبذة عني" : "About"}{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {language === "ar" ? "" : "Me"}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              {t.heroSubtitle}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-10 mt-10">
              {aboutData.profileImage && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <img
                    src={aboutData.profileImage}
                    alt="Profile"
                    className="relative w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                </motion.div>
              )}

              {/* Quick Info Cards */}
              <div className="mt-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors duration-300"
                >
                  <div
                    className={`flex items-center ${
                      language === "ar"
                        ? "flex-row-reverse space-x-reverse space-x-6"
                        : "space-x-3"
                    } mb-3`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <StarIcon className="h-5 w-5 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {t.expertise}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm">{t.expertiseDesc}</p>
                </motion.div>

                {aboutData.showCV && aboutData.cvFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors duration-300"
                  >
                    <div
                      className={`flex items-center ${
                        language === "ar"
                          ? "flex-row-reverse space-x-reverse space-x-6"
                          : "space-x-3"
                      } mb-3`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DocumentTextIcon className="h-5 w-5 text-black" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {t.resume}
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadCV(aboutData.cvFile!)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {t.downloadCV}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2 space-y-12"
          >
            {/* About Description */}
            {content?.description && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/30 transition-colors duration-300"
              >
                <h2
                  className={`text-3xl font-bold text-white mb-6 flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      language === "ar" ? "mr-0 ml-6" : "mr-3"
                    }`}
                  >
                    <span className="text-black font-bold text-sm">A</span>
                  </div>
                  {t.aboutMe}
                </h2>
                <div
                  className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-yellow-400"
                  dangerouslySetInnerHTML={{ __html: content.description }}
                />
              </motion.div>
            )}

            {/* Skills Section */}
            {content?.skills && content.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/30 transition-colors duration-300"
              >
                <h2
                  className={`text-3xl font-bold text-white mb-6 flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      language === "ar" ? "mr-0 ml-6" : "mr-3"
                    }`}
                  >
                    <TrophyIcon className="h-5 w-5 text-black" />
                  </div>
                  {t.skillsExpertise}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {content.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Section */}
            {content?.education && content.education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/30 transition-colors duration-300"
              >
                <h2
                  className={`text-3xl font-bold text-white mb-6 flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      language === "ar" ? "mr-0 ml-6" : "mr-3"
                    }`}
                  >
                    <AcademicCapIcon className="h-5 w-5 text-black" />
                  </div>
                  {t.education}
                </h2>
                <div className="space-y-6">
                  {content.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                      className={`relative ${
                        language === "ar"
                          ? "pr-8 border-r-4 border-yellow-400"
                          : "pl-8 border-l-4 border-yellow-400"
                      }`}
                    >
                      <div
                        className={`absolute ${
                          language === "ar" ? "-right-2" : "-left-2"
                        } top-0 w-4 h-4 bg-yellow-400 rounded-full shadow-lg`}
                      ></div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-yellow-400 font-medium mb-1">
                        {edu.institution}
                      </p>
                      <p className="text-gray-400 text-sm">{edu.year}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {content?.experience && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/30 transition-colors duration-300"
              >
                <h2
                  className={`text-3xl font-bold text-white mb-6 flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      language === "ar" ? "mr-0 ml-6" : "mr-3"
                    }`}
                  >
                    <BriefcaseIcon className="h-5 w-5 text-black" />
                  </div>
                  {t.experience}
                </h2>
                <div
                  className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-yellow-400"
                  dangerouslySetInnerHTML={{ __html: content.experience }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
