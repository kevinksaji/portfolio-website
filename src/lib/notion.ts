import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

// Initialize Notion client for official API
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Cache for blog posts to avoid repeated API calls
let blogPostsCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Types for blog posts
export interface BlogPost {
  id: string;
  title: string;
  category: string;
  slug: string;
  publishedDate: string;
  coverImage?: string;
  status: 'Draft' | 'Published';
}

// Type for Notion page properties
interface NotionProperties {
  Title?: {
    title: Array<{ plain_text: string }>;
  };
  Category?: {
    select: { name: string } | null;
  };
  Status?: {
    status: { name: string } | null;
  };
  Slug?: {
    rich_text: Array<{ plain_text: string }>;
  };
  'Published Date'?: {
    date: { start: string } | null;
  };
  'Cover Image'?: {
    files: Array<{ file: { url: string } }>;
  };
}

// Helper function to check if cache is still valid
function isCacheValid(): boolean {
  return blogPostsCache !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

// Server-side cached version of getBlogPosts for better performance
export const getCachedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    return getBlogPosts();
  },
  ['blog-posts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['blog-posts']
  }
);

// Fetch all published blog posts from Notion database with caching
export async function getBlogPosts(): Promise<BlogPost[]> {
  // Return cached data if it's still valid
  if (isCacheValid()) {
    console.log('📦 Returning cached blog posts');
    return blogPostsCache!;
  }

  try {
    console.log('🔄 Fetching fresh blog posts from Notion...');
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
    });

    const posts = response.results
      .filter((page) => 'properties' in page)
      .map((page) => {
        const p = page as Record<string, unknown>;
        const properties = p.properties as NotionProperties;
        return {
          id: p.id as string,
          title: properties.Title?.title?.[0]?.plain_text || '',
          category: properties.Category?.select?.name || '',
          slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
          publishedDate: properties['Published Date']?.date?.start || '',
          coverImage: properties['Cover Image']?.files?.[0]?.file?.url || '',
          status: (properties.Status?.status?.name as 'Draft' | 'Published') || 'Draft',
        };
      });

    // Update cache
    blogPostsCache = posts;
    cacheTimestamp = Date.now();
    console.log(`✅ Cached ${posts.length} blog posts`);

    return posts;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    
    // Return cached data if available, even if expired
    if (blogPostsCache !== null) {
      console.log('⚠️ Returning expired cache due to API error');
      return blogPostsCache;
    }
    
    return [];
  }
}

// Fetch a single blog post by slug (uses cached data when possible)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try to get from cache first
  if (isCacheValid()) {
    const cachedPost = blogPostsCache!.find(post => post.slug === slug);
    if (cachedPost) {
      console.log('📦 Returning cached blog post:', slug);
      return cachedPost;
    }
  }

  // If not in cache, fetch fresh data
  try {
    console.log('🔄 Fetching fresh blog post:', slug);
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug,
        },
      },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0];
    if (!('properties' in page)) return null;
    
    const properties = page.properties as unknown as NotionProperties;
    const post = {
      id: page.id,
      title: properties.Title?.title?.[0]?.plain_text || '',
      category: properties.Category?.select?.name || '',
      slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
      publishedDate: properties['Published Date']?.date?.start || '',
      coverImage: properties['Cover Image']?.files?.[0]?.file?.url || '',
      status: (properties.Status?.status?.name as 'Draft' | 'Published') || 'Draft',
    };

    // Update cache with this post if it's not already there
    if (blogPostsCache) {
      const existingIndex = blogPostsCache.findIndex(p => p.id === post.id);
      if (existingIndex >= 0) {
        blogPostsCache[existingIndex] = post;
      } else {
        blogPostsCache.push(post);
      }
    }

    return post;
  } catch (error) {
    console.error('❌ Error fetching blog post by slug:', error);
    return null;
  }
}

// Get Notion page content for rendering (this is the heavy operation)
export async function getNotionPage(pageId: string) {
  try {
    console.log('🔄 Fetching Notion page content:', pageId);
    
    // Use the official Notion API to get page blocks with pagination
    let allBlocks: Record<string, unknown>[] = [];
    let hasMore = true;
    let startCursor: string | undefined;
    
    while (hasMore) {
      const response = await notion.blocks.children.list({ 
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100 // Maximum allowed by Notion API
      });
      
      allBlocks = allBlocks.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor || undefined;
      
      console.log(`📄 Fetched ${response.results.length} blocks (total: ${allBlocks.length})`);
    }
    
    console.log(`📄 Total blocks fetched: ${allBlocks.length}`);
    
    // Convert the official API response to a format our renderer can use
    const recordMap = {
      block: {} as Record<string, {
        value: {
          id: string;
          type: string;
          properties: Record<string, unknown>;
        };
      }>
    };
    
    // Add the page itself
    recordMap.block[pageId] = {
      value: {
        id: pageId,
        type: 'page',
        properties: {}
      }
    };
    
    // Add all the blocks
    allBlocks.forEach((block: Record<string, unknown>) => {
      const blockId = block.id as string;
      const blockType = block.type as string;
      const blockProperties = (block[blockType] as Record<string, unknown>) || {};
      
      recordMap.block[blockId] = {
        value: {
          id: blockId,
          type: blockType,
          properties: {
            rich_text: (blockProperties.rich_text as Array<{ plain_text: string }> | undefined) || []
          }
        }
      };
    });
    
    console.log('✅ Page content processed successfully');
    return recordMap;
    
  } catch (error) {
    console.error('❌ Error fetching Notion page content:', error);
    return null;
  }
}
