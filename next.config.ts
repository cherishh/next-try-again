import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  instrumentationHook: false,
  experimental: {
    useCache: true,
    // viewTransition: true,
    // dynamicIO: true,
    // ppr: 'incremental',
  },
};

export default nextConfig;
