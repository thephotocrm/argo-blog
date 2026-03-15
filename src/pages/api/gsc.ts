import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const keyJson = import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!keyJson) {
    return new Response(JSON.stringify({
      error: 'Google Service Account not configured',
      hint: 'Set GOOGLE_SERVICE_ACCOUNT_KEY in your environment variables',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const credentials = JSON.parse(Buffer.from(keyJson, 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchConsole = google.searchconsole({ version: 'v1', auth });

    const days = parseInt(url.searchParams.get('days') || '28');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const [queryResponse, pageResponse] = await Promise.all([
      searchConsole.searchanalytics.query({
        siteUrl: 'sc-domain:blog.argostudio.co',
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query'],
          rowLimit: 25,
          type: 'web',
        },
      }),
      searchConsole.searchanalytics.query({
        siteUrl: 'sc-domain:blog.argostudio.co',
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['page'],
          rowLimit: 25,
          type: 'web',
        },
      }),
    ]);

    const totals = (queryResponse.data.rows || []).reduce(
      (acc, row) => ({
        clicks: acc.clicks + (row.clicks || 0),
        impressions: acc.impressions + (row.impressions || 0),
      }),
      { clicks: 0, impressions: 0 }
    );

    const avgPosition =
      (queryResponse.data.rows || []).reduce((sum, row) => sum + (row.position || 0), 0) /
      (queryResponse.data.rows?.length || 1);

    return new Response(JSON.stringify({
      dateRange: { start: formatDate(startDate), end: formatDate(endDate) },
      totals: { ...totals, avgPosition: Math.round(avgPosition * 10) / 10 },
      topQueries: (queryResponse.data.rows || []).map(row => ({
        query: row.keys?.[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: Math.round((row.ctr || 0) * 1000) / 10,
        position: Math.round((row.position || 0) * 10) / 10,
      })),
      topPages: (pageResponse.data.rows || []).map(row => ({
        page: row.keys?.[0]?.replace('https://blog.argostudio.co', ''),
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: Math.round((row.ctr || 0) * 1000) / 10,
        position: Math.round((row.position || 0) * 10) / 10,
      })),
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
