<script lang="ts">
    import { serializeJsonLd } from '$lib/utils/json-ld';
	export let title: string = 'Nordics Today - Your Daily Source for Nordic News';
	export let description: string = 'English news from Sweden, Norway, Denmark, Finland & Iceland for expats and English speakers. Daily Nordic news updates on Swedish politics, culture, business and society.';
	export let keywords: string[] = ['nordic news in english', 'sweden news in english', 'expat news sweden', 'scandinavian news english', 'english speaking news nordics', 'nordic expat community news', 'living in sweden news english', 'latest nordic countries news english'];
	export let image: string = '/og-image.jpg';
	export let url: string = '';
	export let type: string = 'website';
	export let publishedTime: string = '';
	export let modifiedTime: string = '';
	export let section: string = '';
	export let tags: string[] = [];
	export let author: string = 'Nordics Today News Team';
	export let siteName: string = 'Nordics Today';
	export let locale: string = 'en_US';
	export let structuredData: any = null;
	// When true, only render base meta (no OG/Twitter) to avoid overriding page-specific tags
	export let baseOnly: boolean = false;
    // Robots directive, configurable so error pages can set noindex
    export let robots: string = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

	// Generate canonical URL
	$: canonicalUrl = url ? `https://nordicstoday.com${url}` : 'https://nordicstoday.com';
	
	// Default structured data for website
	$: defaultStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": siteName,
		"url": "https://nordicstoday.com",
		"description": description,
		"publisher": {
			"@type": "Organization",
			"@id": "https://nordicstoday.com/#org",
			"name": "Nordics Today",
			"logo": {
				"@type": "ImageObject",
				"url": "https://nordicstoday.com/logo.png"
			}
		},
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://nordicstoday.com/search?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	};

	$: finalStructuredData = structuredData || defaultStructuredData;
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(', ')} />
	<meta name="author" content={author} />
	<meta name="robots" content={robots} />
	<meta name="googlebot" content={robots} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />
	
	<!-- Hreflang Tags for International SEO -->
	<link rel="alternate" hreflang="en" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={canonicalUrl} />
	
	<!-- Icons are managed globally in app.html -->
	{#if !baseOnly}
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content={type} />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta property="og:image" content={image.startsWith('http') ? image : `https://nordicstoday.com${image}`} />
		<meta property="og:url" content={canonicalUrl} />
		<meta property="og:site_name" content={siteName} />
		<meta property="og:locale" content={locale} />
		
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		{#if author}
			<meta property="article:author" content={author} />
		{/if}
		{#each tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
		
		<!-- Twitter Card -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@nordicstoday" />
		<meta name="twitter:creator" content="@nordicstoday" />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={image.startsWith('http') ? image : `https://nordicstoday.com${image}`} />
	{/if}
	
	<!-- Additional SEO Meta Tags -->
	<meta name="language" content="English" />
	<meta name="revisit-after" content="1 days" />
	<meta name="distribution" content="global" />
	<meta name="rating" content="general" />
	
	<!-- Enhanced Geo Tags for Nordic Focus -->
	<meta name="geo.region" content="EU" />
	<meta name="geo.placename" content="Nordic Countries" />
	<meta name="geo.position" content="59.3293;18.0686" />
	<meta name="ICBM" content="59.3293, 18.0686" />
	<meta name="DC.coverage" content="Sweden, Norway, Denmark, Finland, Iceland" />
	<meta name="DC.subject" content="English news in Nordic countries" />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${serializeJsonLd(finalStructuredData)}</script>`}
</svelte:head>
