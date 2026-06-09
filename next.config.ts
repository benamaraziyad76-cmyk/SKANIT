import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'public/**',
        'node_modules/sharp/**',
        'node_modules/three/**',
        'node_modules/@google/model-viewer/**'
      ],
    },
  },
};

export default nextConfig;
