export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Image URLs - Use full URLs for better compatibility
export const IMAGE_URLS = {
  // Base URL for images
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5000",

  // Logo images
  LOGO: {
    PNG: "/images/logo.png",
    SVG: "/images/logo.svg",
    DEFAULT: "/images/default-logo.png",
  },

  // Background images
  BACKGROUND: {
    HERO: "https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg",
    DEFAULT_HERO: "https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg",
    FOOD_1: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    FOOD_2: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
    FOOD_3: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
    COOKING: "https://images.pexels.com/photos/1267323/pexels-photo-1267323.jpeg",
  },

  // Favicon
  FAVICON: {
    ICO: "/favicon.ico",
    PNG: "/images/default-favicon.png",
  },

  // Get full URL for any image path
  getFullUrl: (path: string) => {
    const baseUrl = IMAGE_URLS.BASE_URL;
    return `${baseUrl}${path}`;
  },
};

// Common image URLs as full URLs
export const FULL_IMAGE_URLS = {
  BASE_URL: IMAGE_URLS.BASE_URL,
  LOGO_PNG: IMAGE_URLS.getFullUrl(IMAGE_URLS.LOGO.PNG),
  LOGO_SVG: IMAGE_URLS.getFullUrl(IMAGE_URLS.LOGO.SVG),
  HERO_BG: IMAGE_URLS.BACKGROUND.HERO,
  DEFAULT_HERO: IMAGE_URLS.BACKGROUND.DEFAULT_HERO,
  FOOD_1: IMAGE_URLS.BACKGROUND.FOOD_1,
  FOOD_2: IMAGE_URLS.BACKGROUND.FOOD_2,
  FOOD_3: IMAGE_URLS.BACKGROUND.FOOD_3,
  COOKING: IMAGE_URLS.BACKGROUND.COOKING,
  FAVICON_ICO: IMAGE_URLS.getFullUrl(IMAGE_URLS.FAVICON.ICO),
  FAVICON_PNG: IMAGE_URLS.getFullUrl(IMAGE_URLS.FAVICON.PNG),
};
