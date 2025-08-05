import { ReactNode, useState, useEffect } from "react";
import MainNavbar from "../layout/MainNavbar";
import { FULL_IMAGE_URLS } from "@/config/constants";

interface MainLayoutProps {
  children: ReactNode;
  logoUrl?: string;
  backgroundImageUrl?: string;
}

export default function MainLayout({
  children,
  logoUrl,
  backgroundImageUrl,
}: MainLayoutProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Preload the background image immediately
  const backgroundUrl = backgroundImageUrl || FULL_IMAGE_URLS.HERO_BG;

  // Set initial load to false after a short delay to prevent layout shift
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 relative">
      {/* Background Image - Always show, but with opacity transition */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat transition-opacity duration-500 ${
          isInitialLoad ? "opacity-0" : ""
        }`}
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          opacity: isInitialLoad ? 0 : imageLoaded ? 1 : 0.3, // Start with low opacity, fade in when loaded
        }}
      >
        {/* Preload image */}
        <img
          src={backgroundUrl}
          alt=""
          className="hidden"
          onLoad={() => {
            console.log("🖼️ Background image loaded successfully");
            setImageLoaded(true);
          }}
          onError={() => {
            console.log(
              "🖼️ Background image failed to load, using gradient fallback"
            );
            setImageError(true);
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="min-h-screen bg-black/20 backdrop-blur-sm relative z-10">
        <MainNavbar logoUrl={logoUrl} />
        <main className="pt-0 pb-20 md:pb-0">{children}</main>
        
        {/* Loading overlay for initial load */}
        {isInitialLoad && (
          <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 z-[9998] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
