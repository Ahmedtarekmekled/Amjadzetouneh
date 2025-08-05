import { ReactNode, useState } from "react";
import MainNavbar from "../layout/MainNavbar";
import { FULL_IMAGE_URLS } from "@/config/constants";

interface MainLayoutProps {
  children: ReactNode;
  logoUrl?: string;
  backgroundImageUrl?: string;
}

export default function MainLayout({ children, logoUrl, backgroundImageUrl }: MainLayoutProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 relative">
      {/* Background Image */}
      {!imageError && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
          style={{
            backgroundImage: imageLoaded
              ? `url(${backgroundImageUrl || FULL_IMAGE_URLS.HERO_BG})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Preload image */}
          <img
            src={backgroundImageUrl || FULL_IMAGE_URLS.HERO_BG}
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
      )}

      {/* Content overlay */}
      <div className="min-h-screen bg-black/20 backdrop-blur-sm relative z-10">
        <MainNavbar logoUrl={logoUrl} />
        <main className="pt-0 pb-0">{children}</main>
      </div>
    </div>
  );
}
