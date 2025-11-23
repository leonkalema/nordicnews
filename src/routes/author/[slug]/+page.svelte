<script lang="ts">
  import type { PageData } from './$types';
  import { getCountryFlag } from '$lib/supabase.js';
  export let data: PageData;
  const { author, articles } = data as any;
</script>

<svelte:head>
  <title>{author.name} - Author at Nordics Today</title>
  <meta name="description" content={author.bio || `${author.name} - Nordic correspondent at Nordics Today.`} />
  <link rel="canonical" href={`https://nordicstoday.com/author/${author.slug}`} />
</svelte:head>

<section class="bg-off-white min-h-screen">
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-start gap-6">
        {#if author.profile_image_url}
          <img src={author.profile_image_url} alt={`${author.name} profile`} class="w-24 h-24 rounded-full object-cover border" />
        {:else}
          <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500">
            {author.name?.charAt(0)}
          </div>
        {/if}
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{author.name}</h1>
          <p class="text-gray-700 mt-2 max-w-3xl">{author.bio || 'Nordics Today correspondent.'}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {#if author.country_focus}
              <span class="px-2 py-1 bg-gray-100 rounded">Country: {author.country_focus}</span>
            {/if}
            {#if author.topic_focus}
              <span class="px-2 py-1 bg-gray-100 rounded">Focus: {author.topic_focus}</span>
            {/if}
            {#if author.specialties && author.specialties.length}
              {#each author.specialties as tag}
                <span class="px-2 py-1 bg-gray-100 rounded">{tag}</span>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Latest articles by {author.name}</h2>

    {#if articles.length === 0}
      <p class="text-gray-600">No articles yet.</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each articles as article}
          <article class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {#if article.featured_image_url}
              <a href={`/article/${article.slug}`}><img src={article.featured_image_url} alt={article.featured_image_alt || article.title} class="w-full h-40 object-cover" /></a>
            {/if}
            <div class="p-4">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{getCountryFlag(article.country)}</span>
                <time datetime={article.published_at}>{new Date(article.published_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</time>
              </div>
              <a href={`/article/${article.slug}`} class="block">
                <h3 class="text-base font-semibold text-gray-900 hover:text-nordic-blue line-clamp-2">{article.title}</h3>
              </a>
              {#if article.summary}
                <p class="text-sm text-gray-700 mt-2 line-clamp-3">{article.summary}</p>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </main>
</section>
