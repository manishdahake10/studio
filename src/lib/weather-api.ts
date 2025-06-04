import type { WeatherAPIResponse } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function fetchWeatherData(city: string): Promise<WeatherAPIResponse> {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured.');
  }

  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`
  );

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || 'City not found or invalid request.');
    }
    throw new Error('Failed to fetch weather data.');
  }

  return response.json() as Promise<WeatherAPIResponse>;
}
