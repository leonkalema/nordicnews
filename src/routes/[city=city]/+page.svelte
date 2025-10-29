<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data;
	
	$: cityConfig = data.cityConfig;
	$: countryConfig = data.countryConfig;
	$: cityName = cityConfig?.name || '';
	$: citySlug = cityConfig?.slug || '';
	$: countryName = countryConfig?.name || '';
	$: countrySlug = countryConfig?.slug || '';
	$: articles = data.articles || [];

	$: seoData = {
		title: `${cityName} News in English | Latest ${cityName} Updates | Nordics Today`,
		description: `Latest news from ${cityName} in English. Get real-time updates on ${cityName} politics, business, culture, and local events.`,
		keywords: [`${cityName} news in English`, `${cityName} news English`, `${countryName} capital news`],
		url: `/${citySlug}`,
		type: 'website'
	};
</script>

<SEOHead {...seoData} />

<div class="container mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-gray-600">
		<a href="/{countrySlug}" class="hover:text-blue-600">{countryName} news in English</a>
		<span class="mx-2">→</span>
		<span class="text-gray-900 font-semibold">{cityName}</span>
	</nav>

	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			{cityName} News in English
		</h1>
		<p class="text-lg text-gray-700">
			{cityConfig?.description || `Latest news and updates from ${cityName}`}
		</p>
	</header>

	{#if articles.length > 0}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each articles as article}
				<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
					{#if article.featured_image_url}
						<img src={article.featured_image_url} alt={article.title} class="w-full h-48 object-cover" />
					{/if}
					<div class="p-6">
						<h2 class="font-semibold text-lg mb-2">
							<a href={article.url_slug} class="hover:text-blue-600">
								{article.title}
							</a>
						</h2>
						<p class="text-gray-600 text-sm mb-4">
							{article.summary || article.excerpt}
						</p>
						<div class="flex items-center justify-between text-sm text-gray-500">
							<time>{article.relative_time}</time>
							<span class="text-blue-600">{article.category_display}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">No articles available for {cityName} at the moment.</p>
			<a href="/{countrySlug}" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
				← Back to all {countryName} news
			</a>
		</div>
	{/if}

	<!-- Related Links -->
	<section class="mt-12 bg-blue-50 rounded-lg p-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-6">More {countryName} News</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<a href="/{countrySlug}" class="text-blue-600 hover:text-blue-800 font-semibold">
				← All {countryName} News
			</a>
			<a href="/{countrySlug}/politics" class="text-blue-600 hover:text-blue-800 font-semibold">
				{countryName} Politics →
			</a>
		</div>
	</section>
</div>
