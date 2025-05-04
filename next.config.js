/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'supabase.co',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'vercel.app'
    ],
  },
  // Server Actions are available by default in Next.js 14+
  
  // Performance Optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  experimental: {
    optimizeCss: true, // Optimize CSS for production
    scrollRestoration: true, // Improve scrolling performance
  },
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // Cache optimization
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
