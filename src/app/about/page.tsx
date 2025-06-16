
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Weather Weaver',
  description: 'Learn more about the Weather Weaver application, its features, and technology.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-bold text-center text-primary">About Weather Weaver</h1>
        <p className="mt-2 text-lg text-center text-muted-foreground">
          Your go-to source for clear and concise weather information.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 border-b pb-2 text-primary/90">Our Mission</h2>
          <p className="text-foreground/90 leading-relaxed">
            Weather Weaver aims to provide users with accurate, easy-to-understand weather data for locations worldwide.
            We focus on a clean interface and essential information, helping you plan your day effectively,
            whether you're checking the current conditions or looking at the 7-day forecast.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 border-b pb-2 text-primary/90">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/90 pl-4">
            <li><strong>Real-Time Weather:</strong> Get up-to-the-minute data on temperature, humidity, wind, and visibility.</li>
            <li><strong>City Search:</strong> Easily find weather information for any city.</li>
            <li><strong>7-Day Forecast:</strong> Plan ahead with detailed daily forecasts.</li>
            <li><strong>Air Quality Data:</strong> Stay informed about current and forecasted air pollution levels.</li>
            <li><strong>Theme Toggle:</strong> Switch between light and dark modes for your viewing comfort.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 border-b pb-2 text-primary/90">Technology Stack</h2>
          <p className="text-foreground/90 leading-relaxed">
            Weather Weaver is built with a modern, robust technology stack:
          </p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80 pl-4 mt-2">
            <li>Next.js (App Router) for a performant React framework</li>
            <li>React for building the user interface</li>
            <li>Tailwind CSS for utility-first styling</li>
            <li>ShadCN UI for pre-built, accessible components</li>
            <li>Lucide Icons for a clean icon set</li>
            <li>OpenWeatherMap API for weather and air quality data</li>
            <li>GNews.io API for weather-related news</li>
          </ul>
        </section>

        <p className="mt-10 text-center text-muted-foreground">
          Thanks for visiting Weather Weaver!
        </p>
      </div>
    </div>
  );
}
