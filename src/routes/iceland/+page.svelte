<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { onMount } from 'svelte';

	export let data;

	// Pagination and infinite scroll
	let currentPage = 1;
	let loading = false;
	let hasMore = true;
	let allArticles: any[] = data.articles || [];
	const articlesPerPage = 12;

	// SEO optimized for "English news in Iceland"
	$: seoData = {
		title: 'English News in Iceland | Latest Icelandic News in English | Nordics Today',
		description: 'Latest news from Iceland in English. Get real-time updates on Icelandic politics, business, culture, and breaking news for English speakers in Iceland.',
		keywords: ['English news in Iceland', 'Icelandic news in English', 'Iceland news English', 'English speaking Iceland news', 'Icelandic politics English', 'Reykjavik news English', 'Iceland breaking news English', 'Icelandic business news English'],
		url: '/iceland',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "English News in Iceland",
			"description": "Latest Icelandic news in English for English speakers",
			"url": "https://nordicstoday.com/iceland",
			"about": {
				"@type": "Country",
				"name": "Iceland"
			},
			"inLanguage": "en",
			"audience": {
				"@type": "Audience",
				"audienceType": "English speakers in Iceland"
			},
			"publisher": {
				"@type": "NewsMediaOrganization",
				"name": "Nordics Today",
				"url": "https://nordicstoday.com"
			},
			"mainEntity": {
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "Where can I read Icelandic news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today provides daily Icelandic news in English, covering Althing parliament, Reykjavik business, volcanic activity, tourism, and cultural events for expats and global readers."
						}
					},
					{
						"@type": "Question",
						"name": "What is the best English news site for Iceland?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today is a comprehensive English news aggregator for Iceland, offering real-time coverage of Icelandic politics, business, volcanic activity, and society from Reykjavik and across Iceland."
						}
					},
					{
						"@type": "Question",
						"name": "Does Iceland have English newspapers?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "While most Icelandic newspapers publish in Icelandic, Nordics Today provides Icelandic news in English, making it accessible for expats, tourists, and English speakers worldwide."
						}
					},
					{
						"@type": "Question",
						"name": "How can expats follow Icelandic politics in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today covers Icelandic political news in English, including Althing parliament debates, government policy changes, and election updates, making it easy for expats to stay informed about Icelandic politics."
						}
					},
					{
						"@type": "Question",
						"name": "What topics does Iceland news cover?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Iceland news in English covers Althing politics, Reykjavik business, volcanic activity, tourism industry, fishing industry, renewable energy, and cultural events across Iceland."
						}
					},
					{
						"@type": "Question",
						"name": "Is Icelandic news updated daily?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today updates Icelandic news in English daily, providing real-time coverage of breaking news, volcanic activity, political developments, and local events from Iceland."
						}
					}
				]
			}
		}
	};

	// Filter articles for Iceland
	$: icelandArticles = allArticles.filter((article: any) => 
		article.source_country === 'IS' || 
		article.category?.toLowerCase().includes('iceland') ||
		article.title?.toLowerCase().includes('iceland')
	);

	// Category-specific articles
	$: politicsArticles = icelandArticles.filter((a: any) => a.category === 'politics').slice(0, 4);
	$: businessArticles = icelandArticles.filter((a: any) => a.category === 'business').slice(0, 4);
	$: techArticles = icelandArticles.filter((a: any) => a.category === 'tech').slice(0, 4);
	$: societyArticles = icelandArticles.filter((a: any) => a.category === 'society').slice(0, 4);

	// Paginated articles for display
	$: paginatedArticles = icelandArticles.slice(0, currentPage * articlesPerPage);
	$: hasMore = paginatedArticles.length < icelandArticles.length;

	// Load more articles
	async function loadMoreArticles() {
		if (loading || !hasMore) return;
		
		loading = true;
		try {
			const response = await fetch(`/api/articles?country=IS&limit=12&offset=${allArticles.length}`);
			const newArticles = await response.json();
			
			if (newArticles && newArticles.length > 0) {
				allArticles = [...allArticles, ...newArticles];
			} else {
				hasMore = false;
			}
		} catch (error) {
			console.error('Error loading more articles:', error);
		} finally {
			loading = false;
		}
	}

	// Infinite scroll
	function handleScroll() {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
			loadMoreArticles();
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<SEOHead {...seoData} />

<main class="min-h-screen bg-gray-50">
<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			English News in Iceland
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			Nordics Today provides daily Icelandic news in English, covering politics from the Althing parliament, 
			Reykjavik business updates, volcanic activity, and cultural events for expats and global readers. 
			Whether you're following government policy changes, tracking Iceland's renewable energy developments, 
			monitoring volcanic eruptions, or staying informed about life in Iceland, our comprehensive coverage 
			delivers real-time English news from Reykjavik and across the country. From breaking news to in-depth 
			analysis of Icelandic politics, tourism industry, fishing sector, and societal trends, we make Icelandic 
			news accessible for international residents, expats, tourists, and English speakers worldwide.
		</p>
	</header>

	{#if paginatedArticles.length > 0}
		<!-- City Hub Section -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">English News by Icelandic City</h2>
			<p class="text-gray-700 mb-6">Get localized news coverage from Iceland's capital and regions in English</p>
			<div class="grid gap-6 md:grid-cols-1">
				<a href="/reykjavik" class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
					<h3 class="text-xl font-bold text-gray-900 mb-2">Reykjavik News in English</h3>
					<p class="text-gray-600 text-sm">Capital city politics, business, culture, and local events from Reykjavik</p>
				</a>
			</div>
		</section>

		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Icelandic Politics in English</h2>
					<a href="/category/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Althing parliament, government decisions, and political developments from Iceland</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each politicsArticles as article}
					<ArticleCard {article} />
				{/each}
			</div>
		</section>
		{/if}

		{#if businessArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Icelandic Business News</h2>
					<a href="/category/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Tourism industry, fishing sector, renewable energy, and Reykjavik business</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each businessArticles as article}
					<ArticleCard {article} />
				{/each}
			</div>
		</section>
		{/if}

		{#if techArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Icelandic Technology & Innovation</h2>
					<a href="/category/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Renewable energy, geothermal power, tech startups, and digital innovation from Iceland</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each techArticles as article}
					<ArticleCard {article} />
				{/each}
			</div>
		</section>
		{/if}

		{#if societyArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Icelandic Society & Culture</h2>
					<a href="/category/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in Iceland, cultural events, volcanic activity, and community news</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each societyArticles as article}
					<ArticleCard {article} />
				{/each}
			</div>
		</section>
		{/if}

		<!-- All Articles Section -->
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">All Icelandic News in English</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each paginatedArticles as article}
					<ArticleCard {article} />
				{/each}
			</div>

			<!-- Load More Button -->
			{#if hasMore}
				<div class="text-center mt-8">
					{#if loading}
						<div class="inline-flex items-center gap-2 text-gray-500">
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							Loading more articles...
						</div>
					{:else}
						<button 
							on:click={loadMoreArticles}
							class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Load More Articles
						</button>
					{/if}
				</div>
			{/if}
		</section>

		<!-- FAQ Section -->
		<section class="mb-12 bg-gray-50 rounded-lg p-8">
			<h2 class="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
			<div class="space-y-6">
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Where can I read Icelandic news in English?</h3>
					<p class="text-gray-700">Nordics Today provides daily Icelandic news in English, covering Althing parliament, Reykjavik business, volcanic activity, tourism, and cultural events for expats and global readers.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What is the best English news site for Iceland?</h3>
					<p class="text-gray-700">Nordics Today is a comprehensive English news aggregator for Iceland, offering real-time coverage of Icelandic politics, business, volcanic activity, and society from Reykjavik and across Iceland.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Does Iceland have English newspapers?</h3>
					<p class="text-gray-700">While most Icelandic newspapers publish in Icelandic, Nordics Today provides Icelandic news in English, making it accessible for expats, tourists, and English speakers worldwide.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">How can expats follow Icelandic politics in English?</h3>
					<p class="text-gray-700">Nordics Today covers Icelandic political news in English, including Althing parliament debates, government policy changes, and election updates, making it easy for expats to stay informed about Icelandic politics.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What topics does Iceland news cover?</h3>
					<p class="text-gray-700">Iceland news in English covers Althing politics, Reykjavik business, volcanic activity, tourism industry, fishing industry, renewable energy, and cultural events across Iceland.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Is Icelandic news updated daily?</h3>
					<p class="text-gray-700">Yes, Nordics Today updates Icelandic news in English daily, providing real-time coverage of breaking news, volcanic activity, political developments, and local events from Iceland.</p>
				</div>
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-500">No articles available. Check back later for the latest news from Iceland.</p>
		</div>
	{/if}
</div>

	<!-- Across the Nordics -->
	<AcrossTheNordics />
</main>
