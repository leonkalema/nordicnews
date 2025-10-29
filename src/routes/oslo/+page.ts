import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=NO&limit=50');
		const allArticles = await response.json();
		
		// Filter for Oslo-related articles
		const osloArticles = allArticles.filter((article: any) => 
			article.title?.toLowerCase().includes('oslo') ||
			article.summary?.toLowerCase().includes('oslo') ||
			article.content?.toLowerCase().includes('oslo')
		);
		
		return {
			articles: osloArticles
		};
	} catch (error) {
		console.error('Error loading Oslo articles:', error);
		return {
			articles: []
		};
	}
};
