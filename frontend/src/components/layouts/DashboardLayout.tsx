import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ShareIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import HeadMeta from "./HeadMeta";
import ParticlesBackground from "../ui/ParticlesBackground";
import { Settings } from "@/services/settingsService";

interface DashboardLayoutProps {
  children: React.ReactNode;
  settings?: Settings | null;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Posts", href: "/dashboard/posts", icon: DocumentTextIcon },
  { name: "About", href: "/dashboard/about", icon: UserIcon },
  { name: "Social Media", href: "/dashboard/socials", icon: ShareIcon },
  // { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon }, // Disabled for now
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  settings = null,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      // Handle logout error silently
    }
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      <HeadMeta settings={settings} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
        {/* Particles Background */}
        <ParticlesBackground />

        {/* Mobile sidebar backdrop */}
        <Transition
          show={sidebarOpen}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        </Transition>

        {/* Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col z-30">
          <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-amber-900 via-yellow-800 to-orange-900 border-r border-amber-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-center h-24 px-6 border-b border-amber-700 bg-gradient-to-r from-amber-800 to-yellow-800 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400 to-amber-400 transform rotate-12 scale-150"></div>
              </div>

              <Link
                href="/dashboard"
                className="text-3xl font-bold text-white flex items-center space-x-3 relative z-10"
              >
                <Image
                  src="/images/logo.png"
                  alt="Culinary Tales Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-200"
                />
                <div>
                  <span className="bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent block">
                    Amjad
                  </span>
                  <span className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent block">
                    Zetouneh
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative z-10 ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 shadow-xl shadow-amber-500/25"
                        : "text-amber-100 hover:bg-gradient-to-r hover:from-amber-800/50 hover:to-yellow-800/50 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 transition-all duration-300 ${
                        isActive
                          ? "text-amber-900"
                          : "text-amber-300 group-hover:text-yellow-200"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-6 border-t border-amber-700 bg-gradient-to-r from-amber-800 to-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-amber-900 font-bold text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user?.username}
                    </p>
                    <p className="text-xs text-amber-200">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 text-amber-200 hover:text-white hover:bg-amber-700 rounded-xl transition-all duration-300 transform hover:scale-110 cursor-pointer"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        <Transition
          show={sidebarOpen}
          enter="transform transition ease-in-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
          className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-amber-900 via-yellow-800 to-orange-900 shadow-2xl z-30 lg:hidden"
        >
          {/* Mobile sidebar content */}
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-24 px-6 border-b border-amber-700 bg-gradient-to-r from-amber-800 to-yellow-800">
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-white flex items-center space-x-3"
              >
                <Image
                  src="/images/logo.png"
                  alt="Culinary Tales Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl"
                />
                <span className="bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
                  Amjad Zetouneh
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-amber-200 hover:text-white p-2 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 shadow-xl"
                        : "text-amber-100 hover:bg-gradient-to-r hover:from-amber-800/50 hover:to-yellow-800/50 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 transition-colors ${
                        isActive
                          ? "text-amber-900"
                          : "text-amber-300 group-hover:text-yellow-200"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="p-6 border-t border-amber-700 bg-gradient-to-r from-amber-800 to-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-amber-900 font-bold text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user?.username}
                    </p>
                    <p className="text-xs text-amber-200">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 text-amber-200 hover:text-white hover:bg-amber-700 rounded-xl transition-colors cursor-pointer"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Transition>

        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-20 bg-gradient-to-r from-amber-600 to-yellow-600 px-6 shadow-lg relative z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-amber-200 p-2 rounded-lg hover:bg-amber-700/50 transition-colors cursor-pointer"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="ml-4 flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="Culinary Tales Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl shadow-lg"
            />
            <span className="text-xl font-bold text-white">Dashboard</span>
          </div>
        </div>

        {/* Main content */}
        <main className="lg:pl-80 relative z-10">
          <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
