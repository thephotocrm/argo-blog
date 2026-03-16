import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const keyJson = import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    return new Response(JSON.stringify({
      error: 'Google Service Account not configured',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const targetUrl = body.url;

    if (!targetUrl || !targetUrl.startsWith('https://blog.argostudio.co/')) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const credentials = JSON.parse(Buffer.from(keyJson, 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({ version: 'v3', auth });

    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url: targetUrl,
        type: 'URL_UPDATED',
      },
    });

    return new Response(JSON.stringify({
      success: true,
      url: targetUrl,
      notifyTime: result.data.urlNotificationMetadata?.latestUpdate?.notifyTime,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
