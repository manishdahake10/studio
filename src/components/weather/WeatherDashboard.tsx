"use client";

import { useState, useEffect, useCallback } from 'react';
import { CitySearch } from './CitySearch';
import { CurrentWeather } from './CurrentWeather';
import { ForecastDisplay } from './ForecastDisplay';
import { WeatherSummary } from './WeatherSummary';
import { fetchWeatherData } from '@/lib/weather-api';
import type { WeatherAPIResponse } from '@/types/weather';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_CITY = 'London';
const LAST_CITY_KEY = 'weatherweaver_last_city';

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherAPIResponse | null>(null);
  const [city, setCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const lastSearchedCity = localStorage.getItem(LAST_CITY_KEY) || DEFAULT_CITY;
    setCity(lastSearchedCity);
    loadWeatherData(lastSearchedCity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load initial data on mount

  const loadWeatherData = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(cityName);
      setWeatherData(data);
      setCity(data.location.name); // Update city name from API response
      localStorage.setItem(LAST_CITY_KEY, data.location.name);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: "Error fetching weather",
        description: err.message || 'Could not fetch weather data. Please try another city or check your API key.',
        variant: "destructive",
      });
      setWeatherData(null); // Clear old data on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSearch = (searchedCity: string) => {
    loadWeatherData(searchedCity);
  };
  
  const WeatherSkeleton = () => (
    <div className="space-y-6">
      <CardSkeleton />
      <ForecastSkeleton />
      <SummarySkeleton />
    </div>
  );

  const CardSkeleton = () => (
    <div className="p-6 border rounded-lg shadow-sm">
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Skeleton className="h-20 w-20 rounded-full mr-4" />
          <div>
            <Skeleton className="h-12 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm w-full sm:w-auto">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-5 w-32" />)}
        </div>
      </div>
    </div>
  );

  const ForecastSkeleton = () => (
    <div className="mt-6">
      <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm flex flex-col items-center">
            <Skeleton className="h-5 w-16 mb-2" />
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-12 w-12 rounded-md mb-2" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
  
  const SummarySkeleton = () => (
    <div className="mt-6 p-6 border rounded-lg shadow-sm">
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-10 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <CitySearch onSearch={handleSearch} initialCity={city} isLoading={isLoading} />
      
      {error && !process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
        <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>API Key Missing</AlertTitle>
          <AlertDescription>
            The WeatherAPI key is not configured. Please set the NEXT_PUBLIC_WEATHER_API_KEY environment variable in your .env.local file.
          </AlertDescription>
        </Alert>
      )}

      {error && process.env.NEXT_PUBLIC_WEATHER_API_KEY &&(
         <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && <WeatherSkeleton />}
      
      {!isLoading && weatherData && (
        <div className="space-y-6">
          <CurrentWeather data={weatherData} />
          <ForecastDisplay forecastDays={weatherData.forecast?.forecastday} />
          <WeatherSummary weatherData={weatherData} />
        </div>
      )}
    </div>
  );
}
