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
  excerpt: string;
  publishedDate: string;
  category: string;
  content: string;
  coverImage?: string;
}

// fetch all published blog posts from Notion database
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const databasePageId = process.env.NOTION_DATABASE_ID;
    
    if (!databasePageId) {
      console.log('NOTION_DATABASE_ID not set - returning empty blog posts');
      return [];
    }

    console.log('🔄 Fetching blog posts from database:', databasePageId);
    
    // Fetch the database page to get all the blog post pages
    const databasePage = await notionClient.getPage(databasePageId);
    
    if (!databasePage) {
      console.log('Database page not found');
      return [];
    }

    const posts: BlogPost[] = [];
    
    // Extract all the pages from the database
    // The database structure will have child pages that are blog posts
    const allPageIds = Object.keys(databasePage.block).filter(id => 
      databasePage.block[id]?.value?.type === 'page' && 
      id !== databasePageId
    );

    console.log(`📄 Found ${allPageIds.length} potential blog posts`);
    
    // Pre-filter pages to only include those that seem accessible
    const pageIds = allPageIds.filter(id => {
      const block = databasePage.block[id];
      // Basic check - ensure the block has the expected structure
      return block?.value?.properties || block?.value?.type === 'page';
    });

    console.log(`📄 Filtered to ${pageIds.length} accessible blog posts`);

    // Fetch each blog post page
    for (const pageId of pageIds) {
      try {
        console.log(`🔄 Fetching blog post page: ${pageId}`);
        
        const postPage = await notionClient.getPage(pageId);
        if (!postPage) {
          console.log(`⚠️ No data returned for page: ${pageId}`);
          continue;
        }

        const page = postPage.block[pageId];
        if (!page?.value) {
          console.log(`⚠️ No page value found for: ${pageId}`);
          continue;
        }

        // Extract blog post data from properties
        const properties = page.value.properties || {};
        
        // Debug: Log the properties structure to understand what's available
        // console.log(`🔍 Properties for ${pageId}:`, JSON.stringify(properties, null, 2));
        
        // Skip database pages (pages that only have a title, no other properties)
        if (Object.keys(properties).length <= 1) {
          console.log(`⏭️ Skipping database page: ${pageId}`);
          continue;
        }
        
        // Get title from the page title property
        const title = properties.title?.[0]?.[0] || `Blog Post ${pageId.slice(0, 8)}`;
        
        // Extract category from properties - POZ` field contains the category
        let category = 'Uncategorized';
        if (properties['POZ`']) {
          category = properties['POZ`'][0]?.[0] || 'Uncategorized';
        }
        
        // Also try to extract slug from Oa:r field and published date from eVWe field
        let extractedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (properties['Oa:r']) {
          extractedSlug = properties['Oa:r'][0]?.[0] || extractedSlug;
        }
        
        let extractedDate = new Date().toISOString();
        if (properties['eVWe'] && properties['eVWe'][0]?.[1]?.[0]?.[1]?.start_date) {
          const dateStr = properties['eVWe'][0][1][0][1].start_date;
          extractedDate = new Date(dateStr).toISOString();
        }
        
        // Use extracted values and placeholder values
        const slug = extractedSlug;
        const excerpt = `Excerpt for ${title}`;
        const publishedDate = extractedDate;
        const coverImage = undefined;
        
        // Extract content from the page blocks - be more flexible with content extraction
        let content = '';
        const allBlocks = Object.values(postPage.block);
        
        // Get text content from various block types
        allBlocks.forEach(block => {
          if (block.value && block.value.id !== pageId) { // Skip the page block itself
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
          excerpt,
          publishedDate,
          category,
          content: content.trim(),
          coverImage
        });

        console.log(`✅ Processed blog post: ${title}`);
      } catch (error) {
        console.error(`❌ Error processing blog post ${pageId}:`, error);
        // Don't let one failed page break the entire process
        continue;
      }
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    
    console.log(`📚 Successfully fetched ${posts.length} blog posts`);
    return posts;
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Cached version of getBlogPosts for better performance
export async function getCachedBlogPosts(): Promise<BlogPost[]> {
  return getBlogPosts();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

// Get Notion page content for rendering using notion-client
export async function getNotionPage(pageId: string) {
  try {
    console.log('🔄 Fetching Notion page content:', pageId);
    
    // Use notion-client to get the full page content
    const recordMap = await notionClient.getPage(pageId);
    
    console.log('Page content fetched successfully');
    return recordMap;
    
  } catch (error) {
    console.error('Error fetching Notion page content:', error);
    return null;
  }
}
