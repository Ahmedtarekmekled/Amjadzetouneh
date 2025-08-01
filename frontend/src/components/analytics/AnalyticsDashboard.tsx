import { useState, useEffect } from "react";

interface AnalyticsDashboardProps {
  className?: string;
}

// Simple analytics data interface
interface SimpleAnalyticsData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  averageViewsPerPost: number;
  engagementRate: number;
  recentViews: {
    date: string;
    views: number;
  }[];
  topPosts: {
    _id: string;
    title: string;
    views: number;
    slug: string;
  }[];
  monthlyStats: {
    month: string;
    posts: number;
    views: number;
  }[];
  categoryStats: {
    category: string;
    count: number;
    views: number;
  }[];
}

export default function AnalyticsDashboard({
  className = "",
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<SimpleAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Use simple default analytics data
      const defaultData: SimpleAnalyticsData = {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        averageViewsPerPost: 0,
        engagementRate: 0,
        recentViews: [],
        topPosts: [],
        monthlyStats: [],
        categoryStats: [],
      };

      setAnalytics(defaultData);
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Set empty analytics data as fallback
      setAnalytics({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        averageViewsPerPost: 0,
        engagementRate: 0,
        recentViews: [],
        topPosts: [],
        monthlyStats: [],
        categoryStats: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200"
            >
              <div className="h-4 bg-amber-200 rounded mb-2"></div>
              <div className="h-8 bg-amber-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-12 h-12 bg-amber-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-bold">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          No Analytics Data
        </h3>
        <p className="text-amber-600">
          Start creating posts to see your analytics
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">
            Analytics Dashboard
          </h2>
          <p className="text-amber-600">
            Track your blog's performance and growth
          </p>
        </div>
        <div className="flex space-x-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                  : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                Total Views
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {formatNumber(analytics.totalViews)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-1">↗</span>
                <span className="text-sm text-green-600">
                  +12% from last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl">👁️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                Published Posts
              </p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {analytics.publishedPosts}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-1">↗</span>
                <span className="text-sm text-green-600">
                  +5% from last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">
                Avg Views/Post
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {formatNumber(analytics.averageViewsPerPost)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-1">↗</span>
                <span className="text-sm text-green-600">
                  +8% from last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">
                Engagement Rate
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {analytics.engagementRate}%
              </p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-1">↗</span>
                <span className="text-sm text-green-600">
                  +3% from last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-orange-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Views Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-amber-900">
              Recent Views
            </h3>
            <span className="text-amber-600 text-xl">📅</span>
          </div>
          <div className="space-y-4">
            {analytics.recentViews && analytics.recentViews.length > 0 ? (
              analytics.recentViews.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-amber-700">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-amber-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((day.views / 50) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-amber-900 w-12 text-right">
                      {day.views}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-amber-600">No recent view data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-amber-900">
              Top Performing Posts
            </h3>
            <span className="text-amber-600 text-xl">📈</span>
          </div>
          <div className="space-y-4">
            {analytics.topPosts && analytics.topPosts.length > 0 ? (
              analytics.topPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-amber-900 truncate">
                        {post.title}
                      </h4>
                      <p className="text-xs text-amber-600">
                        {formatNumber(post.views)} views
                      </p>
                    </div>
                  </div>
                  <span className="text-amber-600 text-sm font-medium">
                    View →
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-amber-600">No posts data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-amber-900">
            Category Performance
          </h3>
          <span className="text-amber-600 text-xl">🏷️</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.categoryStats && analytics.categoryStats.length > 0 ? (
            analytics.categoryStats.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-amber-900">
                    {category.category}
                  </h4>
                  <span className="text-sm text-amber-600">
                    {category.count} posts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-800">
                    {formatNumber(category.views)}
                  </span>
                  <span className="text-sm text-amber-600">views</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-amber-600">No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-amber-900">
            Monthly Trends
          </h3>
          <span className="text-amber-600 text-xl">📊</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.monthlyStats && analytics.monthlyStats.length > 0 ? (
            analytics.monthlyStats.map((month, index) => (
              <div key={index} className="text-center">
                <h4 className="font-semibold text-amber-900 mb-2">
                  {month.month}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">Posts:</span>
                    <span className="font-semibold text-amber-900">
                      {month.posts}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">Views:</span>
                    <span className="font-semibold text-amber-900">
                      {formatNumber(month.views)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-amber-600">No monthly trends data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
