
import type { WeatherAPIResponse, ForecastDay, HourForecast, AstroForecast, DayForecast, AirPollutionDataEntry, AirPollutionResponse } from '@/types/weather';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const AIR_POLLUTION_API_KEY = process.env.NEXT_PUBLIC_AIR_POLLUTION_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function metersToKm(meters: number): number {
  return parseFloat((meters / 1000).toFixed(1));
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.floor((degrees + 11.25) / 22.5) % 16];
}


export async function fetchWeatherData(city: string): Promise<WeatherAPIResponse> {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key (NEXT_PUBLIC_WEATHER_API_KEY) is not configured. Please set it in your .env file.');
  }

  const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
  const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

  let lat: number | undefined;
  let lon: number | undefined;

  try {
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentWeatherResponse.ok) {
      let errorMessage = `Current weather API request failed with status ${currentWeatherResponse.status}`;
      try {
        const errorData = await currentWeatherResponse.json();
        if (errorData && errorData.message) {
          errorMessage = `Current Weather: ${errorData.message} (code ${errorData.cod})`;
          if (String(errorData.cod) === "401") {
             errorMessage = `Invalid OpenWeatherMap API key for current weather: ${errorData.message}. Please ensure your key in .env is correct.`;
          } else if (String(errorData.cod) === "404") {
            errorMessage = `City not found for current weather: ${errorData.message}`;
          }
        }
      } catch (parseError) {
        // console.error("Could not parse error response from OpenWeatherMap (current weather):", parseError);
      }
      throw new Error(errorMessage);
    }
    const currentData = await currentWeatherResponse.json();
    lat = currentData.coord.lat;
    lon = currentData.coord.lon;

    if (!forecastResponse.ok) {
      let errorMessage = `Forecast API request failed with status ${forecastResponse.status}`;
      try {
        const errorData = await forecastResponse.json();
        if (errorData && errorData.message) {
          errorMessage = `Forecast: ${errorData.message} (code ${errorData.cod})`;
           if (String(errorData.cod) === "401") {
             errorMessage = `Invalid OpenWeatherMap API key for forecast: ${errorData.message}. Please ensure your key in .env is correct.`;
          } else if (String(errorData.cod) === "404") {
            errorMessage = `City not found for forecast: ${errorData.message}`;
          }
        }
      } catch (parseError) {
        // console.error("Could not parse error response from OpenWeatherMap (forecast):", parseError);
      }
      throw new Error(errorMessage);
    }
    const forecastData = await forecastResponse.json();

    const timezoneOffsetSeconds = currentData.timezone;
    const locationEpoch = currentData.dt;
    const localTime = new Date((locationEpoch + timezoneOffsetSeconds) * 1000).toISOString().substring(0, 16).replace('T', ' ');


    const location = {
      name: currentData.name,
      region: currentData.sys.country,
      country: currentData.sys.country,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon,
      tz_id: `Etc/GMT${timezoneOffsetSeconds >= 0 ? (timezoneOffsetSeconds === 0 ? '' : '+') : '-'}${Math.abs(timezoneOffsetSeconds/3600)}`,
      localtime_epoch: locationEpoch,
      localtime: localTime,
    };

    const current = {
      last_updated_epoch: currentData.dt,
      last_updated: new Date(currentData.dt * 1000).toISOString(),
      temp_c: Math.round(currentData.main.temp),
      temp_f: Math.round(currentData.main.temp * 9/5 + 32),
      is_day: currentData.dt > currentData.sys.sunrise && currentData.dt < currentData.sys.sunset ? 1 : 0,
      condition: {
        text: currentData.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        code: currentData.weather[0].id,
      },
      wind_mph: Math.round(currentData.wind.speed * 2.23694),
      wind_kph: Math.round(currentData.wind.speed * 3.6),
      wind_degree: currentData.wind.deg,
      wind_dir: getWindDirection(currentData.wind.deg),
      pressure_mb: currentData.main.pressure,
      pressure_in: parseFloat((currentData.main.pressure * 0.02953).toFixed(2)),
      precip_mm: currentData.rain?.['1h'] || 0,
      precip_in: parseFloat(((currentData.rain?.['1h'] || 0) / 25.4).toFixed(2)),
      humidity: currentData.main.humidity,
      cloud: currentData.clouds.all,
      feelslike_c: Math.round(currentData.main.feels_like),
      feelslike_f: Math.round(currentData.main.feels_like * 9/5 + 32),
      vis_km: currentData.visibility ? metersToKm(currentData.visibility) : 10,
      vis_miles: currentData.visibility ? parseFloat((metersToKm(currentData.visibility) * 0.621371).toFixed(1)) : 6,
      uv: 0,
      gust_mph: currentData.wind.gust ? Math.round(currentData.wind.gust * 2.23694) : Math.round(currentData.wind.speed * 2.23694),
      gust_kph: currentData.wind.gust ? Math.round(currentData.wind.gust * 3.6) : Math.round(currentData.wind.speed * 3.6),
    };

    const forecastDaysProcessed: ForecastDay[] = [];
    if (forecastData.list && forecastData.list.length > 0) {
      const dailyDataAgg: Record<string, any[]> = {};
      forecastData.list.forEach((item: any) => {
        const dateStr = new Date((item.dt + timezoneOffsetSeconds) * 1000).toISOString().split('T')[0];
        if (!dailyDataAgg[dateStr]) {
          dailyDataAgg[dateStr] = [];
        }
        dailyDataAgg[dateStr].push(item);
      });

      const todayEpoch = new Date((currentData.dt + timezoneOffsetSeconds) * 1000).setUTCHours(0,0,0,0) / 1000;

      Object.keys(dailyDataAgg).sort().slice(0, 7).forEach(dateStr => {
        const dayEntries = dailyDataAgg[dateStr];
        const temps = dayEntries.map(e => e.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        
        let representativeEntry = dayEntries.find(e => new Date((e.dt + timezoneOffsetSeconds) * 1000).getUTCHours() >= 12 && new Date((e.dt + timezoneOffsetSeconds) * 1000).getUTCHours() < 15) || dayEntries[Math.floor(dayEntries.length / 2)] || dayEntries[0];

        const dayForecast: DayForecast = {
          maxtemp_c: Math.round(maxTemp),
          maxtemp_f: Math.round(maxTemp * 9/5 + 32),
          mintemp_c: Math.round(minTemp),
          mintemp_f: Math.round(minTemp * 9/5 + 32),
          avgtemp_c: Math.round(dayEntries.reduce((sum, e) => sum + e.main.temp, 0) / dayEntries.length),
          avgtemp_f: Math.round((dayEntries.reduce((sum, e) => sum + e.main.temp, 0) / dayEntries.length) * 9/5 + 32),
          maxwind_kph: Math.round(Math.max(...dayEntries.map(e => e.wind.speed)) * 3.6),
          maxwind_mph: Math.round(Math.max(...dayEntries.map(e => e.wind.speed)) * 2.23694),
          totalprecip_mm: parseFloat(dayEntries.reduce((sum, e) => sum + (e.rain?.['3h'] || 0), 0).toFixed(1)),
          totalprecip_in: parseFloat((dayEntries.reduce((sum, e) => sum + (e.rain?.['3h'] || 0), 0) / 25.4).toFixed(2)),
          totalsnow_cm: parseFloat(dayEntries.reduce((sum, e) => sum + (e.snow?.['3h'] || 0), 0).toFixed(1)),
          avgvis_km: metersToKm(dayEntries.reduce((sum, e) => sum + (e.visibility || 10000), 0) / dayEntries.length),
          avgvis_miles: parseFloat((metersToKm(dayEntries.reduce((sum, e) => sum + (e.visibility || 10000), 0) / dayEntries.length) * 0.621371).toFixed(1)),
          avghumidity: Math.round(dayEntries.reduce((sum, e) => sum + e.main.humidity, 0) / dayEntries.length),
          daily_will_it_rain: dayEntries.some(e => e.pop && e.pop > 0.3) ? 1 : 0, // pop is probability of precipitation
          daily_chance_of_rain: Math.round(Math.max(0, ...dayEntries.map(e => (e.pop || 0) * 100))),
          daily_will_it_snow: dayEntries.some(e => e.snow?.['3h'] && e.snow['3h'] > 0) ? 1 : 0,
          daily_chance_of_snow: 0, // OpenWeatherMap free tier does not provide explicit chance of snow for daily summary
          condition: {
            text: representativeEntry.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${representativeEntry.weather[0].icon}@2x.png`,
            code: representativeEntry.weather[0].id,
          },
          uv: 0, // UV index not available in free forecast
        };
        
        const dateEpoch = new Date(new Date(dateStr + 'T00:00:00Z').getTime()).getTime() / 1000;

        const astro: AstroForecast = {
            sunrise: dateEpoch === todayEpoch && currentData.sys.sunrise ? new Date((currentData.sys.sunrise + timezoneOffsetSeconds) * 1000).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'}) : "N/A",
            sunset: dateEpoch === todayEpoch && currentData.sys.sunset ? new Date((currentData.sys.sunset + timezoneOffsetSeconds) * 1000).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'}) : "N/A",
            moonrise: "N/A", // Not available in OpenWeather free tier
            moonset: "N/A", // Not available in OpenWeather free tier
            moon_phase: "N/A", // Not available in OpenWeather free tier
            moon_illumination: "N/A", // Not available in OpenWeather free tier
            is_moon_up: 0,
            is_sun_up: 0,
        };

        const hourForecasts: HourForecast[] = dayEntries.map(item => ({
          time_epoch: item.dt,
          time: new Date((item.dt + timezoneOffsetSeconds) * 1000).toISOString(),
          temp_c: Math.round(item.main.temp),
          temp_f: Math.round(item.main.temp * 9/5 + 32),
          is_day: item.sys.pod === 'd' ? 1 : 0, // 'd' for day, 'n' for night
          condition: {
            text: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
            code: item.weather[0].id,
          },
          wind_mph: Math.round(item.wind.speed * 2.23694), // m/s to mph
          wind_kph: Math.round(item.wind.speed * 3.6), // m/s to kph
          wind_degree: item.wind.deg,
          wind_dir: getWindDirection(item.wind.deg),
          pressure_mb: item.main.pressure,
          pressure_in: parseFloat((item.main.pressure * 0.02953).toFixed(2)),
          precip_mm: item.rain?.['3h'] || 0, // Precipitation volume for the last 3 hours, mm
          precip_in: parseFloat(((item.rain?.['3h'] || 0) / 25.4).toFixed(2)),
          humidity: item.main.humidity,
          cloud: item.clouds.all,
          feelslike_c: Math.round(item.main.feels_like),
          feelslike_f: Math.round(item.main.feels_like * 9/5 + 32),
          windchill_c: Math.round(item.main.temp_min), // Approximation, OpenWeather uses temp_min for this
          windchill_f: Math.round(item.main.temp_min * 9/5 + 32), // Approximation
          heatindex_c: Math.round(item.main.temp_max), // Approximation
          heatindex_f: Math.round(item.main.temp_max * 9/5 + 32), // Approximation
          dewpoint_c: 0, // Not directly available, would require calculation
          dewpoint_f: 0, // Not directly available
          will_it_rain: (item.pop && item.pop > 0) ? 1 : 0,
          chance_of_rain: Math.round((item.pop || 0) * 100), // Probability of precipitation
          will_it_snow: (item.snow?.['3h'] && item.snow['3h'] > 0) ? 1 : 0,
          chance_of_snow: 0, // No direct snow probability per hour
          vis_km: item.visibility ? metersToKm(item.visibility) : 10,
          vis_miles: item.visibility ? parseFloat((metersToKm(item.visibility) * 0.621371).toFixed(1)) : 6,
          gust_mph: item.wind.gust ? Math.round(item.wind.gust * 2.23694) : Math.round(item.wind.speed * 2.23694),
          gust_kph: item.wind.gust ? Math.round(item.wind.gust * 3.6) : Math.round(item.wind.speed * 3.6),
          uv: 0, // UV not available in hourly forecast
        }));

        forecastDaysProcessed.push({
          date: dateStr,
          date_epoch: dateEpoch,
          day: dayForecast,
          astro: astro,
          hour: hourForecasts,
        });
      });
    }

    // Fetch Air Pollution Data
    let airPollutionData: AirPollutionDataEntry | undefined;
    let airPollutionForecastData: AirPollutionDataEntry[] | undefined;

    if (lat !== undefined && lon !== undefined) {
      if (!AIR_POLLUTION_API_KEY) {
        console.warn('Air Pollution API key (NEXT_PUBLIC_AIR_POLLUTION_API_KEY) is not configured. Air pollution data will not be fetched.');
      } else {
        const airPollutionCurrentUrl = `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${AIR_POLLUTION_API_KEY}`;
        const airPollutionForecastUrl = `${OPENWEATHER_BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${AIR_POLLUTION_API_KEY}`;
        
        try {
          const [apCurrentResponse, apForecastResponse] = await Promise.all([
            fetch(airPollutionCurrentUrl),
            fetch(airPollutionForecastUrl)
          ]);

          if (apCurrentResponse.ok) {
            const apCurrentJson: AirPollutionResponse = await apCurrentResponse.json();
            if (apCurrentJson.list && apCurrentJson.list.length > 0) {
              airPollutionData = apCurrentJson.list[0];
            }
          } else {
            console.error(`Air pollution current API request failed: ${apCurrentResponse.status}`);
             if (apCurrentResponse.status === 401) throw new Error("Invalid API key for Air Pollution (current). Please check NEXT_PUBLIC_AIR_POLLUTION_API_KEY.");
          }

          if (apForecastResponse.ok) {
            const apForecastJson: AirPollutionResponse = await apForecastResponse.json();
            airPollutionForecastData = apForecastJson.list;
          } else {
            console.error(`Air pollution forecast API request failed: ${apForecastResponse.status}`);
             if (apForecastResponse.status === 401) throw new Error("Invalid API key for Air Pollution (forecast). Please check NEXT_PUBLIC_AIR_POLLUTION_API_KEY.");
          }
        } catch (apError: any) {
           if (apError.message.includes("Invalid API key")) throw apError; // Re-throw critical API key errors
          console.error("Error fetching air pollution data:", apError);
        }
      }
    }

    return {
      location,
      current,
      forecast: {
        forecastday: forecastDaysProcessed,
      },
      airPollution: airPollutionData,
      airPollutionForecast: airPollutionForecastData,
    } as WeatherAPIResponse;

  } catch (networkOrThrownError: any) {
    if (
      networkOrThrownError.message.includes('API key is not configured') ||
      networkOrThrownError.message.includes('Invalid OpenWeatherMap API key') ||
      networkOrThrownError.message.includes('City not found') ||
      networkOrThrownError.message.includes('Current weather API request failed with status') ||
      networkOrThrownError.message.includes('Forecast API request failed with status') ||
      networkOrThrownError.message.includes('Invalid API key for Air Pollution')
    ) {
        throw networkOrThrownError; // Re-throw specific, actionable errors
    }
    console.error("Network error fetching weather data from OpenWeatherMap:", networkOrThrownError);
    // Fallback to a generic network error if it's not one of the specific ones.
    throw new Error('Network error: Failed to connect to OpenWeatherMap. Please check your internet connection.');
  }
}
