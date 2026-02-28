import { NextResponse } from 'next/server';
import { getBlogCategories } from '@/lib/blog';

export async function GET() {
  const categories = await getBlogCategories();
  const response = NextResponse.json(categories);
  response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  return response;
}
