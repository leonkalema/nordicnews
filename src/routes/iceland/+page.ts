import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetch articles specifically for Iceland
		const response = await fetch('/api/articles?country=IS&limit=20');
		const articles = await response.json();

		return {
			articles: articles || []
		};
	} catch (error) {
		console.error('Error loading Iceland articles:', error);
		return {
			articles: []
		};
	}
};
