import { fetchArticleBySlug, fetchArticles } from '$lib/data/articles.js';
import { incrementViewCount, supabase } from '$lib/supabase.js';
import { buildSeoTitle } from '$lib/utils/seo-title';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface OpinionContributor {
  name: string;
  title: string;
  institution: string;
  bio: string;
  linkedin_url: string | null;
  website_url: string | null;
  headshot_url: string | null;
}

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
    
    // For opinion articles, fetch contributor info
    let contributor: OpinionContributor | null = null;
    console.log('[Opinion Debug] Article category:', article.category, 'ID:', article.id);
    if ((article.category as string) === 'opinion') {
      try {
        const { data: submission, error: subError } = await supabase
          .from('opinion_submissions')
          .select('opinion_contributors(*)')
          .eq('published_article_id', article.id)
          .single();
        
        console.log('[Opinion Debug] Submission query result:', submission, 'Error:', subError);
        
        if (submission?.opinion_contributors) {
          const c = submission.opinion_contributors as any;
          contributor = {
            name: c.name,
            title: c.title,
            institution: c.institution,
            bio: c.bio,
            linkedin_url: c.linkedin_url,
            website_url: c.website_url,
            headshot_url: c.headshot_url
          };
          console.log('[Opinion Debug] Contributor found:', contributor.name);
        }
      } catch (e) {
        console.error('Failed to fetch contributor:', e);
      }
    }

    // Fetch related articles - simplified to prevent timeout
    // Priority: same country, then recent articles
    let relatedCategoryArticles: any[] = [];
    let relatedCountryArticles: any[] = [];
    let trendingArticles: any[] = [];

    try {
      // Single optimized query for same-country articles
      const relatedResponse = await Promise.race([
        fetchArticles({ country: article.country }, 1, 8),
        new Promise<ArticleListResponse>((_, reject) => 
          setTimeout(() => reject(new Error('Related articles timeout')), 5000)
        )
      ]);
      
      const filtered = relatedResponse.articles.filter(a => a.id !== article.id);
      relatedCountryArticles = filtered.slice(0, 3);
      trendingArticles = filtered.slice(0, 5);
    } catch (err) {
      console.error('Failed to fetch related articles:', err);
      // Non-critical - page can load without related articles
    }

    // Generate structured data for SEO
    const hasAuthorPerson = Boolean((article as any).author || (article as any).author_name);
    const authorName = (article as any).author || (article as any).author_name || 'Nordics Today';
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.summary || article.excerpt,
      "image": article.featured_image_url ? [article.featured_image_url] : [],
      "datePublished": article.published_at,
      "dateModified": (article as any).updated_at || article.published_at,
      "author": hasAuthorPerson
        ? { "@type": "Person", "name": authorName }
        : { "@type": "Organization", "name": authorName },
      "publisher": { "@id": "https://nordicstoday.com/#org" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://nordicstoday.com/article/${article.slug}` },
      "articleSection": article.category_display,
      "keywords": article.keywords || [],
      "isAccessibleForFree": true,
      "inLanguage": "en",
      "locationCreated": { "@type": "Place", "name": article.country_name }
    } as const;

    // Generate SEO-optimized description (150-160 chars)
    let description = article.meta_description || article.summary || article.excerpt || '';
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }

    const seoTitleOverride = (article as unknown as { seo_title?: string; meta_title?: string }).seo_title || (article as unknown as { seo_title?: string; meta_title?: string }).meta_title || '';
    const seoTitle = seoTitleOverride.trim() || buildSeoTitle({ title: article.title, countryName: article.country_name, publishedAt: article.published_at });

    return {
      article,
      contributor,
      relatedArticles: {
        byCategory: relatedCategoryArticles,
        byCountry: relatedCountryArticles,
        trending: trendingArticles
      },
      structuredData,
      meta: {
        title: seoTitle,
        description: description,
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
