import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase, generateExcerpt, CATEGORY_NAMES } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const country = url.searchParams.get('country');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const category = url.searchParams.get('category');

		// Build the query - using the correct table name from schema
		let query = supabase
			.from('published_articles')
			.select('*')
			.order('published_at', { ascending: false });

		// Filter by country if specified
		if (country) {
			query = query.eq('country', country);
		}

		// Filter by category if specified
		if (category) {
			query = query.eq('category', category);
		}

		// Apply pagination
		query = query.range(offset, offset + limit - 1);

		const { data: articles, error } = await query;

		if (error) {
			console.error('Error fetching articles:', error);
			return json({ error: 'Failed to fetch articles' }, { status: 500 });
		}

		// Transform articles to match expected format
		const transformedArticles = articles?.map(article => ({
			id: article.id,
			title: article.title,
			summary: article.summary || generateExcerpt(article.content),
			excerpt: article.summary || generateExcerpt(article.content),
			slug: article.slug,
			url_slug: `/article/${article.slug}`,
			published_date: article.published_at,
			source_name: article.source_name,
			source_country: article.country,
			category: article.category,
			category_display: CATEGORY_NAMES[article.category] || article.category,
			country_name: getCountryName(article.country),
			featured_image_url: article.featured_image_url,
			image_url: article.featured_image_url,
			image_alt: article.featured_image_alt,
			relative_time: getRelativeTime(article.published_at)
		})) || [];

		return json(transformedArticles);

	} catch (error) {
		console.error('API Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

function getCountryName(countryCode: string): string {
	const countryMap: Record<string, string> = {
		'SE': 'Sweden',
		'NO': 'Norway',
		'DK': 'Denmark',
		'FI': 'Finland',
		'IS': 'Iceland'
	};
	return countryMap[countryCode] || countryCode;
}

function getRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
	
	if (diffInHours < 1) {
		return 'Just now';
	} else if (diffInHours < 24) {
		return `${diffInHours}h ago`;
	} else {
		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays}d ago`;
	}
}
