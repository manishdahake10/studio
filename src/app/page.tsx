import { Header } from "@/components/layout/Header";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <WeatherDashboard />
      </main>
      <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Weather Weaver. Powered by WeatherAPI.</p>
      </footer>
    </div>
  );
}
