export const GET = async () => {
  const now = new Date().toISOString();
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/search',
    // Country hubs
    '/sweden', '/norway', '/denmark', '/finland', '/iceland',
    // City hubs (known)
    '/stockholm', '/gothenburg', '/malmo', '/oslo', '/copenhagen', '/helsinki', '/reykjavik',
    // Country categories
    '/sweden/politics','/sweden/business','/sweden/tech','/sweden/society',
    '/norway/politics','/norway/business','/norway/tech','/norway/society',
    '/denmark/politics','/denmark/business','/denmark/tech','/denmark/society',
    '/finland/politics','/finland/business','/finland/tech','/finland/society',
    '/iceland/politics','/iceland/business','/iceland/tech','/iceland/society'
  ];

  const urls = staticPages.map((path) => `
  <url>
    <loc>https://nordicstoday.com${path}</loc>
    <lastmod>${now}</lastmod>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
