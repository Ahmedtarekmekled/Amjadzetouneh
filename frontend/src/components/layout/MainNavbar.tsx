import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  HomeIcon,
  UserIcon,
  NewspaperIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

const navigation = {
  en: [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "About", href: "/about", icon: UserIcon },
    { name: "Blog", href: "/blog", icon: NewspaperIcon },
  ],
  ar: [
    { name: "الرئيسية", href: "/", icon: HomeIcon },
    { name: "من نحن", href: "/about", icon: UserIcon },
    { name: "المدونة", href: "/blog", icon: NewspaperIcon },
  ],
};

export default function MainNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const currentNavigation = navigation[language];

  useEffect(() => {
    // Load language preference from cookie
    const savedLanguage = Cookies.get("preferred-language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage as "en" | "ar");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setLanguage]);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    Cookies.set("preferred-language", newLang, { expires: 365 });
  };

  return (
    <>
      {/* Desktop Navbar - Hidden on mobile */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-sm shadow-lg py-3"
            : "bg-transparent py-6"
        } ${language === "ar" ? "rtl" : "ltr"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/images/logo.png"
                alt="Culinary Tales Logo"
                width={70}
                height={70}
                className="w-18 h-18 rounded-lg"
              />
              <span
                className={`font-display text-xl sm:text-2xl font-bold ${
                  isScrolled ? "text-white" : "text-white"
                } group-hover:text-yellow-400 transition-colors`}
              >
                <span className="text-yellow-400">Amjad</span> Zetouneh
              </span>
            </Link>

            <nav
              className={`hidden md:flex items-center gap-8 ${
                language === "ar" ? "space-x-reverse" : ""
              }`}
            >
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    router.pathname === item.href
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg"
                      : isScrolled
                      ? "text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
                      : "text-white hover:text-yellow-400 hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isScrolled
                    ? "text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
                    : "text-white hover:text-yellow-400 hover:bg-white/10"
                }`}
              >
                <LanguageIcon className="h-5 w-5" />
                <span>{language.toUpperCase()}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <div
          className={`grid grid-cols-4 h-16 ${
            language === "ar" ? "rtl" : "ltr"
          }`}
        >
          {currentNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  router.pathname === item.href
                    ? "text-yellow-400"
                    : "text-gray-400 hover:text-yellow-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={toggleLanguage}
            className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <LanguageIcon className="h-5 w-5" />
            <span className="text-xs">{language.toUpperCase()}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
