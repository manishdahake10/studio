
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
        hostname: 'openweathermap.org', // Added for OpenWeatherMap icons
        port: '',
        pathname: '/img/wn/**',
      }
    ],
  },
};

export default nextConfig;
