import { fetchArticlesByCategory, fetchArticles } from '$lib/data/articles.js';
import { CATEGORY_NAMES } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const { category } = params;
  
  // Validate category parameter
  const validCategories = ['breaking', 'business', 'politics', 'tech', 'culture', 'sports', 'society', 'guide', 'editorial', 'comparison'];
  if (!validCategories.includes(category.toLowerCase())) {
    throw error(404, 'Category not found');
  }

  const categoryCode = category.toLowerCase();
  const categoryName = CATEGORY_NAMES[categoryCode];

  try {
    // Get query parameters for filtering and pagination
    const country = url.searchParams.get('country');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');

    // Build filters
    const filters: any = { category: categoryCode };
    if (country) filters.country = country;
    if (search) filters.search = search;

    // Fetch articles for this category
    const articlesResult = await fetchArticles(filters, page, 20);

    // Get featured articles from this category
    const featuredResult = await fetchArticles(
      { category: categoryCode, featured: true }, 
      1, 
      3
    );

    // Get articles by country for this category
    const countryPromises = ['SE', 'NO', 'DK', 'FI', 'IS'].map(async (countryCode) => {
      try {
        const result = await fetchArticles({ category: categoryCode, country: countryCode }, 1, 3);
        return {
          country: countryCode,
          articles: result.articles
        };
      } catch (error) {
        console.error(`Error fetching ${categoryCode} articles for ${countryCode}:`, error);
        return {
          country: countryCode,
          articles: []
        };
      }
    });

    const countryResults = await Promise.allSettled(countryPromises);
    const articlesByCountry = countryResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    // Get related categories (similar topics)
    const relatedCategories = getRelatedCategories(categoryCode);
    const relatedPromises = relatedCategories.map(async (relatedCat) => {
      try {
        const result = await fetchArticles({ category: relatedCat }, 1, 3);
        return {
          category: relatedCat,
          articles: result.articles
        };
      } catch (error) {
        console.error(`Error fetching related articles for ${relatedCat}:`, error);
        return {
          category: relatedCat,
          articles: []
        };
      }
    });

    const relatedResults = await Promise.allSettled(relatedPromises);
    const relatedArticles = relatedResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    return {
      category: {
        code: categoryCode,
        name: categoryName,
        slug: category.toLowerCase()
      },
      articles: articlesResult.articles,
      pagination: articlesResult.pagination,
      featuredArticles: featuredResult.articles,
      articlesByCountry,
      relatedArticles,
      currentFilters: {
        country,
        search
      },
      meta: {
        title: `${categoryName} News - Nordics Today`,
        description: `Latest ${categoryName.toLowerCase()} news from across the Nordic region. Stay updated with developments in Sweden, Norway, Denmark, Finland, and Iceland.`,
        keywords: [`${categoryName} news`, 'Nordic news', categoryName, country || ''].filter(Boolean)
      },
      error: articlesResult.error
    };

  } catch (err) {
    console.error(`Error loading ${category} category page:`, err);
    
    return {
      category: {
        code: categoryCode,
        name: categoryName,
        slug: category.toLowerCase()
      },
      articles: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalArticles: 0,
        hasNext: false,
        hasPrev: false,
        limit: 20
      },
      featuredArticles: [],
      articlesByCountry: [],
      relatedArticles: [],
      currentFilters: {
        country: null,
        search: null
      },
      meta: {
        title: `${categoryName} News - Nordics Today`,
        description: `Latest ${categoryName.toLowerCase()} news from across the Nordic region.`,
        keywords: [`${categoryName} news`, 'Nordic news', categoryName]
      },
      error: 'Unable to load articles at this time. Please try again later.'
    };
  }
};

// Helper function to get related categories
function getRelatedCategories(category: string): string[] {
  const relations: Record<string, string[]> = {
    'business': ['tech', 'politics'],
    'politics': ['society', 'business'],
    'tech': ['business', 'culture'],
    'culture': ['society', 'sports'],
    'sports': ['culture', 'society'],
    'society': ['politics', 'culture'],
    'breaking': ['politics', 'business']
  };
  
  return relations[category] || ['business', 'politics'];
}
