import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  instrumentationHook: false,
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
