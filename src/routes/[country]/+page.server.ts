import { fetchArticlesByCountry, fetchArticles } from '$lib/data/articles.js';
import { COUNTRY_NAMES } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const { country } = params;
  
  // Validate country parameter
  const validCountries = ['sweden', 'norway', 'denmark', 'finland', 'iceland'];
  if (!validCountries.includes(country.toLowerCase())) {
    throw error(404, 'Country not found');
  }

  // Map country names to codes
  const countryCodeMap: Record<string, string> = {
    'sweden': 'SE',
    'norway': 'NO',
    'denmark': 'DK',
    'finland': 'FI',
    'iceland': 'IS'
  };

  const countryCode = countryCodeMap[country.toLowerCase()];
  const countryName = COUNTRY_NAMES[countryCode];

  try {
    // Get query parameters for filtering and pagination
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');

    // Build filters
    const filters: any = { country: countryCode };
    if (category) filters.category = category;
    if (search) filters.search = search;

    // Fetch articles for this country
    const articlesResult = await fetchArticles(filters, page, 20);

    // Get featured articles from this country
    const featuredResult = await fetchArticles(
      { country: countryCode, featured: true }, 
      1, 
      3
    );

    // Get articles by category for this country
    const categoryPromises = ['business', 'politics', 'tech', 'culture', 'sports'].map(async (cat) => {
      try {
        const result = await fetchArticles({ country: countryCode, category: cat }, 1, 4);
        return {
          category: cat,
          articles: result.articles
        };
      } catch (error) {
        console.error(`Error fetching ${cat} articles for ${countryCode}:`, error);
        return {
          category: cat,
          articles: []
        };
      }
    });

    const categoryResults = await Promise.allSettled(categoryPromises);
    const articlesByCategory = categoryResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    return {
      country: {
        code: countryCode,
        name: countryName,
        slug: country.toLowerCase()
      },
      articles: articlesResult.articles,
      pagination: articlesResult.pagination,
      featuredArticles: featuredResult.articles,
      articlesByCategory,
      currentFilters: {
        category,
        search
      },
      meta: {
        title: `${countryName} News - Nordics Today`,
        description: `Latest news and analysis from ${countryName}. Stay updated with ${countryName}'s politics, business, culture, and more.`,
        keywords: [`${countryName} news`, countryName, 'Nordic news', category || ''].filter(Boolean)
      },
      error: articlesResult.error
    };

  } catch (err) {
    console.error(`Error loading ${country} page:`, err);
    
    return {
      country: {
        code: countryCode,
        name: countryName,
        slug: country.toLowerCase()
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
      articlesByCategory: [],
      currentFilters: {
        category: null,
        search: null
      },
      meta: {
        title: `${countryName} News - Nordics Today`,
        description: `Latest news and analysis from ${countryName}.`,
        keywords: [`${countryName} news`, countryName, 'Nordic news']
      },
      error: 'Unable to load articles at this time. Please try again later.'
    };
  }
};
