import { json } from '@sveltejs/kit';
import { searchArticles } from '$lib/data/articles.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchTerm = url.searchParams.get('q');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const country = url.searchParams.get('country');
    const category = url.searchParams.get('category');

    if (!searchTerm || searchTerm.trim().length < 2) {
      return json({
        success: false,
        error: 'Search term must be at least 2 characters long'
      }, { status: 400 });
    }

    // Build filters
    const filters: any = { search: searchTerm.trim() };
    if (country) filters.country = country;
    if (category) filters.category = category;

    const result = await searchArticles(searchTerm.trim(), page, limit);

    return json({
      success: true,
      data: {
        articles: result.articles,
        pagination: result.pagination,
        searchTerm: searchTerm.trim(),
        filters: {
          country,
          category
        }
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return json({
      success: false,
      error: 'Search temporarily unavailable. Please try again later.'
    }, { status: 500 });
  }
};

// Handle POST requests for more complex search queries
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { 
      searchTerm, 
      filters = {}, 
      page = 1, 
      limit = 20,
      sortBy = 'published_at',
      sortOrder = 'desc'
    } = body;

    if (!searchTerm || searchTerm.trim().length < 2) {
      return json({
        success: false,
        error: 'Search term must be at least 2 characters long'
      }, { status: 400 });
    }

    // Build comprehensive filters
    const searchFilters: any = { search: searchTerm.trim() };
    if (filters.country) searchFilters.country = filters.country;
    if (filters.category) searchFilters.category = filters.category;
    if (filters.featured) searchFilters.featured = filters.featured;

    const result = await searchArticles(searchTerm.trim(), page, limit);

    return json({
      success: true,
      data: {
        articles: result.articles,
        pagination: result.pagination,
        searchTerm: searchTerm.trim(),
        filters,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    
    return json({
      success: false,
      error: 'Search temporarily unavailable. Please try again later.'
    }, { status: 500 });
  }
};
