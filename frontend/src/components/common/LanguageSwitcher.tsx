import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.button
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 bg-gray-800 hover:bg-yellow-600 hover:text-black text-white rounded-full transition-all duration-300 font-medium ${className}`}
    >
      {language === "en" ? "العربية" : "English"}
    </motion.button>
  );
}
