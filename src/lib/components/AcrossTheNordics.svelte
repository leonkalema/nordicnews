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

<section class="bg-off-white py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Across the Nordics</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
			{#each articlesByCountry as countryData}
				{@const countryName = countryNames[countryData.country]}
				{@const countrySlug = countrySlugMap[countryData.country]}
				{@const flag = getCountryFlag(countryData.country)}
				
				<div class="bg-white rounded-lg shadow-md p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold text-gray-800 flex items-center gap-2">
							<span>{flag}</span>
							{countryName}
						</h3>
						<a href="/{countrySlug}" class="text-xs text-nordic-blue hover:underline">View All</a>
					</div>
					
					<div class="space-y-3">
						{#each countryData.articles.slice(0, 3) as article}
							<article class="border-b border-gray-100 pb-2 last:border-b-0">
								<a href={article.url_slug} class="group">
									<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2">
										{article.title}
									</h4>
									<div class="flex items-center justify-between mt-1">
										<span class="text-xs text-gray-500">{article.category_display}</span>
										<span class="text-xs text-gray-400">{article.relative_time}</span>
									</div>
								</a>
							</article>
						{:else}
							<p class="text-xs text-gray-500">No recent articles</p>
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
