
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Map',
  description: 'Map page for Weather Weaver.',
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
