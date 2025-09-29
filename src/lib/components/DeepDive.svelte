<script lang="ts">
	import type { ProcessedArticle } from '$lib/data/articles.js';

	export let latestArticles: ProcessedArticle[] = [];
	export let articlesByCategory: Array<{category: string, articles: ProcessedArticle[]}> = [];
	export let trendingArticles: ProcessedArticle[] = [];
	
	// Use trendingArticles for potential future trending section
	$: hasTrendingArticles = trendingArticles.length > 0;

	// Get category sections
	$: businessTechArticles = articlesByCategory.find(cat => 
		['business', 'tech'].includes(cat.category)
	)?.articles || [];
	
	$: cultureSocietyArticles = articlesByCategory.find(cat => 
		['culture', 'society'].includes(cat.category)
	)?.articles || [];

	$: politicsArticles = articlesByCategory.find(cat => 
		cat.category === 'politics'
	)?.articles || [];
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		<!-- Latest News Feed -->
		<div class="md:col-span-2">
			<h2 class="text-2xl font-bold text-nordic-blue mb-6">The Latest</h2>
			<div class="space-y-8">
				{#each latestArticles.slice(0, 6) as article}
					<a href={article.url_slug} class="flex flex-col sm:flex-row items-start gap-6 group">
						<img 
							src={article.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
							alt={article.featured_image_alt || article.title} 
							class="w-full sm:w-48 h-32 object-cover rounded-lg shadow-md transform group-hover:scale-105 transition-transform duration-300" 
						/>
						<div>
							<div class="flex items-center gap-2 mb-1">
								<span class="text-xs font-semibold text-gray-500">{article.category_display}</span>
								<span class="text-xs text-gray-400">{article.relative_time}</span>
							</div>
							<h3 class="text-lg font-semibold text-gray-800 group-hover:text-nordic-blue transition-colors">{article.title}</h3>
							<p class="mt-1 text-sm text-gray-600">{article.excerpt}</p>
						</div>
					</a>
				{:else}
					<p class="text-gray-500 text-center py-8">No latest articles available</p>
				{/each}
			</div>
		</div>

		<!-- Thematic Blocks -->
		<div class="space-y-8">
			<!-- Business & Tech -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2">Business & Tech</h3>
				<ul class="mt-4 space-y-3">
					{#each businessTechArticles.slice(0, 4) as article}
						<li>
							<a href={article.url_slug} class="group">
								<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2">
									{article.title}
								</h4>
								<div class="flex items-center justify-between mt-1">
									<span class="text-xs text-gray-500">{article.country_name}</span>
									<span class="text-xs text-gray-400">{article.relative_time}</span>
								</div>
							</a>
						</li>
					{:else}
						<li class="text-xs text-gray-500">No business/tech articles available</li>
					{/each}
				</ul>
			</div>

			<!-- Ad Slot -->
			<div class="bg-gray-100 p-6 rounded-lg shadow-md text-center">
				<span class="text-xs text-gray-500">Advertisement</span>
				<div class="h-48 flex items-center justify-center">
					<p class="text-gray-400">Ad Slot</p>
				</div>
			</div>

			<!-- Politics News -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2">Politics News</h3>
				<ul class="mt-4 space-y-3">
					{#each politicsArticles.slice(0, 4) as article}
						<li>
							<a href={article.url_slug} class="group">
								<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2">
									{article.title}
								</h4>
								<div class="flex items-center justify-between mt-1">
									<span class="text-xs text-gray-500">{article.country_name}</span>
									<span class="text-xs text-gray-400">{article.relative_time}</span>
								</div>
							</a>
						</li>
					{:else}
						<li class="text-xs text-gray-500">No politics articles available</li>
					{/each}
				</ul>
			</div>

			<!-- Culture & Society -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2">Society & Culture</h3>
				<ul class="mt-4 space-y-3">
					{#each cultureSocietyArticles.slice(0, 4) as article}
						<li>
							<a href={article.url_slug} class="group">
								<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2">
									{article.title}
								</h4>
								<div class="flex items-center justify-between mt-1">
									<span class="text-xs text-gray-500">{article.country_name}</span>
									<span class="text-xs text-gray-400">{article.relative_time}</span>
								</div>
							</a>
						</li>
					{:else}
						<li class="text-xs text-gray-500">No society/culture articles available</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
