import { NextResponse } from 'next/server';
import { getBlogCategories } from '@/lib/blog';

export async function GET() {
  try {
    const categories = await getBlogCategories();
    const response = NextResponse.json(categories);
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    return response;
  } catch (error) {
    console.error('Blog categories GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
