import { getCityConfig } from '$lib/config/countries.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { city } = params;
	
	// Get city config
	const cityConfig = getCityConfig(city.toLowerCase());
	if (!cityConfig) {
		throw error(404, 'City not found');
	}

	try {
		// Fetch articles for this city's country
		const response = await fetch(`/api/articles?country=${cityConfig.country.code}&limit=100`);
		const allArticles = await response.json();
		
		// Filter for city-related articles
		const cityArticles = allArticles.filter((article: any) => 
			article.title?.toLowerCase().includes(city.toLowerCase()) ||
			article.summary?.toLowerCase().includes(city.toLowerCase()) ||
			article.content?.toLowerCase().includes(city.toLowerCase())
		);
		
		return {
			articles: cityArticles,
			cityConfig: cityConfig.city,
			countryConfig: cityConfig.country
		};
	} catch (err) {
		console.error('Error loading articles:', err);
		return {
			articles: [],
			cityConfig: cityConfig.city,
			countryConfig: cityConfig.country
		};
	}
};
