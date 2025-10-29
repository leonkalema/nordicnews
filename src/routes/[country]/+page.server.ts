import { getCountryBySlug } from '$lib/config/countries.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { country } = params;
	
	// Get country config
	const countryConfig = getCountryBySlug(country.toLowerCase());
	if (!countryConfig) {
		throw error(404, 'Country not found');
	}

	try {
		// Fetch articles for this country - increased limit to populate all category sections
		const response = await fetch(`/api/articles?country=${countryConfig.code}&limit=100`);
		const articles = await response.json();

		return {
			articles: articles || [],
			countryConfig
		};
	} catch (err) {
		console.error('Error loading articles:', err);
		return {
			articles: [],
			countryConfig
		};
	}
};
