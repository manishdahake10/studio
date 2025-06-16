
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
        hostname: 'cdn.weatherapi.com', 
        port: '',
        pathname: '/weather/64x64/**',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
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
