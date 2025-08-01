import { createContext, useContext, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "about.title": "About Me",
    "about.experience": "Experience",
    "about.downloadCV": "Download CV",
    "hero.exploreButton": "Explore Blog",
    "common.save": "Save",
    "common.saving": "Saving...",
    "settings.general.title": "General Settings",
    "settings.general.description": "Manage your site settings",
    "settings.general.siteTitle": "Site Title",
    "settings.general.siteDescription": "Site Description",
    "settings.profile.title": "Profile Settings",
    "settings.profile.description": "Update your profile information",
    "settings.profile.photo": "Profile Photo",
    "settings.profile.changePhoto": "Change Photo",
    "settings.profile.name": "Name",
    "settings.profile.bio": "Bio",
  },
  ar: {
    "about.title": "نبذة عني",
    "about.experience": "الخبرات",
    "about.downloadCV": "تحميل السيرة الذاتية",
    "hero.exploreButton": "تصفح المدونة",
    "common.save": "حفظ",
    "common.saving": "جاري الحفظ...",
    "settings.general.title": "الإعدادات العامة",
    "settings.general.description": "إدارة إعدادات موقعك",
    "settings.general.siteTitle": "عنوان الموقع",
    "settings.general.siteDescription": "وصف الموقع",
    "settings.profile.title": "إعدادات الملف الشخصي",
    "settings.profile.description": "تحديث معلومات ملفك الشخصي",
    "settings.profile.photo": "الصورة الشخصية",
    "settings.profile.changePhoto": "تغيير الصورة",
    "settings.profile.name": "الاسم",
    "settings.profile.bio": "نبذة",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      <div dir={language === "ar" ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
