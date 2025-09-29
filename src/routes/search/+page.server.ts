import { fetchArticles } from '$lib/data/articles.js';

export const load = async ({ url }: { url: URL }) => {
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 12;

  try {
    if (!query.trim()) {
      return {
        articles: [],
        pagination: null,
        query: '',
        totalResults: 0
      };
    }

    // Search articles using the existing fetchArticles function
    const result = await fetchArticles({ search: query }, page, limit);
    
    return {
      articles: result.articles || [],
      pagination: result.pagination,
      query: query.trim(),
      totalResults: result.pagination?.totalArticles || 0
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      articles: [],
      pagination: null,
      query: query.trim(),
      totalResults: 0,
      error: 'Search temporarily unavailable. Please try again later.'
    };
  }
};
