<script lang="ts">
	import { marked } from 'marked';
	import GuideCtaBox from '$lib/components/article/GuideCtaBox.svelte';
	import { articlePageUtils } from '$lib/utils/article-page';

	type ArticleBodyProps = {
		readonly category: string;
		readonly content: string | null;
		readonly featuredImageUrl: string | null;
		readonly featuredImageAlt: string | null;
		readonly featuredImageCaption: string | null;
	};

	const {
		category,
		content,
		featuredImageUrl,
		featuredImageAlt,
		featuredImageCaption
	}: ArticleBodyProps = $props();

	marked.setOptions({ breaks: true, gfm: true });

	const isGuideLike = $derived(category === 'guide' || category === 'comparison');
	const htmlContent = $derived(content ? (marked.parse(content) as string) : '');
	const contentParts = $derived(htmlContent ? articlePageUtils.splitContentForAd(htmlContent) : { before: '', after: '' });

	const getPrimaryCta = (): { href: string; label: string; secondaryHref?: string; secondaryLabel?: string } => {
		const lower = (content || '').toLowerCase();
		if (lower.includes('wise')) {
			return {
				href: 'https://wise.com/',
				label: 'Check fees on Wise',
				secondaryHref: 'https://revolut.com/',
				secondaryLabel: 'Compare Revolut'
			};
		}
		return {
			href: 'https://wise.com/',
			label: 'Compare money transfer fees'
		};
	};

	const cta = $derived(getPrimaryCta());
</script>

<div class="lg:col-span-3">
	{#if featuredImageUrl}
		<div class="mb-8">
			<img
				src={featuredImageUrl}
				alt={featuredImageAlt || ''}
				class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
				decoding="async"
				loading="eager"
				fetchpriority="high"
			/>
			{#if featuredImageCaption}
				<p class="text-sm text-gray-600 mt-2 italic">{featuredImageCaption}</p>
			{/if}
		</div>
	{/if}

	<div class="prose prose-lg max-w-none article-content">
		{#if htmlContent}
			{@html contentParts.before}

			{#if isGuideLike}
				<GuideCtaBox
					title="Best next step"
					description="Use a trusted tool mentioned in this guide." 
					primaryHref={cta.href}
					primaryLabel={cta.label}
					secondaryHref={cta.secondaryHref}
					secondaryLabel={cta.secondaryLabel}
				/>
			{/if}

			{#if contentParts.after}
				<div class="my-8 not-prose">
					<ins
						class="adsbygoogle"
						style="display:block; text-align:center;"
						data-ad-layout="in-article"
						data-ad-format="fluid"
						data-ad-client="ca-pub-7608249203271599"
						data-ad-slot="9168219982"></ins>
				</div>
			{/if}

			{@html contentParts.after}
		{:else}
			<p class="text-gray-600 italic">Article content is being processed...</p>
		{/if}
	</div>
</div>
