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

<section class="bg-white py-16 border-t-4 border-nordic-blue">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-12 text-center">
			<div class="flex items-center justify-center gap-3 mb-3">
				<div class="h-px w-12 bg-gradient-to-r from-transparent to-nordic-blue"></div>
				<h2 class="text-3xl font-black text-gray-900 uppercase tracking-tight">Across the Nordics</h2>
				<div class="h-px w-12 bg-gradient-to-l from-transparent to-nordic-blue"></div>
			</div>
			<p class="text-gray-600">Latest updates from each Nordic country</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
			{#each articlesByCountry as countryData}
				{@const countryName = countryNames[countryData.country]}
				{@const countrySlug = countrySlugMap[countryData.country]}
				{@const flag = getCountryFlag(countryData.country)}
				
				<div class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-nordic-blue overflow-hidden group">
					<div class="bg-gradient-to-r from-nordic-blue to-blue-700 px-4 py-3">
						<div class="flex items-center justify-between">
							<h3 class="font-bold text-white flex items-center gap-2 text-lg">
								<span class="text-2xl">{flag}</span>
								{countryName}
							</h3>
							<a href="/{countrySlug}" class="text-xs text-white hover:text-gray-200 font-semibold uppercase tracking-wide">All →</a>
						</div>
					</div>
					
					<div class="p-4 space-y-4">
						{#each countryData.articles.slice(0, 3) as article}
							<article class="border-b border-gray-200 pb-3 last:border-b-0">
								<a href={article.url_slug} class="group/article block">
									<h4 class="text-sm font-bold text-gray-900 group-hover/article:text-nordic-blue transition-colors line-clamp-2 leading-snug mb-2">
										{article.title}
									</h4>
									<div class="flex items-center justify-between">
										<span class="text-xs font-semibold text-nordic-blue uppercase">{article.category_display}</span>
										<span class="text-xs text-gray-500">{article.relative_time}</span>
									</div>
								</a>
							</article>
						{:else}
							<p class="text-xs text-gray-500 text-center py-4">No recent articles</p>
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
