import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase.js';

// Google News sitemap: last 48 hours only
export const GET: RequestHandler = async () => {
  try {
    const now: Date = new Date();
    const since: Date = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('published_articles')
      .select(`
        id,
        title,
        slug,
        keywords,
        published_at,
        featured_image_url,
        featured_image_caption
      `)
      .gte('published_at', since.toISOString())
      .order('published_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Error generating news sitemap (query):', error);
      throw error;
    }

    const articles = (data || []).filter(a => a.slug && a.title);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${articles
    .map((article) => {
      const loc = `https://nordicstoday.com/article/${article.slug}`;
      const pubDate = new Date(article.published_at || now).toISOString();
      const title = escapeXml(String(article.title));
      const keywords = Array.isArray(article.keywords)
        ? article.keywords.join(', ')
        : (article.keywords || 'Nordic news');
      const imageBlock = article.featured_image_url
        ? `\n  <image:image>\n    <image:loc>${article.featured_image_url}</image:loc>\n    <image:title>${title}</image:title>\n    <image:caption>${escapeXml(String(article.featured_image_caption || article.title))}</image:caption>\n  </image:image>`
        : '';
      return `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Nordics Today</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${escapeXml(keywords)}</news:keywords>
    </news:news>${imageBlock}
  </url>`;
    })
    .join('')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // News sitemap should refresh frequently
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (err) {
    console.error('Error generating news sitemap:', err);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://nordicstoday.com/</loc>
    <news:news>
      <news:publication>
        <news:name>Nordics Today</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString()}</news:publication_date>
      <news:title>News sitemap temporarily unavailable</news:title>
    </news:news>
  </url>
</urlset>`;
    return new Response(fallback, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      status: 200
    });
  }
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
