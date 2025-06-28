import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'pub-ce42191b7e6f487fa1077cb938dc35a3.r2.dev',
      },
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },
  instrumentationHook: false,
  experimental: {
    useCache: true,
    // viewTransition: true,
    // dynamicIO: true,
    // ppr: 'incremental',
  },
};

export default nextConfig;
