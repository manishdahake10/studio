
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-4 border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Manish Dahake. Powered by OpenWeatherMap.</p>
        <nav className="mt-2">
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <span className="mx-2">|</span>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

    