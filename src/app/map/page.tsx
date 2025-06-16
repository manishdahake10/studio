
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression, GeoJSON as LeafletGeoJSON, Layer, PathOptions, Feature, GeoJsonObject, Geometry } from 'leaflet'; // Type-only import
import type { GeoJSONProps } from 'react-leaflet';


// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic( // Keep Marker for potential future use or if needed by other logic
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic( // Keep Popup for potential future use
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const LayersControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.LayersControl),
  { ssr: false }
);
const GeoJSON = dynamic<GeoJSONProps>(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);


// Leaflet image assets
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
  }
}


export default function MapPage() {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [countriesData, setCountriesData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_MAP_API_KEY); // OWM API Key for tile layers
    document.title = "Climate Map | Weather Weaver";

    if (typeof window !== 'undefined') {
      import('leaflet').then(LModule => {
        const L = LModule.default || LModule; 

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
        setIsLeafletReady(true); 
      });

      // Fetch countries GeoJSON data
      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => setCountriesData(data as GeoJsonObject))
        .catch(error => console.error('Error fetching countries GeoJSON:', error));
    }
  }, []);

  const position: LatLngExpression = [20, 0]; // Initial map center
  const initialZoom = 2;

  const baseLayerUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const cartoDBAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  
  const openWeatherMapAttribution = '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>';
  
  const precipitationLayerUrl = apiKey
    ? `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`
    : undefined;
  const temperatureLayerUrl = apiKey
    ? `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`
    : undefined;
  const windSpeedLayerUrl = apiKey
    ? `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`
    : undefined;


  const countryStyle: PathOptions = {
    fillColor: 'transparent',
    fillOpacity: 0.1,
    color: '#00FFFF', // Cyan
    weight: 1,
    opacity: 0.7,
  };

  const highlightFeature = useCallback((e: { target: Layer }) => {
    const layer = e.target as LeafletGeoJSON;
    layer.setStyle({
      weight: 2.5,
      color: '#00FFFF',
      fillColor: '#00FFFF',
      fillOpacity: 0.3,
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }, []);

  const resetHighlight = useCallback((e: { target: Layer }) => {
    const layer = e.target as LeafletGeoJSON;
    // Check if the layer has a 'resetStyle' method or if it's a GeoJSON layer to reset explicitly
    if (typeof (layer as any).resetStyle === 'function') {
        (layer as any).resetStyle(layer); // For react-leaflet v3+
    } else {
         // Fallback or for different react-leaflet versions, you might need to re-apply the original style
        layer.setStyle(countryStyle);
    }
  }, [countryStyle]);


  const onEachCountry = useCallback((country: Feature<Geometry, any>, layer: Layer) => {
    const countryName = country.properties.name || "Unknown Country";
    layer.bindTooltip(countryName, {sticky: true, direction: 'auto', className: 'country-tooltip'});
    
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => {
        // Placeholder for future click functionality (e.g., fetch weather)
        console.log(`Clicked on ${countryName}`);
        // Example: Show a popup on click (can be expanded later)
        (layer as LeafletGeoJSON).bindPopup(`Detailed info for ${countryName} coming soon!`).openPopup();
      }
    });
  }, [highlightFeature, resetHighlight]);


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Global Climate Map</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Interactive world map with real-time weather data overlays. Hover over countries.
        </p>
      </header>

      <div 
        className="h-[calc(100vh-280px)] min-h-[500px] w-full rounded-lg shadow-lg overflow-hidden border border-cyan-500/50 bg-black"
        key={isLeafletReady ? 'map-initialized' : 'map-initializing-wrapper'}
      >
        {isLeafletReady ? (
          <Suspense fallback={<div className="flex items-center justify-center h-full bg-slate-800 text-slate-300"><p>Initializing map components...</p></div>}>
            <MapContainer center={position} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%', background: '#0a0f14' }}>
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Dark Matter Base">
                  <TileLayer
                    attribution={cartoDBAttribution}
                    url={baseLayerUrl}
                    subdomains="abcd"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
                
                {countriesData && GeoJSON && (
                  <LayersControl.Overlay checked name="Country Borders">
                    <GeoJSON 
                        data={countriesData} 
                        style={countryStyle} 
                        onEachFeature={onEachCountry} 
                    />
                  </LayersControl.Overlay>
                )}

                {precipitationLayerUrl && (
                  <LayersControl.Overlay name="Precipitation">
                    <TileLayer
                      url={precipitationLayerUrl}
                      attribution={openWeatherMapAttribution}
                      opacity={0.7}
                    />
                  </LayersControl.Overlay>
                )}
                {temperatureLayerUrl && (
                  <LayersControl.Overlay name="Temperature">
                    <TileLayer
                      url={temperatureLayerUrl}
                      attribution={openWeatherMapAttribution}
                      opacity={0.7}
                    />
                  </LayersControl.Overlay>
                )}
                {windSpeedLayerUrl && (
                  <LayersControl.Overlay name="Wind Speed">
                    <TileLayer
                      url={windSpeedLayerUrl}
                      attribution={openWeatherMapAttribution}
                      opacity={0.7}
                    />
                  </LayersControl.Overlay>
                )}
              </LayersControl>
              {/* Example Marker, can be removed or used for GPS location later */}
              {Marker && Popup && <Marker position={[51.505, -0.09]}><Popup>London (Example)</Popup></Marker>}
            </MapContainer>
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-900 text-slate-200">
            <p>Loading map resources...</p>
          </div>
        )}
      </div>
      <div className="mt-6 p-4 border rounded-lg bg-card text-card-foreground shadow">
        <h2 className="text-xl font-semibold mb-2">Developer Note:</h2>
        <p className="text-sm mb-1">
          Map API Key for OWM tiles (<code className="bg-muted px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_MAP_API_KEY</code>): 
          {apiKey ? (<code className="bg-muted px-1 py-0.5 rounded text-sm break-all ml-1">{apiKey}</code>) : " Not loaded"}
        </p>
        <p className="text-sm">
          This map displays a dark base layer with GeoJSON country borders and various OpenWeatherMap tile overlays.
          If layers are not visible, ensure your API key is valid for OpenWeatherMap tile services.
        </p>
      </div>
       <style jsx global>{`
        .country-tooltip {
          background-color: rgba(0, 20, 30, 0.85) !important;
          border: 1px solid #00FFFF !important;
          color: #00FFFF !important;
          border-radius: 4px;
          box-shadow: 0 0 10px #00FFFF;
          font-family: 'Courier New', Courier, monospace;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(0, 20, 30, 0.9) !important;
          color: #E0F2F1 !important;
          border: 1px solid #00FFFF;
          border-radius: 4px;
          box-shadow: 0 0 8px #00FFFF;
        }
        .leaflet-popup-content {
          font-family: 'Courier New', Courier, monospace;
          color: #E0F2F1 !important;
        }
        .leaflet-popup-tip {
          background: rgba(0, 20, 30, 0.9) !important;
          border-left-color: #00FFFF !important; 
          border-right-color: #00FFFF !important; 
        }
        .leaflet-control-layers {
            background: rgba(10, 15, 20, 0.85) !important;
            color: #E0F2F1 !important;
            border: 1px solid #00FFFF !important;
            box-shadow: 0 0 8px #00FFFF;
        }
        .leaflet-control-layers-base label, .leaflet-control-layers-overlays label {
            color: #E0F2F1 !important;
        }
        .leaflet-control-layers-selector {
            margin-right: 5px;
        }
      `}</style>
    </div>
  );
}
