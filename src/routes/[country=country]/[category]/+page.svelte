<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { page } from '$app/stores';
	import { serializeJsonLd } from '$lib/utils/json-ld';
	
	export let data;
	
	// Pagination
	let currentPage = 1;
	const articlesPerPage = 24;
	$: totalPages = Math.ceil((data.articles?.length || 0) / articlesPerPage);
	$: paginatedArticles = data.articles?.slice(0, currentPage * articlesPerPage) || [];
	$: hasMore = currentPage < totalPages;
	
	function loadMore() {
		if (hasMore) currentPage++;
	}
	
	const countryNames: Record<string, string> = {
		'sweden': 'Sweden',
		'norway': 'Norway',
		'denmark': 'Denmark',
		'finland': 'Finland',
		'iceland': 'Iceland'
	};
	
	const categoryNames: Record<string, string> = {
		'politics': 'Politics',
		'business': 'Business',
		'tech': 'Technology',
		'society': 'Society & Culture'
	};
	
	$: countryName = countryNames[data.country] || data.country;
	$: categoryName = categoryNames[data.category] || data.category;
	
	$: seoData = {
		title: `${countryName} ${categoryName} News in English | Nordics Today`,
		description: `Latest ${categoryName.toLowerCase()} news from ${countryName} in English. Stay updated on ${countryName} ${categoryName.toLowerCase()} developments.`,
		keywords: [`${countryName} ${categoryName.toLowerCase()}`, `${countryName} news`, `${categoryName} English`],
		url: `/${data.country}/${data.category}`,
		type: 'website'
	};

	// Compute og:locale per country for OpenGraph
	function ogLocaleForCountry(slug: string): string {
		const map: Record<string, string> = {
			sweden: 'en_SE',
			norway: 'en_NO',
			denmark: 'en_DK',
			finland: 'en_FI',
			iceland: 'en_IS'
		};
		return map[slug] || 'en_US';
	}
	$: ogLocale = ogLocaleForCountry(data.country);
</script>

<svelte:head>
  <!-- Breadcrumbs: Home -> Country -> Category -->
  {@html `<script type="application/ld+json">${serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nordicstoday.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": countryName,
        "item": `https://nordicstoday.com/${data.country}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `https://nordicstoday.com/${data.country}/${data.category}`
      }
    ]
  })}</script>`}

  <!-- Hreflang alternates for equivalent category pages in each Nordic country -->
  <link rel="alternate" hreflang="x-default" href={`https://nordicstoday.com/${data.country}/${data.category}`} />
  <link rel="alternate" hreflang="en" href={`https://nordicstoday.com/${data.country}/${data.category}`} />
  <link rel="alternate" hreflang="en-SE" href={`https://nordicstoday.com/sweden/${data.category}`} />
  <link rel="alternate" hreflang="en-NO" href={`https://nordicstoday.com/norway/${data.category}`} />
  <link rel="alternate" hreflang="en-DK" href={`https://nordicstoday.com/denmark/${data.category}`} />
  <link rel="alternate" hreflang="en-FI" href={`https://nordicstoday.com/finland/${data.category}`} />
  <link rel="alternate" hreflang="en-IS" href={`https://nordicstoday.com/iceland/${data.category}`} />
</svelte:head>

<SEOHead {...seoData} locale={ogLocale} />

<div class="container mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm">
		<ol class="flex items-center space-x-2 text-gray-600">
			<li><a href="/" class="hover:text-blue-600">Home</a></li>
			<li><span class="mx-2">/</span></li>
			<li><a href="/{data.country}" class="hover:text-blue-600">{countryName}</a></li>
			<li><span class="mx-2">/</span></li>
			<li class="text-gray-900 font-semibold">{categoryName}</li>
		</ol>
	</nav>

	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			{countryName} {categoryName} News in English
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl">
			Latest {categoryName.toLowerCase()} news and updates from {countryName} in English.
		</p>
	</header>

	{#if data.articles && data.articles.length > 0}
		<div class="mb-4 text-gray-600">
			Showing {paginatedArticles.length} of {data.articles.length} articles
		</div>
		
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each paginatedArticles as article}
				<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
					{#if article.featured_image_url}
						<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover" />
					{/if}
					<div class="p-6">
						<h2 class="font-semibold text-lg mb-2 line-clamp-2">
							<a href={article.url_slug} class="hover:text-blue-600">
								{article.title}
							</a>
						</h2>
						<p class="text-gray-600 text-sm mb-4 line-clamp-3">
							{article.summary || article.excerpt}
						</p>
						<div class="flex items-center justify-between text-sm text-gray-500">
							<time datetime={article.published_date}>
								{article.relative_time}
							</time>
							<span class="text-blue-600 font-medium">{article.category_display}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
		
		<!-- Load More Button -->
		{#if hasMore}
			<div class="text-center mt-8">
				<button 
					on:click={loadMore}
					class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
				>
					Load More Articles ({data.articles.length - paginatedArticles.length} remaining)
				</button>
			</div>
		{/if}
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">No {categoryName.toLowerCase()} articles available for {countryName} at the moment.</p>
			<a href="/{data.country}" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
				← Back to all {countryName} news
			</a>
		</div>
	{/if}

	<!-- Related Links -->
	<section class="mt-12 bg-blue-50 rounded-lg p-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-6">More {countryName} News</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<a href="/{data.country}" class="text-blue-600 hover:text-blue-800 font-semibold">
				← All {countryName} News
			</a>
			<a href="/category/{data.category}" class="text-blue-600 hover:text-blue-800 font-semibold">
				{categoryName} from All Nordic Countries →
			</a>
		</div>
	</section>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
