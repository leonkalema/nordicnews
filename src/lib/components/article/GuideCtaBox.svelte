<script lang="ts">
	import { ExternalLink, ArrowRight } from 'lucide-svelte';

	type GuideCtaBoxProps = {
		readonly title?: string;
		readonly description?: string;
		readonly primaryHref: string;
		readonly primaryLabel: string;
		readonly secondaryHref?: string;
		readonly secondaryLabel?: string;
	};

	const {
		title = 'Recommended tools',
		description = 'Compare fees and get set up faster.',
		primaryHref,
		primaryLabel,
		secondaryHref = undefined,
		secondaryLabel = undefined
	}: GuideCtaBoxProps = $props();

	const trackClick = (label: string): void => {
		const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
		if (!gtag) return;
		gtag('event', 'affiliate_click', { event_category: 'guides', event_label: label });
	};
</script>

<div class="not-prose my-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-gray-400">Tools</p>
			<h3 class="mt-2 font-serif text-lg font-semibold text-gray-900">{title}</h3>
			<p class="mt-1 text-sm text-gray-600">{description}</p>
		</div>
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
			<ExternalLink size={18} />
		</div>
	</div>
	<div class="mt-4 grid gap-2 sm:grid-cols-2">
		<a
			href={primaryHref}
			target="_blank"
			rel="noopener noreferrer"
			onclick={() => trackClick(primaryLabel)}
			class="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
		>
			{primaryLabel}
			<ArrowRight size={16} />
		</a>
		{#if secondaryHref && secondaryLabel}
			<a
				href={secondaryHref}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackClick(secondaryLabel)}
				class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
			>
				{secondaryLabel}
				<ArrowRight size={16} />
			</a>
		{/if}
	</div>
	<p class="mt-3 text-xs text-gray-400">
		Links may be monetized via affiliate partners.
	</p>
</div>
