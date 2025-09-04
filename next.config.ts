/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/swatroute' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/swatroute/' : '',
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts', 'leaflet', 'react-leaflet'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;