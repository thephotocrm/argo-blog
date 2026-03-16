import type { APIRoute } from 'astro';
import { readGitHubJSON, writeGitHubJSON } from '../../../lib/github-data';

export const prerender = false;

const FILE_PATH = 'src/data/synced/seo/review-solicitation.json';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, targetPlatform } = body;

    if (!name || !targetPlatform) {
      return new Response(JSON.stringify({ error: 'name and targetPlatform are required' }), { status: 400 });
    }

    const { data, sha } = await readGitHubJSON(FILE_PATH);

    const contact = {
      id: `contact-${Date.now()}`,
      name,
      email: email || '',
      targetPlatform,
      status: 'not_contacted',
      reviewPosted: false,
      reviewUrl: null,
      notes: '',
    };

    data.contacts.push(contact);
    data.lastUpdated = new Date().toISOString().split('T')[0];

    await writeGitHubJSON(FILE_PATH, data, sha, `review-solicitation: add contact ${name}`);

    return new Response(JSON.stringify(contact), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
