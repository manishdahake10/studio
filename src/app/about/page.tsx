
import type { Metadata } from 'next';
import Link from 'next/link'; // Import Link for any potential internal links if needed in future

export const metadata: Metadata = {
  title: 'About Weather Weaver',
  description: 'Learn more about Weather Weaver, empowering you with real-time climate insights – anywhere, anytime.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">About Weather Weaver</h1>
        <p className="mt-3 text-xl text-muted-foreground">
          Empowering you with real-time climate insights – anywhere, anytime.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-10">
        <section>
          <p className="text-lg text-foreground/90 leading-relaxed text-center">
            Welcome to Weather Weaver, your all-in-one weather broadcasting platform built to provide accurate, real-time weather updates, air quality monitoring, and location-specific climate news — all in one place.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-4 border-b pb-2 text-primary/90">What We Do</h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            Weather Weaver offers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/90 pl-4 mb-4">
            <li><strong>Live weather conditions</strong> with temperature, humidity, pressure, wind speed, and more.</li>
            <li><strong>7-day weather forecast</strong> with interactive visual charts for better planning.</li>
            <li><strong>Air Quality Index (AQI)</strong> to help you monitor environmental health and pollution levels.</li>
            <li><strong>News updates</strong> related to the city or country you search, giving context to ongoing climatic events.</li>
          </ul>
          <p className="text-foreground/90 leading-relaxed">
            Simply enter a country or city name, and we’ll fetch and display:
          </p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80 pl-4 mt-2">
            <li>Weather information</li>
            <li>Air Quality Index details</li>
            <li>Relevant news articles</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-4 border-b pb-2 text-primary/90">Powered by Trusted APIs</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            We use reliable and trusted third-party APIs to ensure data accuracy and real-time access:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary/80">OpenWeather API</h3>
              <p className="text-foreground/80 leading-relaxed ml-2">
                Provides current weather data and 7-day forecasts.
                <br />
                <em className="text-sm">Source: <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://openweathermap.org</a></em>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/80">OpenWeather Air Pollution API</h3>
              <p className="text-foreground/80 leading-relaxed ml-2">
                Offers real-time Air Quality Index (PM2.5, PM10, O3, NO2, etc.) to help users understand environmental pollution levels.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary/80">GNews API</h3>
              <p className="text-foreground/80 leading-relaxed ml-2">
                Delivers location-specific news articles related to climate, disasters, or environmental changes.
                <br />
                <em className="text-sm">Source: <a href="https://gnews.io" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://gnews.io</a></em>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-4 border-b pb-2 text-primary/90">Our Mission</h2>
          <blockquote className="italic text-lg text-foreground/90 border-l-4 border-primary pl-4 py-2">
            "To provide easy access to real-time climate and environment-related information so that people can make safer, smarter decisions in their daily lives."
          </blockquote>
          <p className="text-foreground/90 leading-relaxed mt-4">
            Whether you’re planning a trip, monitoring air quality for health reasons, or staying updated on environmental news, Weather Weaver brings everything to your fingertips — fast, accurate, and visually engaging.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-4 border-b pb-2 text-primary/90">Stay Connected</h2>
          <p className="text-foreground/90 leading-relaxed">
            We are constantly working to enhance the platform by integrating more features, improving accuracy, and expanding to more regions.
          </p>
          <p className="text-foreground/90 leading-relaxed mt-2">
            Feel free to connect with us or share your feedback. Your input helps us improve.
          </p>
        </section>

        <p className="mt-12 text-center text-muted-foreground">
          Thanks for choosing Weather Weaver!
        </p>
      </div>
    </div>
  );
}
