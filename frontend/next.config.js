/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["localhost", "amjadzetouneh.onrender.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "amjadzetouneh.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Fix asset paths for static export
  assetPrefix: "",
  basePath: "",
  // Disable image optimization for static export
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
