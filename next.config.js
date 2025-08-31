/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
