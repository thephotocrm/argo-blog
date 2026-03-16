import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/tech-seo-tasks.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const task = data.tasks.find((t: any) => t.id === parseInt(params.id as string));
    if (!task) return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });

    const body = await request.json();
    if (body.status) task.status = body.status;

    await writeGitHubJSON(FILE_PATH, data, sha, `tech-seo-tasks: update #${params.id} → ${body.status}`);

    return new Response(JSON.stringify(task), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
