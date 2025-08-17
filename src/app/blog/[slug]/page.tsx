import { getBlogPostBySlug, getNotionPage } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import NotionRenderer from '@/components/NotionRenderer';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const notionPage = await getNotionPage(post.id);

  return (
    <main className="min-h-screen w-full bg-background overflow-y-auto">
      <article className="pt-20 px-4 max-w-4xl mx-auto pb-16">
        {/* Header */}
        <header className="mb-8">
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

        {/* Content */}
        <div className="flex justify-center">
          {notionPage ? (
            <NotionRenderer
              recordMap={notionPage}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Content Not Available
              </h2>
              <p className="text-muted-foreground mb-4">
                The blog post content couldn&apos;t be loaded from Notion.
              </p>
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
