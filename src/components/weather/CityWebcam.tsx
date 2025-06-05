
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Camera, ExternalLink } from "lucide-react";

interface CityWebcamProps {
  latitude?: number;
  longitude?: number;
  cityName?: string;
}

export function CityWebcam({ latitude, longitude, cityName }: CityWebcamProps) {
  if (!cityName) {
    return null;
  }

  const windyUrl = latitude && longitude
    ? `https://www.windy.com/webcams/nearby?lat=${latitude}&lon=${longitude}&zoom=10`
    : `https://www.windy.com/webcams/search/query/${encodeURIComponent(cityName)}`;

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Camera size={22} className="mr-2 text-primary" />
          Live City Webcam
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4 overflow-hidden rounded-lg border aspect-video bg-muted flex items-center justify-center">
          <Image
            src="https://placehold.co/600x400.png"
            alt={`Webcam placeholder for ${cityName}`}
            width={600}
            height={400}
            className="object-cover w-full h-full"
            data-ai-hint="city view"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          View live webcams in and around {cityName} on Windy.com.
        </p>
        <Button asChild variant="outline">
          <a href={windyUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} className="mr-2" />
            Find Webcams for {cityName}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
