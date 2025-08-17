import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-background overflow-y-auto">
      <div className="pt-20 px-4 max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-6">📝</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Blog Post Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link 
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
