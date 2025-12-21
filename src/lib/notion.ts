// Fetch blog posts and page content from Notion (official API)

import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

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

export type NotionBlock = BlockObjectResponse & { children?: NotionBlock[] };

function getNotionClient(): Client | null {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Client({ auth: apiKey });
}

function richTextToPlainText(richText: RichTextItemResponse[] | undefined): string {
  if (!richText || richText.length === 0) {
    return '';
  }
  return richText.map((t) => t.plain_text).join('');
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isPageObject(
  value: PageObjectResponse | PartialPageObjectResponse | unknown
): value is PageObjectResponse | PartialPageObjectResponse {
  return typeof value === 'object' && value !== null && (value as { object?: string }).object === 'page';
}

function isFullPage(value: PageObjectResponse | PartialPageObjectResponse): value is PageObjectResponse {
  return 'properties' in value;
}

function getFirstTitleFromPage(page: PageObjectResponse): string {
  const props = Object.values(page.properties);
  const titleProp = props.find((p) => p.type === 'title');
  if (!titleProp || titleProp.type !== 'title') {
    return 'Untitled';
  }
  const title = richTextToPlainText(titleProp.title);
  return title || 'Untitled';
}

function getPropertyByName(page: PageObjectResponse, name: string) {
  const target = name.toLowerCase();
  return Object.entries(page.properties).find(([key]) => key.toLowerCase() === target)?.[1];
}

function tryGetStringProperty(page: PageObjectResponse, names: string[]): string {
  for (const name of names) {
    const prop = getPropertyByName(page, name);
    if (!prop) continue;

    if (prop.type === 'rich_text') {
      const value = richTextToPlainText(prop.rich_text);
      if (value) return value;
    }

    if (prop.type === 'title') {
      const value = richTextToPlainText(prop.title);
      if (value) return value;
    }

    if (prop.type === 'url') {
      if (prop.url) return prop.url;
    }

    if (prop.type === 'select') {
      if (prop.select?.name) return prop.select.name;
    }

    if (prop.type === 'status') {
      if (prop.status?.name) return prop.status.name;
    }
  }

  return '';
}

function tryGetCategory(page: PageObjectResponse): string {
  const prop =
    getPropertyByName(page, 'Category') ??
    getPropertyByName(page, 'Tags') ??
    getPropertyByName(page, 'Tag');

  if (!prop) return 'Uncategorized';

  if (prop.type === 'select') {
    return prop.select?.name || 'Uncategorized';
  }
  if (prop.type === 'multi_select') {
    return prop.multi_select?.[0]?.name || 'Uncategorized';
  }

  const asText = tryGetStringProperty(page, ['Category', 'Tags', 'Tag']);
  return asText || 'Uncategorized';
}

function tryGetPublishedDate(page: PageObjectResponse): string {
  const candidates = ['Published', 'Publish Date', 'Published Date', 'Date'];
  for (const name of candidates) {
    const prop = getPropertyByName(page, name);
    if (prop?.type === 'date' && prop.date?.start) {
      return new Date(prop.date.start).toISOString();
    }
  }
  return new Date(page.created_time).toISOString();
}

function tryGetCoverUrl(page: PageObjectResponse): string | undefined {
  // Prefer the page cover if present (official API)
  if (page.cover) {
    if (page.cover.type === 'external') {
      return page.cover.external.url;
    }
    if (page.cover.type === 'file') {
      return page.cover.file.url;
    }
  }

  const prop = getPropertyByName(page, 'Cover Image') ?? getPropertyByName(page, 'Cover');
  if (!prop) return undefined;

  if (prop.type === 'files') {
    const file = prop.files?.[0];
    if (!file) return undefined;
    if (file.type === 'external') return file.external.url;
    if (file.type === 'file') return file.file.url;
  }

  if (prop.type === 'url' && prop.url) return prop.url;

  return undefined;
}

function isPublishedStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  if (!s) return true; // if no status property exists, treat as publishable
  return s === 'published' || s === 'public' || s === 'live';
}

function pageToBlogPost(page: PageObjectResponse): BlogPost {
  const title = getFirstTitleFromPage(page);
  const slug = tryGetStringProperty(page, ['Slug', 'slug']) || slugify(title);
  const status = tryGetStringProperty(page, ['Status', 'status']);
  const publishedDate = tryGetPublishedDate(page);
  const category = tryGetCategory(page);
  const coverImage = tryGetCoverUrl(page);

  return {
    id: page.id,
    title,
    slug,
    status: status || 'Published',
    publishedDate,
    category,
    content: '',
    coverImage,
  };
}

/**
 * Fetches all blog posts from Notion database.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const notion = getNotionClient();

    if (!databaseId || !notion) {
      return [];
    }

    const pages: PageObjectResponse[] = [];
    let startCursor: string | undefined;

    // Paginate through all pages in the database
    while (true) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
        page_size: 100,
      });

      for (const result of response.results) {
        if (isPageObject(result) && isFullPage(result)) {
          pages.push(result);
        }
      }

      if (!response.has_more || !response.next_cursor) {
        break;
      }
      startCursor = response.next_cursor;
    }

    const posts = pages
      .filter((p) => !p.archived)
      .map(pageToBlogPost)
      .filter((p) => isPublishedStatus(p.status));

    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
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
 * This function filters blog posts by category name.
 * It's case-insensitive.
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
function isFullBlock(
  block: BlockObjectResponse | PartialBlockObjectResponse
): block is BlockObjectResponse {
  return 'type' in block;
}

async function fetchBlockChildren(notion: Client, blockId: string, depth: number): Promise<NotionBlock[]> {
  if (depth <= 0) return [];

  const children: NotionBlock[] = [];
  let startCursor: string | undefined;

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100,
    });

    for (const result of response.results) {
      if (!isFullBlock(result)) continue;
      const block: NotionBlock = { ...result };
      if (block.has_children) {
        block.children = await fetchBlockChildren(notion, block.id, depth - 1);
      }
      children.push(block);
    }

    if (!response.has_more || !response.next_cursor) {
      break;
    }
    startCursor = response.next_cursor;
  }

  return children;
}

/**
 * Fetches a Notion page's block tree using the official Notion API.
 */
export async function getNotionPage(pageId: string): Promise<NotionBlock[] | null> {
  try {
    const notion = getNotionClient();
    if (!notion) return null;

    // Depth cap keeps requests bounded; increase if you use deep toggles.
    return await fetchBlockChildren(notion, pageId, 5);
  } catch (error) {
    console.error('Error fetching Notion page blocks:', error);
    return null;
  }
}