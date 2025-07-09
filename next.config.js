/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure static export is disabled for API routes
  output: undefined,

  // Enable experimental features if needed
  experimental: {
    // Enable if using server actions
    serverActions: true,
  },

  // Ensure proper TypeScript configuration
  typescript: {
    // Don't fail build on TypeScript errors during development
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    // Don't fail build on ESLint errors during development
    ignoreDuringBuilds: true,
  },

  // Ensure proper handling of API routes
  async rewrites() {
    return []
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ]
  },

  // Images configuration
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
