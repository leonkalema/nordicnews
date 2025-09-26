<script lang="ts">
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import DeepDive from '$lib/components/DeepDive.svelte';
	import LongRead from '$lib/components/LongRead.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data;

	// Enhanced SEO data for homepage
	$: seoData = {
		title: data.meta?.title || 'Nordics today - Your Daily Source for Nordic News',
		description: data.meta?.description || 'The latest news and analysis from Sweden, Norway, Denmark, Finland, and Iceland, translated for a global audience.',
		keywords: ['Nordic news', 'Sweden news', 'Norway news', 'Denmark news', 'Finland news', 'Iceland news', 'Scandinavian news', 'European news'],
		url: '',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "NewsMediaOrganization",
			"name": "Nordics today",
			"url": "https://nordicstoday.com",
			"logo": "https://nordicstoday.com/logo.png",
			"description": "The latest news and analysis from Sweden, Norway, Denmark, Finland, and Iceland",
			"sameAs": [
				"https://twitter.com/nordicstoday",
				"https://facebook.com/nordicstoday"
			],
			"address": {
				"@type": "PostalAddress",
				"addressRegion": "Nordic Countries",
				"addressCountry": "EU"
			},
			"areaServed": ["Sweden", "Norway", "Denmark", "Finland", "Iceland"],
			"knowsLanguage": ["en", "sv", "no", "da", "fi", "is"],
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
