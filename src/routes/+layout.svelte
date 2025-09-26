<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { children } = $props();
</script>

<SEOHead />

<div class="min-h-screen flex flex-col bg-off-white">
	<Header />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>
