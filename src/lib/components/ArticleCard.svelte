<script lang="ts">
	export let article: any;
</script>

<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
	{#if article.featured_image_url}
		<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-48 object-cover" />
	{/if}
	<div class="p-6">
		<h3 class="font-semibold text-lg mb-2 line-clamp-2">
			<a href={article.url_slug} class="hover:text-blue-600">
				{article.title}
			</a>
		</h3>
		<p class="text-gray-600 text-sm mb-3 line-clamp-3">
			{article.summary || article.excerpt}
		</p>
		<div class="flex justify-between items-center text-sm text-gray-500">
			<span></span>
			<time datetime={article.published_date}>
				{article.relative_time}
			</time>
		</div>
	</div>
</article>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
