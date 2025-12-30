<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { CheckCircle, AlertCircle, Mail } from 'lucide-svelte';

	let status = $state<'loading' | 'success' | 'error' | 'idle'>('idle');
	let message = $state('');
	let email = $state('');

	onMount(() => {
		const urlEmail = $page.url.searchParams.get('email');
		if (urlEmail) {
			email = urlEmail;
			handleUnsubscribe(urlEmail);
		}
	});

	const handleUnsubscribe = async (emailToUnsubscribe: string): Promise<void> => {
		status = 'loading';

		try {
			const response = await fetch('/api/newsletter/unsubscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: emailToUnsubscribe })
			});

			const data = await response.json();

			if (response.ok) {
				status = 'success';
				message = 'You have been successfully unsubscribed from our newsletter.';
			} else {
				status = 'error';
				message = data.error || 'Something went wrong. Please try again.';
			}
		} catch {
			status = 'error';
			message = 'Network error. Please try again.';
		}
	};

	const handleSubmit = (e: Event): void => {
		e.preventDefault();
		if (email) {
			handleUnsubscribe(email);
		}
	};
</script>

<svelte:head>
	<title>Unsubscribe | Nordics Today</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
		<div class="text-center mb-6">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
				<Mail size={32} class="text-gray-600" />
			</div>
			<h1 class="text-2xl font-serif font-bold text-gray-900">Unsubscribe</h1>
		</div>

		{#if status === 'loading'}
			<div class="text-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="mt-4 text-gray-600">Processing...</p>
			</div>
		{:else if status === 'success'}
			<div class="text-center py-4">
				<CheckCircle size={48} class="mx-auto text-green-500 mb-4" />
				<p class="text-gray-700">{message}</p>
				<p class="mt-4 text-sm text-gray-500">We're sorry to see you go.</p>
				<a href="/" class="mt-6 inline-block text-blue-600 hover:text-blue-800">
					← Back to Nordics Today
				</a>
			</div>
		{:else if status === 'error'}
			<div class="text-center py-4">
				<AlertCircle size={48} class="mx-auto text-red-500 mb-4" />
				<p class="text-gray-700">{message}</p>
				<button
					onclick={() => { status = 'idle'; }}
					class="mt-4 text-blue-600 hover:text-blue-800"
				>
					Try again
				</button>
			</div>
		{:else}
			<p class="text-gray-600 text-center mb-6">
				Enter your email address to unsubscribe from our newsletter.
			</p>
			<form onsubmit={handleSubmit} class="space-y-4">
				<input
					type="email"
					bind:value={email}
					placeholder="your@email.com"
					required
					class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				<button
					type="submit"
					class="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800"
				>
					Unsubscribe
				</button>
			</form>
			<p class="mt-6 text-center text-sm text-gray-500">
				Changed your mind? <a href="/" class="text-blue-600 hover:text-blue-800">Go back home</a>
			</p>
		{/if}
	</div>
</div>
