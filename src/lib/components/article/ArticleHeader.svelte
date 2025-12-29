<script lang="ts">
	import { Calendar, Eye, Clock, ArrowLeft } from 'lucide-svelte';
	import { getCountryFlag } from '$lib/supabase.js';
	import { articlePageUtils } from '$lib/utils/article-page';
	import ArticleShareMenu from '$lib/components/article/ArticleShareMenu.svelte';

	type ArticleHeaderProps = {
		readonly title: string;
		readonly slug: string;
		readonly country: string;
		readonly countryName: string;
		readonly categoryDisplay: string;
		readonly publishedAt: string | null;
		readonly relativeTime: string;
		readonly viewCount: number | null;
		readonly authorName: string | null;
		readonly authorSlug: string | null;
		readonly summary: string | null;
		readonly excerpt: string;
	};

	const {
		title,
		slug,
		country,
		countryName,
		categoryDisplay,
		publishedAt,
		relativeTime,
		viewCount,
		authorName,
		authorSlug,
		summary,
		excerpt
	}: ArticleHeaderProps = $props();
</script>

<div class="bg-white border-b border-gray-200">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
		<a href="/" class="inline-flex items-center text-nordic-blue hover:text-blue-800 transition-colors">
			<ArrowLeft size={20} class="mr-2" />
			Back to Home
		</a>
	</div>
</div>

<header class="bg-white">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 mb-6">
			<div class="flex flex-wrap items-center gap-4">
				<div class="flex items-center gap-2">
					<span>{getCountryFlag(country)}</span>
					<span class="font-medium">{countryName}</span>
				</div>
				<div class="flex items-center gap-1">
					<Calendar size={16} />
					<time datetime={publishedAt || ''}>{articlePageUtils.formatDate(publishedAt)}</time>
				</div>
				<div class="flex items-center gap-1">
					<Clock size={16} />
					<span>{relativeTime}</span>
				</div>
				<div class="flex items-center gap-1">
					<Eye size={16} />
					<span>{viewCount || 0} views</span>
				</div>
				<span class="px-2 py-1 bg-nordic-blue text-white text-xs font-semibold rounded-full">
					{categoryDisplay}
				</span>
			</div>
			<ArticleShareMenu title={title} />
		</div>

		<h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>

		<div class="flex items-center gap-3 text-sm text-gray-500 mb-8">
			{#if authorName}
				{#if authorSlug}
					<a href={`/author/${authorSlug}`} class="font-medium text-gray-900 hover:underline">By {authorName}</a>
				{:else}
					<span class="font-medium text-gray-900">By {authorName}</span>
				{/if}
			{:else}
				<span class="font-medium text-gray-900">By Nordics Today</span>
			{/if}
			<span>•</span>
			<time datetime={publishedAt || ''}>{articlePageUtils.formatDate(publishedAt)}</time>
		</div>

		{#if summary || excerpt}
			<p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">{summary || excerpt}</p>
		{/if}
	</div>
</header>
