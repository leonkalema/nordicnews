import { 
  fetchFeaturedArticles, 
  fetchArticles, 
  fetchTrendingArticles,
  type ProcessedArticle 
} from '$lib/data/articles.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  try {
    // Execute all data fetching in parallel for optimal performance
    const [
      featuredResult,
      allLatestResult,
      trendingResult
    ] = await Promise.allSettled([
      fetchFeaturedArticles(5), // Top 5 featured articles for Daily Snapshot
      fetchArticles({}, 1, 20), // Get more latest articles to filter from
      fetchTrendingArticles(8) // Top 8 trending articles
    ]);

    // Extract data from Promise.allSettled results
    const featuredArticles: ProcessedArticle[] = 
      featuredResult.status === 'fulfilled' ? featuredResult.value : [];
    
    const allLatestArticles = 
      allLatestResult.status === 'fulfilled' ? allLatestResult.value : { articles: [], pagination: null };
    
    const trendingArticles: ProcessedArticle[] = 
      trendingResult.status === 'fulfilled' ? trendingResult.value : [];

    // Get IDs of featured articles to avoid duplicates
    const featuredArticleIds = new Set(featuredArticles.map(a => a.id));

    // Filter latest articles to exclude featured ones for "The Latest" section
    const latestArticles = allLatestArticles.articles.filter(article => 
      !featuredArticleIds.has(article.id)
    ).slice(0, 12);

    // Get IDs of all used articles to avoid duplicates in other sections
    const usedArticleIds = new Set([
      ...featuredArticles.map(a => a.id),
      ...latestArticles.map(a => a.id)
    ]);

    // Get articles by country for "Across the Nordics" section (excluding already used)
    const countryPromises = ['SE', 'NO', 'DK', 'FI', 'IS'].map(async (country) => {
      try {
        const result = await fetchArticles({ country }, 1, 10); // Get more to filter from
        return {
          country,
          articles: result.articles.filter(article => !usedArticleIds.has(article.id)).slice(0, 3)
        };
      } catch (error) {
        console.error(`Error fetching articles for ${country}:`, error);
        return {
          country,
          articles: []
        };
      }
    });

    const countryResults = await Promise.allSettled(countryPromises);
    const articlesByCountry = countryResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    // Update used articles list with country articles
    articlesByCountry.forEach(countryData => {
      countryData.articles.forEach((article: any) => usedArticleIds.add(article.id));
    });

    // Get articles by category for thematic sections (excluding already used)
    const categoryPromises = ['business', 'politics', 'tech', 'culture'].map(async (category) => {
      try {
        const result = await fetchArticles({ category }, 1, 10); // Get more to filter from
        return {
          category,
          articles: result.articles.filter(article => !usedArticleIds.has(article.id)).slice(0, 4)
        };
      } catch (error) {
        console.error(`Error fetching articles for ${category}:`, error);
        return {
          category,
          articles: []
        };
      }
    });

    const categoryResults = await Promise.allSettled(categoryPromises);
    const articlesByCategory = categoryResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    // Calculate statistics for the site
    const stats = {
      totalArticles: allLatestArticles.pagination?.totalArticles || 0,
      countriesActive: articlesByCountry.filter(c => c.articles.length > 0).length,
      categoriesActive: articlesByCategory.filter(c => c.articles.length > 0).length
    };

    return {
      // Daily Snapshot data
      featuredArticles,
      
      // Across the Nordics data
      articlesByCountry,
      
      // Deep Dive data
      latestArticles, // Now this is the filtered array without featured articles
      articlesByCategory,
      trendingArticles,
      
      // Site statistics
      stats,
      
      // Meta data for SEO
      meta: {
        title: 'Nordics Today - Your Daily Source for Nordic News',
        description: 'The latest news and analysis from Sweden, Norway, Denmark, Finland, and Iceland, translated for a global audience.',
        keywords: ['Nordic news', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Scandinavian news']
      }
    };

  } catch (error) {
    console.error('Error loading homepage data:', error);
    
    // Return minimal fallback data
    return {
      featuredArticles: [],
      articlesByCountry: [],
      latestArticles: [],
      articlesByCategory: [],
      trendingArticles: [],
      stats: {
        totalArticles: 0,
        countriesActive: 0,
        categoriesActive: 0
      },
      meta: {
        title: 'Nordics Today - Your Daily Source for Nordic News',
        description: 'The latest news and analysis from Sweden, Norway, Denmark, Finland, and Iceland.',
        keywords: ['Nordic news', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland']
      },
      error: 'Unable to load content at this time. Please refresh the page.'
    };
  }
};
