import type { APIRoute } from 'astro';
import { readJSON, writeJSON, seoPath } from '../../lib/data';

export const prerender = false;

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const filepath = seoPath('keyword-candidates.json');
  const data = readJSON(filepath);
  if (!data) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });

  const body = await request.json();
  const updates: Array<{ keyword: string; decision: string | null }> = body.updates || [];

  for (const upd of updates) {
    const cand = data.candidates.find((c: any) => c.keyword === upd.keyword);
    if (cand) {
      cand.decision = upd.decision;
      cand.validated = upd.decision !== null;
    }
  }
  data.lastUpdated = new Date().toISOString().split('T')[0];
  writeJSON(filepath, data);

  return new Response(JSON.stringify({ updated: updates.length }), { status: 200 });
};
