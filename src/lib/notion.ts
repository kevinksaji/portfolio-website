// for fetching blog posts from Notion database

import { Client } from '@notionhq/client';

// initialize Notion client for official API
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
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
}

// type for Notion page properties
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
  Excerpt?: {
    rich_text: Array<{ plain_text: string }>;
  };
}

// fetch all published blog posts from Notion database with caching
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          },
          sorts: [
            {
              property: 'Published Date',
              direction: 'descending'
            }
          ]
        }),
        next: { revalidate: 3600 } // Cache for 1 hour using Next.js built-in caching
      }
    );

    if (!response.ok) { // if the response is not ok, throw an error
      throw new Error(`Notion API error: ${response.status}`);
    }

    
    const data = await response.json(); // get the data from the response if response is ok
    const posts: BlogPost[] = []; // initialize an empty array of blog posts

    for (const page of data.results) { // loop through the results
      const properties = page.properties;
      
      const title = properties.Title?.title?.[0]?.plain_text || 'Untitled'; // get the title from the properties
      const slug = properties.Slug?.rich_text?.[0]?.plain_text || // get the slug from the properties
                   title.toLowerCase().replace(/[^a-z0-9]+/g, '-'); // if the slug is not found, use the title and replace all non-alphanumeric characters with a dash
      const excerpt = properties.Excerpt?.rich_text?.[0]?.plain_text || ''; // get the excerpt from the properties
      const publishedDate = properties['Published Date']?.date?.start || ''; // get the published date from the properties
      const category = properties.Category?.select?.name || 'Uncategorized'; // get the category from the properties
      
      // get the full page content
      const contentResponse = await fetch(
        `https://api.notion.com/v1/blocks/${page.id}/children`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
          },
          next: { revalidate: 3600 } // cache for 1 hour
        }
      );
      
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        const content = contentData.results
          .map((block: any) => {
            if (block.type === 'paragraph') {
              return block.paragraph.rich_text
                .map((text: any) => text.plain_text)
                .join('');
            }
            return '';
          })
          .join('\n\n');
        
        posts.push({
          id: page.id,
          title,
          slug,
          excerpt,
          publishedDate,
          category,
          content
        });
      }
    }

    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
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
        page_size: 100 // maximum allowed by Notion API
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
    
    console.log('Page content processed successfully');
    return recordMap;
    
  } catch (error) {
    console.error('Error fetching Notion page content:', error);
    return null;
  }
}
