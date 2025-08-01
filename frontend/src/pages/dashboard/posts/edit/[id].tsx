import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BlogPostForm from "@/components/blog/BlogPostForm";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { postService } from "@/services/postService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeftIcon,
  PencilIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (id && isAuthenticated && !authLoading) {
      loadPost();
    }
  }, [id, isAuthenticated, authLoading]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await postService.getPostById(id as string);
      setPost(data);
    } catch (error: any) {
      console.error("Error loading post:", error);
      showToast("error", error.message || "Failed to load post");

      // If it's an authentication error, redirect to login
      if (
        error.message?.includes("authentication") ||
        error.message?.includes("log in")
      ) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: BlogPostFormData) => {
    setIsSubmitting(true);
    try {
      await postService.updatePost(id as string, formData);
      showToast("success", "Post updated successfully");
      setTimeout(() => {
        router.push("/dashboard/posts");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating post:", error);
      showToast("error", error.message || "Failed to update post");

      // If it's an authentication error, redirect to login
      if (
        error.message?.includes("authentication") ||
        error.message?.includes("log in")
      ) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Show loading while fetching post data
  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Loading recipe...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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
                        Edit Recipe
                      </h1>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your recipe details and content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Last updated:{" "}
                      {new Date(post?.updatedAt || "").toLocaleDateString()}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        post?.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post?.status === "published" ? (
                        <>
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeSlashIcon className="w-4 h-4 mr-1" />
                          Draft
                        </>
                      )}
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
                {post && (
                  <BlogPostForm
                    initialData={post}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </div>
          </div>

          <Toast
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
