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
    HERO: "/images/hero-bg.jpg",
    DEFAULT_HERO: "/images/default-hero.jpg",
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
  HERO_BG: IMAGE_URLS.getFullUrl(IMAGE_URLS.BACKGROUND.HERO),
  DEFAULT_HERO: IMAGE_URLS.getFullUrl(IMAGE_URLS.BACKGROUND.DEFAULT_HERO),
  FAVICON_ICO: IMAGE_URLS.getFullUrl(IMAGE_URLS.FAVICON.ICO),
  FAVICON_PNG: IMAGE_URLS.getFullUrl(IMAGE_URLS.FAVICON.PNG),
};
