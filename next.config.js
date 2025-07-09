/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output as it can cause issues with Vercel
  // Vercel handles this automatically

  experimental: {
    // Enable server actions if needed
    serverActions: true,
  },

  // Don't fail build on type/lint errors during development
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },

  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "development",
  },

  // Basic image optimization
  images: {
    unoptimized: false,
  },
}

module.exports = nextConfig
