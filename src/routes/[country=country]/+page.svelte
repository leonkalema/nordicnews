<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import CountryFAQ from '$lib/components/CountryFAQ.svelte';
	import CountryCityHubsSection from '$lib/components/country/CountryCityHubsSection.svelte';
	import CountryAllArticlesSection from '$lib/components/country/CountryAllArticlesSection.svelte';
	import CountryCategoryModules from '$lib/components/country/CountryCategoryModules.svelte';
	import RecommendedLinks from '$lib/components/RecommendedLinks.svelte';
	import { internalLinkGroups } from '$lib/config/internal-links';
	import { buildRecommendedLinks } from '$lib/utils/recommended-links';
	import { onMount } from 'svelte';
    import { serializeJsonLd } from '$lib/utils/json-ld';

	export let data;
	
	// Get country config from data
	$: countryConfig = data.countryConfig;
	$: country = countryConfig?.name || '';
	$: countrySlug = countryConfig?.slug || '';
	$: countryCode = countryConfig?.code || '';
	$: parliament = countryConfig?.parliament || '';
	$: cities = countryConfig?.cities || [];
	$: recommendedKey = `country:${countrySlug}`;
	$: recommendedGroup = internalLinkGroups[recommendedKey] || null;
	$: computedRecommendedLinks = buildRecommendedLinks({ articles: countryArticles, maxLinks: 5 });
	$: recommendedLinks = (recommendedGroup && recommendedGroup.links.length > 0) ? recommendedGroup.links : computedRecommendedLinks;

	// Pagination and infinite scroll
	let currentPage = 1;
	let loading = false;
	let hasMore = true;
	let allArticles: any[] = data.articles || [];
	const articlesPerPage = 12;

	// Filter articles for this country - DYNAMIC
	$: countryArticles = allArticles.filter((article: any) => 
		article.source_country === countryCode || 
		article.category?.toLowerCase().includes(countrySlug) ||
		article.title?.toLowerCase().includes(countrySlug)
	);

	// Latest articles (shown in hero section)
	$: latestArticles = countryArticles.slice(0, 6);
	$: latestArticleIds = new Set(latestArticles.map((a: any) => a.id));

	// SEO optimized - dynamic for all countries
	// Title: Exact match keyword FIRST for better rankings
	$: seoData = {
		title: `${country} News in English - Daily Updates for Expats & English Speakers`,
		description: `Read ${country} news in English today. Get daily updates on ${country} politics, business, culture & society. The #1 source for English speakers in ${country}. Updated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
		keywords: [
			`${country} news in English`,
			`${country.toLowerCase()} news in english`,
			`${country} news English`,
			`English news ${country}`,
			`${country} news today`,
			`${country} breaking news English`,
			`${country} ${parliament} English`,
			`${country} politics English`,
			`${country} expat news`,
			`news from ${country} in English`,
			`${country} daily news English`
		],
		url: `/${countrySlug}`,
		type: 'website',
		structuredData: {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": `https://nordicstoday.com/${countrySlug}#webpage`,
					"url": `https://nordicstoday.com/${countrySlug}`,
					"name": `${country} News in English - Daily Updates for Expats & English Speakers`,
					"description": `Read ${country} news in English. Daily updates on politics, business, culture for English speakers.`,
					"isPartOf": { "@id": "https://nordicstoday.com/#website" },
					"inLanguage": "en",
					"dateModified": new Date().toISOString(),
					"about": {
						"@type": "Country",
						"name": country
					},
					"audience": {
						"@type": "Audience",
						"audienceType": `English speakers in ${country}, expats, international readers`
					}
				},
				{
					"@type": "CollectionPage",
					"@id": `https://nordicstoday.com/${countrySlug}#collection`,
					"name": `${country} News in English`,
					"description": `Latest ${country} news articles in English`,
					"url": `https://nordicstoday.com/${countrySlug}`,
					"mainEntity": {
						"@type": "ItemList",
						"itemListElement": latestArticles.slice(0, 10).map((article: any, index: number) => ({
							"@type": "ListItem",
							"position": index + 1,
							"url": `https://nordicstoday.com${article.url_slug}`,
							"name": article.title
						}))
					}
				},
				{
					"@type": "FAQPage",
					"@id": `https://nordicstoday.com/${countrySlug}#faq`,
					"mainEntity": countryConfig.faqs.map((faq: any) => ({
						"@type": "Question",
						"name": faq.question,
						"acceptedAnswer": {
							"@type": "Answer",
							"text": faq.answer
						}
					}))
				}
			]
		}
	};

	// Category-specific articles - EXCLUDE articles already shown in Latest
	$: politicsArticles = countryArticles.filter((a: any) => 
		a.category === 'politics' && !latestArticleIds.has(a.id)
	).slice(0, 4);
	
	$: businessArticles = countryArticles.filter((a: any) => 
		a.category === 'business' && !latestArticleIds.has(a.id)
	).slice(0, 4);
	
	$: techArticles = countryArticles.filter((a: any) => 
		a.category === 'tech' && !latestArticleIds.has(a.id)
	).slice(0, 4);
	
	$: societyArticles = countryArticles.filter((a: any) => 
		(a.category === 'society' || a.category === 'culture' || a.category === 'breaking') && 
		!latestArticleIds.has(a.id)
	).slice(0, 4);

	// Collect all IDs shown in category sections
	$: categoryArticleIds = new Set([
		...politicsArticles.map((a: any) => a.id),
		...businessArticles.map((a: any) => a.id),
		...techArticles.map((a: any) => a.id),
		...societyArticles.map((a: any) => a.id)
	]);

	// "All News" section - EXCLUDE articles already shown in Latest and Category sections
	$: remainingArticles = countryArticles.filter((a: any) => 
		!latestArticleIds.has(a.id) && !categoryArticleIds.has(a.id)
	);
	$: displayedArticles = remainingArticles.slice(0, currentPage * articlesPerPage);

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

	// OpenGraph locale based on country slug
	function ogLocaleForCountry(slug: string): string {
		const map: Record<string, string> = {
			sweden: 'en_SE',
			norway: 'en_NO',
			denmark: 'en_DK',
			finland: 'en_FI',
			iceland: 'en_IS'
		};
		return map[slug] || 'en_US';
	}
	$: ogLocale = ogLocaleForCountry(countrySlug);
