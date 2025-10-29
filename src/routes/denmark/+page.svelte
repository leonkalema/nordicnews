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

	// SEO optimized for "English news in Denmark"
	$: seoData = {
		title: 'English News in Denmark | Latest Danish News in English | Nordics Today',
		description: 'Latest news from Denmark in English. Get real-time updates on Danish politics, business, culture, and breaking news for English speakers in Denmark.',
		keywords: ['English news in Denmark', 'Danish news in English', 'Denmark news English', 'English speaking Denmark news', 'Danish politics English', 'Copenhagen news English', 'Denmark breaking news English', 'Danish business news English'],
		url: '/denmark',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "English News in Denmark",
			"description": "Latest Danish news in English for English speakers",
			"url": "https://nordicstoday.com/denmark",
			"about": {
				"@type": "Country",
				"name": "Denmark"
			},
			"inLanguage": "en",
			"audience": {
				"@type": "Audience",
				"audienceType": "English speakers in Denmark"
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
						"name": "Where can I read Danish news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today provides daily Danish news in English, covering Folketing parliament, Copenhagen business, wind energy industry, and cultural events for expats and global readers."
						}
					},
					{
						"@type": "Question",
						"name": "What is the best English news site for Denmark?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today is a comprehensive English news aggregator for Denmark, offering real-time coverage of Danish politics, business, wind energy, and society from Copenhagen and across Denmark."
						}
					},
					{
						"@type": "Question",
						"name": "Does Denmark have English newspapers?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "While most Danish newspapers publish in Danish, Nordics Today provides Danish news in English, making it accessible for expats, international residents, and English speakers worldwide."
						}
					},
					{
						"@type": "Question",
						"name": "How can expats follow Danish politics in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today covers Danish political news in English, including Folketing parliament debates, government policy changes, and election updates, making it easy for expats to stay informed about Danish politics."
						}
					},
					{
						"@type": "Question",
						"name": "What topics does Denmark news cover?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Denmark news in English covers Folketing politics, Copenhagen business, wind energy industry, shipping sector, and cultural events across Denmark."
						}
					},
					{
						"@type": "Question",
						"name": "Is Danish news updated daily?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today updates Danish news in English daily, providing real-time coverage of breaking news, political developments, and local events from Denmark."
						}
					}
				]
			}
		}
	};

	// Filter articles for Denmark
	$: denmarkArticles = allArticles.filter((article: any) => 
		article.source_country === 'DK' || 
		article.category?.toLowerCase().includes('denmark') ||
		article.title?.toLowerCase().includes('denmark')
	);

	// Category-specific articles
	$: politicsArticles = denmarkArticles.filter((a: any) => a.category === 'politics').slice(0, 4);
	$: businessArticles = denmarkArticles.filter((a: any) => a.category === 'business').slice(0, 4);
	$: techArticles = denmarkArticles.filter((a: any) => a.category === 'tech').slice(0, 4);
	$: societyArticles = denmarkArticles.filter((a: any) => a.category === 'society').slice(0, 4);

	// Paginated articles for display
	$: paginatedArticles = denmarkArticles.slice(0, currentPage * articlesPerPage);
	$: hasMore = paginatedArticles.length < denmarkArticles.length;

	// Load more articles
	async function loadMoreArticles() {
		if (loading || !hasMore) return;
		
		loading = true;
		try {
			const response = await fetch(`/api/articles?country=DK&limit=12&offset=${allArticles.length}`);
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
			English News in Denmark
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			Nordics Today provides daily Danish news in English, covering politics from the Folketing parliament, 
			Copenhagen business updates, wind energy industry, and cultural events for expats and global readers. 
			Whether you're following government policy changes, tracking Denmark's renewable energy developments, 
			monitoring shipping industry news, or staying informed about life in Denmark, our comprehensive coverage 
			delivers real-time English news from Copenhagen and across the country. From breaking news to in-depth 
			analysis of Danish politics, wind energy sector, maritime industry, and societal trends, we make Danish 
			news accessible for international residents, expats, and English speakers worldwide.
		</p>
	</header>

	{#if paginatedArticles.length > 0}
		<!-- City Hub Section -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">English News by Danish City</h2>
			<p class="text-gray-700 mb-6">Get localized news coverage from Denmark's capital and regions in English</p>
			<div class="grid gap-6 md:grid-cols-1">
				<a href="/copenhagen" class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
					<h3 class="text-xl font-bold text-gray-900 mb-2">Copenhagen News in English</h3>
					<p class="text-gray-600 text-sm">Capital city politics, business, culture, and local events from Copenhagen</p>
				</a>
			</div>
		</section>

		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Danish Politics in English</h2>
					<a href="/category/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Folketing parliament, government decisions, and political developments from Denmark</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Danish Business News</h2>
					<a href="/category/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Wind energy industry, shipping sector, and Copenhagen business developments</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Danish Technology & Innovation</h2>
					<a href="/category/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Wind energy, green tech, and digital innovation from Denmark</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Danish Society & Culture</h2>
					<a href="/category/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in Denmark, cultural events, and community news</p>
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
			<h2 class="text-2xl font-semibold mb-6">All Danish News in English</h2>
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
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Where can I read Danish news in English?</h3>
					<p class="text-gray-700">Nordics Today provides daily Danish news in English, covering Folketing parliament, Copenhagen business, wind energy industry, and cultural events for expats and global readers.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What is the best English news site for Denmark?</h3>
					<p class="text-gray-700">Nordics Today is a comprehensive English news aggregator for Denmark, offering real-time coverage of Danish politics, business, wind energy, and society from Copenhagen and across Denmark.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Does Denmark have English newspapers?</h3>
					<p class="text-gray-700">While most Danish newspapers publish in Danish, Nordics Today provides Danish news in English, making it accessible for expats, international residents, and English speakers worldwide.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">How can expats follow Danish politics in English?</h3>
					<p class="text-gray-700">Nordics Today covers Danish political news in English, including Folketing parliament debates, government policy changes, and election updates, making it easy for expats to stay informed about Danish politics.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What topics does Denmark news cover?</h3>
					<p class="text-gray-700">Denmark news in English covers Folketing politics, Copenhagen business, wind energy industry, shipping sector, and cultural events across Denmark.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Is Danish news updated daily?</h3>
					<p class="text-gray-700">Yes, Nordics Today updates Danish news in English daily, providing real-time coverage of breaking news, political developments, and local events from Denmark.</p>
				</div>
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-500">No articles available. Check back later for the latest news from Denmark.</p>
		</div>
	{/if}
</div>

	<!-- Across the Nordics -->
	<AcrossTheNordics />
</main>
