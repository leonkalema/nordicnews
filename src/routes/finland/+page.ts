import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetch articles specifically for Finland
		const response = await fetch('/api/articles?country=FI&limit=20');
		const articles = await response.json();

		return {
			articles: articles || []
		};
	} catch (error) {
		console.error('Error loading Finland articles:', error);
		return {
			articles: []
		};
	}
};
