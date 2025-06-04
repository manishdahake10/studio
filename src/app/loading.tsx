import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <div className="py-4 px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-7 w-36" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Search Bar Skeleton */}
        <div className="flex w-full max-w-sm items-center space-x-2 mx-auto my-4">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Current Weather Skeleton */}
        <div className="p-6 border rounded-lg shadow-sm mb-6">
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Skeleton className="h-20 w-20 rounded-full mr-4" />
              <div>
                <Skeleton className="h-12 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm w-full sm:w-auto">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-5 w-32" />)}
            </div>
          </div>
        </div>

        {/* Forecast Skeleton */}
        <div className="mt-6">
          <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-sm flex flex-col items-center">
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-12 w-12 rounded-md mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="py-4 px-6 border-t text-center">
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </footer>
    </div>
  );
}
