import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  HomeIcon,
  UserIcon,
  NewspaperIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon, // Add this for RTL arrows
} from "@heroicons/react/24/outline";

// Create a Direction Context with boolean type
const DirectionContext = createContext<boolean>(false);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false); // Toggle for RTL
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  const toggleDirection = () => {
    setIsRTL((prev) => !prev);
  };

  return (
    <DirectionContext.Provider value={isRTL}>
      {/* Desktop Header */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-white to-gray-100 shadow-md"
            : "bg-transparent"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`flex items-center justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Logo - Only visible on large screens */}
            <div
              className="hidden lg:flex items-center space-x-3 group"
              style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-lg transform transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span
                className="hidden lg:block font-display text-xl font-semibold text-[#2B2B2B] group-hover:text-[#5A3E2B] transition-colors"
                style={{
                  marginLeft: isRTL ? "0.75rem" : "",
                  marginRight: isRTL ? "" : "0.75rem",
                }}
              >
                Culinary Tales
              </span>
            </div>
            <nav
              className={`flex items-center space-x-1 ${
                isRTL ? "space-x-reverse" : ""
              }`}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    router.pathname === item.href
                      ? "text-[#5A3E2B] bg-[#FAF3E0] rounded-md"
                      : "text-[#2B2B2B] hover:text-[#5A3E2B] hover:bg-[#FAF3E0] rounded-md"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {router.pathname === item.href && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-[#FAF3E0] rounded-md"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer for desktop */}
      <div className="lg:h-16" />

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 shadow-sm"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="grid grid-cols-4 h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;

            return (
              <Link key={item.name} href={item.href} className="relative group">
                <div
                  className="flex flex-col items-center justify-center h-full space-y-1"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  <div
                    className={`relative ${
                      isActive
                        ? "text-[#5A3E2B]"
                        : "text-[#2B2B2B] group-hover:text-[#5A3E2B]"
                    } transition-colors duration-200`}
                  >
                    <Icon className="h-6 w-6" />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-dot"
                        className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#5A3E2B]"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      isActive
                        ? "text-[#5A3E2B]"
                        : "text-[#2B2B2B] group-hover:text-[#5A3E2B]"
                    } transition-colors duration-200`}
                  >
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-bg"
                    className="absolute inset-0 bg-[#FAF3E0] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-sm border border-gray-100"
        style={{
          left: isRTL ? "1rem" : "",
          right: isRTL ? "" : "1rem",
        }}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6 text-[#2B2B2B]" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-[#2B2B2B]" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? "-100%" : "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="lg:hidden fixed inset-0 bg-white z-40"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex flex-col h-full pt-20 px-6">
              {navigation.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between py-4 border-b border-gray-100 ${
                      router.pathname === item.href
                        ? "text-[#5A3E2B]"
                        : "text-[#2B2B2B]"
                    }`}
                  >
                    <div
                      className="flex items-center space-x-4"
                      style={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                        marginRight: isRTL ? "1rem" : "",
                        marginLeft: isRTL ? "" : "1rem",
                      }}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-lg font-medium">{item.name}</span>
                    </div>
                    {isRTL ? (
                      <ChevronLeftIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle RTL/LTR Button */}
      <button
        onClick={toggleDirection}
        className="fixed bottom-4 left-4 z-50 p-2 rounded-lg bg-white shadow-sm border border-gray-100"
      >
        {isRTL ? "Switch to LTR" : "Switch to RTL"}
      </button>
    </DirectionContext.Provider>
  );
}

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "About", href: "/about", icon: UserIcon },
  { name: "Blog", href: "/blog", icon: NewspaperIcon },
  { name: "Recipes", href: "/recipes", icon: BookOpenIcon },
];
