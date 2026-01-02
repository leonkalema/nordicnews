<script lang="ts">
  import SEOHead from '$lib/components/SEOHead.svelte';
  import { page } from '$app/stores';
  import { serializeJsonLd } from '$lib/utils/json-ld';
  import CategoryFooter from '$lib/components/category/CategoryFooter.svelte';
  import { buildRecommendedLinks } from '$lib/utils/recommended-links';
  
  export let data;
  
  $: category = data.category;
  $: categorySlug = category?.slug || (category?.name || '').toLowerCase();
  $: articles = data.articles || [];
  $: featuredArticles = data.featuredArticles || [];
  $: articlesByCountry = data.articlesByCountry || [];
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
  $: totalPages = data.pagination?.totalPages || 1;
  $: isOpinion = categorySlug === 'opinion';
	$: bottomRecommendedLinks = buildRecommendedLinks({ articles, maxLinks: 5 });
  
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
    <div class="mb-12">
      <!-- Opinion Hero -->
      <div class="border-b border-gray-200 pb-8 mb-8">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Commentary</h2>
        <h1 class="font-serif text-4xl font-bold text-gray-900 mb-4">Opinion & Expert Analysis</h1>
        <p class="text-gray-500 text-lg max-w-2xl">
          Perspectives from academics, researchers, and industry leaders on Nordic affairs.
        </p>
      </div>
      
      <!-- Legal Disclaimer -->
      <div class="bg-gray-50 border-l-2 border-black p-4 mb-8">
        <p class="text-sm text-gray-600">
          <strong class="text-gray-900">Editorial Disclaimer:</strong> Opinion pieces represent the views of their authors only.
          <a href="/editorial-policy" class="underline hover:text-black">Read our Editorial Policy</a>.
        </p>
      </div>
      
      <!-- Contributor Info -->
      <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
        <span class="text-sm text-gray-500">Are you an expert in Nordic affairs?</span>
        <a href="/contribute" class="bg-black hover:bg-gray-800 text-white px-5 py-2 text-sm font-medium transition-colors">
          Submit an Opinion
        </a>
      </div>
      
      <div class="flex items-center gap-2 text-gray-500 text-sm">
        <span class="bg-gray-100 px-3 py-1 rounded-full">{data.pagination?.totalArticles || 0} articles</span>
      </div>
    </div>
  {:else}
    <!-- Standard Category Header -->
    <div class="mb-12 border-b border-gray-200 pb-8">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category</h2>
      <h1 class="font-serif text-4xl font-bold text-gray-900 mb-3">{category.name}</h1>
      <div class="flex items-center gap-4">
        <p class="text-gray-500">Latest news and analysis from across the Nordic region</p>
        <span class="text-xs text-gray-400">{data.pagination?.totalArticles || 0} articles</span>
      </div>
    </div>
  {/if}

  <!-- Featured Articles -->
  {#if featuredArticles.length > 0}
    <section class="mb-16">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Featured</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {#each featuredArticles as article}
          <article class="group">
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
              
              <h3 class="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <a href={article.url_slug} class="group-hover:text-gray-600 transition-colors">
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
                class="text-gray-500 hover:text-black text-sm"
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
    <section class="mb-16">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">By Country</h2>
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
                    <h4 class="font-serif text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      <a href={article.url_slug} class="hover:text-gray-600 transition-colors">
                        {article.title}
                      </a>
                    </h4>
                    <p class="text-xs text-gray-500">{formatDate(article.published_at)}</p>
                  </article>
                {/each}
              </div>
              <a 
                href="/{countryGroup.country.toLowerCase()}"
                class="inline-block mt-3 text-gray-500 hover:text-black text-xs"
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
    <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">All Articles</h2>
    
    {#if data.error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{data.error}</p>
      </div>
    {/if}

    {#if articles.length > 0}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each articles as article}
          <article class="group">
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
              
              <h3 class="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <a href={article.url_slug} class="group-hover:text-gray-600 transition-colors">
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
                class="text-gray-500 hover:text-black text-sm"
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
                  class="px-3 py-2 {pageNum === currentPage ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}"
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
        <a href="/" class="text-gray-600 hover:text-black font-medium">
          Browse all news →
        </a>
      </div>
    {/if}
  </section>

	<CategoryFooter isOpinion={isOpinion} recommendedLinks={bottomRecommendedLinks} />
</div>
