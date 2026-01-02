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
	<section class="bg-white border border-gray-200 rounded-xl shadow-sm">
		<div class="px-6 pt-5 pb-2">
			<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest">{heading}</h2>
		</div>
		<div class="px-6 pb-5">
			<div class="divide-y divide-gray-100">
				{#each visibleLinks as link}
					<a href={link.href} class="block py-3 group">
						<span class="font-serif text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{link.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}
