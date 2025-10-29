import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=SE&limit=30');
		const articles = await response.json();
		
		// Filter for Gothenburg-related articles
		const gothenburgArticles = articles.filter((article: any) => 
			article.title?.toLowerCase().includes('gothenburg') ||
			article.title?.toLowerCase().includes('göteborg') ||
			article.summary?.toLowerCase().includes('gothenburg') ||
			article.summary?.toLowerCase().includes('göteborg') ||
			article.content?.toLowerCase().includes('gothenburg') ||
			article.content?.toLowerCase().includes('göteborg')
		);

		return {
			articles: gothenburgArticles || []
		};
	} catch (error) {
		console.error('Error loading Gothenburg articles:', error);
		return {
			articles: []
		};
	}
};
