
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
      { // For CartoDB Dark Matter tiles
        protocol: 'https',
        hostname: 'a.basemaps.cartocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'b.basemaps.cartocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'c.basemaps.cartocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'd.basemaps.cartocdn.com',
      },
      // NewsAPI/GNews image sources
      {
        protocol: 'https',
        hostname: 'www.theweek.in',
        port: '',
        pathname: '/**',
      },
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
