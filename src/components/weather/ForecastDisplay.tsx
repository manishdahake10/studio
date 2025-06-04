import type { ForecastDay } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Thermometer } from 'lucide-react';

interface ForecastDisplayProps {
  forecastDays: ForecastDay[] | undefined;
}

export function ForecastDisplay({ forecastDays }: ForecastDisplayProps) {
  if (!forecastDays || forecastDays.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-headline font-semibold mb-4 text-center">7-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {forecastDays.map((dayData) => (
          <Card key={dayData.date_epoch} className="flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">
                {new Date(dayData.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {new Date(dayData.date_epoch * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center flex-grow justify-center p-3 pt-0">
              {dayData.day.condition.icon && (
                <Image
                  src={`https:${dayData.day.condition.icon}`}
                  alt={dayData.day.condition.text}
                  width={48}
                  height={48}
                  data-ai-hint="weather condition"
                />
              )}
              <p className="text-sm mt-1 mb-2 truncate w-full px-1" title={dayData.day.condition.text}>{dayData.day.condition.text}</p>
              <div className="flex items-center text-sm">
                <Thermometer size={16} className="mr-1 text-primary" />
                <span>{Math.round(dayData.day.mintemp_c)}° / {Math.round(dayData.day.maxtemp_c)}°C</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
