import { ReactNode } from "react";
import MainNavbar from "../layout/MainNavbar";
import { FULL_IMAGE_URLS } from "@/config/constants";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100"
      style={{
        backgroundImage: `url(${FULL_IMAGE_URLS.HERO_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <MainNavbar />
        <main className="pt-0 pb-0">{children}</main>
      </div>
    </div>
  );
}
