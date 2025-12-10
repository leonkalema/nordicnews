<script lang="ts">
	import type { ProcessedArticle } from '$lib/data/articles.js';

	export let featuredArticles: ProcessedArticle[] = [];

	// Get the main featured article and top stories
	$: featuredArticle = featuredArticles[0];
	$: topStories = featuredArticles.slice(1, 4);
</script>

<section class="bg-white py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Hero Featured Story -->
			<div class="lg:col-span-2">
				{#if featuredArticle}
					<a href={featuredArticle.url_slug} class="block group">
						<div class="relative overflow-hidden">
							<img 
								src={featuredArticle.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
								alt={featuredArticle.featured_image_alt || featuredArticle.title} 
								class="w-full h-[450px] object-cover" 
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
							<div class="absolute bottom-0 left-0 right-0 p-8">
								<span class="text-xs font-medium text-white/80 uppercase tracking-widest mb-3 block">{featuredArticle.category_display}</span>
								<h1 class="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">{featuredArticle.title}</h1>
								<p class="text-gray-300 line-clamp-2 mb-4">{featuredArticle.excerpt}</p>
								<span class="text-sm text-gray-400">{featuredArticle.relative_time}</span>
							</div>
						</div>
					</a>
			{:else}
				<div class="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
					<p class="text-gray-500">No featured articles available</p>
				</div>
			{/if}
		</div>

			<!-- Right Sidebar -->
			<div>
				<!-- Top Stories Sidebar -->
				<div class="border-l-2 border-black pl-6">
					<h2 class="text-sm font-bold text-black uppercase tracking-widest mb-6">Top Stories</h2>
					<div class="space-y-6">
						{#each topStories as story, index}
							<a href={story.url_slug} class="group block">
								<div class="flex gap-4">
									<span class="flex-shrink-0 text-3xl font-light text-gray-300">{index + 1}</span>
									<div class="flex-1">
										<span class="text-xs text-gray-500 uppercase tracking-wide">{story.category_display}</span>
										<h3 class="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug mt-1">{story.title}</h3>
										<span class="text-xs text-gray-400 mt-2 block">{story.relative_time}</span>
									</div>
								</div>
							</a>
						{:else}
							<p class="text-gray-500 text-sm">No top stories available</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
