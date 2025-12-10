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

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
		<!-- Latest News Feed -->
		<div class="lg:col-span-3">
			<div class="mb-8">
				<h2 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Latest</h2>
				<p class="text-2xl font-semibold text-gray-900">Recent Stories</p>
			</div>
			
			<!-- Featured Articles Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{#each latestArticles.slice(0, 4) as article}
					<a href={article.url_slug} class="group block">
						<div class="aspect-[16/10] overflow-hidden mb-4">
							<img 
								src={article.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
								alt={article.featured_image_alt || article.title} 
								class="w-full h-full object-cover" 
							/>
						</div>
						<span class="text-xs text-gray-500 uppercase tracking-wide">{article.category_display}</span>
						<h3 class="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mt-1 mb-2">{article.title}</h3>
						<p class="text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
						<span class="text-xs text-gray-400 mt-2 block">{article.relative_time}</span>
					</a>
				{/each}
			</div>

			<!-- More Articles List -->
			<div class="border-t border-gray-200 pt-8">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each latestArticles.slice(4, 12) as article}
						<a href={article.url_slug} class="group flex gap-4 py-4 border-b border-gray-100">
							<img 
								src={article.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
								alt={article.featured_image_alt || article.title} 
								class="w-24 h-20 object-cover flex-shrink-0" 
							/>
							<div class="flex-1 min-w-0">
								<span class="text-xs text-gray-500 uppercase tracking-wide">{article.category_display}</span>
								<h3 class="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mt-1">{article.title}</h3>
								<span class="text-xs text-gray-400 mt-1 block">{article.relative_time}</span>
							</div>
						</a>
					{:else}
						<p class="text-gray-500 text-center py-8 col-span-2">No additional articles available</p>
					{/each}
				</div>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-10">
			<!-- Business & Tech -->
			<div>
				<h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Business & Tech</h3>
				<ul class="space-y-4">
					{#each businessTechArticles.slice(0, 4) as article}
						<li>
							<a href={article.url_slug} class="group block">
								<h4 class="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 leading-snug">
									{article.title}
								</h4>
								<span class="text-xs text-gray-400 mt-1 block">{article.relative_time}</span>
							</a>
						</li>
					{:else}
						<li class="text-xs text-gray-400">No articles available</li>
					{/each}
				</ul>
			</div>

			<!-- Politics -->
			<div>
				<h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Politics</h3>
				<ul class="space-y-4">
					{#each politicsArticles.slice(0, 4) as article}
						<li>
							<a href={article.url_slug} class="group block">
								<h4 class="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 leading-snug">
									{article.title}
								</h4>
								<span class="text-xs text-gray-400 mt-1 block">{article.relative_time}</span>
							</a>
						</li>
					{:else}
						<li class="text-xs text-gray-400">No articles available</li>
					{/each}
				</ul>
			</div>

			<!-- Society & Culture -->
			<div>
				<h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Society & Culture</h3>
				<ul class="space-y-4">
					{#each cultureSocietyArticles.slice(0, 4) as article}
						<li>
							<a href={article.url_slug} class="group block">
								<h4 class="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 leading-snug">
									{article.title}
								</h4>
								<span class="text-xs text-gray-400 mt-1 block">{article.relative_time}</span>
							</a>
						</li>
					{:else}
						<li class="text-xs text-gray-400">No articles available</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
