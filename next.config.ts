import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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

const withMDX = createMDX({
  // 可以在这里添加markdown插件
});

export default withMDX(nextConfig);
