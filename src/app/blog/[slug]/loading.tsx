export default function Loading() {
  return (
    <main className="min-h-screen w-full bg-background overflow-y-auto">
      <article className="pt-20 px-4 max-w-4xl mx-auto">
        {/* Header skeleton */}
        <header className="mb-8">
          <div className="h-64 md:h-96 bg-muted rounded-lg mb-6 animate-pulse"></div>
          
          <div className="text-center">
            <div className="h-10 bg-muted rounded-lg mb-4 animate-pulse"></div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-6 bg-muted rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </header>

        {/* Content skeleton */}
        <div className="space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </article>
    </main>
  );
}
