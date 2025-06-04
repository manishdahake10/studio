
"use client";

import type { AirPollutionData } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudFog, Wind, Leaf, AlertTriangle, Skull, BarChartHorizontalBig } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
  value: { label: "Concentration (μg/m³)" },
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

  const chartData = Object.entries(components)
    .map(([key, value]) => ({
      name: pollutantLabels[key as keyof typeof pollutantLabels] || key.toUpperCase(),
      value: parseFloat(value?.toFixed(2) ?? "0"),
      fill: pollutantChartConfig[key as keyof typeof pollutantChartConfig]?.color || "hsl(var(--chart-1))",
    }))
    .filter(item => item.value > 0);

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

        {chartData.length > 0 && (
          <>
            <div className="flex items-center text-lg font-semibold mb-3 text-secondary-foreground">
              <BarChartHorizontalBig size={20} className="mr-2 text-primary" />
              Pollutant Concentration Breakdown
            </div>
            <ChartContainer config={pollutantChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="horizontal" // Changed to horizontal
                  margin={{
                    left: 10, // Adjusted left margin for Y-axis labels
                    right: 30,
                    top: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" /> {/* vertical lines */}
                  <XAxis 
                    type="number" 
                    dataKey="value" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={60} // Ensure enough width for pollutant names
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="value" radius={4}>
                    {/* Recharts' Bar component will automatically use the 'fill' property from the data objects */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
