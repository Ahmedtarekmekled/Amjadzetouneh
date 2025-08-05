import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AboutForm from "@/components/about/AboutForm";
import { aboutService, AboutData } from "@/services/aboutService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageLoader from "@/components/ui/PageLoader";
import Toast from "@/components/ui/Toast";
import { UserIcon, DocumentTextIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function AboutPage() {
  const router = useRouter();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "error",
    message: "",
  });

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await aboutService.getAbout();
      setAboutData(data);
    } catch (error: any) {
      setToast({
        show: true,
        type: "error",
        message: error.message || "Failed to load about data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: AboutData) => {
    setIsSubmitting(true);
    try {
      const updatedData = await aboutService.updateAbout(formData);
      setAboutData(updatedData);
      setToast({
        show: true,
        type: "success",
        message: "About page updated successfully!",
      });
    } catch (error: any) {
      setToast({
        show: true,
        type: "error",
        message: error.message || "Failed to update about data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <PageLoader text="Loading profile information..." showBackground={false} />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    About Page
                  </h1>
                  <p className="text-amber-600 mt-1">
                    Manage your profile information, CV, and personal details
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
              >
                <SparklesIcon className="mr-2 h-5 w-5" />
                Profile Settings
              </motion.div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Profile Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {aboutData?.profileImage ? "Complete" : "Incomplete"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">CV Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {aboutData?.cvFile ? "Uploaded" : "Not Uploaded"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Content Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {aboutData?.content?.en?.description ? "Complete" : "Incomplete"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Profile Information
              </h2>
              <p className="text-gray-600">
                Update your personal information, upload your photo, and manage your CV
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <AboutForm
              initialData={aboutData || undefined}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </motion.div>

        {/* Toast */}
        {toast.show && (
          <Toast
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
