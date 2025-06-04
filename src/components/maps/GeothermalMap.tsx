
"use client";

import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, MapPin } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const geothermalHotspots = [
  { name: "Iceland", coordinates: [-19.0208, 64.9631] as [number, number], description: "High concentration of volcanoes and geothermal fields." },
  { name: "Yellowstone, USA", coordinates: [-110.5885, 44.4280] as [number, number], description: "Famous for geysers and hot springs." },
  { name: "Taupō Volcanic Zone, NZ", coordinates: [175.9903, -38.7929] as [number, number], description: "Active volcanic and geothermal region." },
  { name: "Rift Valley, Kenya", coordinates: [37.9062, 0.0236] as [number, number], description: "Part of the East African Rift system with significant geothermal potential." },
  { name: "Larderello, Italy", coordinates: [10.8783, 43.2432] as [number, number], description: "World's first geothermal power plant." },
];

export function GeothermalMap() {
  return (
    <Card className="w-full shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <MapPin size={22} className="mr-2 text-primary" />
          World Geothermal Hotspots (Examples)
        </CardTitle>
      </CardHeader>
      <CardContent className="aspect-video h-[400px] md:h-[500px] p-0 overflow-hidden">
        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147
          }}
          width={800}
          height={450}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--background))"
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: "hsl(var(--secondary))" },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {geothermalHotspots.map(({ name, coordinates, description }) => (
              <Marker key={name} coordinates={coordinates}>
                <Flame className="text-destructive h-5 w-5" />
                <title>{`${name}: ${description}`}</title>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </CardContent>
    </Card>
  );
}
