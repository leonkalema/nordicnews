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
		title: 'Oslo News in English | Latest Oslo Updates | Nordics Today',
		description: 'Latest news from Oslo in English. Get real-time updates on Oslo politics, business, culture, and local events for English speakers in Norway\'s capital.',
		keywords: ['Oslo news in English', 'Oslo news English', 'Oslo breaking news', 'Oslo business news', 'Norway capital news', 'Oslo local news English'],
		url: '/oslo',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Oslo News in English",
			"description": "Latest Oslo news in English for English speakers",
			"url": "https://nordicstoday.com/oslo",
			"about": {
				"@type": "City",
				"name": "Oslo",
				"alternateName": "Oslo",
				"containedIn": {
					"@type": "Country",
					"name": "Norway"
				}
			},
			"inLanguage": "en",
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Norway",
						"item": "https://nordicstoday.com/norway"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Oslo",
						"item": "https://nordicstoday.com/oslo"
					}
				]
			},
			"mainEntity": {
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "Where can I read Oslo news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today provides daily Oslo news in English, covering Storting parliament, Oslo business, local events, and city developments for expats and English speakers in Norway's capital."
						}
					},
					{
						"@type": "Question",
						"name": "What topics does Oslo news cover?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Oslo news in English covers politics from the Storting, Oslo business and oil industry, cultural events, and local community news from Norway's capital."
						}
					},
					{
						"@type": "Question",
						"name": "Is Oslo news updated daily?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today updates Oslo news in English daily, providing real-time coverage of breaking news, political developments, and local events from Norway's capital."
						}
					},
					{
						"@type": "Question",
						"name": "Can expats follow Oslo local news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today provides Oslo local news in English for expats, covering everything from city council decisions to neighborhood events, business updates, and cultural activities."
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
		if (loading || displayedArticles.length >= allArticles.length) return;
		
		loading = true;
		currentPage++;
		loading = false;
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
	<nav class="mb-6 text-sm">
		<ol class="flex items-center space-x-2 text-gray-600">
			<li><a href="/" class="hover:text-blue-600">Home</a></li>
			<li><span class="mx-2">/</span></li>
			<li><a href="/norway" class="hover:text-blue-600">Norway</a></li>
			<li><span class="mx-2">/</span></li>
			<li class="text-gray-900 font-semibold">Oslo</li>
		</ol>
	</nav>

	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			Oslo News in English
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			Stay informed with the latest Oslo news in English. From Storting politics and government 
			decisions to Oslo business developments, oil and gas industry, cultural events, and local news 
			from Norway's capital. Whether you're an expat living in Oslo, planning to visit Norway, 
			or simply interested in Norwegian capital affairs, our comprehensive English coverage keeps you 
			updated on everything happening in Oslo. Get real-time news on Oslo's business scene, 
			shipping sector, maritime industry, cultural events, and community developments—curated 
			for English speakers.
		</p>
	</header>

	{#if displayedArticles.length > 0}
		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Oslo Politics</h2>
					<a href="/category/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Storting parliament, city council decisions, and political developments</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Oslo Business & Industry</h2>
					<a href="/category/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Oil and gas industry, shipping sector, and Oslo business developments</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Oslo Tech & Innovation</h2>
					<a href="/category/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Maritime tech, renewable energy, and digital innovation from Oslo</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Oslo Society & Culture</h2>
					<a href="/category/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in Oslo, cultural events, and community news</p>
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
			<h2 class="text-2xl font-semibold mb-6">All Oslo News in English</h2>
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
							<p class="text-gray-600 text-sm mb-4 line-clamp-3">
								{article.summary || article.excerpt}
							</p>
							<div class="flex items-center justify-between text-sm text-gray-500">
								<time datetime={article.published_date}>
									{article.relative_time}
								</time>
								{#if article.category}
									<span class="text-blue-600 font-medium capitalize">{article.category}</span>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>

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
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Where can I read Oslo news in English?</h3>
					<p class="text-gray-700">Nordics Today provides daily Oslo news in English, covering Storting parliament, Oslo business, local events, and city developments for expats and English speakers in Norway's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What topics does Oslo news cover?</h3>
					<p class="text-gray-700">Oslo news in English covers politics from the Storting, Oslo business and oil industry, cultural events, and local community news from Norway's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Is Oslo news updated daily?</h3>
					<p class="text-gray-700">Yes, Nordics Today updates Oslo news in English daily, providing real-time coverage of breaking news, political developments, and local events from Norway's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Can expats follow Oslo local news in English?</h3>
					<p class="text-gray-700">Yes, Nordics Today provides Oslo local news in English for expats, covering everything from city council decisions to neighborhood events, business updates, and cultural activities.</p>
				</div>
			</div>
		</section>

		<!-- Related Links -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">More Norway News in English</h2>
			<div class="grid gap-4 md:grid-cols-1">
				<a href="/norway" class="text-blue-600 hover:text-blue-800 font-semibold">
					← All Norway News
				</a>
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Loading latest Oslo news in English...</p>
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
