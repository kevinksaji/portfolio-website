export default function CategoryLoading() {
  return (
    <main className="min-h-screen w-full bg-background pt-12 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 -mt-20">
        {/* Category Title Skeleton */}
        <div className="text-center mb-12">
          <div className="h-16 bg-muted rounded-lg animate-pulse"></div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group flex flex-col space-y-3 p-8 rounded-xl bg-card border border-border">
                {/* Image Skeleton */}
                <div className="w-full h-48 rounded-lg bg-muted animate-pulse mb-4"></div>
                
                {/* Content Skeleton */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
