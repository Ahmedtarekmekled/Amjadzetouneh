import axios from "axios";
import { API_URL } from "@/config/constants";

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface ContentLanguage {
  description: string;
  experience: string;
  skills: string[];
  education: Education[];
}

interface Content {
  en: ContentLanguage;
  ar: ContentLanguage;
}

export interface AboutData {
  content: {
    en: {
      description: string;
      experience: string;
      skills: string[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
    };
    ar: {
      description: string;
      experience: string;
      skills: string[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
    };
  };
  profileImage?: string;
  cvFile?: string;
  showCV: boolean;
}

export const aboutService = {
  async getAbout(): Promise<AboutData> {
    try {
      const response = await axios.get(`${API_URL}/about`);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Cannot connect to server. Please make sure the backend is running."
        );
      }
      throw error;
    }
  },

  async updateAbout(data: AboutData): Promise<AboutData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(`${API_URL}/about`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Cannot connect to server. Please make sure the backend is running."
        );
      }
      throw error;
    }
  },

  async deleteProfileImage(): Promise<AboutData> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.delete(`${API_URL}/about/profile-image`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async deleteCv(): Promise<AboutData> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.delete(`${API_URL}/about/cv`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async deleteFile(type: "image" | "cv"): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    await axios.delete(`${API_URL}/upload/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
