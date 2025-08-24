import { getBlogPosts } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = await getBlogPosts();
  
  // Decode the category from URL and filter posts
  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');
  // Properly capitalize the category name
  const formattedCategory = decodedCategory.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  const filteredPosts = posts.filter(post => 
    post.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  if (filteredPosts.length === 0) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen w-full bg-background pt-12 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 -mt-20">
        {/* Category Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {formattedCategory}
          </h1>
        </div>

        {/* Posts Grid - Centered */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="group flex flex-col space-y-3 p-8 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  {post.coverImage && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                      <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h2>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
