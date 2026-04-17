/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost',
      'supabase.co',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'vercel.app'
    ],
  },
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
