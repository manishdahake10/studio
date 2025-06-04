import type { WeatherAPIResponse } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Thermometer, Droplets, Wind, Eye, CalendarDays } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherAPIResponse | null;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  if (!data) return null;

  const { location, current } = data;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-headline">{location.name}, {location.country}</CardTitle>
        <CardDescription className="flex items-center">
          <CalendarDays size={16} className="mr-1" />
          Last updated: {new Date(current.last_updated_epoch * 1000).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            {current.condition.icon && (
              <Image 
                src={current.condition.icon} 
                alt={current.condition.text} 
                width={80} 
                height={80}
                className="mr-4" 
                data-ai-hint="weather icon"
              />
            )}
            <div>
              <p className="text-5xl font-bold">{current.temp_c}°C</p>
              <p className="text-muted-foreground">{current.condition.text}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center">
              <Thermometer size={20} className="mr-2 text-primary" />
              <span>Feels like: {current.feelslike_c}°C</span>
            </div>
            <div className="flex items-center">
              <Droplets size={20} className="mr-2 text-primary" />
              <span>Humidity: {current.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind size={20} className="mr-2 text-primary" />
              <span>Wind: {current.wind_kph} km/h</span>
            </div>
            <div className="flex items-center">
              <Eye size={20} className="mr-2 text-primary" />
              <span>Visibility: {current.vis_km} km</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
