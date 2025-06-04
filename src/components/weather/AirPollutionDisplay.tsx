
"use client";

import type { AirPollutionDataEntry, AQIComponents } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudFog, Wind, Leaf, AlertTriangle, Skull, BarChartHorizontalBig, LineChartIcon, Activity } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, TooltipProps } from "recharts";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface AirPollutionDisplayProps {
  currentPollution: AirPollutionDataEntry | undefined;
  forecastPollution: AirPollutionDataEntry[] | undefined;
  locationName: string | undefined;
}

const getAqiInfo = (aqi: number | undefined): { text: string; color: 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'gray'; Icon: React.ElementType; advice: string } => {
  if (aqi === undefined) return { text: 'N/A', color: 'gray', Icon: CloudFog, advice: "Air quality data is not available." };
  switch (aqi) {
    case 1: return { text: 'Good', color: 'green', Icon: Leaf, advice: "Air quality is excellent. Ideal for outdoor activities." };
    case 2: return { text: 'Fair', color: 'yellow', Icon: Wind, advice: "Air quality is acceptable. Sensitive individuals may experience minor respiratory symptoms." };
    case 3: return { text: 'Moderate', color: 'orange', Icon: CloudFog, advice: "Air quality is moderate. Members of sensitive groups may experience health effects. General public should limit prolonged outdoor exertion." };
    case 4: return { text: 'Poor', color: 'red', Icon: AlertTriangle, advice: "Air quality is poor. Everyone may begin to experience health effects. Sensitive groups may experience more serious health effects. Avoid outdoor activities." };
    case 5: return { text: 'Very Poor', color: 'purple', Icon: Skull, advice: "Air quality is very poor. Health alert: everyone may experience serious health effects. Remain indoors." };
    default: return { text: 'Unknown', color: 'gray', Icon: CloudFog, advice: "Air quality is unknown." };
  }
};

const badgeVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  green: 'default',
  yellow: 'secondary',
  orange: 'default',
  red: 'destructive',
  purple: 'destructive',
  gray: 'outline',
};

const pollutantLabels: Record<keyof AQIComponents, string> = {
  co: "CO",
  no: "NO",
  no2: "NO₂",
  o3: "O₃",
  so2: "SO₂",
  pm2_5: "PM₂.₅",
  pm10: "PM₁₀",
  nh3: "NH₃",
};

const pollutantChartConfig: ChartConfig = {
  pm2_5: { label: "PM₂.₅", color: "hsl(var(--chart-1))" },
  pm10: { label: "PM₁₀", color: "hsl(var(--chart-2))" },
  o3: { label: "O₃", color: "hsl(var(--chart-3))" },
  no2: { label: "NO₂", color: "hsl(var(--chart-4))" },
  so2: { label: "SO₂", color: "hsl(var(--chart-5))" },
  co: { label: "CO", color: "hsl(var(--chart-1))" }, 
} satisfies ChartConfig;


const HealthAdvisoryWidget = ({ aqi }: { aqi: number | undefined }) => {
  const { advice, color, text } = getAqiInfo(aqi);
  const badgeClass = badgeVariantMap[color] || 'outline';
  
  return (
    <Card className={`mt-4 border-${color}-500/50 dark:border-${color}-400/50`}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md flex items-center">
          <Activity size={18} className="mr-2" /> Health Advisory
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm">
          Current Air Quality: <Badge variant={badgeClass} className={`font-semibold ${color === 'yellow' ? 'bg-yellow-400 text-black' : ''} ${color === 'orange' ? 'bg-orange-500 text-white' : ''} ${color === 'purple' ? 'bg-purple-700 text-white' : ''}`}>{text}</Badge> (AQI: {aqi ?? 'N/A'})
        </p>
        <p className="text-sm mt-2">{advice}</p>
      </CardContent>
    </Card>
  );
};

