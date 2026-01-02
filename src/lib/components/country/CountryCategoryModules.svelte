<script lang="ts">
	type CountryArticle = {
		readonly id: string;
		readonly title: string;
		readonly url_slug: string;
		readonly relative_time?: string | null;
		readonly featured_image_url?: string | null;
		readonly image_alt?: string | null;
	};

	type CountryCategoryModulesProps = {
		readonly country: string;
		readonly countrySlug: string;
		readonly politicsArticles: readonly CountryArticle[];
		readonly businessArticles: readonly CountryArticle[];
		readonly techArticles: readonly CountryArticle[];
		readonly societyArticles: readonly CountryArticle[];
	};

	const {
		country,
		countrySlug,
		politicsArticles,
		businessArticles,
		techArticles,
		societyArticles
	}: CountryCategoryModulesProps = $props();
</script>

{#if politicsArticles.length > 0}
	<section class="mb-16">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Politics</h2>
				<p class="font-serif text-2xl font-semibold text-gray-900">{country} Politics</p>
			</div>
			<a href="/{countrySlug}/politics" class="text-sm text-gray-500 hover:text-black">View all →</a>
		</div>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each politicsArticles as article}
				<article class="group">
					{#if article.featured_image_url}
						<div class="aspect-[16/10] overflow-hidden mb-3">
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-full object-cover" />
						</div>
					{/if}
					<h3 class="font-serif text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
						<a href={article.url_slug}>{article.title}</a>
					</h3>
					<span class="text-xs text-gray-400">{article.relative_time || ''}</span>
				</article>
			{/each}
		</div>
	</section>
{/if}

{#if businessArticles.length > 0}
	<section class="mb-16">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Business</h2>
				<p class="font-serif text-2xl font-semibold text-gray-900">{country} Business</p>
			</div>
			<a href="/{countrySlug}/business" class="text-sm text-gray-500 hover:text-black">View all →</a>
		</div>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each businessArticles as article}
				<article class="group">
					{#if article.featured_image_url}
						<div class="aspect-[16/10] overflow-hidden mb-3">
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-full object-cover" />
						</div>
					{/if}
					<h3 class="font-serif text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
						<a href={article.url_slug}>{article.title}</a>
					</h3>
					<span class="text-xs text-gray-400">{article.relative_time || ''}</span>
				</article>
			{/each}
		</div>
	</section>
{/if}

{#if techArticles.length > 0}
	<section class="mb-16">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Technology</h2>
				<p class="font-serif text-2xl font-semibold text-gray-900">{country} Tech</p>
			</div>
			<a href="/{countrySlug}/tech" class="text-sm text-gray-500 hover:text-black">View all →</a>
		</div>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each techArticles as article}
				<article class="group">
					{#if article.featured_image_url}
						<div class="aspect-[16/10] overflow-hidden mb-3">
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-full object-cover" />
						</div>
					{/if}
					<h3 class="font-serif text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
						<a href={article.url_slug}>{article.title}</a>
					</h3>
					<span class="text-xs text-gray-400">{article.relative_time || ''}</span>
				</article>
			{/each}
		</div>
	</section>
{/if}

{#if societyArticles.length > 0}
	<section class="mb-16">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Society</h2>
				<p class="font-serif text-2xl font-semibold text-gray-900">{country} Society & Culture</p>
			</div>
			<a href="/{countrySlug}/society" class="text-sm text-gray-500 hover:text-black">View all →</a>
		</div>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each societyArticles as article}
				<article class="group">
					{#if article.featured_image_url}
						<div class="aspect-[16/10] overflow-hidden mb-3">
							<img src={article.featured_image_url} alt={article.image_alt || article.title} class="w-full h-full object-cover" />
						</div>
					{/if}
					<h3 class="font-serif text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
						<a href={article.url_slug}>{article.title}</a>
					</h3>
					<span class="text-xs text-gray-400">{article.relative_time || ''}</span>
				</article>
			{/each}
		</div>
	</section>
{/if}
