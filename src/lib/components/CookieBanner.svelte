<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let showBanner = $state(false);
	let isVisible = $state(false);

	const ADSENSE_ID = 'ca-pub-7608249203271599';
	const GA_ID = 'G-1Y6KPNKXEW';

	type GtagFn = (...args: unknown[]) => void;

	const ensureGtag = (): GtagFn => {
		(window as Window & { dataLayer?: unknown[] }).dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer || [];
		const gtag: GtagFn = (...args: unknown[]) => {
			(window as Window & { dataLayer: unknown[] }).dataLayer.push(args);
		};
		(window as Window & { gtag?: GtagFn }).gtag = gtag;
		return gtag;
	};

	const setDefaultConsent = (): void => {
		const gtag = ensureGtag();
		gtag('consent', 'default', {
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
			analytics_storage: 'denied',
			wait_for_update: 500
		});
	};

	const updateConsent = (isGranted: boolean): void => {
		const gtag = ensureGtag();
		gtag('consent', 'update', {
			ad_storage: isGranted ? 'granted' : 'denied',
			ad_user_data: isGranted ? 'granted' : 'denied',
			ad_personalization: isGranted ? 'granted' : 'denied',
			analytics_storage: isGranted ? 'granted' : 'denied'
		});
	};

	function loadAdSense(): void {
		if (document.getElementById('adsense-script')) return;
		const script = document.createElement('script');
		script.id = 'adsense-script';
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
		document.head.appendChild(script);
	}

	function loadGoogleAnalytics(): void {
		if (document.getElementById('gtag-script')) return;
		setDefaultConsent();
		const script = document.createElement('script');
		script.id = 'gtag-script';
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
		document.head.appendChild(script);
		
		script.onload = () => {
			const gtag = ensureGtag();
			gtag('js', new Date());
			gtag('config', GA_ID, {
				anonymize_ip: true
			});
		};
	}

	onMount(() => {
		if (browser) {
			const consent = localStorage.getItem('cookie-consent');
			loadGoogleAnalytics();
			if (consent === 'accepted') {
				updateConsent(true);
				loadAdSense();
			} else if (consent === 'declined') {
				updateConsent(false);
			} else if (!consent) {
				showBanner = true;
				setTimeout(() => {
					isVisible = true;
				}, 100);
			}
		}
	});

	function acceptCookies(): void {
		if (browser) {
			localStorage.setItem('cookie-consent', 'accepted');
			localStorage.setItem('cookie-consent-date', new Date().toISOString());
			updateConsent(true);
			loadAdSense();
		}
		isVisible = false;
		setTimeout(() => {
			showBanner = false;
		}, 300);
	}

	function declineCookies(): void {
		if (browser) {
			localStorage.setItem('cookie-consent', 'declined');
			localStorage.setItem('cookie-consent-date', new Date().toISOString());
			updateConsent(false);
		}
		isVisible = false;
		setTimeout(() => {
			showBanner = false;
		}, 300);
	}
</script>

{#if showBanner}
	<div 
		class="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out {isVisible ? 'translate-y-0' : 'translate-y-full'}"
		role="dialog"
		aria-labelledby="cookie-banner-title"
		aria-describedby="cookie-banner-description"
	>
		<div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div class="flex-1">
				<h3 id="cookie-banner-title" class="font-semibold text-lg mb-2">🍪 Cookie Consent</h3>
				<p id="cookie-banner-description" class="text-sm text-gray-300 leading-relaxed">
					We use cookies to enhance your browsing experience, serve personalized ads through Google AdSense, and analyze our traffic. 
					By clicking "Accept All", you consent to our use of cookies. You can manage your preferences in our 
					<a href="/privacy" class="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
				</p>
			</div>
			
			<div class="flex flex-col sm:flex-row gap-2 sm:gap-3 min-w-fit">
				<button 
					onclick={declineCookies}
					class="px-4 py-2 text-sm border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200"
					type="button"
				>
					Decline
				</button>
				<button 
					onclick={acceptCookies}
					class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
					type="button"
				>
					Accept All
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Ensure banner appears above all other content */
	:global(body) {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
