"use client";

import { useState, useEffect } from 'react';
import type { WeatherAPIResponse } from '@/types/weather';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { generateWeatherSummary, type GenerateWeatherSummaryInput } from '@/ai/flows/generate-weather-summary';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherSummaryProps {
  weatherData: WeatherAPIResponse | null;
}

export function WeatherSummary({ weatherData }: WeatherSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // This ensures dayOfWeek is only set on the client after hydration
    setDayOfWeek(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  }, []);

  const handleGenerateSummary = async () => {
    if (!weatherData || !dayOfWeek) return;

    setIsLoading(true);
    setSummary(null);

    const input: GenerateWeatherSummaryInput = {
      city: weatherData.location.name,
      temperature: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.wind_kph,
      precipitation: weatherData.current.condition.text,
      dayOfWeek: dayOfWeek,
    };

    try {
      const result = await generateWeatherSummary(input);
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to generate weather summary:", error);
      toast({
        title: "Error",
        description: "Could not generate weather summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!weatherData) return null;

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Sparkles size={24} className="mr-2 text-primary" />
          AI Weather Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGenerateSummary} disabled={isLoading || !dayOfWeek} className="mb-4">
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </Button>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {summary && !isLoading && <p className="text-sm leading-relaxed">{summary}</p>}
      </CardContent>
    </Card>
  );
}
