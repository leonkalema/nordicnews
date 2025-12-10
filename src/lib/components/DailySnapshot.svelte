<script lang="ts">
	import type { ProcessedArticle } from '$lib/data/articles.js';

	export let featuredArticles: ProcessedArticle[] = [];

	// Get the main featured article and top stories
	$: featuredArticle = featuredArticles[0];
	$: topStories = featuredArticles.slice(1, 4);
</script>

<section class="bg-white py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
			<!-- Hero Featured Story -->
			<div class="lg:col-span-2">
				{#if featuredArticle}
					<a href={featuredArticle.url_slug} class="block group">
						<div class="relative overflow-hidden">
							<img 
								src={featuredArticle.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
								alt={featuredArticle.featured_image_alt || featuredArticle.title} 
								class="w-full h-[520px] object-cover" 
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
							<div class="absolute bottom-0 left-0 right-0 p-10">
								<div class="flex items-center gap-3 mb-4">
									<span class="bg-breaking-red text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">Breaking</span>
									<span class="text-white/70 text-xs uppercase tracking-widest">{featuredArticle.category_display}</span>
								</div>
								<h1 class="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">{featuredArticle.title}</h1>
								<p class="text-gray-300 text-lg line-clamp-2 mb-4 max-w-2xl">{featuredArticle.excerpt}</p>
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
				<div class="border-l-2 border-black pl-8">
					<h2 class="text-xs font-bold text-black uppercase tracking-widest mb-8">Top Stories</h2>
					<div class="space-y-8">
						{#each topStories as story, index}
							<a href={story.url_slug} class="group block">
								<div class="flex gap-5">
									<span class="flex-shrink-0 font-serif text-4xl font-light text-gray-200">{index + 1}</span>
									<div class="flex-1">
										<span class="text-xs text-gray-400 uppercase tracking-widest">{story.category_display}</span>
										<h3 class="font-serif text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug mt-2">{story.title}</h3>
										<span class="text-xs text-gray-400 mt-3 block">{story.relative_time}</span>
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
