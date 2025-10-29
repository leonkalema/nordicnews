import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=SE&limit=30');
		const articles = await response.json();
		
		// Filter for Malmö-related articles
		const malmoArticles = articles.filter((article: any) => 
			article.title?.toLowerCase().includes('malmö') ||
			article.title?.toLowerCase().includes('malmo') ||
			article.summary?.toLowerCase().includes('malmö') ||
			article.summary?.toLowerCase().includes('malmo') ||
			article.content?.toLowerCase().includes('malmö') ||
			article.content?.toLowerCase().includes('malmo')
		);

		return {
			articles: malmoArticles || []
		};
	} catch (error) {
		console.error('Error loading Malmö articles:', error);
		return {
			articles: []
		};
	}
};
