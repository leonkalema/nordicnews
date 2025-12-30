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
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';

	const { data }: { data: PageData } = $props();
	const article = $derived(data.article);
	const contributor = $derived(data.contributor);
	const relatedArticles = $derived(data.relatedArticles);
	const structuredData = $derived(data.structuredData);
	const ogLocale = $derived(articlePageUtils.ogLocaleFor(article?.country, article?.country_name));

	const initAdsIfConsented = (): void => {
		try {
			const consent = localStorage.getItem('cookie-consent');
			if (consent !== 'accepted') return;
			const w = window as unknown as { adsbygoogle?: unknown[] };
			const pushAds = (): void => {
				if (!w.adsbygoogle) return;
				const adSlots = document.querySelectorAll('.adsbygoogle');
				adSlots.forEach(() => {
					try {
						w.adsbygoogle?.push({});
					} catch (err) {
						console.warn('Ad push failed:', err);
					}
				});
			};
			if (w.adsbygoogle) {
				pushAds();
			} else {
				const script = document.getElementById('adsense-script') as HTMLScriptElement | null;
				if (script) {
					if (script.dataset.loaded === 'true') {
						setTimeout(pushAds, 100);
					} else {
						script.addEventListener('load', () => {
							script.dataset.loaded = 'true';
							pushAds();
						});
					}
				} else {
					const observer = new MutationObserver(() => {
						const s = document.getElementById('adsense-script');
						if (s) {
							observer.disconnect();
							s.addEventListener('load', pushAds);
						}
					});
					observer.observe(document.head, { childList: true });
					setTimeout(() => observer.disconnect(), 5000);
				}
			}
		} catch (e) {
			console.warn('AdSense init failed:', e);
		}
	};

	onMount(() => {
		initAdsIfConsented();
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

<article class="min-h-screen bg-off-white">
	<ArticleHeader
		title={article.title}
		slug={article.slug}
		country={article.country}
		countryName={article.country_name}
		categoryDisplay={article.category_display}
		publishedAt={article.published_at}
		relativeTime={article.relative_time}
		viewCount={article.view_count}
		authorName={article.author_name || null}
		authorSlug={article.author_slug || null}
		summary={article.summary || null}
		excerpt={article.excerpt}
	/>

	<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
			<div class="lg:col-span-3">
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
