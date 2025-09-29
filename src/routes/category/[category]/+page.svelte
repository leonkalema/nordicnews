<script lang="ts">
  import SEOHead from '$lib/components/SEOHead.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: category = data.category;
  $: articles = data.articles || [];
  $: featuredArticles = data.featuredArticles || [];
  $: articlesByCountry = data.articlesByCountry || [];
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
  
  function formatDate(dateString: string | null) {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getCountryFlag(country: string) {
    const flags: Record<string, string> = {
      'SE': '🇸🇪',
      'NO': '🇳🇴', 
      'DK': '🇩🇰',
      'FI': '🇫🇮',
      'IS': '🇮🇸'
    };
    return flags[country] || '🏴';
  }

  function getCountryName(country: string) {
    const names: Record<string, string> = {
      'SE': 'Sweden',
      'NO': 'Norway', 
      'DK': 'Denmark',
      'FI': 'Finland',
      'IS': 'Iceland'
    };
    return names[country] || country;
  }
</script>

<SEOHead 
  title={data.meta?.title || `${category.name} News - Nordics Today`}
  description={data.meta?.description || `Latest ${category.name.toLowerCase()} news from Nordic countries`}
  keywords={data.meta?.keywords || [`${category.name} news`, 'Nordic news']}
  type="website"
/>

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Category Header -->
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-4">
      <h1 class="text-3xl font-bold text-gray-900">{category.name} News</h1>
      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {data.pagination?.totalArticles || 0} articles
      </span>
    </div>
    <p class="text-gray-600 text-lg">
      Latest {category.name.toLowerCase()} news and analysis from across the Nordic region
    </p>
  </div>

  <!-- Featured Articles -->
  {#if featuredArticles.length > 0}
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured {category.name} Stories</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {#each featuredArticles as article}
          <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {#if article.featured_image_url}
              <img 
                src={article.featured_image_url} 
                alt={article.featured_image_caption || article.title}
                class="w-full h-48 object-cover"
              >
            {/if}
            
            <div class="p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">{getCountryFlag(article.country)}</span>
                <span class="text-sm text-gray-500">{getCountryName(article.country)}</span>
                <span class="text-sm text-gray-400">•</span>
                <span class="text-sm text-gray-500">{formatDate(article.published_at)}</span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <a href={article.url_slug} class="hover:text-blue-600 transition-colors">
                  {article.title}
                </a>
              </h3>
              
              {#if article.excerpt}
                <p class="text-gray-600 text-sm line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
              {/if}
              
              <a 
                href={article.url_slug}
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Read more →
              </a>
            </div>
          </article>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Articles by Country -->
  {#if articlesByCountry.length > 0}
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">{category.name} News by Country</h2>
      <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {#each articlesByCountry as countryGroup}
          {#if countryGroup.articles.length > 0}
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <span class="text-xl">{getCountryFlag(countryGroup.country)}</span>
                {getCountryName(countryGroup.country)}
              </h3>
              <div class="space-y-3">
                {#each countryGroup.articles.slice(0, 3) as article}
                  <article>
                    <h4 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      <a href={article.url_slug} class="hover:text-blue-600 transition-colors">
                        {article.title}
                      </a>
                    </h4>
                    <p class="text-xs text-gray-500">{formatDate(article.published_at)}</p>
                  </article>
                {/each}
              </div>
              <a 
                href="/{countryGroup.country.toLowerCase()}"
                class="inline-block mt-3 text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                View all {getCountryName(countryGroup.country)} news →
              </a>
            </div>
          {/if}
        {/each}
      </div>
    </section>
  {/if}

  <!-- All Articles -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">All {category.name} Articles</h2>
    
    {#if data.error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{data.error}</p>
      </div>
    {/if}

    {#if articles.length > 0}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each articles as article}
          <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {#if article.featured_image_url}
              <img 
                src={article.featured_image_url} 
                alt={article.featured_image_caption || article.title}
                class="w-full h-48 object-cover"
              >
            {/if}
            
            <div class="p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">{getCountryFlag(article.country)}</span>
                <span class="text-sm text-gray-500">{getCountryName(article.country)}</span>
                <span class="text-sm text-gray-400">•</span>
                <span class="text-sm text-gray-500">{formatDate(article.published_at)}</span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <a href={article.url_slug} class="hover:text-blue-600 transition-colors">
                  {article.title}
                </a>
              </h3>
              
              {#if article.excerpt}
                <p class="text-gray-600 text-sm line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
              {/if}
              
              <a 
                href={article.url_slug}
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Read more →
              </a>
            </div>
          </article>
        {/each}
      </div>

      <!-- Pagination -->
      {#if data.pagination && data.pagination.totalPages > 1}
        <div class="mt-8 flex justify-center">
          <nav class="flex items-center gap-2">
            {#if currentPage > 1}
              <a 
                href="/category/{category.slug}?page={currentPage - 1}"
                class="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                Previous
              </a>
            {/if}
            
            {#each Array.from({length: Math.min(5, data.pagination.totalPages)}, (_, i) => i + Math.max(1, currentPage - 2)) as pageNum}
              {#if pageNum <= data.pagination.totalPages}
                <a 
                  href="/category/{category.slug}?page={pageNum}"
                  class="px-3 py-2 {pageNum === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded"
                >
                  {pageNum}
                </a>
              {/if}
            {/each}
            
            {#if currentPage < data.pagination.totalPages}
              <a 
                href="/category/{category.slug}?page={currentPage + 1}"
                class="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                Next
              </a>
            {/if}
          </nav>
        </div>
      {/if}
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500 mb-4">No {category.name.toLowerCase()} articles found.</p>
        <a href="/" class="text-blue-600 hover:text-blue-800 font-medium">
          Browse all news →
        </a>
      </div>
    {/if}
  </section>

  <!-- Browse Other Categories -->
  <section class="mt-12 pt-8 border-t border-gray-200">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Browse Other Categories</h3>
    <div class="flex flex-wrap gap-2">
      <a href="/category/breaking" class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm transition-colors">Breaking News</a>
      <a href="/category/politics" class="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition-colors">Politics</a>
      <a href="/category/business" class="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm transition-colors">Business</a>
      <a href="/category/tech" class="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm transition-colors">Technology</a>
      <a href="/category/culture" class="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm transition-colors">Culture</a>
      <a href="/category/society" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm transition-colors">Society</a>
      <a href="/category/sports" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm transition-colors">Sports</a>
    </div>
  </section>
</div>
