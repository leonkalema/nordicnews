import { supabase, type PublishedArticle, generateExcerpt, formatRelativeTime } from '$lib/supabase.js';
import type { PostgrestError } from '@supabase/supabase-js';

// Types for API responses
export interface ArticleListResponse {
  articles: ProcessedArticle[];
  pagination: PaginationInfo;
  error?: string;
}

export interface ProcessedArticle extends PublishedArticle {
  excerpt: string;
  published_at_formatted: string;
  relative_time: string;
  country_name: string;
  category_display: string;
  url_slug: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface ArticleFilters {
  country?: string;
  category?: string;
  search?: string;
  featured?: boolean;
}

// Constants for query optimization
const DEFAULT_LIMIT = 20;
const FEATURED_LIMIT = 5;
const CACHE_TTL = 30 * 1000; // 30 seconds - news sites need fresh content!

// In-memory cache for performance (NASA-level caching strategy)
const cache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(prefix: string, params: Record<string, any>): string {
  return `${prefix}:${JSON.stringify(params)}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Core article fetching function with error handling and fallbacks
export async function fetchArticles(
  filters: ArticleFilters = {},
  page: number = 1,
  limit: number = DEFAULT_LIMIT
): Promise<ArticleListResponse> {
  try {
    const offset = (page - 1) * limit;
    const cacheKey = getCacheKey('articles', { ...filters, page, limit });
    
    // Check cache first
    const cached = getFromCache<ArticleListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build count query for pagination
    let countQuery = supabase
      .from('published_articles')
      .select('*', { count: 'exact', head: true });

    // Build main query
    let query = supabase
      .from('published_articles')
      .select(`
        id,
        title,
        summary,
        country,
        category,
        source_name,
        slug,
        published_at,
        view_count,
        meta_description,
        keywords,
        featured_image_url,
        featured_image_alt,
        featured_image_caption,
        image_credit
      `)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters to both queries
    if (filters.country) {
      countQuery = countQuery.eq('country', filters.country);
      query = query.eq('country', filters.country);
    }

    if (filters.category) {
      countQuery = countQuery.eq('category', filters.category);
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      const searchFilter = `title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%,content.ilike.%${filters.search}%`;
      countQuery = countQuery.or(searchFilter);
      query = query.or(searchFilter);
    }

    if (filters.featured) {
      countQuery = countQuery.not('featured_image_url', 'is', null);
      query = query.not('featured_image_url', 'is', null);
    }

    // Execute queries in parallel for performance
    const [countResult, articlesResult] = await Promise.all([
      countQuery,
      query
    ]);

    if (countResult.error) {
      console.error('Error fetching article count:', countResult.error);
      throw countResult.error;
    }

    if (articlesResult.error) {
      console.error('Error fetching articles:', articlesResult.error);
      throw articlesResult.error;
    }

    const totalArticles = countResult.count || 0;
    const articles = articlesResult.data || [];

    // Process articles for display
    const processedArticles: ProcessedArticle[] = articles.map(article => ({
      ...article,
      excerpt: generateExcerpt(article.summary || '', 150),
      published_at_formatted: formatRelativeTime(article.published_at),
      relative_time: formatRelativeTime(article.published_at),
      country_name: getCountryName(article.country),
      category_display: getCategoryDisplay(article.category),
      url_slug: `/article/${article.slug}`
    }));

    const response: ArticleListResponse = {
      articles: processedArticles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalArticles / limit),
        totalArticles,
        hasNext: page * limit < totalArticles,
        hasPrev: page > 1,
        limit
      }
    };

    // Cache the response
    setCache(cacheKey, response);
    
    return response;

  } catch (error) {
    console.error('Error in fetchArticles:', error);
    
    // Fallback: try to get any recent articles without filters
    try {
      const fallbackResult = await supabase
        .from('published_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (fallbackResult.data) {
        const processedArticles: ProcessedArticle[] = fallbackResult.data.map(article => ({
          ...article,
          excerpt: generateExcerpt(article.summary || '', 150),
          published_at_formatted: formatRelativeTime(article.published_at),
          relative_time: formatRelativeTime(article.published_at),
          country_name: getCountryName(article.country),
          category_display: getCategoryDisplay(article.category),
          url_slug: `/article/${article.slug}`
        }));

        return {
          articles: processedArticles,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalArticles: processedArticles.length,
            hasNext: false,
            hasPrev: false,
            limit
          },
          error: 'Some features may be limited due to a temporary issue'
        };
      }
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
    }

    return {
      articles: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalArticles: 0,
        hasNext: false,
        hasPrev: false,
        limit
      },
      error: 'Unable to load articles at this time. Please try again later.'
    };
  }
}

// Fetch featured articles for homepage
export async function fetchFeaturedArticles(limit: number = FEATURED_LIMIT): Promise<ProcessedArticle[]> {
  try {
    const cacheKey = getCacheKey('featured', { limit });
    const cached = getFromCache<ProcessedArticle[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('published_articles')
      .select(`
        id,
        title,
        summary,
        country,
        category,
        source_name,
        slug,
        published_at,
        view_count,
        featured_image_url,
        featured_image_alt,
        featured_image_caption,
        image_credit
      `)
      .not('featured_image_url', 'is', null)
      .not('category', 'in', '("guide","editorial","comparison")')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }

    const processedArticles: ProcessedArticle[] = (data || []).map(article => ({
      ...article,
      excerpt: generateExcerpt(article.summary || '', 150),
      published_at_formatted: formatRelativeTime(article.published_at),
      relative_time: formatRelativeTime(article.published_at),
      country_name: getCountryName(article.country),
      category_display: getCategoryDisplay(article.category),
      url_slug: `/article/${article.slug}`
    }));

    setCache(cacheKey, processedArticles);
    return processedArticles;

  } catch (error) {
    console.error('Error in fetchFeaturedArticles:', error);
    return [];
  }
}

// Fetch single article by slug
export async function fetchArticleBySlug(slug: string): Promise<ProcessedArticle | null> {
  try {
    const cacheKey = getCacheKey('article', { slug });
    const cached = getFromCache<ProcessedArticle>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('published_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Article not found
        return null;
      }
      console.error('Error fetching article:', error);
      throw error;
    }

    const processedArticle: ProcessedArticle = {
      ...data,
      excerpt: generateExcerpt(data.summary || '', 150),
      published_at_formatted: formatRelativeTime(data.published_at),
      relative_time: formatRelativeTime(data.published_at),
      country_name: getCountryName(data.country),
      category_display: getCategoryDisplay(data.category),
      url_slug: `/article/${data.slug}`
    };

    setCache(cacheKey, processedArticle);
    return processedArticle;

  } catch (error) {
    console.error('Error in fetchArticleBySlug:', error);
    return null;
  }
}

// Fetch articles by country
export async function fetchArticlesByCountry(
  country: string,
  page: number = 1,
  limit: number = DEFAULT_LIMIT
): Promise<ArticleListResponse> {
  return fetchArticles({ country }, page, limit);
}

// Fetch articles by category
export async function fetchArticlesByCategory(
  category: string,
  page: number = 1,
  limit: number = DEFAULT_LIMIT
): Promise<ArticleListResponse> {
  return fetchArticles({ category }, page, limit);
}

// Search articles with full-text search
export async function searchArticles(
  searchTerm: string,
  page: number = 1,
  limit: number = DEFAULT_LIMIT
): Promise<ArticleListResponse> {
  return fetchArticles({ search: searchTerm }, page, limit);
}

// Get trending articles (most viewed in last 24 hours)
export async function fetchTrendingArticles(limit: number = 10): Promise<ProcessedArticle[]> {
  try {
    const cacheKey = getCacheKey('trending', { limit });
    const cached = getFromCache<ProcessedArticle[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data, error } = await supabase
      .from('published_articles')
      .select(`
        id,
        title,
        summary,
        country,
        category,
        source_name,
        slug,
        published_at,
        view_count,
        featured_image_url,
        featured_image_alt
      `)
      .gte('published_at', yesterday.toISOString())
      .not('category', 'in', '("guide","editorial","comparison")')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending articles:', error);
      throw error;
    }

    const processedArticles: ProcessedArticle[] = (data || []).map(article => ({
      ...article,
      excerpt: generateExcerpt(article.summary || '', 100),
      published_at_formatted: formatRelativeTime(article.published_at),
      relative_time: formatRelativeTime(article.published_at),
      country_name: getCountryName(article.country),
      category_display: getCategoryDisplay(article.category),
      url_slug: `/article/${article.slug}`
    }));

    setCache(cacheKey, processedArticles);
    return processedArticles;

  } catch (error) {
    console.error('Error in fetchTrendingArticles:', error);
    return [];
  }
}

// Helper functions
function getCountryName(countryCode: string): string {
  const names: Record<string, string> = {
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IS': 'Iceland'
  };
  return names[countryCode] || countryCode;
}

function getCategoryDisplay(category: string): string {
  const displays: Record<string, string> = {
    'breaking': 'Breaking News',
    'business': 'Business',
    'politics': 'Politics',
    'tech': 'Technology',
    'culture': 'Culture',
    'sports': 'Sports',
    'society': 'Society'
  };
  return displays[category] || category;
}
