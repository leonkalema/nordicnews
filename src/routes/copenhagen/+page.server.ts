import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=DK&limit=50');
		const allArticles = await response.json();
		
		// Filter for Copenhagen-related articles
		const copenhagenArticles = allArticles.filter((article: any) => 
			article.title?.toLowerCase().includes('copenhagen') ||
			article.title?.toLowerCase().includes('københavn') ||
			article.summary?.toLowerCase().includes('copenhagen') ||
			article.summary?.toLowerCase().includes('københavn') ||
			article.content?.toLowerCase().includes('copenhagen') ||
			article.content?.toLowerCase().includes('københavn')
		);
		
		return {
			articles: copenhagenArticles
		};
	} catch (error) {
		console.error('Error loading Copenhagen articles:', error);
		return {
			articles: []
		};
	}
};
