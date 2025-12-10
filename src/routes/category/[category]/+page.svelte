<script lang="ts">
  import SEOHead from '$lib/components/SEOHead.svelte';
  import { page } from '$app/stores';
  import { serializeJsonLd } from '$lib/utils/json-ld';
  
  export let data;
  
  $: category = data.category;
  $: categorySlug = category?.slug || (category?.name || '').toLowerCase();
  $: articles = data.articles || [];
  $: featuredArticles = data.featuredArticles || [];
  $: articlesByCountry = data.articlesByCountry || [];
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
  $: totalPages = data.pagination?.totalPages || 1;
  $: isOpinion = categorySlug === 'opinion';
  
  function buildHref(targetPage: number) {
    const params = new URLSearchParams($page.url.searchParams);
    if (targetPage === 1) params.delete('page'); else params.set('page', String(targetPage));
    return `/category/${categorySlug || ''}${params.toString() ? `?${params.toString()}` : ''}`;
  }

  // CollectionPage JSON-LD for category listings
  $: collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": isOpinion ? "Opinion & Expert Commentary" : `${category?.name || ''} News`,
    "description": isOpinion 
      ? "Expert opinions, analysis, and perspectives from academics, researchers, and industry leaders on Nordic affairs"
      : `Latest ${String(category?.name || '').toLowerCase()} news from the Nordic region`,
    "url": `https://nordicstoday.com/category/${categorySlug || ''}`,
    "inLanguage": "en"
  };
  
  // FAQ Schema for Opinion section (SEO boost)
  $: opinionFaqSchema = isOpinion ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Opinion section on Nordics Today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Opinion section features expert perspectives, analysis, and commentary from academics, researchers, industry leaders, and qualified contributors on topics affecting the Nordic region. These are not news articles but informed viewpoints."
        }
      },
      {
        "@type": "Question",
        "name": "Do opinion pieces reflect the editorial position of Nordics Today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Opinion pieces represent the personal views of their authors only. They do not necessarily reflect the editorial position or views of Nordics Today or its staff."
        }
      },
      {
        "@type": "Question",
        "name": "How can I submit an opinion piece to Nordics Today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We welcome submissions from academics, researchers, and industry experts. Please use our submission form at nordicstoday.com/contribute to submit your article along with your credentials and bio. All submissions undergo editorial review."
        }
      },
      {
        "@type": "Question",
        "name": "Who can contribute opinion pieces?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept submissions from qualified contributors including university professors, researchers, policy experts, industry executives, and other professionals with demonstrated expertise in Nordic affairs, business, politics, or society."
        }
      }
    ]
  } : null;
  
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

<svelte:head>
  <!-- Breadcrumbs: Home -> Category -->
  {@html `<script type="application/ld+json">${serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nordicstoday.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category?.name || String(category),
        "item": `https://nordicstoday.com/category/${categorySlug || ''}`
      }
    ]
  })}</script>`}
  
  <!-- FAQ Schema for Opinion section -->
  {#if opinionFaqSchema}
    {@html `<script type="application/ld+json">${serializeJsonLd(opinionFaqSchema)}</script>`}
  {/if}

  {#if totalPages > 1}
    {#if currentPage > 1}
      <link rel="prev" href={buildHref(currentPage - 1)} />
    {/if}
    {#if currentPage < totalPages}
      <link rel="next" href={buildHref(currentPage + 1)} />
    {/if}
  {/if}
</svelte:head>

<SEOHead 
  title={data.meta?.title || `${category.name} News - Nordics Today`}
  description={data.meta?.description || `Latest ${category.name.toLowerCase()} news from Nordic countries`}
  keywords={data.meta?.keywords || [`${category.name} news`, 'Nordic news']}
  url={`/category/${categorySlug || ''}`}
  type="website"
  structuredData={collectionSchema}
/>

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Opinion-specific Header with Disclaimer -->
  {#if isOpinion}
    <div class="mb-8">
      <!-- Opinion Hero -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-lg p-8 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h1 class="text-3xl font-bold">Opinion & Expert Commentary</h1>
        </div>
        <p class="text-gray-300 text-lg max-w-2xl">
          Expert perspectives, analysis, and insights from academics, researchers, and industry leaders on Nordic affairs.
        </p>
      </div>
      
      <!-- Legal Disclaimer - Important for liability -->
      <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h2 class="font-semibold text-amber-800 mb-1">Editorial Disclaimer</h2>
            <p class="text-sm text-amber-700">
              <strong>Opinion pieces represent the views of their authors only</strong> and do not necessarily reflect the editorial position of Nordics Today. 
              All submissions undergo editorial review for quality but the arguments and conclusions remain the author's own.
              <a href="/editorial-policy" class="underline hover:text-amber-900">Read our Editorial Policy</a>.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Contributor Info -->
      <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-2 text-blue-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm font-medium">Are you an expert in Nordic affairs?</span>
          </div>
          <a href="/contribute" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Submit an Opinion Piece
          </a>
        </div>
      </div>
      
      <div class="flex items-center gap-2 text-gray-500 text-sm">
        <span class="bg-gray-100 px-3 py-1 rounded-full">{data.pagination?.totalArticles || 0} articles</span>
      </div>
    </div>
  {:else}
    <!-- Standard Category Header -->
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
  {/if}

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
                decoding="async"
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
      <a href="/category/opinion" class="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-sm transition-colors">Opinion</a>
    </div>
  </section>
  
  <!-- FAQ Section for Opinion (visible for SEO) -->
  {#if isOpinion}
    <section class="mt-12 pt-8 border-t border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details class="bg-white border border-gray-200 rounded-lg">
          <summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
            What is the Opinion section on Nordics Today?
          </summary>
          <p class="px-4 pb-4 text-gray-600">
            The Opinion section features expert perspectives, analysis, and commentary from academics, researchers, industry leaders, and qualified contributors on topics affecting the Nordic region. These are not news articles but informed viewpoints.
          </p>
        </details>
        <details class="bg-white border border-gray-200 rounded-lg">
          <summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
            Do opinion pieces reflect the editorial position of Nordics Today?
          </summary>
          <p class="px-4 pb-4 text-gray-600">
            No. Opinion pieces represent the personal views of their authors only. They do not necessarily reflect the editorial position or views of Nordics Today or its staff.
          </p>
        </details>
        <details class="bg-white border border-gray-200 rounded-lg">
          <summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
            How can I submit an opinion piece to Nordics Today?
          </summary>
          <p class="px-4 pb-4 text-gray-600">
            We welcome submissions from academics, researchers, and industry experts. Please use our <a href="/contribute" class="text-blue-600 hover:underline">submission form</a> to submit your article with your credentials and bio. All submissions undergo editorial review.
          </p>
        </details>
        <details class="bg-white border border-gray-200 rounded-lg">
          <summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
            Who can contribute opinion pieces?
          </summary>
          <p class="px-4 pb-4 text-gray-600">
            We accept submissions from qualified contributors including university professors, researchers, policy experts, industry executives, and other professionals with demonstrated expertise in Nordic affairs, business, politics, or society.
          </p>
        </details>
      </div>
    </section>
  {/if}
</div>
