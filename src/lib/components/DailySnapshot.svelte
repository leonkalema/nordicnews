<script lang="ts">
	import type { ProcessedArticle } from '$lib/data/articles.js';

	export let featuredArticles: ProcessedArticle[] = [];

	// Get the main featured article and top stories
	$: featuredArticle = featuredArticles[0];
	$: topStories = featuredArticles.slice(1, 4);
</script>

<section class="bg-gradient-to-b from-gray-50 to-white py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-1 h-8 bg-red-600"></div>
				<h2 class="text-sm font-bold text-red-600 uppercase tracking-wider">Breaking News</h2>
			</div>
			<div class="h-px bg-gradient-to-r from-red-600 via-gray-300 to-transparent"></div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Hero Featured Story -->
			<div class="lg:col-span-2">
				{#if featuredArticle}
					<a href={featuredArticle.url_slug} class="block group">
						<div class="relative overflow-hidden rounded-xl shadow-2xl">
							<img 
								src={featuredArticle.featured_image_url || 'https://images.unsplash.com/photo-1558981852-425c1b4a4a68?q=80&w=2070&auto=format&fit=crop'} 
								alt={featuredArticle.featured_image_alt || featuredArticle.title} 
								class="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500" 
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
							<div class="absolute bottom-0 left-0 right-0 p-8">
								<div class="flex items-center gap-3 mb-4">
									<span class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide">Featured</span>
									<span class="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded">{featuredArticle.category_display}</span>
								</div>
								<h1 class="text-4xl lg:text-5xl font-black text-white leading-tight group-hover:text-gray-200 transition-colors mb-3">{featuredArticle.title}</h1>
								<p class="text-lg text-gray-200 leading-relaxed line-clamp-2">{featuredArticle.excerpt}</p>
								<div class="flex items-center gap-4 mt-4 text-sm text-gray-300">
									<span>{featuredArticle.relative_time}</span>
									<span>•</span>
									
								</div>
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
				<!-- Sidebar Banner Ad -->
				<div class="mb-8">
					<a href="https://fcnordljus.se/register" target="_blank" rel="noopener noreferrer sponsored" class="block">
						<img
							src="https://efqogymhexbveihxtzsj.supabase.co/storage/v1/object/public/ads/New%20to.png"
							alt="Register with FC Nordljus"
							loading="lazy"
							decoding="async"
							class="w-full h-auto rounded-xl shadow-md"
						/>
					</a>
				</div>

				<!-- Top Stories Sidebar -->
				<div class="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
					<div class="bg-gradient-to-r from-nordic-blue to-blue-700 px-6 py-4">
						<h2 class="text-xl font-bold text-white">Top Stories</h2>
					</div>
					<ul class="divide-y divide-gray-100">
						{#each topStories as story, index}
							<li class="p-6 hover:bg-gray-50 transition-colors">
								<a href={story.url_slug} class="group block">
									<div class="flex gap-4">
										<span class="flex-shrink-0 w-8 h-8 bg-nordic-blue text-white rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</span>
										<div class="flex-1">
											<span class="inline-block text-xs font-bold text-nordic-blue uppercase tracking-wide mb-1">{story.category_display}</span>
											<h3 class="font-bold text-gray-900 group-hover:text-nordic-blue transition-colors leading-snug">{story.title}</h3>
											<p class="text-xs text-gray-500 mt-2">{story.relative_time}</p>
										</div>
									</div>
								</a>
							</li>
						{:else}
							<li class="p-6 text-gray-500 text-sm">No top stories available</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>
