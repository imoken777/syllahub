/** @type {import('next').NextConfig} */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig = {
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-popover'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1年
  },
};

export default nextConfig;
