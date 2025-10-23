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
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
		<!-- Latest News Feed - Expanded -->
		<div class="lg:col-span-3">
			<h2 class="text-2xl font-bold text-nordic-blue mb-6">The Latest</h2>
			
			<!-- Top 4 Featured Articles in Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{#each latestArticles.slice(0, 4) as article}
					<a href={article.url_slug} class="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						<img 
							src={article.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
							alt={article.featured_image_alt || article.title} 
							class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" 
						/>
						<div class="p-4">
							<div class="flex items-center gap-2 mb-2">
								<span class="text-xs font-semibold text-nordic-blue bg-blue-50 px-2 py-1 rounded">{article.category_display}</span>
								<span class="text-xs text-gray-400">{article.relative_time}</span>
							</div>
							<h3 class="text-base font-semibold text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-2">{article.title}</h3>
							<p class="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
						</div>
					</a>
				{/each}
			</div>

			<!-- More Articles in Compact List -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each latestArticles.slice(4, 16) as article}
					<a href={article.url_slug} class="flex items-start gap-4 group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<img 
							src={article.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
							alt={article.featured_image_alt || article.title} 
							class="w-20 h-16 object-cover rounded flex-shrink-0" 
						/>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="text-xs font-semibold text-gray-500">{article.category_display}</span>
								<span class="text-xs text-gray-400">{article.relative_time}</span>
							</div>
							<h3 class="text-sm font-semibold text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2">{article.title}</h3>
						</div>
					</a>
				{:else}
					<p class="text-gray-500 text-center py-8 col-span-2">No additional articles available</p>
				{/each}
			</div>
		</div>

		<!-- Compact Sidebar -->
		<div class="space-y-6">
			<!-- Business & Tech -->
			<div class="bg-white p-4 rounded-lg shadow-md">
				<h3 class="text-base font-bold text-nordic-blue border-b border-gray-200 pb-2 mb-3">Business & Tech</h3>
				<ul class="space-y-2">
					{#each businessTechArticles.slice(0, 5) as article}
						<li>
							<a href={article.url_slug} class="group block">
								<h4 class="text-xs font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 leading-tight">
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

			<!-- Politics News -->
			<div class="bg-white p-4 rounded-lg shadow-md">
				<h3 class="text-base font-bold text-nordic-blue border-b border-gray-200 pb-2 mb-3">Politics</h3>
				<ul class="space-y-2">
					{#each politicsArticles.slice(0, 5) as article}
						<li>
							<a href={article.url_slug} class="group block">
								<h4 class="text-xs font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 leading-tight">
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
			<div class="bg-white p-4 rounded-lg shadow-md">
				<h3 class="text-base font-bold text-nordic-blue border-b border-gray-200 pb-2 mb-3">Society & Culture</h3>
				<ul class="space-y-2">
					{#each cultureSocietyArticles.slice(0, 5) as article}
						<li>
							<a href={article.url_slug} class="group block">
								<h4 class="text-xs font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 leading-tight">
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

			<!-- Ad Slot - Compact -->
			<div class="bg-gray-100 p-4 rounded-lg shadow-md text-center">
				<span class="text-xs text-gray-500">Advertisement</span>
				<div class="h-32 flex items-center justify-center">
					<p class="text-gray-400 text-sm">Ad Slot</p>
				</div>
			</div>
		</div>
	</div>
</section>
