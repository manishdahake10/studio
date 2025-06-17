
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Weather Weaver.',
};

export default function PrivacyPolicyPage() {
  const effectiveDate = "17-06-2025"; // As specified by user

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Privacy Policy</h1>
        <p className="mt-2 text-lg text-muted-foreground">Effective Date: {effectiveDate}</p>
      </header>

      <div className="max-w-3xl mx-auto space-y-6 text-foreground/90 leading-relaxed">
        <p>
          At Weather Weaver, we are committed to protecting your privacy and ensuring transparency in how we collect, use, and safeguard your personal information. This Privacy Policy outlines the types of information we collect and how we use it.
        </p>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">1. Information We Collect</h2>
          <p>
            We collect the following types of information when you interact with our website:
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">a. Non-Personal Information:</h3>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li>Search queries (e.g., city or country name)</li>
            <li>Browser type and device information</li>
            <li>IP address (for location-based weather and news)</li>
            <li>Anonymous usage data (pages visited, time spent)</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">b. No Personal Identifiable Information (PII) Collected:</h3>
          <p>
            We do not collect or store any personal details like your name, email, or contact information unless explicitly provided by you (e.g., via feedback form).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">2. Use of Information</h2>
          <p>
            We use the collected data to:
          </p>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li>Provide accurate real-time weather and AQI information</li>
            <li>Deliver location-specific news updates</li>
            <li>Improve website functionality and user experience</li>
            <li>Analyze website traffic and performance</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">3. Third-Party APIs</h2>
          <p>
            Our website uses third-party APIs to retrieve data:
          </p>
           <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li><strong>OpenWeather API</strong> – for weather data and air quality index. 
                <br />
                <em className="text-sm">Privacy Policy: <Link href="https://openweather.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://openweather.co.uk/privacy-policy</Link></em>
            </li>
            <li><strong>GNews API</strong> – for local news related to the searched location.
                <br />
                <em className="text-sm">Privacy Policy: <Link href="https://gnews.io/privacy_policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://gnews.io/privacy_policy</Link></em>
            </li>
          </ul>
          <p className="mt-2">
            These services may log anonymous data such as location or search keywords as per their own privacy policies. We do not control or store this data on our own servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">4. Cookies</h2>
          <p>
            We may use cookies or similar technologies to enhance user experience. Cookies help us remember your preferences and understand user behavior. You can disable cookies through your browser settings.
            Weather Weaver uses localStorage to remember the last city you searched for, for your convenience. This data is stored only in your browser and is not transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">5. Data Security</h2>
          <p>
            We do not store any sensitive data on our servers. We use industry-standard tools and hosting platforms that are designed to be secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">6. Children's Privacy</h2>
          <p>
            Weather Weaver is not intended for use by children under the age of 13. We do not knowingly collect data from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will always be available on this page with the “Effective Date” updated.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">8. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, you can contact us at:
            <br />
            Email: <a href="mailto:manishdahake2026@gmail.com" className="text-accent hover:underline">manishdahake2026@gmail.com</a>
          </p>
        </section>

        <p className="mt-4">
          By using Weather Weaver, you agree to the terms outlined in this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
