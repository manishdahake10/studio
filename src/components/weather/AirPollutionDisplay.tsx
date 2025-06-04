
"use client";

import type { AirPollutionData } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudFog, Wind, Leaf, AlertTriangle, Skull, BarChartHorizontalBig } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import React from 'react';

interface AirPollutionDisplayProps {
  data: AirPollutionData | undefined;
}

const getAqiInfo = (aqi: number | undefined): { text: string; color: 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'gray'; Icon: React.ElementType } => {
  if (aqi === undefined) return { text: 'N/A', color: 'gray', Icon: CloudFog };
  switch (aqi) {
    case 1: return { text: 'Good', color: 'green', Icon: Leaf };
    case 2: return { text: 'Fair', color: 'yellow', Icon: Wind };
    case 3: return { text: 'Moderate', color: 'orange', Icon: CloudFog };
    case 4: return { text: 'Poor', color: 'red', Icon: AlertTriangle };
    case 5: return { text: 'Very Poor', color: 'purple', Icon: Skull };
    default: return { text: 'Unknown', color: 'gray', Icon: CloudFog };
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

const pollutantLabels: Record<keyof AirPollutionData['components'], string> = {
  co: "CO",
  no: "NO",
  no2: "NO₂",
  o3: "O₃",
  so2: "SO₂",
  pm2_5: "PM₂.₅",
  pm10: "PM₁₀",
  nh3: "NH₃",
};

const pollutantChartConfig = {
  co: { label: "CO", color: "hsl(var(--chart-1))" },
  no: { label: "NO", color: "hsl(var(--chart-2))" },
  no2: { label: "NO₂", color: "hsl(var(--chart-3))" },
  o3: { label: "O₃", color: "hsl(var(--chart-4))" },
  so2: { label: "SO₂", color: "hsl(var(--chart-5))" },
  pm2_5: { label: "PM₂.₅", color: "hsl(var(--chart-1))" },
  pm10: { label: "PM₁₀", color: "hsl(var(--chart-2))" },
  nh3: { label: "NH₃", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export function AirPollutionDisplay({ data }: AirPollutionDisplayProps) {
  if (!data) {
    return (
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <CloudFog size={22} className="mr-2 text-primary" />
            Air Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Air pollution data is currently unavailable for this location or the API key is missing/invalid.</p>
        </CardContent>
      </Card>
    );
  }

  const { main, components, dt } = data;
  const aqiInfo = getAqiInfo(main?.aqi);
  const AqiIcon = aqiInfo.Icon;

  const stackedChartData = React.useMemo(() => {
    if (!components) return [];
    const allPollutantKeys = Object.keys(pollutantLabels) as Array<keyof AirPollutionData['components']>;
    const processedComponents = allPollutantKeys.reduce((acc, key) => {
      acc[key] = parseFloat((components[key] ?? 0).toFixed(2));
      return acc;
    }, {} as Record<keyof AirPollutionData['components'], number>);

    return [{
      category: 'Pollutants', 
      ...processedComponents
    }];
  }, [components]);
  
  const hasPollutantDataForChart = components && Object.values(components).some(v => v > 0);

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center text-xl font-headline">
                <AqiIcon size={22} className="mr-2 text-primary" />
                Air Quality Index (AQI)
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date(dt * 1000).toLocaleString()}
                </p>
            </div>
            <Badge variant={badgeVariantMap[aqiInfo.color]} className={`text-lg px-3 py-1 ${aqiInfo.color === 'yellow' ? 'bg-yellow-400 text-black' : ''} ${aqiInfo.color === 'orange' ? 'bg-orange-500 text-white' : ''} ${aqiInfo.color === 'purple' ? 'bg-purple-700 text-white' : ''}`}>
                {aqiInfo.text} (AQI: {main?.aqi || 'N/A'})
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3 text-muted-foreground">Pollutant Levels (μg/m³):</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-6">
          {Object.entries(pollutantLabels).map(([key, label]) => (
            <div key={key}><span className="font-medium">{label}:</span> {components[key as keyof typeof components]?.toFixed(2) || 'N/A'}</div>
          ))}
        </div>

        {hasPollutantDataForChart && (
          <>
            <div className="flex items-center text-lg font-semibold mb-3 text-secondary-foreground">
              <BarChartHorizontalBig size={20} className="mr-2 text-primary" />
              Pollutant Composition (μg/m³)
            </div>
            <ChartContainer config={pollutantChartConfig} className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={stackedChartData}
                  layout="horizontal"
                  margin={{
                    left: 10,
                    right: 30,
                    top: 5,
                    bottom: 20, 
                  }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'auto']} />
                  <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} tickMargin={8} width={85} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent verticalAlign="bottom" />} />
                  {Object.keys(pollutantLabels)
                    .filter(key => components[key as keyof AirPollutionData['components']] > 0) 
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
      </CardContent>
    </Card>
  );
}
