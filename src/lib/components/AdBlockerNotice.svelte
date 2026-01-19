<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let adBlockDetected = $state(false);
	let dismissed = $state(false);

	const detectAdBlocker = async (): Promise<boolean> => {
		if (!browser) return false;
		
		// Check if user already dismissed
		if (sessionStorage.getItem('adblock-notice-dismissed')) return false;
		
		try {
			// Method 1: Check if adsbygoogle loaded
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			const w = window as unknown as { adsbygoogle?: unknown[] };
			if (!w.adsbygoogle) return true;
			
			// Method 2: Create a bait element
			const bait = document.createElement('div');
			bait.className = 'adsbox ad-banner ad-placeholder';
			bait.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
			document.body.appendChild(bait);
			
			await new Promise(resolve => setTimeout(resolve, 100));
			const blocked = bait.offsetHeight === 0 || bait.clientHeight === 0;
			bait.remove();
			
			return blocked;
		} catch {
			return false;
		}
	};

	const dismiss = (): void => {
		dismissed = true;
		if (browser) {
			sessionStorage.setItem('adblock-notice-dismissed', 'true');
		}
	};

	onMount(async () => {
		adBlockDetected = await detectAdBlocker();
	});
</script>

{#if adBlockDetected && !dismissed}
	<div class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 text-center">
			<div class="text-6xl mb-4">🚫</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-3">Please Disable Your Ad Blocker</h2>
			<p class="text-gray-600 mb-6 leading-relaxed">
				We rely on advertising to keep Nordics Today <strong>free</strong> for everyone. 
				Please disable your ad blocker to continue reading.
			</p>
			<div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
				<p class="font-semibold text-gray-800 mb-2">How to whitelist us:</p>
				<ol class="text-sm text-gray-600 space-y-1 list-decimal list-inside">
					<li>Click your ad blocker icon in the browser</li>
					<li>Select "Disable on this site" or "Whitelist"</li>
					<li>Refresh the page</li>
				</ol>
			</div>
			<button 
				onclick={() => window.location.reload()}
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
			>
				I've Disabled It — Refresh Page
			</button>
			<p class="text-xs text-gray-400 mt-4">
				Thank you for supporting independent journalism.
			</p>
		</div>
	</div>
{/if}
