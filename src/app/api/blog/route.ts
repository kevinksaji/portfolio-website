import { getBlogPosts } from '@/lib/notion';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getBlogPosts(); // get the blog posts from the notion api
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error in blog API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
