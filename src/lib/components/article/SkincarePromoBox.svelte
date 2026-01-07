<script lang="ts">
	import { Sparkles, ArrowRight } from 'lucide-svelte';

	const trackClick = (): void => {
		const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
		if (!gtag) return;
		gtag('event', 'affiliate_click', { event_category: 'skincare', event_label: 'dr_brandt' });
	};

	const affiliateUrl = 'http://click.linksynergy.com/fs-bin/click?id=hXzXAZ4D5jE&offerid=991658&type=3&subid=0';
</script>

<aside class="not-prose my-8 rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm">
	<div class="flex items-start gap-4">
		<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
			<Sparkles size={22} />
		</div>
		<div class="flex-1">
			<p class="text-xs font-bold uppercase tracking-widest text-rose-400">Nordic Beauty Pick</p>
			<h3 class="mt-1 font-serif text-lg font-semibold text-gray-900">
				Scandinavian Skincare Secrets
			</h3>
			<p class="mt-2 text-sm leading-relaxed text-gray-600">
				Nordic women swear by science-backed skincare. Dr. Brandt's dermatologist-developed formulas 
				deliver visible results—from pore-refining primers to age-defying serums trusted across Stockholm and Copenhagen.
			</p>
		</div>
	</div>
	
	<div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
		<a
			href={affiliateUrl}
			target="_blank"
			rel="noopener sponsored"
			onclick={() => trackClick()}
			class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold !text-white !no-underline transition-colors hover:bg-rose-700 hover:!no-underline"
		>
			Shop Dr. Brandt Skincare
			<ArrowRight size={16} />
		</a>
		<span class="text-xs text-gray-400">Free shipping on orders over $50</span>
	</div>
	
	<p class="mt-4 text-xs text-gray-400">
		Affiliate link – we may earn a commission at no extra cost to you.
	</p>
</aside>

<!-- Rakuten tracking pixel -->
<img 
	src="http://ad.linksynergy.com/fs-bin/show?id=hXzXAZ4D5jE&bids=991658&type=3&subid=0" 
	alt="" 
	width="1" 
	height="1" 
	class="hidden"
	loading="lazy"
/>
