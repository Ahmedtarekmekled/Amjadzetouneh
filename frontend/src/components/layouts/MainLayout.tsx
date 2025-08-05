import { ReactNode } from "react";
import MainNavbar from "../layout/MainNavbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100">
      <MainNavbar />
      <main className="pt-0 pb-0">{children}</main>
    </div>
  );
}
