import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetch articles specifically for Sweden
		const response = await fetch('/api/articles?country=SE&limit=20');
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