</script>

<svelte:head>
	<meta name="sveltekit:reload" content="true" />

    <!-- Breadcrumbs: Home -> Country -->
    {@html `<script type="application/ld+json">${serializeJsonLd({
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
    })}</script>`}

    <!-- Hreflang alternates for country hubs -->
    <link rel="alternate" hreflang="x-default" href={`https://nordicstoday.com/${countrySlug}`} />
    <link rel="alternate" hreflang="en" href={`https://nordicstoday.com/${countrySlug}`} />
    <link rel="alternate" hreflang="en-SE" href="https://nordicstoday.com/sweden" />
    <link rel="alternate" hreflang="en-NO" href="https://nordicstoday.com/norway" />
    <link rel="alternate" hreflang="en-DK" href="https://nordicstoday.com/denmark" />
    <link rel="alternate" hreflang="en-FI" href="https://nordicstoday.com/finland" />
    <link rel="alternate" hreflang="en-IS" href="https://nordicstoday.com/iceland" />
</svelte:head>

<SEOHead {...seoData} locale={ogLocale} />

<!-- Hero Section -->
<div class="bg-black text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
		<h1 class="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
			{country} News in English
		</h1>
		<p class="text-xl text-gray-300 max-w-2xl leading-relaxed mb-4">
			{countryConfig.intro}
		</p>
		<p class="text-sm text-gray-500">
			Updated daily • {countryArticles.length}+ articles • Trusted by expats since 2024
		</p>
	</div>
</div>

<div class="bg-gray-50">
<div class="container mx-auto px-4 -mt-8 relative z-20">

	{#if displayedArticles.length > 0}
		{#if recommendedLinks.length > 0}
			<div class="mb-16">
				<RecommendedLinks heading={(recommendedGroup && recommendedGroup.heading) ? recommendedGroup.heading : 'Recommended reads'} links={recommendedLinks} maxLinks={5} />
			</div>
		{/if}
		<CountryCityHubsSection country={country} cities={cities} />

		<!-- Latest News Section - Shows freshness immediately -->
		<section class="mb-16">
			<div class="mb-10">
				<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Latest</h2>
				<p class="font-serif text-3xl font-semibold text-gray-900">Today's {country} News</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each latestArticles as article}
					<article class="group">
						{#if article.featured_image_url}
							<div class="aspect-[16/10] overflow-hidden mb-4">
								<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-full object-cover" />
							</div>
						{/if}
						<span class="text-xs text-gray-400 uppercase tracking-widest">{article.category_display || article.category}</span>
						<h3 class="font-serif text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mt-2 mb-2">
							<a href={article.url_slug}>
								{article.title}
							</a>
						</h3>
						<p class="text-gray-500 text-sm line-clamp-2 mb-2">
							{article.summary || article.excerpt}
						</p>
						<span class="text-xs text-gray-400">{article.relative_time}</span>
					</article>
				{/each}
			</div>
		</section>

		<CountryCategoryModules
			country={country}
			countrySlug={countrySlug}
			politicsArticles={politicsArticles}
			businessArticles={businessArticles}
			techArticles={techArticles}
			societyArticles={societyArticles}
		/>

		<CountryAllArticlesSection
			country={country}
			displayedArticles={displayedArticles}
			remainingCount={remainingArticles.length}
			hasMore={hasMore}
			loading={loading}
			onLoadMore={loadMoreArticles}
		/>

		<!-- FAQ Section -->
		<CountryFAQ faqs={countryConfig.faqs} />
	{:else}
		<div class="text-center py-20">
			<p class="text-gray-500">Loading latest {country} news...</p>
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
