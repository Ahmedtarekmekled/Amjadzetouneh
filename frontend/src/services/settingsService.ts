import axios from "axios";
import { API_URL } from "@/config/constants";

export interface Settings {
  theme: {
    mode: "light" | "dark" | "system";
    colors: {
      light: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
      };
      dark: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
      };
    };
  };
  branding: {
    logo: string;
    favicon: string;
    hero: {
      backgroundImage: string;
      en: {
        title: string;
        subtitle: string;
        ctaText: string;
      };
      ar: {
        title: string;
        subtitle: string;
        ctaText: string;
      };
    };
  };
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  language: {
    enableArabic: boolean;
    default: "en" | "ar";
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    en: {
      metaTitle: string;
      metaDescription: string;
    };
    ar: {
      metaTitle: string;
      metaDescription: string;
    };
    analytics: {
      googleAnalyticsId: string;
      facebookPixelId: string;
    };
  };
}

export const settingsService = {
  getAllSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      // Return default settings if fetch fails
      return {
        siteTitle: "Culinary Tales",
        siteDescription: "Discover delicious recipes and culinary insights.",
        seo: {
          metaTitle: "Culinary Tales - Food Blog",
          metaDescription:
            "Explore our collection of recipes and culinary stories.",
        },
        branding: {
          hero: {
            title: "Welcome to Culinary Tales",
            description: "Discover amazing recipes",
            backgroundImage: "/images/default-hero.jpg",
          },
        },
      };
    }
  },

  async updateSettings(settings: Partial<Settings>) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }
    const response = await axios.put(`${API_URL}/settings`, settings, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getSettings(): Promise<Settings> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }
    const response = await axios.get(`${API_URL}/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async exportSettings(): Promise<Settings> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }
    const response = await axios.get(`${API_URL}/settings/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async importSettings(settings: Settings): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }
    await axios.post(`${API_URL}/settings/import`, settings, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async resetSettings(): Promise<Settings> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }
    const response = await axios.post(
      `${API_URL}/settings/reset`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
