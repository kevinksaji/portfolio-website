export default function BlogLoading() {
  return (
    <main className="min-h-screen w-full bg-background pt-12 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 -mt-20">
        {/* Blog Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-20 bg-muted rounded-lg mb-6 animate-pulse"></div>
        </div>

        {/* Blog Description Skeleton */}
        <div className="text-center mb-12">
          <div className="h-6 bg-muted rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        {/* Category Tiles Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="group flex flex-col items-center space-y-3 p-8 rounded-xl bg-card border border-border">
              {/* Icon Skeleton */}
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse"></div>
              
              {/* Text Skeleton */}
              <div className="text-center">
                <div className="h-6 bg-muted rounded mb-3 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-20 mx-auto animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
