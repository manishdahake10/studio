
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Weather Weaver.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Privacy Policy</h1>
        <p className="mt-2 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="max-w-3xl mx-auto space-y-6 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">Introduction</h2>
          <p>
            Welcome to Weather Weaver ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>
          <p className="mt-2">
            This privacy notice describes how we might use your information if you:
          </p>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li>Visit our website at [Your Website URL - e.g., https://weatherweaver.com]</li>
            <li>Engage with us in other related ways ― including any sales, marketing, or events</li>
          </ul>
          <p className="mt-2">
            In this privacy notice, if we refer to:
          </p>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li><strong>"Website,"</strong> we are referring to any website of ours that references or links to this policy</li>
            <li><strong>"Services,"</strong> we are referring to our Website, and other related services, including any sales, marketing, or events</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">Personal information you disclose to us</h3>
          <p>
            <em><strong>In Short:</strong> We collect personal information that you provide to us.</em>
          </p>
          <p className="mt-2">
            We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
          </p>
          <p className="mt-2">
            The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li><strong>Location Data:</strong> When you search for weather information, we process the city or country name you provide. We do not store this information persistently linked to any personal identifier beyond what is necessary for the immediate API request and for localStorage functionality to remember your last searched city.</li>
          </ul>
           <h3 className="text-xl font-semibold mt-4 mb-2">Information automatically collected</h3>
          <p>
            <em><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Website.</em>
          </p>
          <p className="mt-2">
            We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information. This information is primarily needed to maintain the security and operation of our Website, and for our internal analytics and reporting purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">2. HOW DO WE USE YOUR INFORMATION?</h2>
          <p>
            <em><strong>In Short:</strong> We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.</em>
          </p>
          <p className="mt-2">
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
          </p>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li><strong>To provide and facilitate delivery of services to the user.</strong> We may use your information to provide you with the requested service (e.g., weather data for a specified location).</li>
            <li><strong>To manage user accounts.</strong> We may use your information for the purposes of managing our account and keeping it in working order. (If applicable)</li>
            <li><strong>To send administrative information to you.</strong> We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.</li>
             <li><strong>To protect our Services.</strong> We may use your information as part of our efforts to keep our Website safe and secure (for example, for fraud monitoring and prevention).</li>
            <li><strong>For other Business Purposes.</strong> We may use your information for other Business Purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Website, products, marketing and your experience.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
          <p>
            <em><strong>In Short:</strong> We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</em>
          </p>
           <p className="mt-2">
            We may process or share your data that we hold based on the following legal basis:
          </p>
           <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
            <li><strong>Third-Party APIs:</strong> To provide our services, we make requests to third-party APIs (OpenWeatherMap, GNews). These requests include the location (city/country) you provide. Please refer to their respective privacy policies for how they handle data:
                <ul className="list-disc list-inside pl-6 mt-1">
                    <li>OpenWeatherMap: <Link href="https://openweather.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://openweather.co.uk/privacy-policy</Link></li>
                    <li>GNews: <Link href="https://gnews.io/privacy_policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://gnews.io/privacy_policy</Link></li>
                </ul>
            </li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p>
            <em><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information. Weather Weaver uses localStorage to remember the last city you searched for, for your convenience. This data is stored only in your browser and is not transmitted to our servers.</em>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p>
            <em><strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</em>
          </p>
          <p className="mt-2">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us (if applicable).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>
            <em><strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.</em>
          </p>
          <p className="mt-2">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p>
            <em><strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.</em>
          </p>
          <p className="mt-2">
            We do not knowingly solicit data from or market to children under 18 years of age. By using the Website, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Website. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account (if applicable) and take reasonable measures to promptly delete such data from our records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p>
            <em><strong>In Short:</strong> You may review, change, or terminate your account at any time (if applicable).</em>
          </p>
           <p className="mt-2">
            If you are a resident in the European Economic Area (EEA) or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: <Link href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://edpb.europa.eu/about-edpb/board/members_en</Link>.
          </p>
          <p className="mt-2">
            If you are resident in Switzerland, the contact details for the data protection authorities are available here: <Link href="https://www.edoeb.admin.ch/edoeb/en/home.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://www.edoeb.admin.ch/edoeb/en/home.html</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p>
            <em><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
          </p>
          <p className="mt-2">
            We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-semibold mb-3 text-primary/90">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>
            If you have questions or comments about this notice, you may email us at [Your Contact Email Address] or by post to:
          </p>
          <p className="mt-2">
            [Your Company Name, if applicable] <br />
            [Your Address, if applicable] <br />
            [Your City, State, Zip, if applicable] <br />
            [Your Country, if applicable]
          </p>
        </section>
      </div>
    </div>
  );
}

    