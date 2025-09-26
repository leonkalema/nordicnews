<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Search, Filter, ArrowLeft, Calendar, Eye, MapPin } from 'lucide-svelte';
	import { getCountryFlag } from '$lib/supabase.js';
	import type { PageData } from './$types';

	export let data: PageData;

	$: country = data.country;
	$: articles = data.articles;
	$: pagination = data.pagination;
	$: featuredArticles = data.featuredArticles;
	$: articlesByCategory = data.articlesByCategory;
	$: currentFilters = data.currentFilters;

	let searchQuery = currentFilters?.search || '';
	let selectedCategory = currentFilters?.category || '';
	let showFilters = false;

	// Available categories
	const categories = [
		{ value: '', label: 'All Categories' },
		{ value: 'business', label: 'Business' },
		{ value: 'politics', label: 'Politics' },
		{ value: 'tech', label: 'Technology' },
		{ value: 'culture', label: 'Culture' },
		{ value: 'sports', label: 'Sports' }
	];

	// Handle search
	const handleSearch = () => {
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set('search', searchQuery.trim());
		if (selectedCategory) params.set('category', selectedCategory);
		
		const queryString = params.toString();
		goto(`/${country.slug}${queryString ? '?' + queryString : ''}`, { replaceState: true });
	};

	// Handle category filter
	const handleCategoryChange = () => {
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set('search', searchQuery.trim());
		if (selectedCategory) params.set('category', selectedCategory);
		
		const queryString = params.toString();
		goto(`/${country.slug}${queryString ? '?' + queryString : ''}`, { replaceState: true });
	};

	// Handle pagination
	const goToPage = (pageNum: number) => {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`/${country.slug}?${params.toString()}`);
	};

	// Clear filters
	const clearFilters = () => {
		searchQuery = '';
		selectedCategory = '';
		goto(`/${country.slug}`, { replaceState: true });
	};
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords?.join(', ')} />
	
	<!-- Open Graph -->
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nordicstoday.com/{country.slug}" />
</svelte:head>

