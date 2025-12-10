<script lang="ts">
	import { BookOpen, ArrowRight } from 'lucide-svelte';
	import type { ProcessedArticle } from '$lib/data/articles';

	export let guideArticles: ProcessedArticle[] = [];
</script>

{#if guideArticles && guideArticles.length > 0}
<section class="bg-white border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-3">
				<BookOpen size={16} class="text-gray-400" />
				<h2 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Expert Guides</h2>
			</div>
			<a href="/category/guide" class="text-xs text-gray-500 hover:text-black flex items-center gap-1">
				View all
				<ArrowRight size={12} />
			</a>
		</div>

		<!-- Horizontal Scroll Cards -->
		<div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
			{#each guideArticles.slice(0, 6) as guide}
			<a href={guide.url_slug} class="group flex-none w-64 bg-white border-b-2 border-transparent hover:border-black transition-all">
				<div class="aspect-[16/10] overflow-hidden mb-3">
					<img 
						src={guide.featured_image_url || 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop'} 
						alt={guide.featured_image_alt || guide.title}
						class="w-full h-full object-cover"
					/>
				</div>
				<span class="text-xs text-gray-400 uppercase tracking-wide">{guide.country_name}</span>
				<h3 class="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mt-1">
					{guide.title}
				</h3>
			</a>
			{/each}
		</div>
	</div>
</section>
{/if}

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
