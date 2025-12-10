<script lang="ts">
	import { getCountryFlag } from '$lib/supabase.js';
	import type { ProcessedArticle } from '$lib/data/articles.js';

	export let articlesByCountry: Array<{country: string, articles: ProcessedArticle[]}> = [];

	const countryNames: Record<string, string> = {
		'SE': 'Sweden',
		'NO': 'Norway', 
		'DK': 'Denmark',
		'FI': 'Finland',
		'IS': 'Iceland'
	};

	const countrySlugMap: Record<string, string> = {
		'SE': 'sweden',
		'NO': 'norway',
		'DK': 'denmark', 
		'FI': 'finland',
		'IS': 'iceland'
	};
</script>

<section class="bg-gray-50 py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-12">
			<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">By Country</h2>
			<p class="font-serif text-3xl font-semibold text-gray-900">Across the Nordics</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
			{#each articlesByCountry as countryData}
				{@const countryName = countryNames[countryData.country]}
				{@const countrySlug = countrySlugMap[countryData.country]}
				{@const flag = getCountryFlag(countryData.country)}
				
				<div class="bg-white hover:bg-gray-50 transition-colors">
					<div class="border-b border-gray-200 px-4 py-4">
						<div class="flex items-center justify-between">
							<h3 class="font-semibold text-gray-900 flex items-center gap-2">
								<span class="text-xl">{flag}</span>
								{countryName}
							</h3>
							<a href="/{countrySlug}" class="text-xs text-gray-500 hover:text-black font-medium">View all</a>
						</div>
					</div>
					
					<div class="p-4 space-y-4">
						{#each countryData.articles.slice(0, 3) as article}
							<article class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
								<a href={article.url_slug} class="group/article block">
									<h4 class="font-serif text-sm font-medium text-gray-900 group-hover/article:text-gray-600 transition-colors line-clamp-2 leading-snug">
										{article.title}
									</h4>
									<span class="text-xs text-gray-400 mt-2 block">{article.relative_time}</span>
								</a>
							</article>
						{:else}
							<p class="text-xs text-gray-400 text-center py-4">No recent articles</p>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Fallback country navigation if no articles -->
				<div class="col-span-full">
					<div class="flex flex-wrap justify-center gap-4 md:gap-8">
						{#each Object.entries(countryNames) as [code, name]}
							<a 
								href="/{countrySlugMap[code]}" 
								class="flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-arctic-gray transition-all duration-200"
							>
								<span>{getCountryFlag(code)}</span>
								<span class="font-medium text-gray-700">{name}</span>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
