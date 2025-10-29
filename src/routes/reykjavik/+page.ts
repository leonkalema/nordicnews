import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/articles?country=IS&limit=50');
		const allArticles = await response.json();
		
		// Filter for Reykjavik-related articles
		const reykjavikArticles = allArticles.filter((article: any) => 
			article.title?.toLowerCase().includes('reykjavik') ||
			article.title?.toLowerCase().includes('reykjavík') ||
			article.summary?.toLowerCase().includes('reykjavik') ||
			article.summary?.toLowerCase().includes('reykjavík') ||
			article.content?.toLowerCase().includes('reykjavik') ||
			article.content?.toLowerCase().includes('reykjavík')
		);
		
		return {
			articles: reykjavikArticles
		};
	} catch (error) {
		console.error('Error loading Reykjavik articles:', error);
		return {
			articles: []
		};
	}
};
