
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
        // Fallback removed, if CurrentWeatherIcon is null for a brief moment, nothing will show for the icon.
        // This is generally okay as it should be set very quickly.
        <div className="h-20 w-20 mb-6"></div> // Placeholder to maintain layout briefly if needed
      )}
      <p className="text-xl font-semibold">Loading Weather Weaver...</p>
      <p className="text-muted-foreground">Weaving the latest forecast for you.</p>
    </div>
  );
}

