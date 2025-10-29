import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { country, category } = params;
	
	// Map country names to country codes
	const countryMap: Record<string, string> = {
		'sweden': 'SE',
		'norway': 'NO',
		'denmark': 'DK',
		'finland': 'FI',
		'iceland': 'IS'
	};
	
	const countryCode = countryMap[country.toLowerCase()];
	
	if (!countryCode) {
		return {
			articles: [],
			country,
			category,
			error: 'Invalid country'
		};
	}
	
	try {
		// Fetch MORE articles to ensure we get enough of the specific category
		// Since politics is only 11% of articles, we need to fetch more
		const response = await fetch(`/api/articles?country=${countryCode}&limit=500`);
		const allArticles = await response.json();
		
		// Filter by category
		const filteredArticles = allArticles.filter((article: any) => {
			if (category === 'politics') return article.category === 'politics';
			if (category === 'business') return article.category === 'business';
			if (category === 'tech') return article.category === 'tech';
			if (category === 'society') return article.category === 'society' || article.category === 'culture' || article.category === 'breaking';
			return false;
		});
		
		return {
			articles: filteredArticles,
			country,
			category,
			countryCode
		};
	} catch (error) {
		console.error('Error loading articles:', error);
		return {
			articles: [],
			country,
			category,
			error: 'Failed to load articles'
		};
	}
};
