import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/keyword-candidates.json';

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

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

    await writeGitHubJSON(FILE_PATH, data, sha, `keyword-candidates: ${updates.length} decisions`);

    return new Response(JSON.stringify({ updated: updates.length }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
