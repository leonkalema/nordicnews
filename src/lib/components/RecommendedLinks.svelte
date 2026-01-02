<script lang="ts">
	import type { RecommendedLink } from '$lib/config/recommended-link';

	type RecommendedLinksProps = {
		readonly heading: string;
		readonly links: readonly RecommendedLink[];
		readonly maxLinks?: number;
	};

	const { heading, links, maxLinks = 5 }: RecommendedLinksProps = $props();
	const visibleLinks = $derived(links.slice(0, maxLinks));
</script>

{#if visibleLinks.length > 0}
	<section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
		<h2 class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">{heading}</h2>
		<div class="space-y-3">
			{#each visibleLinks as link}
				<a href={link.href} class="block group">
					<span class="font-serif text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{link.title}</span>
					<span class="text-xs text-gray-400">{link.href}</span>
				</a>
			{/each}
		</div>
	</section>
{/if}