<div class="min-h-screen bg-off-white">
	<!-- Header -->
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<!-- Back Navigation -->
			<div class="mb-6">
				<a href="/" class="inline-flex items-center text-nordic-blue hover:text-blue-800 transition-colors">
					<ArrowLeft size={20} class="mr-2" />
					Back to Home
				</a>
			</div>

			<!-- Country Header -->
			<div class="flex items-center gap-4 mb-6">
				<span class="text-4xl">{getCountryFlag(country.code)}</span>
				<div>
					<h1 class="text-3xl md:text-4xl font-bold text-gray-900">{country.name} News</h1>
					<p class="text-gray-600 mt-1">Latest news and analysis from {country.name}</p>
				</div>
			</div>

			<!-- Search and Filters -->
			<div class="flex flex-col md:flex-row gap-4">
				<!-- Search Bar -->
				<div class="flex-1 relative">
					<Search size={20} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search {country.name} news..."
						bind:value={searchQuery}
						on:keydown={(e) => e.key === 'Enter' && handleSearch()}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nordic-blue focus:border-transparent"
					/>
				</div>

				<!-- Category Filter -->
				<div class="flex gap-2">
					<select
						bind:value={selectedCategory}
						on:change={handleCategoryChange}
						class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nordic-blue focus:border-transparent"
					>
						{#each categories as category}
							<option value={category.value}>{category.label}</option>
						{/each}
					</select>

					<button
						on:click={handleSearch}
						class="px-6 py-2 bg-nordic-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Search
					</button>

					{#if currentFilters?.search || currentFilters?.category}
						<button
							on:click={clearFilters}
							class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Clear
						</button>
					{/if}
				</div>
			</div>

			<!-- Active Filters Display -->
			{#if currentFilters?.search || currentFilters?.category}
				<div class="mt-4 flex flex-wrap gap-2">
					{#if currentFilters?.search}
						<span class="inline-flex items-center px-3 py-1 bg-nordic-blue text-white text-sm rounded-full">
							Search: "{currentFilters.search}"
						</span>
					{/if}
					{#if currentFilters?.category}
						<span class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
							Category: {categories.find(c => c.value === currentFilters.category)?.label}
						</span>
					{/if}
				</div>
			{/if}
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Featured Articles -->
		{#if featuredArticles.length > 0}
			<section class="mb-12">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">Featured from {country.name}</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					{#each featuredArticles as article}
						<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<a href={article.url_slug} class="block">
								{#if article.featured_image_url}
									<img 
										src={article.featured_image_url} 
										alt={article.featured_image_alt || article.title}
										class="w-full h-48 object-cover"
									/>
								{/if}
								<div class="p-4">
									<div class="flex items-center gap-2 mb-2">
										<span class="px-2 py-1 bg-nordic-blue text-white text-xs font-semibold rounded-full">
											{article.category_display}
										</span>
										<span class="text-xs text-gray-500">{article.relative_time}</span>
									</div>
									<h3 class="font-semibold text-gray-900 hover:text-nordic-blue transition-colors line-clamp-2">
										{article.title}
									</h3>
									{#if article.excerpt}
										<p class="text-sm text-gray-600 mt-2 line-clamp-2">{article.excerpt}</p>
									{/if}
								</div>
							</a>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<!-- Main Articles List -->
			<div class="lg:col-span-3">
				{#if data.error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<p class="text-red-700">{data.error}</p>
					</div>
				{/if}

				{#if articles.length > 0}
					<div class="space-y-6">
						{#each articles as article}
							<article class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
								<a href={article.url_slug} class="block group">
									<div class="flex flex-col sm:flex-row gap-4">
										{#if article.featured_image_url}
											<img 
												src={article.featured_image_url} 
												alt={article.featured_image_alt || article.title}
												class="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0"
											/>
										{/if}
										<div class="flex-1">
											<div class="flex items-center gap-2 mb-2">
												<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
													{article.category_display}
												</span>
												<div class="flex items-center gap-1 text-xs text-gray-500">
													<Calendar size={12} />
													<span>{article.relative_time}</span>
												</div>
												{#if article.view_count}
													<div class="flex items-center gap-1 text-xs text-gray-500">
														<Eye size={12} />
														<span>{article.view_count}</span>
													</div>
												{/if}
											</div>
											<h3 class="text-lg font-semibold text-gray-900 group-hover:text-nordic-blue transition-colors mb-2">
												{article.title}
											</h3>
											{#if article.excerpt}
												<p class="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
											{/if}
											<div class="flex items-center justify-between mt-3">
												<span class="text-xs text-gray-500">{article.source_name}</span>
												<span class="text-xs text-nordic-blue group-hover:underline">Read more →</span>
											</div>
										</div>
									</div>
								</a>
							</article>
						{/each}
					</div>

					<!-- Pagination -->
					{#if pagination && pagination.totalPages > 1}
						<div class="mt-8 flex justify-center">
							<nav class="flex items-center gap-2">
								{#if pagination.hasPrev}
									<button
										on:click={() => goToPage(pagination.currentPage - 1)}
										class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Previous
									</button>
								{/if}

								{#each Array.from({length: Math.min(5, pagination.totalPages)}, (_, i) => {
									const start = Math.max(1, pagination.currentPage - 2);
									return start + i;
								}) as pageNum}
									{#if pageNum <= pagination.totalPages}
										<button
											on:click={() => goToPage(pageNum)}
											class="px-3 py-2 text-sm border rounded-lg transition-colors {pageNum === pagination.currentPage 
												? 'bg-nordic-blue text-white border-nordic-blue' 
												: 'border-gray-300 hover:bg-gray-50'}"
										>
											{pageNum}
										</button>
									{/if}
								{/each}

								{#if pagination.hasNext}
									<button
										on:click={() => goToPage(pagination.currentPage + 1)}
										class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Next
									</button>
								{/if}
							</nav>
						</div>
					{/if}
				{:else}
					<div class="text-center py-12">
						<p class="text-gray-500 text-lg">No articles found for {country.name}.</p>
						{#if currentFilters?.search || currentFilters?.category}
							<button
								on:click={clearFilters}
								class="mt-4 px-4 py-2 bg-nordic-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Clear Filters
							</button>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<aside class="lg:col-span-1">
				<!-- Categories for this country -->
				{#if articlesByCategory.length > 0}
					<div class="bg-white rounded-lg shadow-md p-6 mb-6">
						<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
							Categories in {country.name}
						</h3>
						<div class="space-y-4">
							{#each articlesByCategory as categoryData}
								{#if categoryData.articles.length > 0}
									<div>
										<h4 class="font-semibold text-gray-800 mb-2 capitalize">{categoryData.category}</h4>
										<div class="space-y-2">
											{#each categoryData.articles.slice(0, 3) as article}
												<a href={article.url_slug} class="block group">
													<h5 class="text-sm text-gray-700 group-hover:text-nordic-blue transition-colors line-clamp-2">
														{article.title}
													</h5>
													<span class="text-xs text-gray-500">{article.relative_time}</span>
												</a>
											{/each}
										</div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				{/if}

				<!-- Country Stats -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<h3 class="text-lg font-bold text-nordic-blue border-b-2 border-arctic-gray pb-2 mb-4">
						{country.name} at a Glance
					</h3>
					<div class="space-y-3">
						{#if pagination}
							<div class="flex justify-between">
								<span class="text-gray-600">Total Articles:</span>
								<span class="font-semibold">{pagination.totalArticles}</span>
							</div>
						{/if}
						<div class="flex justify-between">
							<span class="text-gray-600">Categories:</span>
							<span class="font-semibold">{articlesByCategory.filter(c => c.articles.length > 0).length}</span>
						</div>
					</div>
				</div>
			</aside>
		</div>
	</main>
</div>
