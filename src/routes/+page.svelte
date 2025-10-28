<script lang="ts">
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import DeepDive from '$lib/components/DeepDive.svelte';
	import LongRead from '$lib/components/LongRead.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data;

	// Enhanced SEO data for homepage - OPTIMIZED FOR ENGLISH SPEAKERS IN SWEDEN (Oct 2025)
	$: seoData = {
		title: data.meta?.title || 'Nordic News in English | NordicsToday - Latest Sweden & Scandinavia News for Expats',
		description: data.meta?.description || 'English news from Sweden, Norway, Denmark, Finland & Iceland. Daily Nordic news for expats and English speakers living in Scandinavia. Latest updates on Swedish politics, culture & society.',
		keywords: [
			// Core keywords for English speakers in Sweden
			'nordic news in english',
			'scandinavian news english',
			'sweden news in english',
			'expat news sweden',
			'english speaking news nordics',
			// Expat-focused terms
			'nordic expat community news',
			'living in sweden news english',
			'life in sweden for foreigners english news',
			'english language news sweden',
			// Regional coverage
			'latest nordic countries news english',
			'norway news english',
			'denmark news english',
			'finland news english',
			'iceland news english',
			// Long-tail conversational
			'where can i read nordic news in english',
			'best english news aggregator nordic countries',
			'what\'s happening in sweden for expats',
			// Timely/seasonal
			'nordic current events english',
			'scandinavia today in english',
			'latest news from sweden english'
		],
		url: '',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "NewsMediaOrganization",
			"name": "Nordics Today - English News in Sweden & Norway",
			"alternateName": "English Nordic News",
			"url": "https://nordicstoday.com",
			"logo": "https://nordicstoday.com/logo.png",
			"description": "English-language news aggregator for expats and English speakers living in Sweden and the Nordic countries. Daily news from Sweden, Norway, Denmark, Finland, and Iceland translated to English.",
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
				"audienceType": "Expats, international residents, and English speakers living in Sweden and Nordic countries",
				"geographicArea": {
					"@type": "Place",
					"name": "Sweden, Norway, Denmark, Finland, Iceland"
				}
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

<!-- Additional Articles Grid Section -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
	<div class="mb-8">
		<h2 class="text-2xl font-bold text-nordic-blue mb-2">More Nordic News</h2>
		<p class="text-gray-600">Stay updated with the latest stories from across the Nordic region</p>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each (data.latestArticles || []).slice(11, 23) as article}
			<a href={article.url_slug} class="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
				<img 
					src={article.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
					alt={article.featured_image_alt || article.title} 
					class="w-full h-32 object-cover" 
				/>
				<div class="p-3">
					<div class="flex items-center gap-2 mb-1">
						<span class="text-xs font-semibold text-nordic-blue bg-blue-50 px-2 py-1 rounded">{article.category_display}</span>
					</div>
					<h3 class="text-sm font-semibold text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">{article.title}</h3>
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span>{article.country_name}</span>
						<span>{article.relative_time}</span>
					</div>
				</div>
			</a>
		{:else}
			<div class="col-span-full text-center py-8">
				<p class="text-gray-500">Loading more articles...</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
</style>
