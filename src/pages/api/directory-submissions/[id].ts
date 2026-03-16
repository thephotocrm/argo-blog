import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/directory-submissions.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const item = data.items.find((i: any) => i.id === params.id);
    if (!item) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    const body = await request.json();
    if (body.status) item.status = body.status;
    if (body.listingUrl !== undefined) item.listingUrl = body.listingUrl;
    if (body.submittedAt !== undefined) item.submittedAt = body.submittedAt;
    if (body.notes !== undefined) item.notes = body.notes;

    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `directory-submissions: update ${params.id} → ${body.status || 'updated'}`);

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
