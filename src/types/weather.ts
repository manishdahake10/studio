
export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeatherData {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: WeatherCondition;
  uv: number;
}

export interface AstroForecast {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
  is_moon_up: number;
  is_sun_up: number;
}

export interface HourForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: AstroForecast;
  hour: HourForecast[];
}

export interface AQIComponents {
  co: number; // Carbon monoxide, μg/m3
  no: number; // Nitrogen monoxide, μg/m3
  no2: number; // Nitrogen dioxide, μg/m3
  o3: number; // Ozone, μg/m3
  so2: number; // Sulphur dioxide, μg/m3
  pm2_5: number; // Fine particles matter, μg/m3
  pm10: number; // Coarse particulate matter, μg/m3
  nh3: number; // Ammonia, μg/m3
}

export interface AirPollutionDataEntry {
  dt: number; // Date and time, Unix, UTC
  main: {
    aqi: number; // Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
  };
  components: AQIComponents;
}

export interface AirPollutionResponse {
  coord: { lat: number; lon: number };
  list: AirPollutionDataEntry[];
}


export interface WeatherAPIResponse {
  location: WeatherLocation;
  current: CurrentWeatherData;
  forecast?: {
    forecastday: ForecastDay[];
  };
  airPollution?: AirPollutionDataEntry; // Current air pollution
  airPollutionForecast?: AirPollutionDataEntry[]; // Array of forecasted air pollution data
}
