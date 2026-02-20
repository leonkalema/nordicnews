<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import PwaInstallPrompt from '$lib/components/PwaInstallPrompt.svelte';
	import NotificationPrompt from '$lib/components/NotificationPrompt.svelte';
	import AdBlockerNotice from '$lib/components/AdBlockerNotice.svelte';
	import { serializeJsonLd } from '$lib/utils/json-ld';
	import { registerServiceWorker } from '$lib/pwa/service-worker-register';

	let { children } = $props();

	onMount(() => {
		registerServiceWorker();
	});

	afterNavigate(({ to }) => {
		if (browser && to?.url && typeof window.gtag === 'function' && localStorage.getItem('cookie-consent') === 'accepted') {
			window.gtag('event', 'page_view', {
				page_path: to.url.pathname,
				page_location: to.url.href,
				page_title: document.title
			});
		}
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
	<NotificationPrompt />
	<AdBlockerNotice />
</div>
