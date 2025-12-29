<script lang="ts">
	import { Linkedin } from 'lucide-svelte';

	type OpinionContributor = {
		readonly name: string;
		readonly title: string;
		readonly institution: string;
		readonly bio: string;
		readonly linkedin_url: string | null;
		readonly website_url: string | null;
		readonly headshot_url: string | null;
	};

	type OpinionAuthorBoxProps = {
		readonly contributor: OpinionContributor;
	};

	const { contributor }: OpinionAuthorBoxProps = $props();
</script>

<div class="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
	<div class="flex items-start gap-4">
		{#if contributor.headshot_url}
			<img
				src={contributor.headshot_url}
				alt={contributor.name}
				class="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
			/>
		{:else}
			<div class="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-2xl font-bold border-2 border-white shadow-md">
				{contributor.name.charAt(0)}
			</div>
		{/if}
		<div class="flex-1">
			<p class="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-1">About the Author</p>
			<h4 class="text-xl font-bold text-gray-900">{contributor.name}</h4>
			<p class="text-sm text-gray-600 mb-2">{contributor.title}, {contributor.institution}</p>
			<p class="text-gray-700 text-sm leading-relaxed mb-4">{contributor.bio}</p>
			<div class="flex items-center gap-3">
				{#if contributor.linkedin_url}
					<a
						href={contributor.linkedin_url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
					>
						<Linkedin class="w-4 h-4" />
						<span>LinkedIn</span>
					</a>
				{/if}
				{#if contributor.website_url}
					<a
						href={contributor.website_url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
						</svg>
						<span>Website</span>
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>
