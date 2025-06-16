
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { CloudRain, CloudLightning, Sun, CloudSun as DefaultIcon, Zap, Cloudy, Wind } from 'lucide-react'; // Added more variety

interface IconProps {
  className?: string;
}

const weatherIcons: ((props: IconProps) => ReactElement)[] = [
  (props) => <CloudRain {...props} />,
  (props) => <CloudLightning {...props} />,
  (props) => <Sun {...props} />,
  (props) => <Cloudy {...props} />,
  (props) => <Wind {...props} />,
  (props) => <Zap {...props} />, // Lightning bolt
  (props) => <DefaultIcon {...props} />, // CloudSun as a general one
];

export function Preloader() {
  const [CurrentWeatherIcon, setCurrentWeatherIcon] = useState<((props: IconProps) => ReactElement) | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * weatherIcons.length);
    setCurrentWeatherIcon(() => weatherIcons[randomIndex]); // Store the component function itself
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500 ease-in-out">
      {CurrentWeatherIcon ? (
        <CurrentWeatherIcon className="h-20 w-20 text-primary mb-6 animate-pulse" />
      ) : (
        // Fallback generic spinner if random icon isn't ready immediately (should be quick)
        <svg className="animate-spin h-16 w-16 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <p className="text-xl font-semibold">Loading Weather Weaver...</p>
      <p className="text-muted-foreground">Weaving the latest forecast for you.</p>
    </div>
  );
}
