import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen w-full bg-background pt-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Category Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The category you&apos;re looking for doesn&apos;t exist or has no posts yet.
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
