
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com', // Kept in case of future switch
        port: '',
        pathname: '/weather/64x64/**',
      },
      { 
        protocol: 'https',
        hostname: 'openweathermap.org', 
        port: '',
        pathname: '/img/wn/**',
      },
      {
        protocol: 'https',
        hostname: 'tile.openweathermap.org', // For map tiles
        port: '',
        pathname: '/map/**',
      },
      // Add NewsAPI image sources if needed - common ones:
      {
        protocol: 'https',
        hostname: '**.com', // General pattern, might need to be more specific
      },
      {
        protocol: 'https',
        hostname: '**.org',
      },
      {
        protocol: 'https',
        hostname: '**.net',
      }
    ],
  },
};

export default nextConfig;
