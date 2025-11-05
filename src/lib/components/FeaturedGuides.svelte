<script lang="ts">
	import { BookOpen, ArrowRight } from 'lucide-svelte';
	import type { ProcessedArticle } from '$lib/data/articles';

	export let guideArticles: ProcessedArticle[] = [];
</script>

{#if guideArticles && guideArticles.length > 0}
<section class="bg-white border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<!-- Compact Header -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-2">
				<BookOpen size={18} class="text-nordic-blue" />
				<h2 class="text-lg font-bold text-gray-900">Expert Guides</h2>
			</div>
			<a href="/category/guide" class="text-sm text-nordic-blue hover:underline flex items-center gap-1">
				View all
				<ArrowRight size={14} />
			</a>
		</div>

		<!-- Horizontal Scroll Cards -->
		<div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
			{#each guideArticles.slice(0, 6) as guide}
			<a href={guide.url_slug} class="group flex-none w-72 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
				<div class="relative h-40 overflow-hidden">
					<img 
						src={guide.featured_image_url || 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop'} 
						alt={guide.featured_image_alt || guide.title}
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					<div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
						<span class="text-xs font-medium text-gray-700">{guide.country_name}</span>
					</div>
				</div>
				<div class="p-4">
					<h3 class="text-sm font-bold text-gray-900 group-hover:text-nordic-blue transition-colors mb-2 line-clamp-2">
						{guide.title}
					</h3>
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span class="truncate">Nordics Today News Team</span>
					</div>
				</div>
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
