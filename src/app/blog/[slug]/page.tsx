import { getBlogPostBySlug, getNotionPage } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import NotionRenderer from '@/components/NotionRenderer';

// Props interface for the blog post page component
// params is a Promise containing the slug from the dynamic route
interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Main blog post page component - fetches and renders individual blog posts
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Extract slug from the dynamic route parameters
  const { slug } = await params;
  
  // Fetch blog post metadata using the slug
  const post = await getBlogPostBySlug(slug);
  
  // If no post found, trigger Next.js 404 page
  if (!post) {
    notFound();
  }

  // Fetch the full Notion page content using the post ID
  const notionPage = await getNotionPage(post.id);

  return (
    <main className="min-h-screen w-full bg-background overflow-y-auto">
      <article className="pt-20 px-4 max-w-4xl mx-auto pb-16">
        {/* Blog post header section with cover image and metadata */}
        <header className="mb-8">
          {/* Conditional cover image display */}
          {post.coverImage && (
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-6">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {/* Post title and publication date */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <time dateTime={post.publishedDate}>
                {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>
        </header>

        {/* Main content section - renders Notion content or fallback */}
        <div className="flex justify-center">
          {notionPage ? (
            // Render the Notion content using the NotionRenderer component
            <NotionRenderer
              recordMap={notionPage}
            />
          ) : (
            // Fallback UI when Notion content fails to load
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Content Not Available
              </h2>
              <p className="text-muted-foreground mb-4">
                The blog post content couldn&apos;t be loaded from Notion.
              </p>
              {/* Debug information for troubleshooting */}
              <div className="bg-muted p-4 rounded-lg text-left">
                <p className="text-sm text-muted-foreground">
                  <strong>Debug Info:</strong><br />
                  Post ID: {post.id}<br />
                  Title: {post.title}<br />
                  Slug: {post.slug}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}