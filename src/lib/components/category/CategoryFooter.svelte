<script lang="ts">
	import CategoryBrowseSection from '$lib/components/category/CategoryBrowseSection.svelte';
	import RecommendedLinks from '$lib/components/RecommendedLinks.svelte';
	import type { RecommendedLink } from '$lib/config/recommended-link';

	type CategoryFooterProps = {
		readonly isOpinion: boolean;
		readonly recommendedLinks: readonly RecommendedLink[];
	};

	const { isOpinion, recommendedLinks }: CategoryFooterProps = $props();
</script>

{#if recommendedLinks.length > 0}
	<div class="mt-16">
		<RecommendedLinks heading="Recommended reads" links={recommendedLinks} maxLinks={5} />
	</div>
{/if}

<CategoryBrowseSection isOpinion={isOpinion} />
