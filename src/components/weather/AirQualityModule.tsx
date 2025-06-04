
"use client";

import type { AirPollutionDataEntry, AQIComponents } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Info, Leaf, BarChart3, Wind, TrendingUp } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip as ShadTooltip,
  ChartTooltipContent as ShadTooltipContent,
  ChartLegend as ShadLegend,
  ChartLegendContent as ShadLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface AirQualityModuleProps {
  currentAirPollution?: AirPollutionDataEntry;
  forecastAirPollution?: AirPollutionDataEntry[];
  timezoneOffset?: number; // seconds from UTC
}

const pollutantDetails: Record<keyof AQIComponents | string, { name: string; unit: string; color: string }> = {
  co: { name: 'CO (Carbon Monoxide)', unit: 'μg/m³', color: 'var(--color-co)' },
  no: { name: 'NO (Nitrogen Monoxide)', unit: 'μg/m³', color: 'var(--color-no)' },
  no2: { name: 'NO₂ (Nitrogen Dioxide)', unit: 'μg/m³', color: 'var(--color-no2)' },
  o3: { name: 'O₃ (Ozone)', unit: 'μg/m³', color: 'var(--color-o3)' },
  so2: { name: 'SO₂ (Sulphur Dioxide)', unit: 'μg/m³', color: 'var(--color-so2)' },
  pm2_5: { name: 'PM₂.₅ (Fine Particles)', unit: 'μg/m³', color: 'var(--color-pm2_5)' },
  pm10: { name: 'PM₁₀ (Coarse Particles)', unit: 'μg/m³', color: 'var(--color-pm10)' },
  nh3: { name: 'NH₃ (Ammonia)', unit: 'μg/m³', color: 'var(--color-nh3)' },
};

const forecastChartConfig = {
  pm2_5: { label: "PM₂.₅", color: "hsl(var(--chart-1))" },
  pm10: { label: "PM₁₀", color: "hsl(var(--chart-2))" },
  o3: { label: "O₃", color: "hsl(var(--chart-3))" },
  no2: { label: "NO₂", color: "hsl(var(--chart-4))" },
  so2: { label: "SO₂", color: "hsl(var(--chart-5))" },
  co: { label: "CO", color: "hsl(var(--chart-1))" }, // Re-using chart colors for additional pollutants
} satisfies ChartConfig;


