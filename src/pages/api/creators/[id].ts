import type { APIRoute } from 'astro';
import { readJSON, writeJSON, dataPath } from '../../../lib/data';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const filepath = dataPath('creators.json');
  const data = readJSON(filepath);
  if (!data) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });

  const creator = data.creators.find((c: any) => c.id === params.id);
  if (!creator) return new Response(JSON.stringify({ error: 'Creator not found' }), { status: 404 });

  const body = await request.json();
  if (body.outreachStatus) creator.outreachStatus = body.outreachStatus;
  if (body.followUpCount !== undefined) creator.followUpCount = body.followUpCount;
  data.lastUpdated = new Date().toISOString();
  writeJSON(filepath, data);

  return new Response(JSON.stringify(creator), { status: 200 });
};
