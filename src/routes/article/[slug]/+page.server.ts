import { fetchArticleBySlug, fetchArticles } from '$lib/data/articles.js';
import { incrementViewCount } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  try {
    // Fetch the main article
    const article = await fetchArticleBySlug(slug);
    
    if (!article) {
      throw error(404, 'Article not found');
    }

    // Increment view count (non-blocking)
    incrementViewCount(article.id).catch(err => 
      console.error('Failed to increment view count:', err)
    );

    // Fetch related articles in parallel
    const [
      relatedByCategory,
      relatedByCountry,
      trending
    ] = await Promise.allSettled([
      // Articles from same category
      fetchArticles({ category: article.category }, 1, 4),
      // Articles from same country
      fetchArticles({ country: article.country }, 1, 4),
      // Trending articles
      fetchArticles({}, 1, 6) // Latest articles as trending fallback
    ]);

    // Extract related articles, excluding the current article
    const relatedCategoryArticles = relatedByCategory.status === 'fulfilled' 
      ? relatedByCategory.value.articles.filter(a => a.id !== article.id).slice(0, 3)
      : [];

    const relatedCountryArticles = relatedByCountry.status === 'fulfilled'
      ? relatedByCountry.value.articles.filter(a => a.id !== article.id).slice(0, 3)
      : [];

    const trendingArticles = trending.status === 'fulfilled'
      ? trending.value.articles.filter(a => a.id !== article.id).slice(0, 5)
      : [];

    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.summary || article.excerpt,
      "image": article.featured_image_url ? [article.featured_image_url] : [],
      "datePublished": article.published_at,
      "dateModified": article.published_at,
      "author": {
        "@type": "Organization",
        "name": article.source_name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Nordics Today",
        "logo": {
          "@type": "ImageObject",
          "url": "https://nordicstoday.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://nordicstoday.com/article/${article.slug}`
      },
      "articleSection": article.category_display,
      "keywords": article.keywords || [],
      "locationCreated": {
        "@type": "Place",
        "name": article.country_name
      }
    };

    return {
      article,
      relatedArticles: {
        byCategory: relatedCategoryArticles,
        byCountry: relatedCountryArticles,
        trending: trendingArticles
      },
      structuredData,
      meta: {
        title: article.meta_description ? 
          `${article.title} - Nordics Today` : 
          `${article.title} - ${article.country_name} News - Nordics Today`,
        description: article.meta_description || article.summary || article.excerpt,
        keywords: article.keywords || [
          article.category_display,
          article.country_name,
          'Nordic news',
          article.source_name
        ],
        image: article.featured_image_url,
        publishedTime: article.published_at,
        modifiedTime: article.published_at,
        section: article.category_display,
        tags: [
          article.category_display,
          article.country_name,
          ...(article.keywords || [])
        ]
      }
    };

  } catch (err) {
    console.error(`Error loading article ${slug}:`, err);
    
    // If it's already a 404 error, re-throw it
    if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
      throw err;
    }
    
    // For other errors, throw a 500
    throw error(500, 'Unable to load article at this time. Please try again later.');
  }
};
