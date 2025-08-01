import { useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BlogPostForm from "@/components/blog/BlogPostForm";
import { BlogPostFormData } from "@/types/blog";
import { postService } from "@/services/postService";
import Toast from "@/components/ui/Toast";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NewBlogPost() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "error",
    message: "",
  });

  const handleSubmit = async (formData: BlogPostFormData) => {
    setIsSubmitting(true);
    try {
      await postService.createPost(formData);
      setToast({
        show: true,
        type: "success",
        message: "Post created successfully!",
      });
      setTimeout(() => {
        router.push("/dashboard/posts");
      }, 1500);
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to create post",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => router.push("/dashboard/posts")}
                      className="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Create New Recipe
                      </h1>
                      <p className="mt-1 text-sm text-gray-500">
                        Share your delicious recipe with the world
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <PlusIcon className="w-4 h-4 mr-1" />
                      New Recipe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-8">
                <BlogPostForm
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Toast
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
