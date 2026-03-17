import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/link-building.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const decodedId = decodeURIComponent(params.id!);
    const item = data.items.find((i: any) => i.id === decodedId);
    if (!item) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    const body = await request.json();
    if (body.status) item.status = body.status;
    if (body.contactedAt !== undefined) item.contactedAt = body.contactedAt;
    if (body.wonAt !== undefined) item.wonAt = body.wonAt;
    if (body.notes !== undefined) item.notes = body.notes;

    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `link-building: update ${decodedId} → ${body.status || 'updated'}`);

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
