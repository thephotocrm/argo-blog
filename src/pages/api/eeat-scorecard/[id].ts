import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/eeat-scorecard.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const check = data.checks.find((c: any) => c.id === params.id);
    if (!check) return new Response(JSON.stringify({ error: 'Check not found' }), { status: 404 });

    const body = await request.json();
    if (body.status) check.status = body.status;
    if (body.notes !== undefined) check.notes = body.notes;

    // Recalculate overall score
    const passed = data.checks.filter((c: any) => c.status === 'pass').length;
    data.overallScore = passed;

    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `eeat-scorecard: update ${params.id} → ${body.status || 'updated'}`);

    return new Response(JSON.stringify(check), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
