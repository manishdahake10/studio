
import type { WeatherAPIResponse } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function fetchWeatherData(city: string): Promise<WeatherAPIResponse> {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured. Please set the NEXT_PUBLIC_WEATHER_API_KEY environment variable in your .env or .env.local file.');
  }

  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        // WeatherAPI error structure: { error: { code: number, message: string } }
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
          // Add specific context for common key-related errors
          if (errorData.error.code === 2006) { // API key invalid
             errorMessage = `Invalid Weather API key: ${errorData.error.message}`;
          } else if (errorData.error.code === 1002) { // API key not provided (should be caught by earlier check, but good to have)
             errorMessage = `Missing Weather API key: ${errorData.error.message}`;
          } else if (errorData.error.code === 2007 || errorData.error.code === 2008) { // Quota exceeded or key disabled
            errorMessage = `Weather API key issue: ${errorData.error.message}`;
          }
        }
      } catch (parseError) {
        // If parsing the JSON fails, stick with the status-based error message.
        console.error("Could not parse error response from WeatherAPI:", parseError);
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<WeatherAPIResponse>;

  } catch (networkOrThrownError: any) {
    // Re-throw errors that we've already specifically crafted from the !response.ok block or the API_KEY check
    if (
      networkOrThrownError.message.includes('Weather API key is not configured') ||
      networkOrThrownError.message.includes('Invalid Weather API key') ||
      networkOrThrownError.message.includes('Missing Weather API key') ||
      networkOrThrownError.message.includes('Weather API key issue') ||
      networkOrThrownError.message.includes('API request failed with status') ||
      networkOrThrownError.message.includes('City not found') // From original 400 handling
    ) {
        throw networkOrThrownError;
    }
    // For other generic network issues (e.g., DNS, CORS, no internet)
    console.error("Network error fetching weather data:", networkOrThrownError);
    throw new Error('Network error: Failed to connect to WeatherAPI. Please check your internet connection.');
  }
}
