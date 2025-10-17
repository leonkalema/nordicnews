import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetch articles specifically for Denmark
		const response = await fetch('/api/articles?country=DK&limit=20');
		const articles = await response.json();

		return {
			articles: articles || []
		};
	} catch (error) {
		console.error('Error loading Denmark articles:', error);
		return {
			articles: []
		};
	}
};
