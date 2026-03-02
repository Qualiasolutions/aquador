import { NextResponse } from 'next/server';
import { getFeaturedPost } from '@/lib/blog';

export async function GET() {
  try {
    const post = await getFeaturedPost();
    const response = NextResponse.json(post);
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    return response;
  } catch (error) {
    console.error('Blog featured GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
