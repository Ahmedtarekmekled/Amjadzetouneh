import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  GlobeAltIcon,
  ShareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { settingsService, Settings } from "@/services/settingsService";
import Toast from "@/components/ui/Toast";
import ThemeSettings from "@/components/settings/ThemeSettings";
import BrandingSettings from "@/components/settings/BrandingSettings";
import SeoSettings from "@/components/settings/SeoSettings";
import BackupSettings from "@/components/settings/BackupSettings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "react-error-boundary";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Branding", icon: GlobeAltIcon, component: BrandingSettings },
  { name: "SEO", icon: ShareIcon, component: SeoSettings },
  { name: "Backup", icon: ArrowPathIcon, component: BackupSettings },
];

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-500 mb-4">Something went wrong:</p>
      <pre className="text-sm mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Try again
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (newSettings: Partial<Settings>) => {
    setIsSaving(true);
    try {
      const updatedSettings = await settingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
      showToast("success", "Settings saved successfully");
    } catch (error) {
      showToast("error", "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              loadSettings();
            }}
          >
            <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadSettings}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          </ErrorBoundary>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            loadSettings();
          }}
        >
          <div className="container mx-auto px-4 py-8">
            <Toast
              show={toast.show}
              type={toast.type}
              message={toast.message}
              onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                  Site Settings
                </h1>

                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.name}
                        className={({ selected }) =>
                          classNames(
                            "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                            "ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2",
                            selected
                              ? "bg-white text-indigo-700 shadow"
                              : "text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600"
                          )
                        }
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <tab.icon className="w-5 h-5" />
                          <span>{tab.name}</span>
                        </div>
                      </Tab>
                    ))}
                  </Tab.List>

                  <Tab.Panels className="mt-6">
                    {tabs.map((tab) => (
                      <Tab.Panel
                        key={tab.name}
                        className={classNames(
                          "rounded-xl bg-white",
                          "focus:outline-none focus:ring-2"
                        )}
                      >
                        <tab.component
                          settings={settings}
                          onSave={handleSave}
                          isSaving={isSaving}
                        />
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
