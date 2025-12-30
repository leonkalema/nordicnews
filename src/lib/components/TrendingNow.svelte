<script lang="ts">
	import { TrendingUp } from 'lucide-svelte';
	import type { ProcessedArticle } from '$lib/data/articles';

	interface Props {
		articles: ProcessedArticle[];
	}

	const { articles }: Props = $props();
</script>

<section class="bg-white border border-gray-200 rounded-lg p-6">
	<div class="flex items-center gap-2 mb-4">
		<TrendingUp size={20} class="text-breaking-red" />
		<h2 class="font-serif text-lg font-bold text-gray-900">Trending Now</h2>
	</div>

	<ol class="space-y-4">
		{#each articles.slice(0, 5) as article, i}
			<li class="flex gap-3">
				<span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
					{i + 1}
				</span>
				<div class="flex-1 min-w-0">
					<a
						href="/article/{article.slug}"
						class="block text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors line-clamp-2"
					>
						{article.title}
					</a>
					<p class="mt-1 text-xs text-gray-500">
						{article.country_name} · {article.view_count.toLocaleString()} views
					</p>
				</div>
			</li>
		{/each}
	</ol>
</section>
