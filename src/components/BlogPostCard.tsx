import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/notion';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="group flex flex-col items-center space-y-3 p-6 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
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
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span>•</span>
            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">{post.category}</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h2>
        </div>
      </article>
    </Link>
  );
}
