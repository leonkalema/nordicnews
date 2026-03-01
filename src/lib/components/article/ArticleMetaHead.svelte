<script lang="ts">
	import { serializeJsonLd } from '$lib/utils/json-ld';

	type ArticleMeta = {
		readonly title: string;
		readonly description: string;
		readonly keywords?: string[];
		readonly image?: string | null;
		readonly publishedTime?: string | null;
		readonly modifiedTime?: string | null;
		readonly section?: string;
		readonly tags?: string[];
	};

	type ArticleMetaHeadProps = {
		readonly slug: string;
		readonly title: string;
		readonly excerpt?: string;
		readonly featuredImageUrl?: string | null;
		readonly featuredImageCaption?: string | null;
		readonly meta: ArticleMeta;
		readonly ogLocale: string;
		readonly structuredData: unknown;
	};

	const {
		slug,
		title,
		excerpt = '',
		featuredImageUrl = null,
		featuredImageCaption = null,
		meta,
		ogLocale,
		structuredData
	}: ArticleMetaHeadProps = $props();
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta name="keywords" content={meta.keywords?.join(', ') || ''} />

	<link rel="canonical" href={`https://nordicstoday.com/article/${slug}`} />
	<link rel="alternate" hreflang="en" href={`https://nordicstoday.com/article/${slug}`} />
	<link rel="alternate" hreflang="x-default" href={`https://nordicstoday.com/article/${slug}`} />

	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content={featuredImageUrl || 'https://nordicstoday.com/og-image.jpg'} />
	<meta property="og:url" content={`https://nordicstoday.com/article/${slug}`} />
	<meta property="og:site_name" content="Nordics Today" />
	<meta property="og:locale" content={ogLocale} />

	<meta property="article:published_time" content={meta.publishedTime} />
	{#if meta.modifiedTime}
		<meta property="article:modified_time" content={meta.modifiedTime} />
	{/if}
	{#if meta.section}
		<meta property="article:section" content={meta.section} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={excerpt || meta.description} />
	<meta name="twitter:image" content={featuredImageUrl || 'https://nordicstoday.com/og-image.jpg'} />
	<meta name="twitter:image:alt" content={featuredImageCaption || title} />

	<meta name="news_keywords" content={meta.keywords?.join(', ') || ''} />
	<meta name="geo.region" content="Nordic Countries" />
	<meta name="geo.placename" content="Nordic Region" />

	{@html `<script type="application/ld+json">${serializeJsonLd(structuredData)}</script>`}
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
	      "name": title,
	      "item": `https://nordicstoday.com/article/${slug}`
	    }
	  ]
	})}</script>`}
</svelte:head>
