import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
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
    const credentials = JSON.parse(Buffer.from(keyJson, 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });

    const searchConsole = google.searchconsole({ version: 'v1', auth });
    const siteUrl = 'https://blog.argostudio.co/';

    // Get URLs from query param or fetch from sitemap
    const urlsParam = url.searchParams.get('urls');
    let urls: string[] = [];

    if (urlsParam) {
      urls = urlsParam.split(',').filter(Boolean);
    } else {
      // Default: just check homepage
      urls = [siteUrl];
    }

    // Inspect each URL (API limit: 600 requests/day)
    const pages: Array<{
      url: string;
      verdict: string;
      coverageState: string;
      lastCrawlTime: string | null;
      indexingState: string;
    }> = [];

    for (const pageUrl of urls) {
      try {
        const result = await searchConsole.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl: pageUrl,
            siteUrl: siteUrl,
          },
        });

        const inspection = result.data.inspectionResult;
        pages.push({
          url: pageUrl,
          verdict: inspection?.indexStatusResult?.verdict || 'UNKNOWN',
          coverageState: inspection?.indexStatusResult?.coverageState || 'Unknown',
          lastCrawlTime: inspection?.indexStatusResult?.lastCrawlTime || null,
          indexingState: inspection?.indexStatusResult?.indexingState || 'UNKNOWN',
        });
      } catch (err) {
        pages.push({
          url: pageUrl,
          verdict: 'ERROR',
          coverageState: err instanceof Error ? err.message : 'Inspection failed',
          lastCrawlTime: null,
          indexingState: 'ERROR',
        });
      }

      // Small delay between requests
      if (urls.length > 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    const indexed = pages.filter(p => p.verdict === 'PASS').length;

    return new Response(JSON.stringify({
      total: pages.length,
      indexed,
      pages,
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
