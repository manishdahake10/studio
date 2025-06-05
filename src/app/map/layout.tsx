
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weather Map',
  description: 'Interactive world map providing environmental and weather information.',
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
