import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const posts = await getCollection('blog');
  const post = posts.find(p => p.id === params.slug);
  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  // Return the raw body (markdown without frontmatter)
  const content = post.body || '';

  return new Response(JSON.stringify({ slug: params.slug, content }), { status: 200 });
};
