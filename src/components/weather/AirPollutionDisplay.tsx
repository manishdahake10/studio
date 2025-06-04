
"use client";

import type { AirPollutionData } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudFog, Wind, Leaf, AlertTriangle, Skull } from 'lucide-react';

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
  green: 'default', // Using primary for good
  yellow: 'secondary', // Muted yellow/orange for fair
  orange: 'default', // Potentially use a custom orange or keep primary
  red: 'destructive',
  purple: 'destructive', // Darker destructive for very poor
  gray: 'outline',
};


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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">CO:</span> {components.co?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">NO:</span> {components.no?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">NO₂:</span> {components.no2?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">O₃:</span> {components.o3?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">SO₂:</span> {components.so2?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">PM₂₅:</span> {components.pm2_5?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">PM₁₀:</span> {components.pm10?.toFixed(2) || 'N/A'}</div>
          <div><span className="font-medium">NH₃:</span> {components.nh3?.toFixed(2) || 'N/A'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
