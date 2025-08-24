import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/notion';

// Props interface for the blog post card component
// post contains the blog post metadata (title, slug, coverImage, etc.)
interface BlogPostCardProps {
  post: BlogPost;
}

// Blog post card component - displays a preview of a blog post
// When clicked, it navigates to the full blog post page
export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Formats the published date into a readable format (e.g., "Jan 15, 2024")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    // Next.js Link component handles client-side navigation
    // href={`/blog/${post.slug}`} creates the URL path for this specific blog post
    // When clicked, it navigates to /blog/[slug] which triggers the [slug]/page.tsx route
    <Link href={`/blog/${post.slug}`} className="group">
      {/* Article element for semantic HTML - represents a blog post preview */}
      <article className="group flex flex-col items-center space-y-3 p-6 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        {/* Conditional cover image display - only shows if post has a cover image */}
        {post.coverImage && (
          <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        {/* Content section with metadata and title */}
        <div className="text-center">
          {/* Publication date and category display */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span>•</span>
            {/* Category badge with secondary styling */}
            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">{post.category}</span>
          </div>
          
          {/* Blog post title - changes color on hover using group hover */}
          <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h2>
        </div>
      </article>
    </Link>
  );
}