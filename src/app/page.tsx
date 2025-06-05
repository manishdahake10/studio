
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

export default function HomePage() {
  return (
    // The WeatherDashboard itself will be wrapped by the main layout's <main> tag
    // It includes its own container and padding.
    <WeatherDashboard />
  );
}