const getAQICategory = (aqi: number): { name: string; colorClass: string; advice: string } => {
  if (aqi === 1) return { name: 'Good', colorClass: 'bg-green-500 text-white', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
  if (aqi === 2) return { name: 'Fair', colorClass: 'bg-yellow-400 text-black', advice: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' };
  if (aqi === 3) return { name: 'Moderate', colorClass: 'bg-orange-500 text-white', advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
  if (aqi === 4) return { name: 'Poor', colorClass: 'bg-red-500 text-white', advice: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' };
  if (aqi === 5) return { name: 'Very Poor', colorClass: 'bg-purple-600 text-white', advice: 'Health alert: The risk of health effects is increased for everyone.' };
  return { name: 'Unknown', colorClass: 'bg-gray-400 text-black', advice: 'Air quality data is currently unavailable.' };
};

export function AirQualityModule({ currentAirPollution, forecastAirPollution, timezoneOffset = 0 }: AirQualityModuleProps) {
  if (!currentAirPollution && (!forecastAirPollution || forecastAirPollution.length === 0)) {
    return (
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <Wind size={22} className="mr-2 text-primary" />
            Air Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Air quality data is currently unavailable for this location.</p>
        </CardContent>
      </Card>
    );
  }

  const aqiInfo = currentAirPollution ? getAQICategory(currentAirPollution.main.aqi) : getAQICategory(0);

  const forecastChartData = forecastAirPollution?.map(entry => {
    const localTime = new Date((entry.dt + timezoneOffset) * 1000);
    return {
      time: localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone:'UTC' }),
      date: localTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', timeZone:'UTC'}),
      fullTime: localTime.toISOString(),
      aqi: entry.main.aqi,
      ...entry.components,
    };
  });

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Leaf size={22} className="mr-2 text-primary" />
          Air Quality
        </CardTitle>
        {currentAirPollution && (
          <CardDescription className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${aqiInfo.colorClass}`}>
            Current AQI: {currentAirPollution.main.aqi} ({aqiInfo.name})
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="current">
              <Info size={16} className="mr-2" /> Current Snapshot
            </TabsTrigger>
            <TabsTrigger value="forecast" disabled={!forecastChartData || forecastChartData.length === 0}>
              <TrendingUp size={16} className="mr-2" /> Pollution Forecast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {currentAirPollution ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                  {Object.entries(currentAirPollution.components).map(([key, value]) => {
                    const detail = pollutantDetails[key as keyof AQIComponents] || { name: key.toUpperCase(), unit: 'μg/m³', color: 'text-foreground' };
                    return (
                      <div key={key} className="p-3 bg-muted/50 rounded-md">
                        <p className="font-medium text-foreground">{detail.name}</p>
                        <p className="text-lg font-bold" style={{ color: detail.color }}>{value.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">{detail.unit}</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Current air pollution data not available.</p>
            )}
          </TabsContent>

          <TabsContent value="forecast">
            {forecastChartData && forecastChartData.length > 0 ? (
              <ChartContainer config={forecastChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(value, index) => {
                        // Show date for the first tick of each new day
                        if (index === 0 || forecastChartData[index].date !== forecastChartData[index-1].date) {
                            return forecastChartData[index].date;
                        }
                        return value; // Show time for other ticks
                    }}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd" // Show more labels
                  />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'μg/m³', angle: -90, position: 'insideLeft', offset:0, style: {fontSize: '10px', fill: 'hsl(var(--muted-foreground))'} }} />
                  <ShadTooltip 
                    cursor={true} 
                    content={
                      <ShadTooltipContent 
                        indicator="line" 
                        labelFormatter={(value, payload) => {
                           if (payload && payload.length > 0 && payload[0].payload) {
                                const entry = payload[0].payload as typeof forecastChartData[0];
                                return `${entry.date}, ${entry.time} (AQI: ${entry.aqi})`;
                           }
                           return value;
                        }}
                        formatter={(value, name) => (
                          <>
                            <span className="font-semibold" style={{color: forecastChartConfig[name as keyof typeof forecastChartConfig]?.color || '#000'}}>
                              {forecastChartConfig[name as keyof typeof forecastChartConfig]?.label || name}:
                            </span> {Number(value).toFixed(2)} μg/m³
                          </>
                        )}
                      />
                    } 
                  />
                  <ShadLegend content={<ShadLegendContent />} />
                  {Object.keys(forecastChartConfig).filter(key => key !== 'co').map(key => ( // CO values are often much higher, skews chart
                     (forecastChartData[0] as any)[key] !== undefined && // Check if pollutant exists in data
                        <Line 
                            key={key}
                            type="monotone" 
                            dataKey={key} 
                            stroke={forecastChartConfig[key as keyof typeof forecastChartConfig].color} 
                            strokeWidth={2} 
                            dot={false} 
                            name={forecastChartConfig[key as keyof typeof forecastChartConfig].label}
                        />
                  ))}
                </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">Pollution forecast data not available.</p>
            )}
          </TabsContent>
        </Tabs>

        {currentAirPollution && (
          <div className="mt-6 p-4 border rounded-lg bg-background shadow">
            <h4 className="font-semibold text-md mb-2 flex items-center">
              <AlertCircle size={18} className="mr-2 text-primary" />
              Health Advisory (Current AQI: {currentAirPollution.main.aqi} - {aqiInfo.name})
            </h4>
            <p className="text-sm text-muted-foreground">{aqiInfo.advice}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
