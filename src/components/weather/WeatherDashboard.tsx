
"use client";

import { useState, useEffect, useCallback } from 'react';
import { CitySearch } from './CitySearch';
import { CurrentWeather } from './CurrentWeather';
import { ForecastDisplay } from './ForecastDisplay';
import { ForecastCharts } from './ForecastCharts';
import { AirQualityModule } from './AirQualityModule';
import { WeatherNews } from './WeatherNews'; // Added import
import { fetchWeatherData } from '@/lib/weather-api';
import { fetchWeatherNews } from '@/lib/news-api';
import type { WeatherAPIResponse } from '@/types/weather';
import type { NewsArticle } from '@/types/news';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Wind, Newspaper, Info } from "lucide-react"; // Removed Camera
import { Skeleton } from "@/components/ui/skeleton";

const LAST_CITY_KEY = 'weatherweaver_last_city';

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherAPIResponse | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[] | null>(null);
  const [city, setCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load last searched city from localStorage only on initial mount
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastCity) {
      setCity(lastCity);
    }
  }, []);


  useEffect(() => {
    if (city && (!weatherData || weatherData.location.name.toLowerCase() !== city.toLowerCase())) {
      loadInitialData(city);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const loadInitialData = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setIsNewsLoading(true);
    setError(null);
    
    try {
      const weatherPromise = fetchWeatherData(cityName);
      const newsPromise = fetchWeatherNews(cityName);

      const [weatherResult, newsResult] = await Promise.allSettled([
        weatherPromise,
        newsPromise
      ]);

      if (weatherResult.status === 'fulfilled') {
        setWeatherData(weatherResult.value);
        localStorage.setItem(LAST_CITY_KEY, weatherResult.value.location.name);
      } else {
        setError(weatherResult.reason?.message || 'Failed to fetch weather data.');
        toast({
          title: "Error Fetching Weather",
          description: weatherResult.reason?.message || 'Could not fetch weather data.',
          variant: "destructive",
        });
        setWeatherData(null);
      }

      if (newsResult.status === 'fulfilled') {
        setNewsArticles(newsResult.value);
      } else {
        const newsErrorMessage = newsResult.reason?.message || "Could not fetch the latest weather news articles.";
        console.error("Failed to fetch news:", newsResult.reason);
        toast({
          title: "News Update Unavailable",
          description: newsErrorMessage,
          variant: newsErrorMessage.toLowerCase().includes("api key") ? "destructive" : "default",
        });
        setNewsArticles(null);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during data loading.');
      toast({
        title: "Error Loading Data",
        description: err.message || 'An unexpected error occurred.',
        variant: "destructive",
      });
      setWeatherData(null);
      setNewsArticles(null);
    } finally {
      setIsLoading(false);
      setIsNewsLoading(false);
    }
  }, [toast]);

  const handleSearch = (searchedCity: string) => {
    if (searchedCity.trim() === "") return;
    setCity(searchedCity.trim());
  };
  
  const NewsSectionSkeleton = () => (
    <div className="shadow-lg border rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Newspaper size={22} className="mr-2 text-primary" />
        <Skeleton className="h-7 w-1/3" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-6" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
            <Skeleton className="w-full sm:w-1/3 md:w-1/4 h-32 sm:h-auto aspect-video rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 bg-muted" />
              <Skeleton className="h-3 w-1/2 mb-1 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
              <Skeleton className="h-8 w-24 mt-2 bg-muted" />
            </div>
          </div>
        ))}
      </div>
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

  const CombinedSkeleton = () => (
    <div className="space-y-6">
      <NewsSectionSkeleton />
      <CardSkeleton />
      <ForecastSkeleton />
      <ChartsSkeleton />
      <AirQualitySkeleton />
    </div>
  );
  
  const isWeatherApiKeyMissing = !process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const isAirPollutionApiKeyMissing = !process.env.NEXT_PUBLIC_AIR_POLLUTION_API_KEY;
  const isNewsApiKeyMissing = !process.env.NEXT_PUBLIC_NEWS_API_KEY;

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <CitySearch onSearch={handleSearch} initialCity={city} isLoading={(isLoading || isNewsLoading)} />
      
      {isWeatherApiKeyMissing && (
        <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Weather API Key Missing</AlertTitle>
          <AlertDescription>
            The OpenWeatherMap API key for weather (NEXT_PUBLIC_WEATHER_API_KEY) is not configured. Weather data will not be available.
          </AlertDescription>
        </Alert>
      )}
      {isAirPollutionApiKeyMissing && (
         <Alert variant="destructive" className="my-4">
          <Wind className="h-4 w-4" />
          <AlertTitle>Air Pollution API Key Missing</AlertTitle>
          <AlertDescription>
            The OpenWeatherMap API key for air pollution (NEXT_PUBLIC_AIR_POLLUTION_API_KEY) is not configured. Air quality data will not be available.
          </AlertDescription>
        </Alert>
      )}
      {isNewsApiKeyMissing && ( 
         <Alert variant="destructive" className="my-4">
          <Newspaper className="h-4 w-4" />
          <AlertTitle>News API Key Missing</AlertTitle>
          <AlertDescription>
            The News API key (NEXT_PUBLIC_NEWS_API_KEY) is not configured. News articles will not be available.
          </AlertDescription>
        </Alert>
      )}

      {error && !isLoading && ( 
         <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(isLoading || isNewsLoading) && city && <CombinedSkeleton />} 
      
      {!isLoading && !isNewsLoading && (weatherData || newsArticles) && (
        <div className="space-y-6">
            <WeatherNews newsArticles={newsArticles} cityName={weatherData?.location.name} />
          {weatherData && ( 
            <>
              <CurrentWeather data={weatherData} />
              <ForecastDisplay forecastDays={weatherData.forecast?.forecastday} />
              <ForecastCharts forecastDays={weatherData.forecast?.forecastday} />
              <AirQualityModule 
                currentAirPollution={weatherData.airPollution} 
                forecastAirPollution={weatherData.airPollutionForecast}
                timezoneOffset={weatherData.location.localtime_epoch - Math.floor(Date.now()/1000) + (weatherData.location.tz_id.startsWith('Etc/GMT+') ? -parseInt(weatherData.location.tz_id.split('+')[1])*3600 : (weatherData.location.tz_id.startsWith('Etc/GMT-') ? parseInt(weatherData.location.tz_id.split('-')[1])*3600 : 0))}
              />
            </>
          )}
        </div>
      )}
       {!city && !isLoading && !error && (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Enter a city to get started.</p>
          <Info size={48} className="mx-auto mt-4 text-muted-foreground/50" />
        </div>
      )}
       {city && !isLoading && !weatherData && !error && (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No weather data to display for {city}. Try another search.</p>
          {!isNewsLoading && (!newsArticles || newsArticles.length === 0) && <p className="text-md text-muted-foreground mt-2">Weather-related news for {city} could also not be found.</p>}
        </div>
      )}
    </div>
  );
}
