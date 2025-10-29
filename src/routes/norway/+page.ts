import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetch articles specifically for Norway
		const response = await fetch('/api/articles?country=NO&limit=100');
		const articles = await response.json();

		return {
			articles: articles || []
		};
	} catch (error) {
		console.error('Error loading Norway articles:', error);
		return {
			articles: []
		};
	}
};
