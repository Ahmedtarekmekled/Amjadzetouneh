import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { postService } from "@/services/postService";
import { BlogPost } from "@/types/blog";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import {
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const posts = await postService.getAllPosts();
      setRecentPosts(posts.slice(0, 5));
      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter((post) => post.status === "published")
          .length,
        draftPosts: posts.filter((post) => post.status === "draft").length,
      });
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  const getPostTitle = (post: BlogPost) => {
    // Use the main title field instead of content.title
    return (
      post.title?.en ||
      post.title?.ar ||
      post.content?.en?.title ||
      post.content?.ar?.title ||
      "Untitled Post"
    );
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-amber-700 text-lg">
              Manage your culinary content and track your blog's performance
            </p>
          </div>

          {/* Analytics Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ChartBarIcon className="mr-2 h-5 w-5" />
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </button>
          </div>

          {/* Analytics Dashboard */}
          {showAnalytics && (
            <div className="mb-8">
              <AnalyticsDashboard />
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-900 text-sm font-semibold uppercase tracking-wide">
                      Total Posts
                    </p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">
                      {stats.totalPosts}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <DocumentTextIcon className="h-8 w-8 text-amber-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-900 text-sm font-semibold uppercase tracking-wide">
                      Published Posts
                    </p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">
                      {stats.publishedPosts}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <EyeIcon className="h-8 w-8 text-emerald-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-900 text-sm font-semibold uppercase tracking-wide">
                      Draft Posts
                    </p>
                    <p className="text-3xl font-bold text-red-900 mt-2">
                      {stats.draftPosts}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <PencilIcon className="h-8 w-8 text-red-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900">
                    Recent Posts
                  </h3>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard/posts/new"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Post
                  </Link>
                  <Link
                    href="/dashboard/posts"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <DocumentTextIcon className="mr-2 h-4 w-4" />
                    View All Posts
                  </Link>
                </div>
              </div>
            </div>

            <div className="divide-y divide-amber-100">
              {recentPosts.length > 0 ? (
                recentPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className="group hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-yellow-50/50 transition-all duration-300"
                  >
                    <Link
                      href={`/dashboard/posts/edit/${post._id}`}
                      className="block px-8 py-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center group-hover:from-amber-200 group-hover:to-yellow-200 transition-colors duration-300">
                                <DocumentTextIcon className="h-6 w-6 text-amber-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-amber-900 group-hover:text-amber-700 transition-colors duration-300 truncate">
                                {getPostTitle(post)}
                              </h4>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-sm text-amber-600">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  <span>
                                    {new Date(
                                      post.updatedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    post.status === "published"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {post.status === "published"
                                    ? "Published"
                                    : "Draft"}
                                </span>
                                {post.views && post.views > 0 && (
                                  <div className="flex items-center text-sm text-amber-600">
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    <span>{post.views} views</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                            <PencilIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="px-8 py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DocumentTextIcon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-amber-600 mb-6">
                    Start creating your first culinary masterpiece!
                  </p>
                  <Link
                    href="/dashboard/posts/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <PencilIcon className="mr-2 h-5 w-5" />
                    Create Your First Post
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <PencilIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    Quick Actions
                  </h3>
                  <p className="text-amber-600 text-sm">
                    Manage your content efficiently
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Link
                  href="/dashboard/posts/new"
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Create New Post
                </Link>
                <Link
                  href="/dashboard/about"
                  className="block w-full text-center py-3 px-4 bg-white text-amber-700 font-semibold rounded-xl border-2 border-amber-300 hover:bg-amber-50 transition-all duration-300"
                >
                  Update About Page
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    Analytics Overview
                  </h3>
                  <p className="text-amber-600 text-sm">
                    Track your blog's performance
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Total Views</span>
                  <span className="font-semibold text-amber-900">
                    {recentPosts.reduce(
                      (sum, post) => sum + (post.views || 0),
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Engagement Rate</span>
                  <span className="font-semibold text-amber-900">
                    {stats.totalPosts > 0
                      ? Math.round(
                          (stats.publishedPosts / stats.totalPosts) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="w-full text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  {showAnalytics
                    ? "Hide Detailed Analytics"
                    : "View Detailed Analytics"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
