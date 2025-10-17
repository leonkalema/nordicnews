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
			}
		}
	};

	// Filter articles for Iceland
	$: icelandArticles = allArticles.filter((article: any) => 
		article.source_country === 'IS' || 
		article.category?.toLowerCase().includes('iceland') ||
		article.title?.toLowerCase().includes('iceland')
	);

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
		<p class="text-xl text-gray-600 max-w-3xl">
			Stay informed with the latest Icelandic news in English. 
			From Reykjavik politics to Icelandic business, culture, and breaking news - 
			comprehensive coverage for English speakers living in or interested in Iceland.
		</p>
	</header>

	{#if paginatedArticles.length > 0}
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">Latest Icelandic News in English</h2>
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
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-500">No articles available. Check back later for the latest news from Iceland.</p>
		</div>
	{/if}
</div>

	<!-- Across the Nordics -->
	<AcrossTheNordics />
</main>
