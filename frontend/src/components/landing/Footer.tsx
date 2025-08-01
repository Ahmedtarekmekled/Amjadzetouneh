import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const { language } = useLanguage();

  const translations = {
    en: {
      allRightsReserved: "All rights reserved",
      madeWith: "Made with",
      by: "by",
      developer: "Ahmed",
    },
    ar: {
      allRightsReserved: "جميع الحقوق محفوظة",
      madeWith: "صنع بـ",
      by: "بواسطة",
      developer: "أحمد",
    },
  };

  const t = translations[language as "en" | "ar"];

  const navigationLinks = [
    { name: language === "ar" ? "الرئيسية" : "Home", href: "/" },
    { name: language === "ar" ? "من نحن" : "About", href: "/about" },
    { name: language === "ar" ? "المدونة" : "Blog", href: "/blog" },
    {
      name: language === "ar" ? "لوحة التحكم" : "Dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 md:pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">CT</span>
              </div>
              <span className="text-xl font-bold">
                {language === "ar" ? "حكايات الطهي" : "Culinary Tales"}
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`hidden md:flex items-center ${
              language === "ar" ? "space-x-reverse space-x-6" : "space-x-6"
            }`}
          >
            {navigationLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Language Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LanguageSwitcher />
          </motion.div>
        </div>

        {/* Navigation Links - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:hidden mt-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {navigationLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block text-center py-3 px-4 bg-gray-800 rounded-lg text-gray-300 hover:text-yellow-400 hover:bg-gray-700 transition-all duration-300 font-medium"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <div
            className={`flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 ${
              language === "ar"
                ? "sm:space-x-reverse sm:space-x-4"
                : "sm:space-x-4"
            } text-gray-400 text-sm`}
          >
            <div dir={language === "ar" ? "rtl" : "ltr"}>
              © 2025 {language === "ar" ? "حكايات الطهي" : "Culinary Tales"}.{" "}
              {t.allRightsReserved}
            </div>
            <div
              className={`flex items-center ${
                language === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <span>{t.madeWith}</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>{t.by}</span>
              <a
                href="https://ahmedmakled.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
              >
                {t.developer}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
