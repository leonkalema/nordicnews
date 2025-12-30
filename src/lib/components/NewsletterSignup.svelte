<script lang="ts">
	import { Mail, CheckCircle, AlertCircle } from 'lucide-svelte';

	let email = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let message = $state('');

	const handleSubmit = async (e: Event): Promise<void> => {
		e.preventDefault();
		if (!email || status === 'loading') return;

		status = 'loading';

		try {
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, source: 'article' })
			});

			const data = await response.json();

			if (response.ok) {
				status = 'success';
				message = data.message || 'Successfully subscribed!';
				email = '';
				trackEvent('newsletter_subscribed');
			} else {
				status = 'error';
				message = data.error || 'Something went wrong. Please try again.';
			}
		} catch {
			status = 'error';
			message = 'Network error. Please try again.';
		}
	};

	const trackEvent = (eventName: string): void => {
		const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
		if (gtag) {
			gtag('event', eventName, { event_category: 'newsletter' });
		}
	};
</script>

<div class="rounded-lg border border-arctic-gray bg-off-white p-6">
	<div class="flex items-center gap-3 mb-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-nordic-blue">
			<Mail size={20} class="text-white" />
		</div>
		<h3 class="font-serif text-lg font-bold text-nordic-blue">Nordic News Weekly</h3>
	</div>
	
	<p class="text-sm text-gray-600 mb-4">
		Get the week's top stories from Sweden, Norway, Denmark, Finland & Iceland delivered to your inbox.
	</p>

	{#if status === 'success'}
		<div class="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-green-800">
			<CheckCircle size={20} />
			<span class="text-sm">{message}</span>
		</div>
	{:else if status === 'error'}
		<div class="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 mb-3">
			<AlertCircle size={20} />
			<span class="text-sm">{message}</span>
		</div>
		<form onsubmit={handleSubmit} class="flex flex-col sm:flex-row gap-2">
			<input
				type="email"
				bind:value={email}
				placeholder="your@email.com"
				required
				class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nordic-blue focus:border-nordic-blue"
			/>
			<button
				type="submit"
				disabled={status === 'loading'}
				class="rounded-lg bg-nordic-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-nordic-blue/90 disabled:opacity-50"
			>
				Subscribe
			</button>
		</form>
	{:else}
		<form onsubmit={handleSubmit} class="flex flex-col sm:flex-row gap-2">
			<input
				type="email"
				bind:value={email}
				placeholder="your@email.com"
				required
				class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nordic-blue focus:border-nordic-blue"
			/>
			<button
				type="submit"
				disabled={status === 'loading'}
				class="rounded-lg bg-nordic-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-nordic-blue/90 disabled:opacity-50"
			>
				{status === 'loading' ? '...' : 'Subscribe'}
			</button>
		</form>
	{/if}

	<p class="mt-3 text-xs text-gray-500">
		Free weekly digest. Unsubscribe anytime.
	</p>
</div>
