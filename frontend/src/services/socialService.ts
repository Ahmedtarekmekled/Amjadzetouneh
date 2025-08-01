import axios from "axios";
import { API_URL } from "@/config/constants";

export interface Social {
  _id: string;
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export const socialService = {
  async getAllSocials(): Promise<Social[]> {
    const response = await axios.get(`${API_URL}/socials`);
    return response.data;
  },

  async createSocial(data: Omit<Social, "_id">): Promise<Social> {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/socials`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateSocial(id: string, data: Partial<Social>): Promise<Social> {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/socials/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteSocial(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/socials/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getSocialLinks() {
    try {
      const socials = await this.getAllSocials();
      return socials
        .filter(social => social.isActive)
        .map(({ platform, url, icon }) => ({
          platform,
          url,
          icon
        }));
    } catch (error) {
      console.error('Error fetching social links:', error);
      return [];
    }
  }
};
