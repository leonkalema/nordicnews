export const GET = async () => {
  const body = `User-agent: *
Allow: /

# Block admin and private pages
Disallow: /admin/
Disallow: /api/

# Allow assets
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.webp
Allow: /*.svg
Allow: /*.ico

# Sitemaps
Sitemap: https://nordicstoday.com/sitemap.xml
Sitemap: https://nordicstoday.com/news-sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Vary': 'Host'
    }
  });
};
