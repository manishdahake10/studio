
'use client';

import { useEffect } from 'react';

export default function MapPage() {
  useEffect(() => {
    // This effect can be used to set the document title or other client-side initializations
    // For now, it just ensures the component is client-side.
    document.title = "Map | Weather Weaver";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Map Page</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          The map functionality has been removed. This is a placeholder page.
        </p>
      </header>
      <div className="flex justify-center items-center h-[calc(100vh-280px)] min-h-[400px] border rounded-lg bg-muted/20">
        <p className="text-xl text-muted-foreground">Map content has been cleared.</p>
      </div>
    </div>
  );
}
