import { browser } from '$app/environment';

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
	if (!browser) return null;
	if (!('serviceWorker' in navigator)) return null;

	try {
		const registration = await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
			updateViaCache: 'none'
		});

		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;
			if (!newWorker) return;

			newWorker.addEventListener('statechange', () => {
				if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
					console.log('New content available, refresh to update.');
				}
			});
		});

		return registration;
	} catch (error) {
		console.error('Service worker registration failed:', error);
		return null;
	}
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
	if (!browser) return 'denied';
	if (!('Notification' in window)) return 'denied';

	if (Notification.permission === 'granted') return 'granted';
	if (Notification.permission === 'denied') return 'denied';

	return await Notification.requestPermission();
};

export const subscribeToPushNotifications = async (
	registration: ServiceWorkerRegistration,
	vapidPublicKey: string
): Promise<PushSubscription | null> => {
	if (!browser) return null;

	try {
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
		});

		return subscription;
	} catch (error) {
		console.error('Push subscription failed:', error);
		return null;
	}
};

const urlBase64ToUint8Array = (base64String: string): Uint8Array<ArrayBuffer> => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const buffer = new ArrayBuffer(rawData.length);
	const outputArray = new Uint8Array(buffer);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}

	return outputArray;
};
