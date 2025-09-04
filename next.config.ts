/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts', 'leaflet', 'react-leaflet'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;