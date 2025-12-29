<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Smartphone, Share, PlusSquare, MoreVertical, Download, CheckCircle, ArrowRight } from 'lucide-svelte';

	let isIos = $state(false);
	let isAndroid = $state(false);
	let isChrome = $state(false);
	let isSafari = $state(false);
	let isStandalone = $state(false);

	onMount(() => {
		if (!browser) return;

		const ua = navigator.userAgent;
		isIos = /iPad|iPhone|iPod/.test(ua);
		isAndroid = /Android/.test(ua);
		isChrome = /Chrome/.test(ua) && !/Edge/.test(ua);
		isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
		isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
			(window.navigator as Navigator & { standalone?: boolean }).standalone === true;
	});
</script>

<svelte:head>
	<title>Install Nordics Today App | Quick Access to Nordic News</title>
	<meta name="description" content="Install Nordics Today on your device for instant access, offline reading, and breaking news notifications from Sweden, Norway, Denmark, Finland, and Iceland." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
	<div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="text-center">
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
				<Smartphone size={40} class="text-white" />
			</div>
			<h1 class="mt-6 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
				Install Nordics Today
			</h1>
			<p class="mt-4 text-lg text-gray-600">
				Get the app experience without the app store. Quick access, offline reading, and news alerts.
			</p>
		</div>

		{#if isStandalone}
			<div class="mt-10 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
				<CheckCircle size={48} class="mx-auto text-green-600" />
				<h2 class="mt-4 text-xl font-semibold text-green-800">Already Installed!</h2>
				<p class="mt-2 text-green-700">
					You're using Nordics Today as an app. Enjoy the full experience!
				</p>
				<a
					href="/"
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
				>
					Go to Home
					<ArrowRight size={18} />
				</a>
			</div>
		{:else}
			<div class="mt-10 space-y-8">
				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="flex items-center gap-2 text-xl font-semibold text-gray-900">
						<span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">✓</span>
						Why Install?
					</h2>
					<ul class="mt-4 space-y-3">
						<li class="flex items-start gap-3">
							<CheckCircle size={20} class="mt-0.5 shrink-0 text-green-500" />
							<span class="text-gray-700"><strong>Instant Access</strong> — Launch from your home screen in one tap</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckCircle size={20} class="mt-0.5 shrink-0 text-green-500" />
							<span class="text-gray-700"><strong>Offline Reading</strong> — Read cached articles without internet</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckCircle size={20} class="mt-0.5 shrink-0 text-green-500" />
							<span class="text-gray-700"><strong>Breaking News</strong> — Get notified about important Nordic news</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckCircle size={20} class="mt-0.5 shrink-0 text-green-500" />
							<span class="text-gray-700"><strong>Full Screen</strong> — No browser bars, just content</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckCircle size={20} class="mt-0.5 shrink-0 text-green-500" />
							<span class="text-gray-700"><strong>No App Store</strong> — No download size, no updates to manage</span>
						</li>
					</ul>
				</div>

				{#if isIos && isSafari}
					<div class="rounded-xl border border-blue-200 bg-blue-50 p-6">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-blue-900">
							<span class="text-2xl">🍎</span>
							Install on iPhone/iPad (Safari)
						</h2>
						<ol class="mt-4 space-y-4">
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</span>
								<div>
									<p class="font-medium text-gray-900">Tap the Share button</p>
									<p class="mt-1 text-sm text-gray-600">Look for the <Share size={16} class="inline" /> icon at the bottom of Safari</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</span>
								<div>
									<p class="font-medium text-gray-900">Scroll down and tap "Add to Home Screen"</p>
									<p class="mt-1 text-sm text-gray-600">Look for the <PlusSquare size={16} class="inline" /> icon in the share menu</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">3</span>
								<div>
									<p class="font-medium text-gray-900">Tap "Add" in the top right</p>
									<p class="mt-1 text-sm text-gray-600">The app icon will appear on your home screen</p>
								</div>
							</li>
						</ol>
					</div>
				{:else if isIos}
					<div class="rounded-xl border border-orange-200 bg-orange-50 p-6">
						<h2 class="text-xl font-semibold text-orange-900">Open in Safari</h2>
						<p class="mt-2 text-orange-800">
							To install on iPhone/iPad, please open this page in Safari. Copy this URL and paste it in Safari:
						</p>
						<code class="mt-3 block rounded bg-white p-3 text-sm text-gray-800">
							https://nordicstoday.com/install
						</code>
					</div>
				{:else if isAndroid && isChrome}
					<div class="rounded-xl border border-green-200 bg-green-50 p-6">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-green-900">
							<span class="text-2xl">🤖</span>
							Install on Android (Chrome)
						</h2>
						<ol class="mt-4 space-y-4">
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">1</span>
								<div>
									<p class="font-medium text-gray-900">Tap the menu button</p>
									<p class="mt-1 text-sm text-gray-600">Look for <MoreVertical size={16} class="inline" /> (three dots) in the top right of Chrome</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">2</span>
								<div>
									<p class="font-medium text-gray-900">Tap "Install app" or "Add to Home screen"</p>
									<p class="mt-1 text-sm text-gray-600">You may see a banner at the bottom instead</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">3</span>
								<div>
									<p class="font-medium text-gray-900">Confirm the installation</p>
									<p class="mt-1 text-sm text-gray-600">Tap "Install" in the popup dialog</p>
								</div>
							</li>
						</ol>
					</div>
				{:else}
					<div class="rounded-xl border border-purple-200 bg-purple-50 p-6">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-purple-900">
							<span class="text-2xl">💻</span>
							Install on Desktop
						</h2>
						<ol class="mt-4 space-y-4">
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">1</span>
								<div>
									<p class="font-medium text-gray-900">Look for the install icon in your browser</p>
									<p class="mt-1 text-sm text-gray-600">In Chrome/Edge, look for <Download size={16} class="inline" /> in the address bar</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">2</span>
								<div>
									<p class="font-medium text-gray-900">Click "Install"</p>
									<p class="mt-1 text-sm text-gray-600">Confirm the installation in the popup</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">3</span>
								<div>
									<p class="font-medium text-gray-900">Launch from your desktop or start menu</p>
									<p class="mt-1 text-sm text-gray-600">The app opens in its own window</p>
								</div>
							</li>
						</ol>
					</div>
				{/if}

				<div class="text-center">
					<a
						href="/"
						class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
					>
						<ArrowRight size={18} />
						Continue to Nordics Today
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
