import { fetchArticles } from '$lib/data/articles.js';

export const GET = async () => {
  try {
    const limit = 1000;
    let page = 1;
    let allItems: string[] = [];
    // Cap to avoid runaway responses
    const MAX_URLS = 50000;

    // Pull articles in chunks until fewer than limit are returned or cap reached
    // Note: fetchArticles already sorts newest first
    while (allItems.length < MAX_URLS) {
      const { articles } = await fetchArticles({}, page, limit);
      const batch = (articles || []).filter((a: any) => a?.url_slug && a?.title);
      if (!batch.length) break;

      const batchXml = batch.map((a: any) => `
  <url>
    <loc>https://nordicstoday.com${a.url_slug}</loc>
    <lastmod>${(a.published_at || '').split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

      allItems.push(...batchXml);
      if (batch.length < limit) break;
      page += 1;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allItems.join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800'
      }
    });
  } catch (err) {
    console.error('Error generating articles sitemap:', err);
    const fallback = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
  <url><loc>https://nordicstoday.com/</loc></url>
</urlset>`;
    return new Response(fallback, { headers: { 'Content-Type': 'application/xml; charset=utf-8' }, status: 200 });
  }
};
