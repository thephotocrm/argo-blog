import type { APIRoute } from 'astro';
import { getBlogPost } from '../../../lib/data';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const raw = getBlogPost(params.slug as string);
  if (!raw) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  // Strip frontmatter
  const content = raw.replace(/^---[\s\S]*?---\n*/, '');

  return new Response(JSON.stringify({ slug: params.slug, content }), { status: 200 });
};
