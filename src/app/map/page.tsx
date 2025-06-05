
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet'; // Import L for LatLngExpression type and Icon fix

// Dynamically import MapContainer and other react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Fix for default Leaflet icon paths when using with bundlers like Webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
  });
}

export default function MapPage() {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Access environment variable on the client side
    setApiKey(process.env.NEXT_PUBLIC_MAP_API_KEY);
    document.title = "Weather Map | Weather Weaver";
  }, []);

  const position: L.LatLngExpression = [20, 0]; // Default center of the world map
  const initialZoom = 2;

  // This state ensures MapContainer is only rendered client-side after mount
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Interactive Weather Map</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore conditions around the globe. This is a basic map integration.
        </p>
      </header>

      <div className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-lg shadow-lg overflow-hidden border border-border">
        {isClient ? (
          <MapContainer center={position} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Example Marker - you can add more markers or layers dynamically */}
            <Marker position={[51.505, -0.09]}>
              <Popup>
                London. <br /> Current weather features for map will be added here.
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
      </div>
      <div className="mt-6 p-4 border rounded-lg bg-card text-card-foreground shadow">
        <h2 className="text-xl font-semibold mb-2">Developer Note:</h2>
        <p className="text-sm mb-1">
          The API key you provided has been stored as <code className="bg-muted px-1 py-0.5 rounded text-sm">{apiKey ? "NEXT_PUBLIC_MAP_API_KEY" : "env variable (not yet loaded)"}</code>.
          {apiKey && (<> Current value: <code className="bg-muted px-1 py-0.5 rounded text-sm break-all">{apiKey}</code></>)}
        </p>
        <p className="text-sm mb-1">
          This map currently uses default OpenStreetMap tiles. To display specific environmental or weather data layers:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 pl-4">
          <li>Identify the mapping service your API key belongs to.</li>
          <li>Check if that service provides the tile layers you need (e.g., precipitation, temperature).</li>
          <li>
            Update the <code className="bg-muted px-1 py-0.5 rounded">{'<TileLayer />'}</code> component in <code className="bg-muted px-1 py-0.5 rounded">src/app/map/page.tsx</code> with the correct URL and your API key.
          </li>
        </ul>
        <p className="text-sm mt-2">
          Further development will be needed to add specific weather overlays, country selection, and advanced "semantical map" features.
        </p>
      </div>
    </div>
  );
}
