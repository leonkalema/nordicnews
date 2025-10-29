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

	// SEO optimized for "English news in Finland"
	$: seoData = {
		title: 'English News in Finland | Latest Finnish News in English | Nordics Today',
		description: 'Latest news from Finland in English. Get real-time updates on Finnish politics, business, culture, and breaking news for English speakers in Finland.',
		keywords: ['English news in Finland', 'Finnish news in English', 'Finland news English', 'English speaking Finland news', 'Finnish politics English', 'Helsinki news English', 'Finland breaking news English', 'Finnish business news English'],
		url: '/finland',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "English News in Finland",
			"description": "Latest Finnish news in English for English speakers",
			"url": "https://nordicstoday.com/finland",
			"about": {
				"@type": "Country",
				"name": "Finland"
			},
			"inLanguage": "en",
			"audience": {
				"@type": "Audience",
				"audienceType": "English speakers in Finland"
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
						"name": "Where can I read Finnish news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today provides daily Finnish news in English, covering Eduskunta parliament, Helsinki business, Nokia tech sector, and cultural events for expats and global readers."
						}
					},
					{
						"@type": "Question",
						"name": "What is the best English news site for Finland?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today is a comprehensive English news aggregator for Finland, offering real-time coverage of Finnish politics, business, tech industry, and society from Helsinki and across Finland."
						}
					},
					{
						"@type": "Question",
						"name": "Does Finland have English newspapers?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "While most Finnish newspapers publish in Finnish, Nordics Today provides Finnish news in English, making it accessible for expats, international residents, and English speakers worldwide."
						}
					},
					{
						"@type": "Question",
						"name": "How can expats follow Finnish politics in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today covers Finnish political news in English, including Eduskunta parliament debates, government policy changes, and election updates, making it easy for expats to stay informed about Finnish politics."
						}
					},
					{
						"@type": "Question",
						"name": "What topics does Finland news cover?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Finland news in English covers Eduskunta politics, Helsinki business, Nokia and tech sector, Arctic region, and cultural events across Finland."
						}
					},
					{
						"@type": "Question",
						"name": "Is Finnish news updated daily?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today updates Finnish news in English daily, providing real-time coverage of breaking news, political developments, and local events from Finland."
						}
					}
				]
			}
		}
	};

	// Filter articles for Finland
	$: finlandArticles = allArticles.filter((article: any) => 
		article.source_country === 'FI' || 
		article.category?.toLowerCase().includes('finland') ||
		article.title?.toLowerCase().includes('finland')
	);

	// Category-specific articles
	$: politicsArticles = finlandArticles.filter((a: any) => a.category === 'politics').slice(0, 4);
	$: businessArticles = finlandArticles.filter((a: any) => a.category === 'business').slice(0, 4);
	$: techArticles = finlandArticles.filter((a: any) => a.category === 'tech').slice(0, 4);
	$: societyArticles = finlandArticles.filter((a: any) => a.category === 'society').slice(0, 4);

	// Paginated articles for display
	$: paginatedArticles = finlandArticles.slice(0, currentPage * articlesPerPage);
	$: hasMore = paginatedArticles.length < finlandArticles.length;

	// Load more articles
	async function loadMoreArticles() {
		if (loading || !hasMore) return;
		
		loading = true;
		try {
			const response = await fetch(`/api/articles?country=FI&limit=12&offset=${allArticles.length}`);
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
			English News in Finland
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			Nordics Today provides daily Finnish news in English, covering politics from the Eduskunta parliament, 
			Helsinki business updates, Nokia and tech sector, and cultural events for expats and global readers. 
			Whether you're following government policy changes, tracking Finland's technology developments, 
			monitoring Arctic region news, or staying informed about life in Finland, our comprehensive coverage 
			delivers real-time English news from Helsinki and across the country. From breaking news to in-depth 
			analysis of Finnish politics, tech industry, Arctic affairs, and societal trends, we make Finnish 
			news accessible for international residents, expats, and English speakers worldwide.
		</p>
	</header>

	{#if paginatedArticles.length > 0}
		<!-- City Hub Section -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">English News by Finnish City</h2>
			<p class="text-gray-700 mb-6">Get localized news coverage from Finland's capital and regions in English</p>
			<div class="grid gap-6 md:grid-cols-1">
				<a href="/helsinki" class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
					<h3 class="text-xl font-bold text-gray-900 mb-2">Helsinki News in English</h3>
					<p class="text-gray-600 text-sm">Capital city politics, business, culture, and local events from Helsinki</p>
				</a>
			</div>
		</section>

		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Finnish Politics in English</h2>
					<a href="/category/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Eduskunta parliament, government decisions, and political developments from Finland</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Finnish Business News</h2>
					<a href="/category/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Nokia, tech sector, and Helsinki business developments</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Finnish Technology & Innovation</h2>
					<a href="/category/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Nokia, gaming industry, and digital innovation from Finland</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Finnish Society & Culture</h2>
					<a href="/category/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in Finland, Arctic region, and community news</p>
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
			<h2 class="text-2xl font-semibold mb-6">All Finnish News in English</h2>
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
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Where can I read Finnish news in English?</h3>
					<p class="text-gray-700">Nordics Today provides daily Finnish news in English, covering Eduskunta parliament, Helsinki business, Nokia tech sector, and cultural events for expats and global readers.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What is the best English news site for Finland?</h3>
					<p class="text-gray-700">Nordics Today is a comprehensive English news aggregator for Finland, offering real-time coverage of Finnish politics, business, tech industry, and society from Helsinki and across Finland.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Does Finland have English newspapers?</h3>
					<p class="text-gray-700">While most Finnish newspapers publish in Finnish, Nordics Today provides Finnish news in English, making it accessible for expats, international residents, and English speakers worldwide.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">How can expats follow Finnish politics in English?</h3>
					<p class="text-gray-700">Nordics Today covers Finnish political news in English, including Eduskunta parliament debates, government policy changes, and election updates, making it easy for expats to stay informed about Finnish politics.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What topics does Finland news cover?</h3>
					<p class="text-gray-700">Finland news in English covers Eduskunta politics, Helsinki business, Nokia and tech sector, Arctic region, and cultural events across Finland.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Is Finnish news updated daily?</h3>
					<p class="text-gray-700">Yes, Nordics Today updates Finnish news in English daily, providing real-time coverage of breaking news, political developments, and local events from Finland.</p>
				</div>
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-500">No articles available. Check back later for the latest news from Finland.</p>
		</div>
	{/if}
</div>

	<!-- Across the Nordics -->
	<AcrossTheNordics />
</main>
