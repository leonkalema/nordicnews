<script lang="ts">
	type SourceAttributionProps = {
		readonly sourceName: string | null;
		readonly originalUrl: string | null;
	};

	const { sourceName, originalUrl }: SourceAttributionProps = $props();

	const isExternalSource = $derived(
		originalUrl && 
		!originalUrl.includes('nordicstoday.com') && 
		originalUrl.startsWith('http')
	);

	const displaySourceName = $derived(sourceName || 'Original Source');
</script>

{#if isExternalSource}
	<div class="source-attribution bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
		<div class="flex items-center gap-2 text-sm text-gray-600">
			<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
			</svg>
			<span class="font-medium">Source:</span>
			<a 
				href={originalUrl} 
				target="_blank" 
				rel="noopener noreferrer"
				class="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-md"
			>
				{displaySourceName}
			</a>
			<svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</div>
		<p class="text-xs text-gray-500 mt-2">
			This article is based on reporting from {displaySourceName}. Click to view the original.
		</p>
	</div>
{/if}
