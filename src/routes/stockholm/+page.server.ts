import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=SE&limit=30');
		const articles = await response.json();
		
		// Filter for Stockholm-related articles
		const stockholmArticles = articles.filter((article: any) => 
			article.title?.toLowerCase().includes('stockholm') ||
			article.summary?.toLowerCase().includes('stockholm') ||
			article.content?.toLowerCase().includes('stockholm')
		);

		return {
			articles: stockholmArticles || []
		};
	} catch (error) {
		console.error('Error loading Stockholm articles:', error);
		return {
			articles: []
		};
	}
};
