import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/creators.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const creator = data.creators.find((c: any) => c.id === params.id);
    if (!creator) return new Response(JSON.stringify({ error: 'Creator not found' }), { status: 404 });

    const body = await request.json();
    if (body.outreachStatus) creator.outreachStatus = body.outreachStatus;
    if (body.followUpCount !== undefined) creator.followUpCount = body.followUpCount;
    data.lastUpdated = new Date().toISOString();

    await writeGitHubJSON(FILE_PATH, data, sha, `creators: update ${params.id}`);

    return new Response(JSON.stringify(creator), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
