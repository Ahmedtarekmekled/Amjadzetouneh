import { ReactNode } from "react";
import MainNavbar from "../layout/MainNavbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-culinary-beige">
      <MainNavbar />
      <main className="pt-0 pb-0">{children}</main>
    </div>
  );
}
