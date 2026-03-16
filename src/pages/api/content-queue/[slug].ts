import type { APIRoute } from 'astro';
import { readJSON, writeJSON, seoPath } from '../../../lib/data';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const filepath = seoPath('content-queue.json');
  const data = readJSON(filepath);
  if (!data) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });

  const item = data.items.find((i: any) => i.slug === params.slug);
  if (!item) return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });

  const body = await request.json();
  if (body.status) item.status = body.status;
  if (body.status === 'published') item.published_at = new Date().toISOString().split('T')[0];
  data.lastUpdated = new Date().toISOString().split('T')[0];
  writeJSON(filepath, data);

  return new Response(JSON.stringify(item), { status: 200 });
};
