<script lang="ts">
	type AnswerBlockProps = {
		readonly summary: string;
		readonly bullets: readonly string[];
	};

	const { summary, bullets }: AnswerBlockProps = $props();
</script>

<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
	<h2 class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">In brief</h2>
	<p class="text-gray-800 leading-relaxed">{summary}</p>
	{#if bullets.length > 0}
		<ul class="mt-4 space-y-2 text-sm text-gray-700">
			{#each bullets as bullet}
				<li class="flex gap-2">
					<span class="text-gray-400">-</span>
					<span>{bullet}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
