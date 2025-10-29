<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import CountryFAQ from '$lib/components/CountryFAQ.svelte';
	import { onMount } from 'svelte';

	export let data;
	
	// Get country config from data
	const { countryConfig } = data;
	$: country = countryConfig.name;
	$: countrySlug = countryConfig.slug;
	$: countryCode = countryConfig.code;
	$: parliament = countryConfig.parliament;
	$: cities = countryConfig.cities;

	// Pagination and infinite scroll
	let currentPage = 1;
	let loading = false;
	let hasMore = true;
	let allArticles: any[] = data.articles || [];
	const articlesPerPage = 12;

	// SEO optimized - dynamic for all countries
	$: seoData = {
		title: `English News in ${country} | Latest ${country} News in English | Nordics Today`,
		description: `Latest news from ${country} in English. Get real-time updates on ${country} politics, business, culture, and breaking news for English speakers in ${country}.`,
		keywords: [`English news in ${country}`, `${country} news in English`, `${country} news English`, `English speaking ${country} news`, `${country} politics English`, `${country} breaking news English`, `${country} business news English`],
		url: `/${countrySlug}`,
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": `English News in ${country}`,
			"description": `Latest ${country} news in English for English speakers`,
			"url": `https://nordicstoday.com/${countrySlug}`,
			"about": {
				"@type": "Country",
				"name": country
			},
			"inLanguage": "en",
			"audience": {
				"@type": "Audience",
				"audienceType": `English speakers in ${country}`
			},
			"publisher": {
				"@type": "NewsMediaOrganization",
				"name": "Nordics Today",
				"url": "https://nordicstoday.com"
			},
			"mainEntity": {
				"@type": "FAQPage",
				"mainEntity": countryConfig.faqs.map(faq => ({
					"@type": "Question",
					"name": faq.question,
					"acceptedAnswer": {
						"@type": "Answer",
						"text": faq.answer
					}
				}))
			}
		}
	};

	// Filter articles for this country - DYNAMIC
	$: countryArticles = allArticles.filter((article: any) => 
		article.source_country === countryCode || 
		article.category?.toLowerCase().includes(countrySlug) ||
		article.title?.toLowerCase().includes(countrySlug)
	);

	// Category-specific articles - matching your actual database categories
	$: politicsArticles = countryArticles.filter((a: any) => 
		a.category === 'politics'
	).slice(0, 4);
	
	$: businessArticles = countryArticles.filter((a: any) => 
		a.category === 'business'
	).slice(0, 4);
	
	$: techArticles = countryArticles.filter((a: any) => 
		a.category === 'tech'
	).slice(0, 4);
	
	$: societyArticles = countryArticles.filter((a: any) => 
		a.category === 'society' || 
		a.category === 'culture' ||
		a.category === 'breaking'  // Include breaking news in society section
	).slice(0, 4);

	// Paginated articles for display
	$: displayedArticles = countryArticles.slice(0, currentPage * articlesPerPage);

	// Load more articles function
	async function loadMoreArticles() {
		if (loading || !hasMore) return;
		
		loading = true;
		try {
			const response = await fetch(`/api/articles?country=${countryCode}&limit=20&offset=${allArticles.length}`);
			const newArticles = await response.json();
			
			if (newArticles.length === 0) {
				hasMore = false;
			} else {
				allArticles = [...allArticles, ...newArticles];
				currentPage++;
			}
		} catch (error) {
			console.error('Error loading more articles:', error);
		} finally {
			loading = false;
		}
	}

	// Infinite scroll detection
	onMount(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
				loadMoreArticles();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
	<meta name="sveltekit:reload" content="true" />
</svelte:head>

<SEOHead {...seoData} />

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			English News in {country}
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			{countryConfig.intro}
		</p>
	</header>

	{#if displayedArticles.length > 0}
		<!-- City Hubs Section -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">English News by {country} City</h2>
			<p class="text-gray-700 mb-6">Get localized news coverage from {country}'s major cities in English</p>
			<div class="grid gap-6 md:grid-cols-{cities.length}">
				{#each cities as city}
					<a href="/{city.slug}" class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
						<h3 class="text-xl font-bold text-gray-900 mb-2">{city.name} News in English</h3>
						<p class="text-gray-600 text-sm">{city.description}</p>
					</a>
				{/each}
			</div>
		</section>

		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">{country} Politics in English</h2>
					<a href="/{countrySlug}/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">{parliament} debates, government policy, and political developments</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each politicsArticles as article}
					<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if article.featured_image_url}
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-40 object-cover" />
						{/if}
						<div class="p-4">
							<h3 class="font-semibold text-base mb-2 line-clamp-2">
								<a href={article.url_slug} class="hover:text-blue-600">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-2 line-clamp-2">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		{#if businessArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">{country} Business News</h2>
					<a href="/{countrySlug}/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">{country} finance, startups, corporate news, and economic developments</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each businessArticles as article}
					<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if article.featured_image_url}
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-40 object-cover" />
						{/if}
						<div class="p-4">
							<h3 class="font-semibold text-base mb-2 line-clamp-2">
								<a href={article.url_slug} class="hover:text-blue-600">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-2 line-clamp-2">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		{#if techArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">{country} Technology & Innovation</h2>
					<a href="/{countrySlug}/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Tech startups, innovation, digital trends, and {country} tech industry news</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each techArticles as article}
					<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if article.featured_image_url}
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-40 object-cover" />
						{/if}
						<div class="p-4">
							<h3 class="font-semibold text-base mb-2 line-clamp-2">
								<a href={article.url_slug} class="hover:text-blue-600">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-2 line-clamp-2">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		{#if societyArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">{country} Society & Culture</h2>
					<a href="/{countrySlug}/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in {country}, social issues, cultural events, and community news</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each societyArticles as article}
					<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if article.featured_image_url}
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-40 object-cover" />
						{/if}
						<div class="p-4">
							<h3 class="font-semibold text-base mb-2 line-clamp-2">
								<a href={article.url_slug} class="hover:text-blue-600">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-2 line-clamp-2">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		<!-- All Articles Section -->
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">All {country} News in English</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each displayedArticles as article}
					<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if article.featured_image_url}
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover" />
						{/if}
						<div class="p-6">
							<h3 class="font-semibold text-lg mb-2 line-clamp-2">
								<a href={article.url_slug} class="hover:text-blue-600">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-3">
								{article.summary || article.excerpt}
							</p>
							<div class="flex justify-between items-center text-sm text-gray-500">
								<span> </span>
								<time datetime={article.published_date}>
									{article.relative_time}
								</time>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<!-- Loading indicator -->
			{#if loading}
				<div class="text-center py-8">
					<div class="inline-flex items-center">
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span class="text-gray-600">Loading more articles...</span>
					</div>
				</div>
			{/if}

			<!-- Load more button (fallback for non-JS users) -->
			{#if hasMore && !loading}
				<div class="text-center py-8">
					<button 
						on:click={loadMoreArticles}
						class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
					>
						Load More Articles
					</button>
				</div>
			{/if}

			<!-- SEO pagination info -->
			<div class="text-center text-sm text-gray-500 mt-8">
				Showing {displayedArticles.length} of {countryArticles.length} articles
				{#if hasMore}
					• Scroll down for more
				{/if}
			</div>
		</section>

		<!-- FAQ Section -->
		<CountryFAQ faqs={countryConfig.faqs} />
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Loading latest {country} news in English...</p>
		</div>
	{/if}

</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 3;
	}
</style>
