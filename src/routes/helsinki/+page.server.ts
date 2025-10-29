import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=FI&limit=50');
		const allArticles = await response.json();
		
		// Filter for Helsinki-related articles
		const helsinkiArticles = allArticles.filter((article: any) => 
			article.title?.toLowerCase().includes('helsinki') ||
			article.summary?.toLowerCase().includes('helsinki') ||
			article.content?.toLowerCase().includes('helsinki')
		);
		
		return {
			articles: helsinkiArticles
		};
	} catch (error) {
		console.error('Error loading Helsinki articles:', error);
		return {
			articles: []
		};
	}
};
