<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Bell, X } from 'lucide-svelte';
	import { VAPID_PUBLIC_KEY } from '$lib/config/vapid';

	let showPrompt = $state(false);
	let isSubscribed = $state(false);
	let isSupported = $state(false);

	onMount(async () => {
		if (!browser) return;
		if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

		isSupported = true;

		if (Notification.permission === 'granted') {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			isSubscribed = !!subscription;
			return;
		}

		if (Notification.permission === 'denied') return;

		const dismissed = localStorage.getItem('notification-prompt-dismissed');
		const dismissedAt = dismissed ? new Date(dismissed) : null;
		const daysSinceDismissed = dismissedAt
			? (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24)
			: Infinity;

		// Don't show again for 60 days after dismissal
		if (daysSinceDismissed < 60) return;

		// Only show to PWA users or after 5+ visits
		const pwaInstalled = window.matchMedia('(display-mode: standalone)').matches;
		const visitCount = parseInt(localStorage.getItem('notification-visit-count') || '0', 10) + 1;
		localStorage.setItem('notification-visit-count', visitCount.toString());

		// PWA users: show after 2 visits, regular users: show after 5 visits
		const threshold = pwaInstalled ? 2 : 5;
		if (visitCount >= threshold) {
			setTimeout(() => {
				showPrompt = true;
			}, 8000);
		}
	});

	const handleSubscribe = async (): Promise<void> => {
		try {
			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				handleDismiss();
				return;
			}

			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
			});

			const response = await fetch('/api/push/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(subscription.toJSON())
			});

			if (response.ok) {
				isSubscribed = true;
				trackEvent('push_subscribed');
			}

			showPrompt = false;
		} catch (err) {
			console.error('Subscription failed:', err);
		}
	};

	const handleDismiss = (): void => {
		localStorage.setItem('notification-prompt-dismissed', new Date().toISOString());
		showPrompt = false;
	};

	const trackEvent = (eventName: string): void => {
		const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
		if (gtag) {
			gtag('event', eventName, { event_category: 'notifications' });
		}
	};

	const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	};
</script>

{#if showPrompt && isSupported && !isSubscribed}
	<div
		class="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-xl sm:left-auto sm:right-4 sm:w-80"
		role="dialog"
		aria-labelledby="notification-prompt-title"
	>
		<button
			onclick={handleDismiss}
			class="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-blue-100 hover:text-gray-600"
			aria-label="Dismiss"
		>
			<X size={18} />
		</button>

		<div class="flex items-start gap-3">
			<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
				<Bell size={24} />
			</div>
			<div class="flex-1">
				<h3 id="notification-prompt-title" class="font-semibold text-gray-900">
					Stay Updated
				</h3>
				<p class="mt-1 text-sm text-gray-600">
					Get notified about breaking Nordic news and important updates.
				</p>
			</div>
		</div>

		<div class="mt-4 flex gap-2">
			<button
				onclick={handleDismiss}
				class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Not now
			</button>
			<button
				onclick={handleSubscribe}
				class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				<Bell size={16} />
				Enable
			</button>
		</div>
	</div>
{/if}
