import { getCachedBlogPosts } from '@/lib/notion';
import Link from 'next/link';
import { FaCode, FaFutbol, FaChartLine } from 'react-icons/fa';

export default async function BlogPage() {
  const posts = await getCachedBlogPosts();
  
  // Get unique categories and count posts in each
  const categories = posts.reduce((acc, post) => {
    if (post.category) {
      acc[post.category] = (acc[post.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryTiles = [
    { 
      name: 'Computer Science', 
      count: categories['Computer Science'] || 0, 
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      icon: FaCode
    },
    { 
      name: 'Sports', 
      count: categories['Sports'] || 0, 
      color: 'bg-green-500/10 text-green-600 border-green-200',
      icon: FaFutbol
    },
    { 
      name: 'Hobbies', 
      count: categories['Hobbies'] || 0, 
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
      icon: FaChartLine
    },
  ];

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

        {/* Category Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </main>
  );
}
