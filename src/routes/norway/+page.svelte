<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data;

	// SEO optimized for "English news in Norway"
	$: seoData = {
		title: 'English News in Norway | Latest Norwegian News in English | Nordics Today',
		description: 'Latest news from Norway translated to English. Get real-time updates on Norwegian politics, business, culture, and breaking news for English speakers in Norway.',
		keywords: ['English news in Norway', 'Norwegian news in English', 'Norway news English', 'English speaking Norway news', 'Norwegian politics English', 'Oslo news English', 'Norway breaking news English', 'Norwegian business news English'],
		url: '/norway',
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "English News in Norway",
			"description": "Latest Norwegian news translated to English for English speakers",
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
	$: norwayArticles = data.articles?.filter(article => 
		article.source_country === 'NO' || 
		article.raw_category?.toLowerCase().includes('norway') ||
		article.raw_title?.toLowerCase().includes('norway')
	) || [];
</script>

<SEOHead {...seoData} />

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			English News in Norway
		</h1>
		<p class="text-xl text-gray-600 max-w-3xl">
			Stay informed with the latest Norwegian news translated to English. 
			From Oslo politics to Norwegian business, culture, and breaking news - 
			all in English for English speakers living in or interested in Norway.
		</p>
	</header>

	{#if norwayArticles.length > 0}
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">Latest Norwegian News in English</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each norwayArticles.slice(0, 9) as article}
					<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if article.image_url}
							<img src={article.image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover" />
						{/if}
						<div class="p-6">
							<h3 class="font-semibold text-lg mb-2 line-clamp-2">
								<a href="/article/{article.slug}" class="hover:text-blue-600">
									{article.title}
								</a>
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-3">
								{article.summary}
							</p>
							<div class="flex justify-between items-center text-sm text-gray-500">
								<span>{article.source_name}</span>
								<time datetime={article.published_date}>
									{new Date(article.published_date).toLocaleDateString('en-US', { 
										month: 'short', 
										day: 'numeric',
										year: 'numeric'
									})}
								</time>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Loading latest Norwegian news in English...</p>
		</div>
	{/if}

	<section class="bg-red-50 rounded-lg p-8 mb-12">
		<h2 class="text-2xl font-semibold mb-4">Why Choose English News in Norway?</h2>
		<div class="grid md:grid-cols-2 gap-6">
			<div>
				<h3 class="font-semibold mb-2">For English Speakers in Norway</h3>
				<p class="text-gray-600">
					Whether you're an expat, international student, or business professional in Norway, 
					stay connected with local news that affects your daily life.
				</p>
			</div>
			<div>
				<h3 class="font-semibold mb-2">Real-Time Translation</h3>
				<p class="text-gray-600">
					Get Norwegian news translated to English as it happens. From NRK to VG, 
					we bring you the most important Norwegian stories in English.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
