<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { onMount } from 'svelte';

	export let data;

	let currentPage = 1;
	let loading = false;
	let hasMore = true;
	let allArticles: any[] = data.articles || [];
	const articlesPerPage = 12;

	$: seoData = {
		title: 'Stockholm News in English | Latest Stockholm Updates | Nordics Today',
		description: 'Latest news from Stockholm in English. Get real-time updates on Stockholm politics, business, culture, and local events for English speakers in Sweden\'s capital.',
		keywords: ['Stockholm news in English', 'Stockholm news English', 'English news Stockholm', 'Stockholm breaking news', 'Stockholm politics English', 'Stockholm business news', 'Stockholm local news English'],
		url: '/stockholm',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Stockholm News in English",
			"description": "Latest Stockholm news in English for English speakers",
			"url": "https://nordicstoday.com/stockholm",
			"about": {
				"@type": "City",
				"name": "Stockholm",
				"containedIn": {
					"@type": "Country",
					"name": "Sweden"
				}
			},
			"inLanguage": "en",
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Sweden",
						"item": "https://nordicstoday.com/sweden"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Stockholm",
						"item": "https://nordicstoday.com/stockholm"
					}
				]
			},
			"mainEntity": {
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "Where can I read Stockholm news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today provides daily Stockholm news in English, covering Riksdag politics, Stockholm business, local events, and city developments for expats and English speakers in Sweden's capital."
						}
					},
					{
						"@type": "Question",
						"name": "What topics does Stockholm news cover?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Stockholm news in English covers politics from the Riksdag, Stockholm business and startups, tech innovation, housing market, transportation (SL), cultural events, and local community news."
						}
					},
					{
						"@type": "Question",
						"name": "Is Stockholm news updated daily?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today updates Stockholm news in English daily, providing real-time coverage of breaking news, political developments, and local events from Sweden's capital."
						}
					},
					{
						"@type": "Question",
						"name": "Can expats follow Stockholm local news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today provides Stockholm local news in English for expats, covering everything from city council decisions to neighborhood events, housing, and transportation updates."
						}
					}
				]
			}
		}
	};

	// Category-specific articles
	$: politicsArticles = allArticles.filter((a: any) => a.category === 'politics').slice(0, 4);
	$: businessArticles = allArticles.filter((a: any) => a.category === 'business').slice(0, 4);
	$: techArticles = allArticles.filter((a: any) => a.category === 'tech').slice(0, 4);
	$: societyArticles = allArticles.filter((a: any) => a.category === 'society').slice(0, 4);

	$: displayedArticles = allArticles.slice(0, currentPage * articlesPerPage);

	async function loadMoreArticles() {
		if (loading || !hasMore) return;
		
		loading = true;
		try {
			const response = await fetch(`/api/articles?country=SE&limit=30&offset=${allArticles.length}`);
			const newArticles = await response.json();
			
			const stockholmArticles = newArticles.filter((article: any) => 
				article.title?.toLowerCase().includes('stockholm') ||
				article.summary?.toLowerCase().includes('stockholm')
			);
			
			if (stockholmArticles.length === 0) {
				hasMore = false;
			} else {
				allArticles = [...allArticles, ...stockholmArticles];
				currentPage++;
			}
		} catch (error) {
			console.error('Error loading more articles:', error);
		} finally {
			loading = false;
		}
	}

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

<SEOHead {...seoData} />

<div class="container mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-gray-600">
		<a href="/sweden" class="hover:text-blue-600">Sweden news in English</a>
		<span class="mx-2">→</span>
		<span class="text-gray-900 font-semibold">Stockholm</span>
	</nav>

	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			Stockholm News in English
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			Stay informed with the latest Stockholm news in English. From Riksdag politics and government 
			decisions to Stockholm business developments, cultural events, and local news from Sweden's capital. 
			Whether you're an expat living in Stockholm, planning to move to the city, or simply interested in 
			Swedish capital affairs, our comprehensive English coverage keeps you updated on everything happening 
			in Stockholm. Get real-time news on Stockholm's tech scene, financial sector, transportation updates, 
			housing market, and community events—curated for English speakers.
		</p>
	</header>

	{#if displayedArticles.length > 0}
		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Stockholm Politics</h2>
					<a href="/category/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Riksdag debates, government decisions, and political news from Stockholm</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Stockholm Business</h2>
					<a href="/category/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Financial sector, startups, and business developments from Stockholm</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Stockholm Tech & Innovation</h2>
					<a href="/category/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Tech startups, innovation, and digital developments from Stockholm</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Stockholm Society & Culture</h2>
					<a href="/category/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in Stockholm, cultural events, and community news</p>
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
			<h2 class="text-2xl font-semibold mb-6">All Stockholm News in English</h2>
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
								<span>{article.category_display || ''}</span>
								<time datetime={article.published_date}>
									{article.relative_time}
								</time>
							</div>
						</div>
					</article>
				{/each}
			</div>

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
		</section>

		<!-- FAQ Section -->
		<section class="mb-12 bg-gray-50 rounded-lg p-8">
			<h2 class="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
			<div class="space-y-6">
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Where can I read Stockholm news in English?</h3>
					<p class="text-gray-700">Nordics Today provides daily Stockholm news in English, covering Riksdag politics, Stockholm business, local events, and city developments for expats and English speakers in Sweden's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What topics does Stockholm news cover?</h3>
					<p class="text-gray-700">Stockholm news in English covers politics from the Riksdag, Stockholm business and startups, tech innovation, housing market, transportation (SL), cultural events, and local community news.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Is Stockholm news updated daily?</h3>
					<p class="text-gray-700">Yes, Nordics Today updates Stockholm news in English daily, providing real-time coverage of breaking news, political developments, and local events from Sweden's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Can expats follow Stockholm local news in English?</h3>
					<p class="text-gray-700">Yes, Nordics Today provides Stockholm local news in English for expats, covering everything from city council decisions to neighborhood events, housing, and transportation updates.</p>
				</div>
			</div>
		</section>

		<!-- Related Links -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">More Sweden News in English</h2>
			<div class="grid gap-4 md:grid-cols-3">
				<a href="/sweden" class="text-blue-600 hover:text-blue-800 font-semibold">
					← All Sweden News
				</a>
				<a href="/gothenburg" class="text-blue-600 hover:text-blue-800 font-semibold">
					Gothenburg News →
				</a>
				<a href="/malmo" class="text-blue-600 hover:text-blue-800 font-semibold">
					Malmö News →
				</a>
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Loading latest Stockholm news in English...</p>
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
