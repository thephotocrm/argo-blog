import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/distribution-status.json';

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const body = await request.json();
    const { slug, platform, status, url } = body;

    const post = data.posts.find((p: any) => p.slug === slug);
    if (!post) return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });

    if (!post.platforms[platform]) {
      return new Response(JSON.stringify({ error: 'Invalid platform' }), { status: 400 });
    }

    post.platforms[platform].status = status;
    if (url !== undefined) post.platforms[platform].url = url;
    if (status === 'posted') post.platforms[platform].postedAt = new Date().toISOString().split('T')[0];

    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `distribution-status: ${slug} → ${platform} ${status}`);

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
