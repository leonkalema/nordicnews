<script lang="ts">
  import SEOHead from '$lib/components/SEOHead.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: query = data.query || '';
  $: articles = data.articles || [];
  $: totalResults = data.totalResults || 0;
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
  $: hasResults = articles.length > 0;
  $: hasError = data.error;
  
  // SEO data
  $: seoTitle = query ? `Search results for "${query}" - Nordics Today` : 'Search Nordic News - Nordics Today';
  $: seoDescription = query 
    ? `Found ${totalResults} articles about "${query}" from Nordic countries. Search the latest news from Sweden, Norway, Denmark, Finland, and Iceland.`
    : 'Search the latest news and analysis from Nordic countries. Find articles from Sweden, Norway, Denmark, Finland, and Iceland.';

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
  title={seoTitle}
  description={seoDescription}
  type="website"
/>

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Search Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">
      {#if query}
        Search Results for "{query}"
      {:else}
        Search Nordic News
      {/if}
    </h1>
    
    <!-- Search Form -->
    <form method="get" action="/search" class="max-w-2xl">
      <div class="flex gap-2">
        <input 
          type="text" 
          name="q" 
          value={query}
          placeholder="Search news, topics, or countries..." 
          class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <button 
          type="submit" 
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </form>
  </div>

  <!-- Results Summary -->
  {#if query}
    <div class="mb-6">
      {#if hasError}
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">{data.error}</p>
        </div>
      {:else if hasResults}
        <p class="text-gray-600">
          Found <strong>{totalResults}</strong> article{totalResults !== 1 ? 's' : ''} 
          {#if totalResults > articles.length}
            (showing {articles.length})
          {/if}
        </p>
      {:else}
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-yellow-800">No articles found for "{query}". Try different keywords or browse by country below.</p>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Search Results -->
  {#if hasResults}
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
            
            <h2 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              <a href={article.url_slug} class="hover:text-blue-600 transition-colors">
                {article.title}
              </a>
            </h2>
            
            {#if article.excerpt}
              <p class="text-gray-600 text-sm line-clamp-3 mb-3">
                {article.excerpt}
              </p>
            {/if}
            
            <div class="flex items-center justify-between">
              <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {article.category_display}
              </span>
              <a 
                href={article.url_slug}
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Read more →
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>

    <!-- Pagination -->
    {#if data.pagination && data.pagination.total_pages > 1}
      <div class="mt-8 flex justify-center">
        <nav class="flex items-center gap-2">
          {#if currentPage > 1}
            <a 
              href="/search?q={encodeURIComponent(query)}&page={currentPage - 1}"
              class="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              Previous
            </a>
          {/if}
          
          {#each Array.from({length: Math.min(5, data.pagination.total_pages)}, (_, i) => i + Math.max(1, currentPage - 2)) as pageNum}
            {#if pageNum <= data.pagination.total_pages}
              <a 
                href="/search?q={encodeURIComponent(query)}&page={pageNum}"
                class="px-3 py-2 {pageNum === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded"
              >
                {pageNum}
              </a>
            {/if}
          {/each}
          
          {#if currentPage < data.pagination.total_pages}
            <a 
              href="/search?q={encodeURIComponent(query)}&page={currentPage + 1}"
              class="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              Next
            </a>
          {/if}
        </nav>
      </div>
    {/if}
  {/if}

  <!-- No Query State -->
  {#if !query}
    <div class="text-center py-12">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Browse by Country</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
        <a href="/sweden" class="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors">
          <div class="text-2xl mb-2">🇸🇪</div>
          <div class="font-medium text-gray-900">Sweden</div>
        </a>
        <a href="/norway" class="bg-red-50 hover:bg-red-100 p-4 rounded-lg text-center transition-colors">
          <div class="text-2xl mb-2">🇳🇴</div>
          <div class="font-medium text-gray-900">Norway</div>
        </a>
        <a href="/denmark" class="bg-red-50 hover:bg-red-100 p-4 rounded-lg text-center transition-colors">
          <div class="text-2xl mb-2">🇩🇰</div>
          <div class="font-medium text-gray-900">Denmark</div>
        </a>
        <a href="/finland" class="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors">
          <div class="text-2xl mb-2">🇫🇮</div>
          <div class="font-medium text-gray-900">Finland</div>
        </a>
        <a href="/iceland" class="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors">
          <div class="text-2xl mb-2">🇮🇸</div>
          <div class="font-medium text-gray-900">Iceland</div>
        </a>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Popular Search Terms</h3>
        <div class="flex flex-wrap justify-center gap-2">
          <a href="/search?q=politics" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Politics</a>
          <a href="/search?q=environment" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Environment</a>
          <a href="/search?q=technology" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Technology</a>
          <a href="/search?q=business" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Business</a>
          <a href="/search?q=culture" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Culture</a>
        </div>
      </div>
    </div>
  {/if}
</div>
