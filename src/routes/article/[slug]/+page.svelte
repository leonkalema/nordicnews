<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { articlePageUtils } from '$lib/utils/article-page';
	import ArticleMetaHead from '$lib/components/article/ArticleMetaHead.svelte';
	import ArticleHeader from '$lib/components/article/ArticleHeader.svelte';
	import ArticleBody from '$lib/components/article/ArticleBody.svelte';
	import ArticleSidebar from '$lib/components/article/ArticleSidebar.svelte';
	import OpinionAuthorBox from '$lib/components/article/OpinionAuthorBox.svelte';
	import ArticleContentStyles from '$lib/components/article/ArticleContentStyles.svelte';
	import AnswerBlock from '$lib/components/article/AnswerBlock.svelte';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import ReadingProgress from '$lib/components/ReadingProgress.svelte';

	const { data }: { data: PageData } = $props();
	const article = $derived(data.article);
	const contributor = $derived(data.contributor);
	const relatedArticles = $derived(data.relatedArticles);
	const structuredData = $derived(data.structuredData);
	const ogLocale = $derived(articlePageUtils.ogLocaleFor(article?.country, article?.country_name));
	const displayViewCount = $derived((Number(article.view_count ?? 0) > 1 ? Number(article.view_count ?? 0) * 41 : Number(article.view_count ?? 0)));
	const answerSummary = $derived(article.summary || '');
	const answerBullets = $derived([
		article.country_name ? `Location: ${article.country_name}` : null,
		article.category_display ? `Category: ${article.category_display}` : null,
		article.relative_time ? `Published: ${article.relative_time}` : null
	].filter((value): value is string => Boolean(value)));

	let adsPushed = false;
	
	const initAds = (): void => {
		if (adsPushed) return;
		
		const w = window as unknown as { adsbygoogle?: unknown[] };
		if (!w.adsbygoogle) return;
		
		const adSlots = document.querySelectorAll('.adsbygoogle:not([data-ad-status])');
		if (adSlots.length === 0) return;
		
		adSlots.forEach((slot) => {
			const el = slot as HTMLElement;
			// Skip if not visible (width=0 causes errors)
			if (el.offsetWidth === 0) return;
			
			try {
				w.adsbygoogle?.push({});
			} catch {
				// Silently ignore - ad already loaded or other issue
			}
		});
		
		adsPushed = true;
	};

	onMount(() => {
		// Wait for DOM to be fully rendered with visible widths
		setTimeout(initAds, 500);
		
		// Also try when adsense loads
		const handleAdsenseLoaded = (): void => {
			window.removeEventListener('adsense-loaded', handleAdsenseLoaded);
			setTimeout(initAds, 100);
		};
		window.addEventListener('adsense-loaded', handleAdsenseLoaded);
	});
</script>

<ArticleMetaHead
	slug={article.slug}
	title={article.title}
	excerpt={article.excerpt}
	featuredImageUrl={article.featured_image_url}
	featuredImageCaption={article.featured_image_caption}
	meta={data.meta}
	ogLocale={ogLocale}
	structuredData={structuredData}
/>

<ReadingProgress />

<article class="min-h-screen bg-off-white">
	<ArticleHeader
		title={article.title}
		slug={article.slug}
		country={article.country}
		countryName={article.country_name}
		categoryDisplay={article.category_display}
		publishedAt={article.published_at}
		relativeTime={article.relative_time}
		viewCount={displayViewCount}
		authorName={article.author_name || null}
		authorSlug={article.author_slug || null}
		summary={article.summary || null}
		excerpt={article.excerpt}
		showIntro={!article.summary}
	/>

	<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
			<div class="lg:col-span-3">
				{#if article.summary}
					<div class="mb-8">
						<AnswerBlock summary={answerSummary} bullets={answerBullets.slice(0, 5)} />
					</div>
				{/if}
				<ArticleBody
					category={article.category}
					content={article.content}
					featuredImageUrl={article.featured_image_url}
					featuredImageAlt={article.featured_image_alt || null}
					featuredImageCaption={article.featured_image_caption}
				/>

				{#if contributor}
					<OpinionAuthorBox contributor={contributor} />
				{/if}

				<!-- Mobile-only ad (sidebar ad is hidden on mobile) -->
				<div class="lg:hidden my-8">
					<p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Advertisement</p>
					<ins
						class="adsbygoogle"
						style="display:block"
						data-ad-client="ca-pub-7608249203271599"
						data-ad-slot="6255665066"
						data-ad-format="auto"
						data-full-width-responsive="true"></ins>
				</div>

				<footer class="mt-12 pt-8 border-t border-gray-200">
					<div class="flex flex-wrap items-center justify-between gap-4">
						<div class="text-sm text-gray-600">
							<p>Published: {articlePageUtils.formatDate(article.published_at)}</p>
							{#if article.keywords && article.keywords.length > 0}
								<div class="mt-2">
									<span class="font-medium">Tags:</span>
									{#each article.keywords as keyword}
										<span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2 mt-1">{keyword}</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<div class="mt-8">
						<NewsletterSignup />
					</div>
				</footer>
			</div>

			<ArticleSidebar
				articleCategoryDisplay={article.category_display}
				articleCountryName={article.country_name}
				relatedArticles={relatedArticles}
			/>
		</div>
	</main>
</article>

<ArticleContentStyles />
