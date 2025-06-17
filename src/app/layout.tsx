
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppInitializer } from '@/components/layout/AppInitializer';

export const metadata: Metadata = {
  title: {
    default: 'Weather Weaver',
    template: '%s | Weather Weaver',
  },
  description: 'Weave through weather forecasts. Real-time data, 7-day forecast, and more.',
  icons: {
    icon: '/icon.png', // Assumes icon.png is in src/app/
    apple: '/apple-icon.png', // Assumes apple-icon.png is in src/app/ for Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AppInitializer>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow w-full">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AppInitializer>
      </body>
    </html>
  );
}
