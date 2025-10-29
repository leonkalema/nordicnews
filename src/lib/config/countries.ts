export interface FAQItem {
	question: string;
	answer: string;
}

export interface CountryConfig {
	slug: string;
	name: string;
	code: string;
	parliament: string;
	keywords: string[];
	industries: string[];
	cities: CityConfig[];
	faqs: FAQItem[];
	intro: string;
}

export interface CityConfig {
	slug: string;
	name: string;
	alternateName?: string;
	description: string;
}

import { COUNTRY_FAQS, COUNTRY_INTROS } from './country-faqs';

export const COUNTRIES: CountryConfig[] = [
	{
		slug: 'sweden',
		name: 'Sweden',
		code: 'SE',
		parliament: 'Riksdag',
		keywords: ['Riksdag', 'Stockholm', 'Volvo', 'Öresund Bridge'],
		industries: ['Volvo', 'Port of Gothenburg', 'Öresund region', 'Swedish business'],
		cities: [
			{ slug: 'stockholm', name: 'Stockholm', description: 'Capital city politics, business, culture, and local events from Stockholm' },
			{ slug: 'gothenburg', name: 'Gothenburg', alternateName: 'Göteborg', description: 'West coast updates, port news, business, and Gothenburg local stories' },
			{ slug: 'malmo', name: 'Malmö', description: 'Southern Sweden coverage, Öresund region, and Malmö city news' }
		],
		intro: COUNTRY_INTROS.sweden,
		faqs: COUNTRY_FAQS.sweden
	},
	{
		slug: 'norway',
		name: 'Norway',
		code: 'NO',
		parliament: 'Storting',
		keywords: ['Storting', 'Oslo', 'oil and gas', 'shipping', 'maritime'],
		industries: ['oil and gas industry', 'shipping sector', 'maritime industry', 'renewable energy'],
		cities: [
			{ slug: 'oslo', name: 'Oslo', description: 'Capital city politics, business, culture, and local events from Oslo' }
		],
		intro: COUNTRY_INTROS.norway,
		faqs: COUNTRY_FAQS.norway
	},
	{
		slug: 'denmark',
		name: 'Denmark',
		code: 'DK',
		parliament: 'Folketing',
		keywords: ['Folketing', 'Copenhagen', 'wind energy', 'Øresund Bridge'],
		industries: ['wind energy industry', 'shipping sector', 'green tech', 'renewable energy'],
		cities: [
			{ slug: 'copenhagen', name: 'Copenhagen', alternateName: 'København', description: 'Capital city politics, business, culture, and local events from Copenhagen' }
		],
		intro: COUNTRY_INTROS.denmark,
		faqs: COUNTRY_FAQS.denmark
	},
	{
		slug: 'finland',
		name: 'Finland',
		code: 'FI',
		parliament: 'Eduskunta',
		keywords: ['Eduskunta', 'Helsinki', 'Nokia', 'Arctic region'],
		industries: ['Nokia', 'tech sector', 'gaming industry', 'Arctic affairs'],
		cities: [
			{ slug: 'helsinki', name: 'Helsinki', description: 'Capital city politics, business, culture, and local events from Helsinki' }
		],
		intro: COUNTRY_INTROS.finland,
		faqs: COUNTRY_FAQS.finland
	},
	{
		slug: 'iceland',
		name: 'Iceland',
		code: 'IS',
		parliament: 'Althing',
		keywords: ['Althing', 'Reykjavik', 'volcanic activity', 'geothermal', 'tourism'],
		industries: ['volcanic activity', 'geothermal power', 'tourism', 'renewable energy'],
		cities: [
			{ slug: 'reykjavik', name: 'Reykjavik', alternateName: 'Reykjavík', description: 'Capital city politics, business, culture, and local events from Reykjavik' }
		],
		intro: COUNTRY_INTROS.iceland,
		faqs: COUNTRY_FAQS.iceland
	}
];

export const CATEGORIES = [
	{ slug: 'politics', name: 'Politics', dbValues: ['politics'] },
	{ slug: 'business', name: 'Business', dbValues: ['business'] },
	{ slug: 'tech', name: 'Technology', dbValues: ['tech'] },
	{ slug: 'society', name: 'Society & Culture', dbValues: ['society', 'culture', 'breaking'] }
];

export function getCountryBySlug(slug: string): CountryConfig | undefined {
	return COUNTRIES.find(c => c.slug === slug);
}

export function getCountryByCode(code: string): CountryConfig | undefined {
	return COUNTRIES.find(c => c.code === code);
}

export function getCityBySlug(countrySlug: string, citySlug: string): CityConfig | undefined {
	const country = getCountryBySlug(countrySlug);
	return country?.cities.find(c => c.slug === citySlug);
}

export function getCategoryBySlug(slug: string) {
	return CATEGORIES.find(c => c.slug === slug);
}

export function getCityConfig(citySlug: string): { city: CityConfig; country: CountryConfig } | undefined {
	for (const country of COUNTRIES) {
		const city = country.cities.find(c => c.slug === citySlug);
		if (city) {
			return { city, country };
		}
	}
	return undefined;
}
