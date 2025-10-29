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
		title: 'Reykjavik News in English | Latest Reykjavík Updates | Nordics Today',
		description: 'Latest news from Reykjavik in English. Get real-time updates on Reykjavík politics, business, culture, and local events for English speakers in Iceland\'s capital.',
		keywords: ['Reykjavik news in English', 'Reykjavík news English', 'Reykjavik breaking news', 'Reykjavik business news', 'Iceland capital news', 'Reykjavik local news English'],
		url: '/reykjavik',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Reykjavik News in English",
			"description": "Latest Reykjavik news in English for English speakers",
			"url": "https://nordicstoday.com/reykjavik",
			"about": {
				"@type": "City",
				"name": "Reykjavik",
				"alternateName": "Reykjavík",
				"containedIn": {
					"@type": "Country",
					"name": "Iceland"
				}
			},
			"inLanguage": "en",
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Iceland",
						"item": "https://nordicstoday.com/iceland"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Reykjavik",
						"item": "https://nordicstoday.com/reykjavik"
					}
				]
			},
			"mainEntity": {
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "Where can I read Reykjavik news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nordics Today provides daily Reykjavik news in English, covering Althing parliament, Reykjavík business, local events, and city developments for expats and English speakers in Iceland's capital."
						}
					},
					{
						"@type": "Question",
						"name": "What topics does Reykjavik news cover?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Reykjavik news in English covers politics from the Althing, Reykjavík business and tourism, volcanic activity, cultural events, and local community news from Iceland's capital."
						}
					},
					{
						"@type": "Question",
						"name": "Is Reykjavik news updated daily?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today updates Reykjavik news in English daily, providing real-time coverage of breaking news, political developments, and local events from Iceland's capital."
						}
					},
					{
						"@type": "Question",
						"name": "Can expats follow Reykjavik local news in English?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, Nordics Today provides Reykjavik local news in English for expats, covering everything from city council decisions to neighborhood events, tourism updates, and volcanic activity."
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
			<li><a href="/iceland" class="hover:text-blue-600">Iceland</a></li>
			<li><span class="mx-2">/</span></li>
			<li class="text-gray-900 font-semibold">Reykjavik</li>
		</ol>
	</nav>

	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			Reykjavik News in English
		</h1>
		<p class="text-lg text-gray-700 max-w-4xl leading-relaxed">
			Stay informed with the latest Reykjavik news in English. From Althing politics and government 
			decisions to Reykjavík business developments, volcanic activity, cultural events, and local news 
			from Iceland's capital. Whether you're an expat living in Reykjavik, planning to visit Iceland, 
			or simply interested in Icelandic capital affairs, our comprehensive English coverage keeps you 
			updated on everything happening in Reykjavik. Get real-time news on Reykjavík's tourism scene, 
			renewable energy sector, volcanic monitoring, cultural events, and community developments—curated 
			for English speakers.
		</p>
	</header>

	{#if displayedArticles.length > 0}
		<!-- Category Modules -->
		{#if politicsArticles.length > 0}
		<section class="mb-12">
			<div class="mb-6">
				<div class="flex justify-between items-center mb-2">
					<h2 class="text-2xl font-bold text-gray-900">Reykjavik Politics</h2>
					<a href="/category/politics" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Althing parliament, city council decisions, and political developments</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Reykjavik Business & Tourism</h2>
					<a href="/category/business" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Tourism industry, renewable energy, and Reykjavík business developments</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Reykjavik Tech & Innovation</h2>
					<a href="/category/tech" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Renewable energy, geothermal power, and tech innovation from Reykjavík</p>
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
					<h2 class="text-2xl font-bold text-gray-900">Reykjavik Society & Culture</h2>
					<a href="/category/society" class="text-blue-600 hover:text-blue-800 font-semibold">View all →</a>
				</div>
				<p class="text-gray-600 text-sm">Life in Reykjavík, cultural events, volcanic activity, and community news</p>
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
			<h2 class="text-2xl font-semibold mb-6">All Reykjavik News in English</h2>
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
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Where can I read Reykjavik news in English?</h3>
					<p class="text-gray-700">Nordics Today provides daily Reykjavik news in English, covering Althing parliament, Reykjavík business, local events, and city developments for expats and English speakers in Iceland's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">What topics does Reykjavik news cover?</h3>
					<p class="text-gray-700">Reykjavik news in English covers politics from the Althing, Reykjavík business and tourism, volcanic activity, cultural events, and local community news from Iceland's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Is Reykjavik news updated daily?</h3>
					<p class="text-gray-700">Yes, Nordics Today updates Reykjavik news in English daily, providing real-time coverage of breaking news, political developments, and local events from Iceland's capital.</p>
				</div>
				<div class="bg-white rounded-lg p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Can expats follow Reykjavik local news in English?</h3>
					<p class="text-gray-700">Yes, Nordics Today provides Reykjavik local news in English for expats, covering everything from city council decisions to neighborhood events, tourism updates, and volcanic activity.</p>
				</div>
			</div>
		</section>

		<!-- Related Links -->
		<section class="mb-12 bg-blue-50 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">More Iceland News in English</h2>
			<div class="grid gap-4 md:grid-cols-1">
				<a href="/iceland" class="text-blue-600 hover:text-blue-800 font-semibold">
					← All Iceland News
				</a>
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Loading latest Reykjavik news in English...</p>
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
