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
      trendingResult,
      guideArticlesResult
    ] = await Promise.allSettled([
      fetchFeaturedArticles(15), // Fetch more to account for filtering
      fetchArticles({}, 1, 100), // Fetch more articles since we're filtering out guides
      fetchTrendingArticles(20), // Fetch more trending
      fetchArticles({ category: 'guide' }, 1, 6) // Top 6 guide articles
    ]);

    // Extract data from Promise.allSettled results
    const featuredArticles: ProcessedArticle[] = 
      featuredResult.status === 'fulfilled' ? featuredResult.value : [];
    
    const allLatestArticles = 
      allLatestResult.status === 'fulfilled' ? allLatestResult.value : { articles: [], pagination: null };
    
    const trendingArticles: ProcessedArticle[] = 
      trendingResult.status === 'fulfilled' ? trendingResult.value : [];
    
    const guideArticles: ProcessedArticle[] = 
      guideArticlesResult.status === 'fulfilled' ? guideArticlesResult.value.articles : [];

    // Get IDs of featured and guide articles to avoid duplicates
    const featuredArticleIds = new Set(featuredArticles.map(a => a.id));
    const guideArticleIds = new Set(guideArticles.map(a => a.id));

    // Filter latest articles to exclude featured ones and guides for "The Latest" section
    const latestArticles = allLatestArticles.articles.filter(article => 
      !featuredArticleIds.has(article.id) && 
      !['guide', 'editorial', 'comparison'].includes(article.category as string)
    ).slice(0, 30); // Get 30 articles to have enough for all homepage sections

    // Get articles by country for "Across the Nordics" section (exclude featured and guides)
    const countryPromises = ['SE', 'NO', 'DK', 'FI', 'IS'].map(async (country) => {
      try {
        // Fetch more articles to have enough after filtering
        const result = await fetchArticles({ country }, 1, 20);
        // Filter out featured articles and guides
        const filteredArticles = result.articles
          .filter(article => 
            !featuredArticleIds.has(article.id) &&
            !['guide', 'editorial', 'comparison'].includes(article.category as string)
          )
          .slice(0, 3);
        return {
          country,
          articles: filteredArticles
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

    // Build set of used article IDs (featured + country articles)
    const usedArticleIds = new Set([
      ...featuredArticleIds,
      ...articlesByCountry.flatMap(c => c.articles.map((a: any) => a.id))
    ]);

    // Get articles by category for thematic sections (excluding already used)
    const categoryPromises = ['business', 'politics', 'tech', 'culture'].map(async (category) => {
      try {
        const result = await fetchArticles({ category }, 1, 20);
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
      // Expert Guides (NEW - featured above news)
      guideArticles,
      
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
      guideArticles: [],
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
