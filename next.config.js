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
};

module.exports = nextConfig;
