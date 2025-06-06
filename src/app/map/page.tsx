
'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet'; // Type-only import

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-muted"><p className="text-muted-foreground">Loading map core...</p></div> }
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
const LayersControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.LayersControl),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-muted"><p className="text-muted-foreground">Loading map controls...</p></div> }
);

// Leaflet image assets - these require appropriate bundler setup
// If these `require` calls fail, it means images won't load, not the primary cause of "map container initialized"
// but important for map appearance.
let iconRetinaUrlSrc: string | undefined;
let iconUrlSrc: string | undefined;
let shadowUrlSrc: string | undefined;

if (typeof window !== 'undefined') {
  try {
    iconRetinaUrlSrc = require('leaflet/dist/images/marker-icon-2x.png').default || require('leaflet/dist/images/marker-icon-2x.png');
    iconUrlSrc = require('leaflet/dist/images/marker-icon.png').default || require('leaflet/dist/images/marker-icon.png');
    shadowUrlSrc = require('leaflet/dist/images/marker-shadow.png').default || require('leaflet/dist/images/marker-shadow.png');
  } catch (e) {
    console.warn("Could not load Leaflet marker image assets via require:", e);
    // Fallback paths if require fails, assuming images are in public/leaflet-images/
    // This part is a guess, if `require` works, these are not used.
    // iconRetinaUrlSrc = '/leaflet-images/marker-icon-2x.png';
    // iconUrlSrc = '/leaflet-images/marker-icon.png';
    // shadowUrlSrc = '/leaflet-images/marker-shadow.png';
  }
}


export default function MapPage() {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_MAP_API_KEY);
    document.title = "Weather Map | Weather Weaver";

    if (typeof window !== 'undefined') {
      import('leaflet').then(LModule => {
        const L = LModule.default || LModule; // Handle potential default export

        if (L && L.Icon && L.Icon.Default) {
          if (iconUrlSrc && iconRetinaUrlSrc && shadowUrlSrc) {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
              iconRetinaUrl: iconRetinaUrlSrc,
              iconUrl: iconUrlSrc,
              shadowUrl: shadowUrlSrc,
            });
          } else {
            console.warn("Leaflet icon assets not available for patching.");
          }
        } else {
          console.warn("Leaflet L.Icon.Default not found for patching.");
        }
        setIsLeafletReady(true);
      }).catch(error => {
        console.error("Failed to load Leaflet module for icon fix:", error);
        setIsLeafletReady(true); // Still allow map to try rendering, icons might be broken
      });
    }
  }, []);

  const position: LatLngExpression = [20, 0];
  const initialZoom = 2;

  const baseLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const openStreetMapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const precipitationLayerUrl = apiKey
    ? `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`
    : undefined;
  const openWeatherMapAttribution = '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>';

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Interactive Weather Map</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore precipitation around the globe. Click the layers icon to toggle overlays.
        </p>
      </header>

      <div 
        className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-lg shadow-lg overflow-hidden border border-border"
        key={isLeafletReady ? 'map-initialized' : 'map-initializing-wrapper'}
      >
        {isLeafletReady ? (
          <Suspense fallback={<div className="flex items-center justify-center h-full bg-muted"><p className="text-muted-foreground">Initializing map components...</p></div>}>
            <MapContainer center={position} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    attribution={openStreetMapAttribution}
                    url={baseLayerUrl}
                  />
                </LayersControl.BaseLayer>
                {precipitationLayerUrl && (
                  <LayersControl.Overlay name="Precipitation">
                    <TileLayer
                      url={precipitationLayerUrl}
                      attribution={openWeatherMapAttribution}
                      opacity={0.7}
                    />
                  </LayersControl.Overlay>
                )}
              </LayersControl>
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  London. <br /> More features coming soon!
                </Popup>
              </Marker>
            </MapContainer>
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <p className="text-muted-foreground">Loading map resources...</p>
          </div>
        )}
      </div>
      <div className="mt-6 p-4 border rounded-lg bg-card text-card-foreground shadow">
        <h2 className="text-xl font-semibold mb-2">Developer Note:</h2>
        <p className="text-sm mb-1">
          Map API Key (<code className="bg-muted px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_MAP_API_KEY</code>): 
          {apiKey ? (<code className="bg-muted px-1 py-0.5 rounded text-sm break-all ml-1">{apiKey}</code>) : " Not loaded"}
        </p>
        <p className="text-sm">
          This map displays a base OpenStreetMap layer and attempts to overlay a precipitation layer from OpenWeatherMap using your API key.
          If the precipitation layer is not visible, please ensure your API key is valid for OpenWeatherMap tile services and that it has the necessary permissions.
        </p>
      </div>
    </div>
  );
}

