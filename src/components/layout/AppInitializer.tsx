
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Preloader } from '@/components/layout/Preloader';

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  if (isAppLoading) {
    return <Preloader />;
  }

  return <>{children}</>;
}
