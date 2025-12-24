<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface AdConfig {
		slot: string;
		format: 'horizontal' | 'rectangle' | 'vertical';
		responsive?: boolean;
	}

	const { slot, format = 'horizontal', responsive = true }: AdConfig = $props();

	const ADSENSE_CLIENT = 'ca-pub-7608249203271599';

	const formatStyles: Record<string, string> = {
		horizontal: 'min-height: 90px; max-height: 90px;',
		rectangle: 'min-height: 250px; max-height: 280px;',
		vertical: 'min-height: 600px;'
	};

	let adLoaded = $state(false);
	let hasConsent = $state(false);

	onMount(() => {
		if (browser) {
			const consent = localStorage.getItem('cookie-consent');
			hasConsent = consent === 'accepted';

			if (hasConsent && window.adsbygoogle) {
				try {
					(window.adsbygoogle = window.adsbygoogle || []).push({});
					adLoaded = true;
				} catch (e) {
					console.warn('AdSense push failed:', e);
				}
			}
		}
	});
</script>

{#if hasConsent}
	<div class="ad-container my-6" style={formatStyles[format]}>
		<ins
			class="adsbygoogle"
			style="display:block; {formatStyles[format]}"
			data-ad-client={ADSENSE_CLIENT}
			data-ad-slot={slot}
			data-ad-format={responsive ? 'auto' : format}
			data-full-width-responsive={responsive ? 'true' : 'false'}
		></ins>
		{#if !adLoaded}
			<div class="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-sm">
				Advertisement
			</div>
		{/if}
	</div>
{/if}

<style>
	.ad-container {
		width: 100%;
		overflow: hidden;
		background-color: #f9fafb;
		border-radius: 4px;
	}
</style>
