/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/swatroute',
  assetPrefix: '/swatroute/',
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['recharts', 'leaflet', 'react-leaflet'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;