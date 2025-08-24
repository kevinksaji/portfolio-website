import { getBlogPosts } from '@/lib/notion';
import { NextResponse } from 'next/server';

/**
 * GET /api/blog
 * Returns all published blog posts from Notion database
 */
export async function GET() {
  try {
    const posts = await getBlogPosts(); // get the blog posts from the Notion API
    return NextResponse.json({ posts }); // return the blog posts
  } catch (error) {
    console.error('Error in blog API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' }, // return the error if the request fails
      { status: 500 }
    );
  }
}
