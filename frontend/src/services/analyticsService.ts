import axios from "axios";
import { API_URL } from "@/config/constants";

export interface AnalyticsData {
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

export interface ViewData {
  postId: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

export const analyticsService = {
  // Track a view for a specific post
  async trackView(postId: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Skip tracking for non-authenticated users
        return;
      }

      await axios.post(
        `${API_URL}/analytics/track-view`,
        {
          postId,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  },

  // Get comprehensive analytics data
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      // Return default data if analytics endpoint doesn't exist yet
      return {
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
    }
  },

  // Get analytics for a specific post
  async getPostAnalytics(postId: string): Promise<any> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/analytics/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching post analytics:", error);
      return null;
    }
  },

  // Get recent activity
  async getRecentActivity(): Promise<any[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/analytics/recent-activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  },

  // Calculate analytics from posts data (fallback method)
  calculateAnalyticsFromPosts(posts: any[]): AnalyticsData {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(
      (post) => post.status === "published"
    ).length;
    const draftPosts = posts.filter((post) => post.status === "draft").length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const averageViewsPerPost =
      totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;
    const engagementRate =
      totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

    // Get top posts by views
    const topPosts = posts
      .filter((post) => post.views > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((post) => ({
        _id: post._id,
        title:
          post.title?.en ||
          post.title?.ar ||
          post.content?.en?.title ||
          "Untitled",
        views: post.views || 0,
        slug: post.slug,
      }));

    // Generate monthly stats (last 6 months)
    const monthlyStats = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      // Count posts created in this month
      const postsInMonth = posts.filter((post) => {
        const postDate = new Date(post.createdAt);
        return (
          postDate.getMonth() === date.getMonth() &&
          postDate.getFullYear() === date.getFullYear()
        );
      }).length;

      // Sum views for posts in this month
      const viewsInMonth = posts
        .filter((post) => {
          const postDate = new Date(post.createdAt);
          return (
            postDate.getMonth() === date.getMonth() &&
            postDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, post) => sum + (post.views || 0), 0);

      monthlyStats.push({
        month: monthName,
        posts: postsInMonth,
        views: viewsInMonth,
      });
    }

    // Generate category stats
    const categoryMap = new Map();
    posts.forEach((post) => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach((category: string) => {
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { count: 0, views: 0 });
          }
          categoryMap.get(category).count++;
          categoryMap.get(category).views += post.views || 0;
        });
      }
    });

    const categoryStats = Array.from(categoryMap.entries()).map(
      ([category, data]: [string, any]) => ({
        category,
        count: data.count,
        views: data.views,
      })
    );

    // Generate recent views (last 7 days)
    const recentViews = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // This is a simplified calculation - in a real app, you'd track daily views
      const dailyViews = Math.floor(Math.random() * 50) + 10; // Placeholder

      recentViews.push({
        date: dateStr,
        views: dailyViews,
      });
    }

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      averageViewsPerPost,
      engagementRate,
      recentViews,
      topPosts,
      monthlyStats,
      categoryStats,
    };
  },
};
