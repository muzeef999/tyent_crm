import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    serverActions: { allowedOrigins: ['*']} 
  },
  env: {
    BULKLY_API_URL: process.env.BULKLY_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tyent.co.in',
      },
      {
        protocol: 'https',
        hostname: 'live.bulkly.io',
        port: '',
        pathname: '/**',
      },
    ]
  }
};

export default nextConfig;
