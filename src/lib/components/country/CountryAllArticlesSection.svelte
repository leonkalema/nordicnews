<script lang="ts">
	type CountryArticle = {
		readonly id: string;
		readonly title: string;
		readonly url_slug: string;
		readonly summary?: string | null;
		readonly excerpt?: string | null;
		readonly relative_time?: string | null;
		readonly featured_image_url?: string | null;
		readonly image_alt?: string | null;
		readonly category_display?: string | null;
	};

	type CountryAllArticlesSectionProps = {
		readonly country: string;
		readonly displayedArticles: readonly CountryArticle[];
		readonly remainingCount: number;
		readonly hasMore: boolean;
		readonly loading: boolean;
		readonly onLoadMore: () => Promise<void>;
	};

	const { country, displayedArticles, remainingCount, hasMore, loading, onLoadMore }: CountryAllArticlesSectionProps = $props();
</script>

<section class="mb-16">
	<div class="mb-10">
		<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All News</h2>
		<p class="font-serif text-3xl font-semibold text-gray-900">All {country} News</p>
	</div>
	<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each displayedArticles as article}
			<article class="group">
				{#if article.featured_image_url}
					<div class="aspect-[16/10] overflow-hidden mb-4">
						<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-full object-cover" />
					</div>
				{/if}
				<span class="text-xs text-gray-400 uppercase tracking-widest">{article.category_display || ''}</span>
				<h3 class="font-serif text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mt-2 mb-2">
					<a href={article.url_slug}>{article.title}</a>
				</h3>
				<p class="text-gray-500 text-sm line-clamp-2 mb-2">
					{article.summary || article.excerpt || ''}
				</p>
				<span class="text-xs text-gray-400">{article.relative_time || ''}</span>
			</article>
		{/each}
	</div>
	{#if loading}
		<div class="text-center py-12">
			<span class="text-gray-500">Loading more articles...</span>
		</div>
	{/if}
	{#if hasMore && !loading}
		<div class="text-center py-12">
			<button onclick={onLoadMore} class="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium transition-colors" type="button">
				Load More
			</button>
		</div>
	{/if}
	<div class="text-center text-sm text-gray-500 mt-8 mb-4">
		Showing {displayedArticles.length} of {remainingCount} articles in this section
		{#if hasMore}
			• Scroll down for more
		{/if}
	</div>
</section>
