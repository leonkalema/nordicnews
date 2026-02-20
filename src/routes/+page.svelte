<script lang="ts">
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import DeepDive from '$lib/components/DeepDive.svelte';
	import LongRead from '$lib/components/LongRead.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FeaturedGuides from '$lib/components/FeaturedGuides.svelte';
	import AdUnit from '$lib/components/AdUnit.svelte';
	import TrendingNow from '$lib/components/TrendingNow.svelte';

	const { data }: { data: any } = $props();

	const seoData = $derived({
		title: data.meta?.title || 'Nordics Today - Your Daily Source for Nordic News',
		description: data.meta?.description || 'English news from Sweden, Norway, Denmark, Finland & Iceland. Daily Nordic news for expats and English speakers living in Scandinavia. Latest updates on Swedish politics, culture & society.',
		keywords: [
			'nordic news in english',
			'sweden news in english',
			'scandinavian news english',
			'expat news sweden',
			'norway news english',
			'denmark news english',
			'finland news english',
			'iceland news english',
			'living in sweden news',
			'nordic current events'
		],
		url: '',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "NewsMediaOrganization",
					"@id": "https://nordicstoday.com/#organization",
					"name": "Nordics Today",
					"alternateName": "NordicsToday",
					"url": "https://nordicstoday.com",
					"logo": "https://nordicstoday.com/logo.png",
					"sameAs": [
						"https://twitter.com/nordicstoday",
						"https://facebook.com/nordicstoday"
					],
					"inLanguage": "en"
				},
				{
					"@type": "WebSite",
					"@id": "https://nordicstoday.com/#website",
					"name": "Nordics Today",
					"url": "https://nordicstoday.com",
					"potentialAction": {
						"@type": "SearchAction",
						"target": "https://nordicstoday.com/search?q={search_term_string}",
						"query-input": "required name=search_term_string"
					}
				},
				{
					"@type": "CollectionPage",
					"@id": "https://nordicstoday.com/#webpage",
					"url": "https://nordicstoday.com",
					"name": "Nordics Today - Nordic News in English",
					"isPartOf": { "@id": "https://nordicstoday.com/#website" },
					"about": { "@id": "https://nordicstoday.com/#organization" },
					"description": "English-language news from Sweden and the Nordic countries for expats and English speakers."
				},
				{
					"@type": "BreadcrumbList",
					"itemListElement": [
						{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nordicstoday.com/" }
					]
				},
				{
					"@type": "ItemList",
					"itemListElement": (data.latestArticles || []).slice(0, 10).map((article, index) => ({
						"@type": "ListItem",
						"position": index + 1,
						"url": `https://nordicstoday.com${article.url_slug}`
					}))
				}
			]
		}
	});
</script>

<SEOHead {...seoData} />

<!-- Minimal intro -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 border-b border-gray-100">
  <h1 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
    Nordic News in English
  </h1>
</section>

<!-- Ad: Above the fold (leaderboard) -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 flex justify-center">
	<AdUnit slot="2497849466" format="horizontal" responsive={false} />
</div>

<FeaturedGuides guideArticles={data.guideArticles || []} />
<DailySnapshot featuredArticles={data.featuredArticles || []} />

<!-- Ad: Mid-page leaderboard (different slot from above-fold) -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 flex justify-center">
	<AdUnit slot="9168219982" format="horizontal" responsive={true} />
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
		<div class="lg:col-span-3">
			<AcrossTheNordics articlesByCountry={data.articlesByCountry || []} />

			<!-- Ad: Single large placement (responsive) -->
			<div class="my-10 flex justify-center">
				<AdUnit slot="6255665066" format="rectangle" responsive={true} />
			</div>
		</div>
		<aside class="lg:col-span-1">
			<div class="sticky top-4">
				<TrendingNow articles={data.trendingArticles || []} />
			</div>
		</aside>
	</div>
</div>

<DeepDive 
	latestArticles={data.latestArticles || []} 
	articlesByCategory={data.articlesByCategory || []} 
	trendingArticles={data.trendingArticles || []} 
/>

<!-- Ad: Bottom of page (high engagement spot) -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 flex justify-center">
	<AdUnit slot="6255665066" format="rectangle" responsive={true} />
</div>


<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
</style>
