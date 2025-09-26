<script lang="ts">
	import type { ProcessedArticle } from '$lib/data/articles.js';

	export let featuredArticles: ProcessedArticle[] = [];

	// Get the main featured article and top stories
	$: featuredArticle = featuredArticles[0];
	$: topStories = featuredArticles.slice(1, 4);
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		<!-- Featured Story -->
		<div class="md:col-span-2">
			{#if featuredArticle}
				<a href={featuredArticle.url_slug} class="block group">
					<div class="relative overflow-hidden rounded-lg shadow-lg">
						<img 
							src={featuredArticle.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
							alt={featuredArticle.featured_image_alt || featuredArticle.title} 
							class="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300" 
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
						<div class="absolute bottom-0 left-0 p-6">
							<span class="inline-block bg-nordic-blue text-off-white text-xs font-semibold px-2 py-1 rounded-full mb-2">{featuredArticle.category_display}</span>
							<h1 class="text-3xl font-bold text-white group-hover:text-arctic-gray transition-colors">{featuredArticle.title}</h1>
							<p class="mt-2 text-sm text-arctic-gray hidden sm:block">{featuredArticle.excerpt}</p>
						</div>
					</div>
				</a>
			{:else}
				<div class="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
					<p class="text-gray-500">No featured articles available</p>
				</div>
			{/if}
		</div>

		<!-- Top Stories -->
		<div class="bg-off-white p-6 rounded-lg shadow-md">
			<h2 class="text-xl font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2">Top Stories</h2>
			<ul class="mt-4 space-y-4">
				{#each topStories as story}
					<li>
						<a href={story.url_slug} class="group">
							<span class="text-xs font-semibold text-gray-500">{story.category_display}</span>
							<p class="font-semibold text-gray-800 group-hover:text-nordic-blue transition-colors">{story.title}</p>
						</a>
					</li>
				{:else}
					<li class="text-gray-500 text-sm">No top stories available</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
