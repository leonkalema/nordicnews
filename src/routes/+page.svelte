<script lang="ts">
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import DeepDive from '$lib/components/DeepDive.svelte';
	import LongRead from '$lib/components/LongRead.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data;

	// Enhanced SEO data for homepage - OPTIMIZED FOR TARGET KEYWORDS
	$: seoData = {
		title: data.meta?.title || 'English News in Sweden & Norway | Nordic News in English | Nordics Today',
		description: data.meta?.description || 'Latest Swedish and Norwegian news translated to English. Get real-time updates from Sweden, Norway, Denmark, Finland & Iceland in English for English speakers.',
		keywords: ['English news in Sweden', 'English news in Norway', 'Swedish news in English', 'Norwegian news in English', 'Nordic news in English', 'Sweden news English', 'Norway news English', 'English speaking Sweden news', 'English language Nordic news', 'Nordic news', 'Scandinavian news'],
		url: '',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "NewsMediaOrganization",
			"name": "Nordics Today - English News in Sweden & Norway",
			"alternateName": "English Nordic News",
			"url": "https://nordicstoday.com",
			"logo": "https://nordicstoday.com/logo.png",
			"description": "English-language news service covering Sweden, Norway, Denmark, Finland, and Iceland for English speakers",
			"sameAs": [
				"https://twitter.com/nordicstoday",
				"https://facebook.com/nordicstoday"
			],
			"address": {
				"@type": "PostalAddress",
				"addressRegion": "Nordic Countries",
				"addressCountry": "EU"
			},
			"areaServed": [
				{
					"@type": "Country",
					"name": "Sweden"
				},
				{
					"@type": "Country", 
					"name": "Norway"
				},
				{
					"@type": "Country",
					"name": "Denmark"
				},
				{
					"@type": "Country",
					"name": "Finland"
				},
				{
					"@type": "Country",
					"name": "Iceland"
				}
			],
			"inLanguage": "en",
			"audience": {
				"@type": "Audience",
				"audienceType": "English speakers in Nordic countries"
			},
			"knowsLanguage": ["en"],
			"mainEntity": {
				"@type": "WebSite",
				"name": "Nordics today",
				"url": "https://nordicstoday.com",
				"potentialAction": {
					"@type": "SearchAction",
					"target": "https://nordicstoday.com/search?q={search_term_string}",
					"query-input": "required name=search_term_string"
				}
			}
		}
	};
</script>

<SEOHead {...seoData} />

<DailySnapshot featuredArticles={data.featuredArticles || []} />
<AcrossTheNordics articlesByCountry={data.articlesByCountry || []} />
<DeepDive 
	latestArticles={data.latestArticles || []} 
	articlesByCategory={data.articlesByCategory || []} 
	trendingArticles={data.trendingArticles || []} 
/>
