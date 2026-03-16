import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/content-queue.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const item = data.items.find((i: any) => i.slug === params.slug);
    if (!item) return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });

    const body = await request.json();
    if (body.status) item.status = body.status;
    if (body.status === 'published') item.published_at = new Date().toISOString().split('T')[0];
    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `content-queue: update ${params.slug} → ${body.status}`);

    // Request Google indexing when a post is published
    if (body.status === 'published') {
      const postUrl = `https://blog.argostudio.co/blog/${params.slug}/`;
      try {
        await fetch(new URL('/api/request-indexing', request.url).href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `admin_session=${cookies.get('admin_session')?.value}`,
          },
          body: JSON.stringify({ url: postUrl }),
        });
      } catch {
        // Non-blocking — indexing request is best-effort
      }
    }

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
