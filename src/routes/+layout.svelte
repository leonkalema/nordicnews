<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import PwaInstallPrompt from '$lib/components/PwaInstallPrompt.svelte';
	import { serializeJsonLd } from '$lib/utils/json-ld';
	import { registerServiceWorker } from '$lib/pwa/service-worker-register';

	let { children } = $props();

	onMount(() => {
		registerServiceWorker();
	});
</script>

<SEOHead baseOnly={true} />

<svelte:head>
  {@html `<script type="application/ld+json">${serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://nordicstoday.com/#org",
    "name": "Nordics Today",
    "url": "https://nordicstoday.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nordicstoday.com/logo.png"
    },
    "sameAs": [
      "https://twitter.com/nordicstoday"
    ]
  })}</script>`}
</svelte:head>

<div class="min-h-screen flex flex-col bg-off-white">
	<Header />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
	<CookieBanner />
	<PwaInstallPrompt />
</div>
