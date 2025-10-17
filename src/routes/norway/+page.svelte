<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { onMount } from 'svelte';

	export let data;

	// Pagination and infinite scroll
	let currentPage = 1;
	let loading = false;
	let hasMore = true;
	let allArticles: any[] = data.articles || [];
	const articlesPerPage = 12;

	// SEO optimized for "English news in Norway"
	$: seoData = {
		title: 'English News in Norway | Latest Norwegian News in English | Nordics Today',
		description: 'Latest news from Norway in English. Get real-time updates on Norwegian politics, business, culture, and breaking news for English speakers in Norway.',
		keywords: ['English news in Norway', 'Norwegian news in English', 'Norway news English', 'English speaking Norway news', 'Norwegian politics English', 'Oslo news English', 'Norway breaking news English', 'Norwegian business news English'],
		url: '/norway',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "English News in Norway",
			"description": "Latest Norwegian news in English for English speakers",
			"url": "https://nordicstoday.com/norway",
			"about": {
				"@type": "Country",
				"name": "Norway"
			},
			"inLanguage": "en",
			"audience": {
				"@type": "Audience",
				"audienceType": "English speakers in Norway"
			},
			"publisher": {
				"@type": "NewsMediaOrganization",
				"name": "Nordics Today",
				"url": "https://nordicstoday.com"
			}
		}
	};

	// Filter articles for Norway
	$: norwayArticles = allArticles.filter((article: any) => 
		article.source_country === 'NO' || 
		article.category?.toLowerCase().includes('norway') ||
		article.title?.toLowerCase().includes('norway')
	);

	// Paginated articles for display
	$: displayedArticles = norwayArticles.slice(0, currentPage * articlesPerPage);

	// Load more articles function
	async function loadMoreArticles() {
		if (loading || !hasMore) return;
		
		loading = true;
		try {
			const response = await fetch(`/api/articles?country=NO&limit=20&offset=${allArticles.length}`);
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

<SEOHead {...seoData} />

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			English News in Norway
		</h1>
		<p class="text-xl text-gray-600 max-w-3xl">
			Stay informed with the latest Norwegian news in English. 
			From Oslo politics to Norwegian business, culture, and breaking news - 
			comprehensive coverage for English speakers living in or interested in Norway.
		</p>
	</header>

	{#if displayedArticles.length > 0}
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">Latest Norwegian News in English</h2>
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
				Showing {displayedArticles.length} of {norwayArticles.length} articles
				{#if hasMore}
					• Scroll down for more
				{/if}
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Loading latest Norwegian news in English...</p>
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
