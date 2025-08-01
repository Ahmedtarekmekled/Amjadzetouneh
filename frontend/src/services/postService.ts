import axios from "axios";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { API_URL } from "@/config/constants";

const getAuthHeaders = () => {
  // Check if we're on the client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    // Clear invalid token and redirect to login
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }
  throw error;
};

const postService = {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await axios.get(`${API_URL}/posts/admin/all`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const response = await axios.get(`${API_URL}/posts/featured`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      return [];
    }
  },

  async getPostById(id: string): Promise<BlogPost> {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Post not found");
      }
      handleAuthError(error);
      throw error;
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await axios.get(`${API_URL}/posts/slug/${slug}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      return null;
    }
  },

  // Public version for blog viewing - no authentication required
  async getPublicPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await axios.get(`${API_URL}/posts/public/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public post with slug ${slug}:`, error);
      return null;
    }
  },

  async createPost(data: BlogPostFormData): Promise<BlogPost> {
    try {
      const response = await axios.post(`${API_URL}/posts`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      handleAuthError(error);
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to create post");
      }
      throw error;
    }
  },

  async updatePost(id: string, data: BlogPostFormData): Promise<BlogPost> {
    try {
      const response = await axios.put(`${API_URL}/posts/${id}`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      handleAuthError(error);
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to update post");
      }
      throw error;
    }
  },

  async deletePost(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error: any) {
      handleAuthError(error);
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to delete post");
      }
      throw error;
    }
  },

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const response = await axios.get(
        `${API_URL}/posts/category/${category}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      return [];
    }
  },

  // Public version for blog listing - no authentication required
  async getPublicPosts(): Promise<BlogPost[]> {
    try {
      const response = await axios.get(`${API_URL}/posts/public`);
      return response.data;
    } catch (error) {
      console.error("Error fetching public posts:", error);
      return [];
    }
  },

  // Public version for category filtering - no authentication required
  async getPublicPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const response = await axios.get(
        `${API_URL}/posts/public/category/${category}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching public posts by category:", error);
      return [];
    }
  },
};

export { postService };
