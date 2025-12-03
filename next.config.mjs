/** @type {import('next').NextConfig} */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig = {
  serverExternalPackages: ['@libsql/isomorphic-ws'],
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1年
  },
};

export default nextConfig;
