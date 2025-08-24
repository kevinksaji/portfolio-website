import { getBlogPosts } from '@/lib/notion';
import Link from 'next/link';
import { FaCode, FaFutbol, FaBook, FaLightbulb, FaHeart } from 'react-icons/fa';

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  let error: string | null = null;
  
  try {
    posts = await getBlogPosts();
    console.log('Blog posts fetched:', posts.length);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error = 'Failed to load blog posts';
    posts = []; // Ensure posts is always an array
  }
  
  // Get unique categories and count posts in each
  const categories = posts.reduce((acc, post) => {
    if (post.category) {
      acc[post.category] = (acc[post.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Dynamically generate category tiles based on actual blog post categories
  const categoryTiles = Object.entries(categories).map(([categoryName, count]) => {
    // Map category names to icons and colors
    const getCategoryStyle = (name: string) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('computer') || lowerName.includes('science') || lowerName.includes('tech')) {
        return { icon: FaCode, color: 'bg-blue-500/10 text-blue-600 border-blue-200' };
      } else if (lowerName.includes('sport') || lowerName.includes('futbol') || lowerName.includes('game')) {
        return { icon: FaFutbol, color: 'bg-green-500/10 text-green-600 border-green-200' };
      } else if (lowerName.includes('hobby') || lowerName.includes('interest') || lowerName.includes('personal')) {
        return { icon: FaHeart, color: 'bg-purple-500/10 text-purple-600 border-purple-200' };
      } else if (lowerName.includes('book') || lowerName.includes('read') || lowerName.includes('learn')) {
        return { icon: FaBook, color: 'bg-orange-500/10 text-orange-600 border-orange-200' };
      } else if (lowerName.includes('idea') || lowerName.includes('thought') || lowerName.includes('insight')) {
        return { icon: FaLightbulb, color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' };
      }
      // Default fallback
      return { icon: FaBook, color: 'bg-gray-500/10 text-gray-600 border-gray-200' };
    };

    const { icon, color } = getCategoryStyle(categoryName);
    
    return {
      name: categoryName,
      count,
      color,
      icon
    };
  });

  return (
    <main className="min-h-screen w-full bg-background pt-12 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 -mt-20">
        {/* Blog Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl sm:text-7xl font-bold text-foreground mb-6">
            What I&apos;ve been up to.
          </h1>
        </div>

        {/* Blog Description */}
        <div className="text-center mb-12">
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my thoughts and experiences across different topics. From technical insights to personal interests, discover what I&apos;m passionate about.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Failed to Load Blog
            </h2>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">
                <strong>Debug Info:</strong><br />
                Environment: {process.env.NODE_ENV}<br />
                Posts fetched: {posts.length}<br />
                Categories: {Object.keys(categories).length}<br />
                Database ID: {process.env.NOTION_DATABASE_ID ? 'Set' : 'Not Set'}<br />
                Active User: {process.env.NOTION_ACTIVE_USER ? 'Set' : 'Not Set'}<br />
                Token: {process.env.NOTION_TOKEN_V2 ? 'Set' : 'Not Set'}
              </p>
            </div>
          </div>
        )}

        {/* No Posts State */}
        {!error && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Blog Posts Found
            </h2>
            <p className="text-muted-foreground mb-4">
              No blog posts have been published yet.
            </p>
            <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">
                <strong>Debug Info:</strong><br />
                Environment: {process.env.NODE_ENV}<br />
                Posts fetched: {posts.length}<br />
                Database ID: {process.env.NOTION_DATABASE_ID ? 'Set' : 'Not Set'}
              </p>
            </div>
          </div>
        )}

        {/* Category Tiles */}
        {!error && posts.length > 0 && categoryTiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {categoryTiles.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.name} href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="group flex flex-col items-center space-y-3 p-8 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <div className={`w-16 h-16 rounded-full ${category.color.split(' ')[0]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${category.color.split(' ')[1]}`} />
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {category.count} {category.count === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
