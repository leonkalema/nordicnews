<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import SEOHead from '$lib/components/SEOHead.svelte';
  
  $: status = $page.status;
  $: message = $page.error?.message || 'An unexpected error occurred';
  
  let errorTitle = '';
  let errorDescription = '';
  let suggestions: string[] = [];
  
  onMount(() => {
    // Log error for monitoring
    console.error('Error page loaded:', { status, message, url: $page.url.pathname });
    
    // Set error content based on status
    switch (status) {
      case 404:
        errorTitle = 'Article Not Found';
        errorDescription = 'The article you are looking for might have been moved, removed, or is temporarily unavailable.';
        suggestions = [
          'Check the URL for typos',
          'Browse our latest Nordic news',
          'Explore articles by country',
          'Visit our homepage'
        ];
        break;
      case 500:
        errorTitle = 'Server Error';
        errorDescription = 'We are experiencing technical difficulties. Our team has been notified and is working to resolve this issue.';
        suggestions = [
          'Try refreshing the page',
          'Come back in a few minutes',
          'Contact support if the problem persists'
        ];
        break;
      case 503:
        errorTitle = 'Service Temporarily Unavailable';
        errorDescription = 'Our news service is temporarily down for maintenance. Please try again shortly.';
        suggestions = [
          'Try again in a few minutes',
          'Check our social media for updates'
        ];
        break;
      default:
        errorTitle = `Error ${status}`;
        errorDescription = 'Something went wrong while loading the page. Please try again or contact support if the problem persists.';
        suggestions = [
          'Try refreshing the page',
          'Go back to the previous page',
          'Visit our homepage'
        ];
    }
  });
</script>

<SEOHead 
  title="{errorTitle} - Nordics Today"
  description="{errorDescription}"
  type="website"
/>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto">
    <div class="text-center">
      <div class="mx-auto h-24 w-24 text-blue-600 mb-6">
        {#if status === 404}
          <!-- 404 Icon -->
          <svg class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/>
          </svg>
        {:else}
          <!-- Server Error Icon -->
          <svg class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        {/if}
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{errorTitle}</h1>
      <p class="text-lg text-gray-600 mb-8">{errorDescription}</p>
    </div>
  </div>

  <div class="max-w-lg mx-auto">
    <div class="bg-white py-8 px-6 shadow rounded-lg">
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">What you can do:</h2>
          <ul class="space-y-2">
            {#each suggestions as suggestion}
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">{suggestion}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <a href="/" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors">
            Go to Homepage
          </a>
          <a href="/sweden" class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-center hover:bg-gray-300 transition-colors">
            Browse Sweden News
          </a>
        </div>

        {#if status === 404}
          <div class="mt-6">
            <h3 class="text-md font-medium text-gray-900 mb-3">Browse by Country:</h3>
            <div class="grid grid-cols-2 gap-2 text-sm mb-4">
              <a href="/sweden" class="text-blue-600 hover:text-blue-800">🇸🇪 Sweden</a>
              <a href="/norway" class="text-blue-600 hover:text-blue-800">🇳🇴 Norway</a>
              <a href="/denmark" class="text-blue-600 hover:text-blue-800">🇩🇰 Denmark</a>
              <a href="/finland" class="text-blue-600 hover:text-blue-800">🇫🇮 Finland</a>
              <a href="/iceland" class="text-blue-600 hover:text-blue-800">🇮🇸 Iceland</a>
            </div>
            
            <h3 class="text-md font-medium text-gray-900 mb-3">Browse by Category:</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <a href="/category/breaking" class="text-blue-600 hover:text-blue-800">📰 Breaking News</a>
              <a href="/category/politics" class="text-blue-600 hover:text-blue-800">🏛️ Politics</a>
              <a href="/category/business" class="text-blue-600 hover:text-blue-800">💼 Business</a>
              <a href="/category/tech" class="text-blue-600 hover:text-blue-800">💻 Technology</a>
              <a href="/category/culture" class="text-blue-600 hover:text-blue-800">🎨 Culture</a>
              <a href="/category/society" class="text-blue-600 hover:text-blue-800">👥 Society</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Search Box for 404 pages -->
  {#if status === 404}
    <div class="max-w-lg mx-auto mt-8">
      <div class="bg-white py-6 px-6 shadow rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Search Nordic News:</h3>
        <form action="/search" method="get" class="flex gap-2">
          <input 
            type="text" 
            name="q" 
            placeholder="Search news, topics, or countries..." 
            class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <button 
            type="submit" 
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  {/if}
</div>
