<script lang="ts">
	import { onMount } from 'svelte';
	import { Share, Calendar, MapPin, Eye, Clock, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-svelte';
	import { getCountryFlag } from '$lib/supabase.js';
	import type { PageData } from './$types';

	export let data: PageData;

	$: article = data.article;
	$: relatedArticles = data.relatedArticles;
	$: structuredData = data.structuredData;

	let showShareMenu = false;

	// Format the article content with proper paragraphs
	$: formattedContent = article.content ? 
		article.content.split('\n\n').filter(p => p.trim().length > 0) : 
		[];

	// Helper function to format dates
	function formatDate(dateString: string | null) {
		if (!dateString) return 'No date';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Share functions
	const shareOnFacebook = () => {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
	};

	const shareOnTwitter = () => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(article.title);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	};

	const shareOnLinkedIn = () => {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	onMount(() => {
		// Close share menu when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			if (showShareMenu && !(event.target as Element)?.closest('.share-menu')) {
				showShareMenu = false;
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords?.join(', ')} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content={article.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:image" content={data.meta.image} />
	<meta property="og:url" content="https://nordicstoday.com/article/{article.slug}" />
	<meta property="article:published_time" content={data.meta.publishedTime} />
	<meta property="article:modified_time" content={data.meta.modifiedTime} />
	<meta property="article:section" content={data.meta.section} />
	{#if data.meta.tags}
		{#each data.meta.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={article.title} />
	<meta name="twitter:description" content={article.excerpt || data.meta.description} />
	<meta name="twitter:image" content={article.featured_image_url || 'https://nordicstoday.com/og-image.jpg'} />
	<meta name="twitter:image:alt" content={article.featured_image_caption || article.title} />
	
	<!-- Additional Meta Tags for News -->
	<meta name="news_keywords" content={article.keywords?.join(', ') || article.category_display} />
	<meta name="original-source" content={article.original_url || 'Nordic News Sources'} />
	<meta name="geo.region" content="Nordic Countries" />
	<meta name="geo.placename" content="Nordic Region" />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<article class="min-h-screen bg-off-white">
	<!-- Back Navigation -->
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<a href="/" class="inline-flex items-center text-nordic-blue hover:text-blue-800 transition-colors">
				<ArrowLeft size={20} class="mr-2" />
				Back to Home
			</a>
		</div>
	</div>

	<!-- Article Header -->
	<header class="bg-white">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Article Meta -->
			<div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
				<div class="flex items-center gap-2">
					<span>{getCountryFlag(article.country)}</span>
					<span class="font-medium">{article.country_name}</span>
				</div>
				<div class="flex items-center gap-1">
					<Calendar size={16} />
					<time datetime={article.published_at}>{formatDate(article.published_at)}</time>
				</div>
				<div class="flex items-center gap-1">
					<Clock size={16} />
					<span>{article.relative_time}</span>
				</div>
				<div class="flex items-center gap-1">
					<Eye size={16} />
					<span>{article.view_count || 0} views</span>
				</div>
				<span class="px-2 py-1 bg-nordic-blue text-white text-xs font-semibold rounded-full">
					{article.category_display}
				</span>
			</div>

			<!-- Article Title -->
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
				{article.title}
			</h1>

			<!-- Article Summary -->
			{#if article.summary || article.excerpt}
				<p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
					{article.summary || article.excerpt}
				</p>
			{/if}

			<!-- Share & Source Info -->
			<div class="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-gray-200">
				<div class="flex items-center gap-4">
				
				</div>

				<!-- Share Button -->
				<div class="relative share-menu">
					<button 
						on:click={() => showShareMenu = !showShareMenu}
						class="flex items-center gap-2 px-4 py-2 bg-nordic-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Share size={18} />
						Share
					</button>

					{#if showShareMenu}
						<div class="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-48">
							<button on:click={shareOnFacebook} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
								<Facebook size={18} class="text-blue-600" />
								Facebook
							</button>
							<button on:click={shareOnTwitter} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
								<Twitter size={18} class="text-blue-400" />
								Twitter
							</button>
							<button on:click={shareOnLinkedIn} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
								<Linkedin size={18} class="text-blue-700" />
								LinkedIn
							</button>
							<button on:click={copyToClipboard} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
								<Share size={18} class="text-gray-600" />
								Copy Link
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Article Content -->
	<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
			<!-- Main Content -->
			<div class="lg:col-span-3">
				<!-- Featured Image -->
				{#if article.featured_image_url}
					<div class="mb-8">
						<img 
							src={article.featured_image_url} 
							alt={article.featured_image_alt || article.title}
							class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
						/>
						{#if article.featured_image_caption}
							<p class="text-sm text-gray-600 mt-2 italic">{article.featured_image_caption}</p>
						{/if}
					</div>
				{/if}

				<!-- Article Body -->
				<div class="prose prose-lg max-w-none">
					{#if formattedContent.length > 0}
						{#each formattedContent as paragraph}
							<p class="mb-6 text-gray-800 leading-relaxed">{paragraph}</p>
						{/each}
					{:else}
						<p class="text-gray-600 italic">Article content is being processed...</p>
					{/if}
				</div>

				<!-- Article Footer -->
				<footer class="mt-12 pt-8 border-t border-gray-200">
					<div class="flex flex-wrap items-center justify-between gap-4">
						<div class="text-sm text-gray-600">
							<p>Published: {formatDate(article.published_at)}</p>
							{#if article.keywords && article.keywords.length > 0}
								<div class="mt-2">
									<span class="font-medium">Tags:</span>
									{#each article.keywords as keyword}
										<span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2 mt-1">
											{keyword}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</footer>
			</div>

			<!-- Sidebar -->
			<aside class="lg:col-span-1">
				<!-- Related Articles by Category -->
				{#if relatedArticles.byCategory.length > 0}
					<div class="bg-white rounded-lg shadow-md p-6 mb-6">
						<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
							More in {article.category_display}
						</h3>
						<div class="space-y-4">
							{#each relatedArticles.byCategory as related}
								<article class="border-b border-gray-100 pb-3 last:border-b-0">
									<a href={related.url_slug} class="group">
										<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">
											{related.title}
										</h4>
										<div class="flex items-center justify-between text-xs text-gray-500">
											<span>{related.country_name}</span>
											<span>{related.relative_time}</span>
										</div>
									</a>
								</article>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Related Articles by Country -->
				{#if relatedArticles.byCountry.length > 0}
					<div class="bg-white rounded-lg shadow-md p-6 mb-6">
						<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
							More from {article.country_name}
						</h3>
						<div class="space-y-4">
							{#each relatedArticles.byCountry as related}
								<article class="border-b border-gray-100 pb-3 last:border-b-0">
									<a href={related.url_slug} class="group">
										<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">
											{related.title}
										</h4>
										<div class="flex items-center justify-between text-xs text-gray-500">
											<span>{related.category_display}</span>
											<span>{related.relative_time}</span>
										</div>
									</a>
								</article>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Trending Articles -->
				{#if relatedArticles.trending.length > 0}
					<div class="bg-white rounded-lg shadow-md p-6">
						<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
							Trending Now
						</h3>
						<div class="space-y-4">
							{#each relatedArticles.trending as trending}
								<article class="border-b border-gray-100 pb-3 last:border-b-0">
									<a href={trending.url_slug} class="group">
										<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">
											{trending.title}
										</h4>
										<div class="flex items-center justify-between text-xs text-gray-500">
											<span>{trending.country_name}</span>
											<span>{trending.relative_time}</span>
										</div>
									</a>
								</article>
							{/each}
						</div>
					</div>
				{/if}
			</aside>
		</div>
	</main>
</article>
