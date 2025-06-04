
"use client";

import type { ForecastDay } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, Umbrella } from 'lucide-react';

interface ForecastChartsProps {
  forecastDays: ForecastDay[] | undefined;
}

const tempChartConfig = {
  minTemp: {
    label: "Min Temp (°C)",
    color: "hsl(var(--chart-2))",
  },
  maxTemp: {
    label: "Max Temp (°C)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const rainChartConfig = {
  rainChance: {
    label: "Chance of Rain (%)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ForecastCharts({ forecastDays }: ForecastChartsProps) {
  if (!forecastDays || forecastDays.length === 0) return null;

  const chartData = forecastDays.map(day => ({
    date: new Date(day.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    minTemp: day.day.mintemp_c,
    maxTemp: day.day.maxtemp_c,
    rainChance: day.day.daily_chance_of_rain,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <TrendingUp size={22} className="mr-2 text-primary" />
            Temperature Trend (°C)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tempChartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line
                  dataKey="minTemp"
                  type="monotone"
                  stroke={`var(--color-minTemp)`}
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  dataKey="maxTemp"
                  type="monotone"
                  stroke={`var(--color-maxTemp)`}
                  strokeWidth={2}
                  dot={true}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <Umbrella size={22} className="mr-2 text-primary" />
            Chance of Rain (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={rainChartConfig} className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                accessibilityLayer 
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8} 
                  domain={[0, 100]}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="rainChance" fill={`var(--color-rainChance)`} radius={4} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
