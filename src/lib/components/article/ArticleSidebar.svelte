<script lang="ts">
	import type { ProcessedArticle } from '$lib/data/articles';

	type RelatedArticles = {
		readonly byCategory: ProcessedArticle[];
		readonly byCountry: ProcessedArticle[];
		readonly trending: ProcessedArticle[];
	};

	type ArticleSidebarProps = {
		readonly articleCategoryDisplay: string;
		readonly articleCountryName: string;
		readonly relatedArticles: RelatedArticles;
	};

	const { articleCategoryDisplay, articleCountryName, relatedArticles }: ArticleSidebarProps = $props();
</script>

<aside class="lg:col-span-1">
	{#if relatedArticles.byCategory.length > 0}
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
				More in {articleCategoryDisplay}
			</h3>
			<div class="space-y-4">
				{#each relatedArticles.byCategory as related}
					<article class="border-b border-gray-100 pb-3 last:border-b-0">
						<a href={related.url_slug} class="group">
							<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">
								{related.title}
							</h4>
							<div class="flex items-center justify-between text-xs text-gray-500">
								<span>{related.country_name}</span>
								<span>{related.relative_time}</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</div>
	{/if}

	{#if relatedArticles.byCountry.length > 0}
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
				More from {articleCountryName}
			</h3>
			<div class="space-y-4">
				{#each relatedArticles.byCountry as related}
					<article class="border-b border-gray-100 pb-3 last:border-b-0">
						<a href={related.url_slug} class="group">
							<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">
								{related.title}
							</h4>
							<div class="flex items-center justify-between text-xs text-gray-500">
								<span>{related.category_display}</span>
								<span>{related.relative_time}</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow-md p-4 mb-6 sticky top-4">
		<p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Advertisement</p>
		<ins
			class="adsbygoogle"
			style="display:block"
			data-ad-client="ca-pub-7608249203271599"
			data-ad-slot="6255665066"
			data-ad-format="auto"
			data-full-width-responsive="true"></ins>
	</div>

	{#if relatedArticles.trending.length > 0}
		<div class="bg-white rounded-lg shadow-md p-6">
			<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
				Trending Now
			</h3>
			<div class="space-y-4">
				{#each relatedArticles.trending as trending}
					<article class="border-b border-gray-100 pb-3 last:border-b-0">
						<a href={trending.url_slug} class="group">
							<h4 class="text-sm font-medium text-gray-800 group-hover:text-nordic-blue transition-colors line-clamp-2 mb-1">
								{trending.title}
							</h4>
							<div class="flex items-center justify-between text-xs text-gray-500">
								<span>{trending.country_name}</span>
								<span>{trending.relative_time}</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</div>
	{/if}
</aside>
