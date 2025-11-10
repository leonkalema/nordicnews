<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import CountryFAQ from '$lib/components/CountryFAQ.svelte';
	import { onMount } from 'svelte';

	export let data;
	
	// Get country config from data
	$: countryConfig = data.countryConfig;
	$: country = countryConfig?.name || '';
	$: countrySlug = countryConfig?.slug || '';
	$: countryCode = countryConfig?.code || '';
	$: parliament = countryConfig?.parliament || '';
	$: cities = countryConfig?.cities || [];

	// Pagination and infinite scroll
	let currentPage = 1;
	let loading = false;
	let hasMore = true;
	let allArticles: any[] = data.articles || [];
	const articlesPerPage = 12;

	// SEO optimized - dynamic for all countries
	$: seoData = {
		title: `${country} News in English | Latest ${country} Updates | Nordics Today`,
		description: `Latest ${country} news in English. Real-time updates on ${country} politics, business, culture for English speakers. Read ${country} news today.`,
		keywords: [`${country} news in English`, `${country} news English`, `English news ${country}`, `${country} breaking news English`, `${country} ${parliament} English`, `${country} politics English`, `${country} expat news`],
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

    <!-- Breadcrumbs: Home -> Country -->
    <script type="application/ld+json">
      {@html JSON.stringify({
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
            "name": country,
            "item": `https://nordicstoday.com/${countrySlug}`
          }
        ]
      })}
    </script>
</svelte:head>

<SEOHead {...seoData} />

<!-- Hero Section - Clean Black & White -->
<div class="relative overflow-hidden bg-black text-white border-b-4 border-white">
	<div class="container mx-auto px-4 py-16 md:py-24 relative z-10">
		<div class="max-w-4xl">
			<h1 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
				English News in {country}
			</h1>
			<p class="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
				{countryConfig.intro}
			</p>
		</div>
	</div>
</div>

