import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON, readGitHubFile, writeGitHubFile } from '../../../lib/github-data';

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

    // Flip draft frontmatter when approving or reverting a post
    if (body.status === 'approved' || body.status === 'needs_revision') {
      const mdPath = `src/content/blog/${params.slug}.md`;
      try {
        const mdFile = await readGitHubFile(mdPath);
        const draftValue = body.status === 'approved' ? 'false' : 'true';
        const updated = mdFile.content.replace(
          /^(draft:\s*)(true|false)$/m,
          `$1${draftValue}`
        );
        if (updated !== mdFile.content) {
          const action = body.status === 'approved' ? 'publish' : 'unpublish';
          await writeGitHubFile(mdPath, updated, mdFile.sha, `${action}: ${params.slug}`);
        }
      } catch {
        // Post .md may not exist yet — non-blocking
      }
    }

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
