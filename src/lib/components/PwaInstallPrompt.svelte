<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { X, Download, Smartphone } from 'lucide-svelte';

	let showPrompt = $state(false);
	let deferredPrompt: BeforeInstallPromptEvent | null = $state(null);
	let isIos = $state(false);
	let isStandalone = $state(false);

	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[];
		readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
		prompt(): Promise<void>;
	}

	onMount(() => {
		if (!browser) return;

		isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
			(window.navigator as Navigator & { standalone?: boolean }).standalone === true;

		if (isStandalone) return;

		isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

		const dismissed = localStorage.getItem('pwa-prompt-dismissed');
		const dismissedAt = dismissed ? new Date(dismissed) : null;
		const daysSinceDismissed = dismissedAt
			? (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24)
			: Infinity;

		if (daysSinceDismissed < 7) return;

		if (isIos) {
			setTimeout(() => {
				showPrompt = true;
			}, 3000);
			return;
		}

		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
			setTimeout(() => {
				showPrompt = true;
			}, 3000);
		});
	});

	const handleInstall = async (): Promise<void> => {
		if (isIos) {
			window.location.href = '/install';
			return;
		}

		if (!deferredPrompt) return;

		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			trackEvent('pwa_installed');
		}

		deferredPrompt = null;
		showPrompt = false;
	};

	const handleDismiss = (): void => {
		localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
		showPrompt = false;
	};

	const trackEvent = (eventName: string): void => {
		const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
		if (gtag) {
			gtag('event', eventName, { event_category: 'pwa' });
		}
	};
</script>

{#if showPrompt}
	<div
		class="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:left-auto sm:right-4 sm:w-80"
		role="dialog"
		aria-labelledby="pwa-prompt-title"
	>
		<button
			onclick={handleDismiss}
			class="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
			aria-label="Dismiss"
		>
			<X size={18} />
		</button>

		<div class="flex items-start gap-3">
			<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
				<Smartphone size={24} />
			</div>
			<div class="flex-1">
				<h3 id="pwa-prompt-title" class="font-semibold text-gray-900">
					Install Nordics Today
				</h3>
				<p class="mt-1 text-sm text-gray-600">
					{#if isIos}
						Add to your home screen for quick access and offline reading.
					{:else}
						Get instant access, offline reading, and breaking news alerts.
					{/if}
				</p>
			</div>
		</div>

		<div class="mt-4 flex gap-2">
			<button
				onclick={handleDismiss}
				class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Not now
			</button>
			<button
				onclick={handleInstall}
				class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				<Download size={16} />
				{isIos ? 'How to install' : 'Install'}
			</button>
		</div>
	</div>
{/if}
