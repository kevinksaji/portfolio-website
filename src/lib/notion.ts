// for fetching blog posts from Notion database and individual pages

import { NotionAPI } from 'notion-client';

// initialize Notion client for react-notion-x
export const notionClient = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2
});

// types for blog posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedDate: string;
  category: string;
  content: string;
  coverImage?: string;
}

// Smart caching for blog posts - single fetch strategy
// This cache is shared across all blog-related pages to minimize API calls
let blogPostsCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes - longer since we're fetching once

/**
 * Fetches all blog posts from Notion database with intelligent caching
 * 
 * This function implements a smart caching strategy where:
 * - First call to any blog page fetches data from Notion
 * - Subsequent calls within 10 minutes use cached data
 * - All blog-related pages share the same cache
 * - Cache automatically expires after 10 minutes
 * 
 * @returns Promise<BlogPost[]> Array of all blog posts sorted by published date
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (blogPostsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return blogPostsCache;
    }
    
    const databasePageId = process.env.NOTION_DATABASE_ID;
    
    // if the database page id is not set, return an empty array
    if (!databasePageId) {
      return [];
    }
    
    // fetch the database page to get all the blog post pages
    const databasePage = await notionClient.getPage(databasePageId);
    
    if (!databasePage) {
      console.log('Database page not found');
      return [];
    }

    // initialize an empty array to store the blog posts
    const posts: BlogPost[] = [];
    
    // Extract all the pages from the database
    // The database structure will have child pages that are blog posts
    const allPageIds = Object.keys(databasePage.block).filter(id => 
      databasePage.block[id]?.value?.type === 'page' && 
      id !== databasePageId
    );

    // Pre-filter pages to only include those that seem accessible
    const pageIds = allPageIds.filter(id => {
      const block = databasePage.block[id];
      // Basic check - ensure the block has the expected structure
      return block?.value?.properties || block?.value?.type === 'page';
    });

    // Fetch each blog post page
    for (const pageId of pageIds) {
      try {
        const postPage = await notionClient.getPage(pageId);
        if (!postPage) {
          continue;
        }

        const page = postPage.block[pageId];
        if (!page?.value) {
          continue;
        }

        // Extract blog post data from properties
        const properties = page.value.properties || {};
        

        
        // Skip database pages (pages that only have a title, no other properties)
        if (Object.keys(properties).length <= 1) {
          continue;
        }
        
        // Get title from the page title property
        const title = properties.title?.[0]?.[0] || `Blog Post ${pageId.slice(0, 8)}`;
        
        // Extract category from properties - POZ` field contains the category
        let category = 'Uncategorized';
        if (properties['POZ`']) {
          category = properties['POZ`'][0]?.[0] || 'Uncategorized';
        }
        
        // Extract slug from properties - Oa:r field contains the slug
        let slug = properties['Oa:r']?.[0]?.[0] || '';
        if (!slug) {
          // Generate slug from title if not provided
          slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        
        // Extract status from properties - Kq:o field contains the status
        let status = 'Draft';
        if (properties['Kq:o']) {
          status = properties['Kq:o'][0]?.[0] || 'Draft';
        }
        
        // Extract published date - eVWe field contains the published date
        let publishedDate = new Date().toISOString();
        if (properties['eVWe']?.[0]?.[1]?.[0]?.[1]?.start_date) {
          const dateStr = properties['eVWe'][0][1][0][1].start_date;
          publishedDate = new Date(dateStr).toISOString();
        }
        
        // Extract cover image
        const coverImage = properties['Cover Image']?.[0]?.[0] || undefined;
        
        // Extract content from the page blocks - be more flexible with content extraction
        let content = '';
        const allBlocks = Object.values(postPage.block);

        // Get text content from various block types
        allBlocks.forEach((block) => {
          if (
            block &&
            typeof block === 'object' &&
            block.value &&
            block.value.id !== pageId
          ) {
            const blockProps = block.value.properties;

            // Extract text from different block types
            if (blockProps?.title && Array.isArray(blockProps.title)) {
              const text = blockProps.title.map((item: unknown[]) => item[0]).join('');
              if (text.trim()) {
                content += text + '\n\n';
              }
            }
          }
        });

        // If no content was extracted, use a placeholder
        if (!content.trim()) {
          content = `Content for ${title}`;
        }

        posts.push({
          id: pageId,
          title,
          slug,
          status,
          publishedDate,
          category,
          content: content.trim(),
          coverImage
        });

      } catch {
        // Don't let one failed page break the entire process
        continue;
      }
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    
            // Cache the results - this will be used by ALL blog-related pages
    blogPostsCache = posts;
    cacheTimestamp = now;
    
    return posts;
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}



/**
 * Fetches a single blog post by its slug
 * 
 * This function uses the reliable approach of fetching all posts and finding by slug.
 * While not the most efficient for large datasets, it ensures reliability and works
 * with the existing caching system.
 * 
 * @param slug - The URL slug of the blog post to find
 * @returns Promise<BlogPost | null> The blog post if found, null otherwise
 */
export async function getBlogPostBySlugDirect(slug: string): Promise<BlogPost | null> {
  try {
    console.log('🔍 Fetching blog post by slug:', slug);
    
    // Use the reliable approach: fetch all posts and find by slug
    // This is actually the RIGHT approach for a blog with reasonable post count
    const posts = await getBlogPosts();
    const post = posts.find(p => p.slug === slug);
    
    if (post) {
      console.log(`✅ Found blog post: ${post.title}`);
      return post;
    } else {
      console.log('❌ No blog post found with slug:', slug);
      return null;
    }
    
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

/**
 * Main function to get a blog post by slug
 * 
 * This is the public API function that delegates to getBlogPostBySlugDirect.
 * It maintains backward compatibility while allowing for future optimizations.
 * 
 * @param slug - The URL slug of the blog post to find
 * @returns Promise<BlogPost | null> The blog post if found, null otherwise
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Use the direct method instead of fetching all posts
  return getBlogPostBySlugDirect(slug);
}

/**
 * Fetches all blog posts in a specific category
 * 
 * This function filters the cached blog posts by category name.
 * It's case-insensitive and uses the existing cache for performance.
 * 
 * @param category - The category name to filter by (case-insensitive)
 * @returns Promise<BlogPost[]> Array of blog posts in the specified category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

/**
 * Fetches the full Notion page content for rendering
 * 
 * This function retrieves the complete page content including all blocks,
 * which is needed for the NotionRenderer component to display the full blog post.
 * 
 * @param pageId - The Notion page ID to fetch content for
 * @returns Promise<any> The full page record map for rendering
 */
export async function getNotionPage(pageId: string) {
  try {
            // Use notion-client to get the full page content
        const recordMap = await notionClient.getPage(pageId);
        
        return recordMap;
    
  } catch (error) {
    console.error('Error fetching Notion page content:', error);
    return null;
  }
}
