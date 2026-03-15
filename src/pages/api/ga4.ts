import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const keyJson = import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const propertyId = import.meta.env.GA4_PROPERTY_ID;

  if (!keyJson || !propertyId) {
    return new Response(JSON.stringify({
      error: 'GA4 not configured',
      hint: 'Set GOOGLE_SERVICE_ACCOUNT_KEY and GA4_PROPERTY_ID in your environment variables',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const credentials = JSON.parse(Buffer.from(keyJson, 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

    const days = parseInt(url.searchParams.get('days') || '28');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const [trafficResponse, pagesResponse, sourcesResponse] = await Promise.all([
      analyticsData.properties.runReport({
        property: propertyId,
        requestBody: {
          dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
          ],
        },
      }),
      analyticsData.properties.runReport({
        property: propertyId,
        requestBody: {
          dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 20,
        },
      }),
      analyticsData.properties.runReport({
        property: propertyId,
        requestBody: {
          dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        },
      }),
    ]);

    const totalsRow = trafficResponse.data.rows?.[0];
    const totals = {
      sessions: parseInt(totalsRow?.metricValues?.[0]?.value || '0'),
      pageviews: parseInt(totalsRow?.metricValues?.[1]?.value || '0'),
      avgSessionDuration: Math.round(parseFloat(totalsRow?.metricValues?.[2]?.value || '0')),
      bounceRate: Math.round(parseFloat(totalsRow?.metricValues?.[3]?.value || '0') * 100) / 100,
    };

    return new Response(JSON.stringify({
      totals,
      topPages: (pagesResponse.data.rows || []).map(row => ({
        path: row.dimensionValues?.[0]?.value,
        sessions: parseInt(row.metricValues?.[0]?.value || '0'),
        pageviews: parseInt(row.metricValues?.[1]?.value || '0'),
        avgDuration: Math.round(parseFloat(row.metricValues?.[2]?.value || '0')),
      })),
      sources: (sourcesResponse.data.rows || []).map(row => ({
        channel: row.dimensionValues?.[0]?.value,
        sessions: parseInt(row.metricValues?.[0]?.value || '0'),
        pageviews: parseInt(row.metricValues?.[1]?.value || '0'),
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
