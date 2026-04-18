import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/core'],
};

export default nextConfig;
