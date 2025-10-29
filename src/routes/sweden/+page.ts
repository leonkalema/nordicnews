import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetch articles specifically for Sweden - increased limit to populate all category sections
		const response = await fetch('/api/articles?country=SE&limit=100');
		const articles = await response.json();

		return {
			articles: articles || []
		};
	} catch (error) {
		console.error('Error loading Sweden articles:', error);
		return {
			articles: []
		};
	}
};