<div class="bg-gray-50">
<div class="container mx-auto px-4 -mt-8 relative z-20">

	{#if displayedArticles.length > 0}
		<!-- City Hubs Section - Glassmorphism Cards -->
		<section class="mb-16">
			<div class="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
				<div class="text-center mb-10">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">English News by {country} City</h2>
					<p class="text-gray-600 text-lg">Get localized news coverage from {country}'s major cities in English</p>
				</div>
				<div class="grid gap-6 md:grid-cols-{cities.length}">
					{#each cities as city}
						<a href="/{city.slug}" class="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
							<div class="absolute top-4 right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
								</svg>
							</div>
							<h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{city.name} News in English</h3>
							<p class="text-gray-600 text-sm leading-relaxed">{city.description}</p>
						</a>
					{/each}
				</div>
			</div>
		</section>

		<!-- Latest News Section - Shows freshness immediately -->
		<section class="mb-16">
			<div class="mb-8">
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest {country} News in English Today</h2>
				<p class="text-gray-600 text-lg">Breaking {country} news in English - real-time updates for expats and English speakers</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each countryArticles.slice(0, 6) as article}
					<article class="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-300">
						{#if article.featured_image_url}
							<div class="relative overflow-hidden">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
								<div class="absolute top-3 left-3">
									<span class="px-3 py-1 bg-black text-white text-xs font-bold rounded">
										{article.category_display || article.category}
									</span>
								</div>
								<div class="absolute bottom-3 right-3">
									<span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded">
										{article.relative_time}
									</span>
								</div>
							</div>
						{/if}
						<div class="p-6">
							<h3 class="font-bold text-lg mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
								<a href={article.url_slug}>
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
								{article.summary || article.excerpt}
							</p>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-16">
			<div class="mb-8">
				<div class="flex justify-between items-center mb-3">
					<div>
						<h2 class="text-3xl font-bold text-gray-900 mb-1">{country} Politics in English</h2>
						<p class="text-gray-600">{parliament} debates, government policy, and political developments</p>
					</div>
					<a href="/{countrySlug}/politics" class="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
						View all
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
					</a>
				</div>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each politicsArticles as article}
					<article class="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
						{#if article.featured_image_url}
							<div class="relative overflow-hidden">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
								<div class="absolute top-3 left-3">
									<span class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">POLITICS</span>
								</div>
							</div>
						{/if}
						<div class="p-5">
							<h3 class="font-bold text-base mb-2 line-clamp-2 leading-snug">
								<a href={article.url_slug} class="hover:text-blue-600 transition-colors">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500 font-medium">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		{#if businessArticles.length > 0}
		<section class="mb-16">
			<div class="mb-8">
				<div class="flex justify-between items-center mb-3">
					<div>
						<h2 class="text-3xl font-bold text-gray-900 mb-1">{country} Business News</h2>
						<p class="text-gray-600">{country} finance, startups, corporate news, and economic developments</p>
					</div>
					<a href="/{countrySlug}/business" class="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
						View all
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
					</a>
				</div>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each businessArticles as article}
					<article class="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
						{#if article.featured_image_url}
							<div class="relative overflow-hidden">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
								<div class="absolute top-3 left-3">
									<span class="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">BUSINESS</span>
								</div>
							</div>
						{/if}
						<div class="p-5">
							<h3 class="font-bold text-base mb-2 line-clamp-2 leading-snug">
								<a href={article.url_slug} class="hover:text-blue-600 transition-colors">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500 font-medium">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		{#if techArticles.length > 0}
		<section class="mb-16">
			<div class="mb-8">
				<div class="flex justify-between items-center mb-3">
					<div>
						<h2 class="text-3xl font-bold text-gray-900 mb-1">{country} Technology & Innovation</h2>
						<p class="text-gray-600">Tech startups, innovation, digital trends, and {country} tech industry news</p>
					</div>
					<a href="/{countrySlug}/tech" class="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
						View all
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
					</a>
				</div>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each techArticles as article}
					<article class="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
						{#if article.featured_image_url}
							<div class="relative overflow-hidden">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
								<div class="absolute top-3 left-3">
									<span class="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">TECH</span>
								</div>
							</div>
						{/if}
						<div class="p-5">
							<h3 class="font-bold text-base mb-2 line-clamp-2 leading-snug">
								<a href={article.url_slug} class="hover:text-blue-600 transition-colors">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500 font-medium">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		{#if societyArticles.length > 0}
		<section class="mb-16">
			<div class="mb-8">
				<div class="flex justify-between items-center mb-3">
					<div>
						<h2 class="text-3xl font-bold text-gray-900 mb-1">{country} Society & Culture</h2>
						<p class="text-gray-600">Life in {country}, social issues, cultural events, and community news</p>
					</div>
					<a href="/{countrySlug}/society" class="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
						View all
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
					</a>
				</div>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each societyArticles as article}
					<article class="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
						{#if article.featured_image_url}
							<div class="relative overflow-hidden">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
								<div class="absolute top-3 left-3">
									<span class="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">SOCIETY</span>
								</div>
							</div>
						{/if}
						<div class="p-5">
							<h3 class="font-bold text-base mb-2 line-clamp-2 leading-snug">
								<a href={article.url_slug} class="hover:text-blue-600 transition-colors">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
								{article.summary || article.excerpt}
							</p>
							<time datetime={article.published_date} class="text-xs text-gray-500 font-medium">
								{article.relative_time}
							</time>
						</div>
					</article>
				{/each}
			</div>
		</section>
		{/if}

		<!-- All Articles Section -->
		<section class="mb-16">
			<div class="mb-8">
				<h2 class="text-3xl font-bold text-gray-900">All {country} News in English</h2>
				<p class="text-gray-600 mt-2">Latest articles from across {country}</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each displayedArticles as article}
					<article class="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
						{#if article.featured_image_url}
							<div class="relative overflow-hidden">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
							</div>
						{/if}
						<div class="p-6">
							<h3 class="font-bold text-lg mb-3 line-clamp-2 leading-snug">
								<a href={article.url_slug} class="hover:text-blue-600 transition-colors">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
								{article.summary || article.excerpt}
							</p>
							<div class="flex justify-between items-center text-sm text-gray-500">
								<span class="font-medium">{article.category_display || ''}</span>
								<time datetime={article.published_date} class="font-medium">
									{article.relative_time}
								</time>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<!-- Loading indicator -->
			{#if loading}
				<div class="text-center py-12">
					<div class="inline-flex items-center bg-white rounded-lg px-6 py-4 shadow-md">
						<svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span class="text-gray-700 font-medium">Loading more articles...</span>
					</div>
				</div>
			{/if}

			<!-- Load more button (fallback for non-JS users) -->
			{#if hasMore && !loading}
				<div class="text-center py-12">
					<button 
						on:click={loadMoreArticles}
						class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
					>
						Load More Articles
					</button>
				</div>
			{/if}

			<!-- SEO pagination info -->
			<div class="text-center text-sm text-gray-500 mt-8 mb-4">
				Showing {displayedArticles.length} of {countryArticles.length} articles
				{#if hasMore}
					• Scroll down for more
				{/if}
			</div>
		</section>

		<!-- FAQ Section -->
		<CountryFAQ faqs={countryConfig.faqs} />
	{:else}
		<div class="text-center py-20">
			<div class="inline-flex items-center bg-white rounded-lg px-6 py-4 shadow-md">
				<svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<p class="text-gray-700 font-medium">Loading latest {country} news in English...</p>
			</div>
		</div>
	{/if}

</div>
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
