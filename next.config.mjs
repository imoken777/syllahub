/** @type {import('next').NextConfig} */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig = {
  serverExternalPackages: ['@libsql/isomorphic-ws'],
};

export default nextConfig;
