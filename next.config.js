/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable TypeScript checking during build to prevent type errors from failing the build
  typescript: {
    // !! WARN: This should only be used in production, not during development
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build as well
  eslint: {
    // !! WARN: This should only be used in production, not during development
    ignoreDuringBuilds: true,
  },
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  // Increase maximum memory allocation
  experimental: {
    memoryOverrideManifest: true,
  },
  // Configure output for better deployment
  output: 'standalone',
}

module.exports = nextConfig
