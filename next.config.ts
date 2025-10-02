import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true, 
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
