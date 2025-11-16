<script lang="ts">
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import DeepDive from '$lib/components/DeepDive.svelte';
	import LongRead from '$lib/components/LongRead.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FeaturedGuides from '$lib/components/FeaturedGuides.svelte';

	export let data;

	
	$: seoData = {
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
	};
</script>

<SEOHead {...seoData} />

<!-- Intro section for crawlable content and H1 -->
<section class="max-w-4xl mx-auto px-4 py-12 text-center">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">
    Nordic News in English
  </h1>
  <p class="text-xl text-gray-700 mb-2">
    Daily news from across Scandinavia, curated for expats and English speakers.
  </p>
  <p class="text-gray-600">
    Covering Sweden, Norway, Denmark, Finland, and Iceland.
  </p>
</section>

<section class="max-w-7xl mx-auto px-4 pb-8">
  <a href="https://fcnordljus.se/register" target="_blank" rel="noopener noreferrer sponsored" class="block">
    <img 
      src="https://efqogymhexbveihxtzsj.supabase.co/storage/v1/object/public/ads/New%20to.png" 
      alt="Register with FC Nordljus" 
      loading="lazy" 
      decoding="async" 
      class="w-full h-auto rounded-xl shadow-md" 
    />
  </a>
</section>

<FeaturedGuides guideArticles={data.guideArticles || []} />
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
					alt={article.featured_image_alt || `${article.title} - ${article.country_name} news`} 
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
