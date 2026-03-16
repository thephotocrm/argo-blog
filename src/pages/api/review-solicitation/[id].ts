import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/review-solicitation.json';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const contact = data.contacts.find((c: any) => c.id === params.id);
    if (!contact) return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404 });

    const body = await request.json();
    if (body.status) contact.status = body.status;
    if (body.reviewPosted !== undefined) contact.reviewPosted = body.reviewPosted;
    if (body.reviewUrl !== undefined) contact.reviewUrl = body.reviewUrl;
    if (body.notes !== undefined) contact.notes = body.notes;

    // Update target counts
    if (body.status === 'review_posted') {
      const target = data.targets.find((t: any) => t.platform === contact.targetPlatform);
      if (target) target.current = data.contacts.filter((c: any) => c.targetPlatform === contact.targetPlatform && c.status === 'review_posted').length;
    }

    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `review-solicitation: update ${params.id} → ${body.status || 'updated'}`);

    return new Response(JSON.stringify(contact), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
