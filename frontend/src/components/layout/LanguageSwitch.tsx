import { useLanguage } from "@/contexts/LanguageContext";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg text-culinary-brown dark:text-culinary-beige hover:bg-culinary-brown/10 dark:hover:bg-culinary-beige/10 transition-colors"
      aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <div className="flex items-center space-x-2">
        <GlobeAltIcon className="h-5 w-5" />
        <span className="text-sm font-medium">{language === "ar" ? "EN" : "AR"}</span>
      </div>
    </button>
  );
}
