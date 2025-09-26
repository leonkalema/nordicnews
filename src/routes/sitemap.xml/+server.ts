import { fetchArticles } from '$lib/data/articles.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // Fetch all articles for sitemap
    const articlesResult = await fetchArticles({}, 1, 1000); // Get up to 1000 articles
    const articles = articlesResult.articles;

    // Define static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/sweden', priority: '0.8', changefreq: 'daily' },
      { url: '/norway', priority: '0.8', changefreq: 'daily' },
      { url: '/denmark', priority: '0.8', changefreq: 'daily' },
      { url: '/finland', priority: '0.8', changefreq: 'daily' },
      { url: '/iceland', priority: '0.8', changefreq: 'daily' }
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages.map(page => `
  <url>
    <loc>https://nordicstoday.com${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${articles.map(article => `
  <url>
    <loc>https://nordicstoday.com${article.url_slug}</loc>
    <lastmod>${article.published_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:name>Nordics Today</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.published_at}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      <news:keywords>${article.keywords?.join(', ') || article.category_display}</news:keywords>
    </news:news>
    ${article.featured_image_url ? `
    <image:image>
      <image:loc>${article.featured_image_url}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
      <image:caption>${escapeXml(article.featured_image_caption || article.excerpt || '')}</image:caption>
    </image:image>` : ''}
  </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nordicstoday.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  }
};

// Helper function to escape XML characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
