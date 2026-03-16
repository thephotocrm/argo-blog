import type { APIRoute } from 'astro';
import { readJSON, writeJSON, seoPath } from '../../../lib/data';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const filepath = seoPath('tech-seo-tasks.json');
  const data = readJSON(filepath);
  if (!data) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });

  const task = data.tasks.find((t: any) => t.id === parseInt(params.id as string));
  if (!task) return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });

  const body = await request.json();
  if (body.status) task.status = body.status;
  writeJSON(filepath, data);

  return new Response(JSON.stringify(task), { status: 200 });
};
