/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Configure webpack for path aliases
  webpack: (config, { isServer }) => {
    // Add path resolution for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/'),
      '@/lib': path.resolve(__dirname, 'src/lib/')
    };
    
    // Explicitly add src directory to module directories
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules',
      ...config.resolve.modules || []
    ];
    
    return config;
  }
}

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = nextConfig;