const CustomTooltipContent = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload; // The whole data object for this point
    const aqi = dataPoint.aqi; // Assuming 'aqi' is part of your chart data point
    const aqiInfo = getAqiInfo(aqi);

    return (
      <div className="bg-background border border-border shadow-lg rounded-md p-3 text-sm">
        <p className="font-semibold mb-1">
          {new Date(label as number * 1000).toLocaleDateString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
        </p>
        {payload.map((pld, index) => (
          <div key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value?.toFixed(2)} μg/m³`}
          </div>
        ))}
        {aqi !== undefined && (
          <p className="mt-2 pt-1 border-t border-border text-xs">
            Overall AQI: {aqi} (<span style={{color: `var(--color-aqi-${aqiInfo.color})`}}>{aqiInfo.text}</span>)
          </p>
        )}
      </div>
    );
  }
  return null;
};


export function AirPollutionDisplay({ currentPollution, forecastPollution, locationName }: AirPollutionDisplayProps) {
  if (!currentPollution && !forecastPollution) {
    return (
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <CloudFog size={22} className="mr-2 text-primary" />
            Air Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Air pollution data is currently unavailable for {locationName || 'this location'}{!process.env.NEXT_PUBLIC_AIR_POLLUTION_API_KEY ? ' (API key missing)' : ''}.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currentAqi = currentPollution?.main?.aqi;
  const aqiInfo = getAqiInfo(currentAqi);
  const AqiIcon = aqiInfo.Icon;

  const currentComponents = currentPollution?.components;
  const currentStackedChartData = React.useMemo(() => {
    if (!currentComponents) return [];
    const allPollutantKeys = Object.keys(pollutantLabels) as Array<keyof AQIComponents>;
    const processedComponents = allPollutantKeys.reduce((acc, key) => {
      acc[key] = parseFloat((currentComponents[key] ?? 0).toFixed(2));
      return acc;
    }, {} as Record<keyof AQIComponents, number>);
    return [{ category: 'Pollutants', ...processedComponents }];
  }, [currentComponents]);
  const hasCurrentPollutantDataForChart = currentComponents && Object.values(currentComponents).some(v => v > 0);

  const forecastChartData = React.useMemo(() => {
    if (!forecastPollution) return [];
    return forecastPollution.map(entry => ({
      dt: entry.dt,
      aqi: entry.main.aqi,
      pm2_5: entry.components.pm2_5,
      pm10: entry.components.pm10,
      o3: entry.components.o3,
      no2: entry.components.no2,
      so2: entry.components.so2,
      co: entry.components.co,
    }));
  }, [forecastPollution]);

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center text-xl font-headline">
                <AqiIcon size={22} className="mr-2 text-primary" />
                Air Quality Index (AQI)
                </CardTitle>
                {currentPollution && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(currentPollution.dt * 1000).toLocaleString()}
                  </p>
                )}
            </div>
            {currentPollution && (
              <Badge variant={badgeVariantMap[aqiInfo.color]} className={`text-lg px-3 py-1 ${aqiInfo.color === 'yellow' ? 'bg-yellow-400 text-black' : ''} ${aqiInfo.color === 'orange' ? 'bg-orange-500 text-white' : ''} ${aqiInfo.color === 'purple' ? 'bg-purple-700 text-white' : ''}`}>
                  {aqiInfo.text} (AQI: {currentAqi || 'N/A'})
              </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="current">Current Snapshot</TabsTrigger>
            <TabsTrigger value="forecast" disabled={!forecastPollution || forecastPollution.length === 0}>
              4-Day Forecast
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {currentPollution ? (
              <>
                <p className="text-sm mb-3 text-muted-foreground">Pollutant Levels (μg/m³):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-6">
                  {Object.entries(pollutantLabels).map(([key, label]) => (
                    <div key={key}><span className="font-medium">{label}:</span> {currentComponents?.[key as keyof typeof currentComponents]?.toFixed(2) || 'N/A'}</div>
                  ))}
                </div>

                {hasCurrentPollutantDataForChart && (
                  <>
                    <div className="flex items-center text-lg font-semibold mb-3 text-secondary-foreground">
                      <BarChartHorizontalBig size={20} className="mr-2 text-primary" />
                      Current Pollutant Composition (μg/m³)
                    </div>
                    <ChartContainer config={pollutantChartConfig as ChartConfig} className="h-[150px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          accessibilityLayer
                          data={currentStackedChartData}
                          layout="horizontal"
                          margin={{ left: 10, right: 30, top: 5, bottom: 20 }}
                        >
                          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                          <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'auto']} />
                          <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} tickMargin={8} width={85} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                          <ChartLegend content={<ChartLegendContent verticalAlign="bottom" />} />
                          {Object.keys(pollutantLabels)
                            .filter(key => currentComponents?.[key as keyof AQIComponents] > 0) 
                            .map((key) => (
                            <Bar
                              key={key}
                              dataKey={key} 
                              stackId="pollutants" 
                              name={pollutantLabels[key as keyof typeof pollutantLabels]} 
                              fill={`var(--color-${key})`} 
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Current air pollution data is unavailable.</p>
            )}
          </TabsContent>
          <TabsContent value="forecast">
            {forecastPollution && forecastPollution.length > 0 ? (
               <>
                <div className="flex items-center text-lg font-semibold mb-3 text-secondary-foreground">
                  <LineChartIcon size={20} className="mr-2 text-primary" />
                  Pollutant Forecast Trends (μg/m³)
                </div>
                <ChartContainer config={pollutantChartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer>
                    <LineChart data={forecastChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="dt"
                        tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleDateString([], {day: 'numeric', hour: 'numeric'})}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<CustomTooltipContent />} cursor={true} />
                      <ChartLegend content={<ChartLegendContent />} />
                      {(Object.keys(pollutantChartConfig) as Array<keyof typeof pollutantChartConfig>)
                        .filter(key => key !== 'co' && key !== 'nh3' && key !== 'no') // CO often has much larger scale, NH3/NO less common for trends.
                        .map((key) => (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`var(--color-${key})`}
                            strokeWidth={2}
                            dot={false}
                            name={pollutantChartConfig[key]?.label || key.toUpperCase()}
                          />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Air pollution forecast data is unavailable.</p>
            )}
          </TabsContent>
        </Tabs>
        <HealthAdvisoryWidget aqi={currentAqi} />
      </CardContent>
    </Card>
  );
}
