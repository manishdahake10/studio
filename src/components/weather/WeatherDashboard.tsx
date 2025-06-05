
"use client";

import { useState, useEffect, useCallback } from 'react';
import { CitySearch } from './CitySearch';
import { CurrentWeather } from './CurrentWeather';
import { ForecastDisplay } from './ForecastDisplay';
import { ForecastCharts } from './ForecastCharts';
import { AirQualityModule } from './AirQualityModule'; // New import
import { fetchWeatherData } from '@/lib/weather-api';
import type { WeatherAPIResponse } from '@/types/weather';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Wind } from "lucide-react";
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
    setIsLoading(false); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const loadWeatherData = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    setWeatherData(null); 
    try {
      const data = await fetchWeatherData(cityName);
      setWeatherData(data);
      setCity(data.location.name); 
      localStorage.setItem(LAST_CITY_KEY, data.location.name);
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: "Error Fetching Data",
        description: err.message || 'Could not fetch weather or air quality data. Please try another city or check your API keys.',
        variant: "destructive",
      });
      setWeatherData(null); 
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSearch = (searchedCity: string) => {
    if (searchedCity.trim() === "") return;
    loadWeatherData(searchedCity);
  };
  
  const WeatherSkeleton = () => (
    <div className="space-y-6">
      <CardSkeleton />
      <ForecastSkeleton />
      <ChartsSkeleton /> 
      <AirQualitySkeleton />
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

  const ChartsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="p-6 border rounded-lg shadow-sm">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-[250px] w-full" />
      </div>
      <div className="p-6 border rounded-lg shadow-sm">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    </div>
  );

  const AirQualitySkeleton = () => (
    <div className="mt-6 p-6 border rounded-lg shadow-sm">
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-6 w-1/4 mb-4" />
      <div className="flex mb-4">
        <Skeleton className="h-10 w-1/2 mr-1" />
        <Skeleton className="h-10 w-1/2 ml-1" />
      </div>
      <Skeleton className="h-[200px] w-full mb-4" />
      <Skeleton className="h-5 w-1/2 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
  

  const isWeatherApiKeyMissing = !process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const isAirPollutionApiKeyMissing = !process.env.NEXT_PUBLIC_AIR_POLLUTION_API_KEY;

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <CitySearch onSearch={handleSearch} initialCity={city} isLoading={isLoading} />
      
      {isWeatherApiKeyMissing && (
        <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Weather API Key Missing</AlertTitle>
          <AlertDescription>
            The OpenWeatherMap API key for weather (NEXT_PUBLIC_WEATHER_API_KEY) is not configured. Please set it in your .env file. Weather data will not be available.
          </AlertDescription>
        </Alert>
      )}
      {isAirPollutionApiKeyMissing && (
         <Alert variant="destructive" className="my-4">
          <Wind className="h-4 w-4" />
          <AlertTitle>Air Pollution API Key Missing</AlertTitle>
          <AlertDescription>
            The OpenWeatherMap API key for air pollution (NEXT_PUBLIC_AIR_POLLUTION_API_KEY) is not configured. Please set it in your .env file. Air quality data will not be available.
          </AlertDescription>
        </Alert>
      )}


      {error && (
         <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && city && <WeatherSkeleton />}
      
      {!isLoading && weatherData && (
        <div className="space-y-6">
          <CurrentWeather data={weatherData} />
          <ForecastDisplay forecastDays={weatherData.forecast?.forecastday} />
          <ForecastCharts forecastDays={weatherData.forecast?.forecastday} />
          <AirQualityModule 
            currentAirPollution={weatherData.airPollution} 
            forecastAirPollution={weatherData.airPollutionForecast}
            timezoneOffset={weatherData.location.localtime_epoch - Math.floor(Date.now()/1000) + weatherData.location.tz_id.startsWith('Etc/GMT+') ? -parseInt(weatherData.location.tz_id.split('+')[1])*3600 : (weatherData.location.tz_id.startsWith('Etc/GMT-') ? parseInt(weatherData.location.tz_id.split('-')[1])*3600 : 0)}
          />
        </div>
      )}
       {!isLoading && !weatherData && !error && !city && ( 
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Enter a city to get started.</p>
        </div>
      )}
    </div>
  );
}
