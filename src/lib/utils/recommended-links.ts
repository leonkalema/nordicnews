import type { RecommendedLink } from '$lib/config/recommended-link';

type ArticleWithViews = {
	readonly title?: string | null;
	readonly url_slug?: string | null;
	readonly slug?: string | null;
	readonly view_count?: number | null;
};

type BuildRecommendedLinksInput = {
	readonly articles: readonly ArticleWithViews[];
	readonly maxLinks?: number;
};

const toHref = (article: ArticleWithViews): string | null => {
	if (article.url_slug) return article.url_slug;
	if (article.slug) return `/article/${article.slug}`;
	return null;
};

const toTitle = (article: ArticleWithViews): string | null => {
	const value = (article.title || '').trim();
	return value ? value : null;
};

export const buildRecommendedLinks = (input: BuildRecommendedLinksInput): readonly RecommendedLink[] => {
	const { articles, maxLinks = 5 } = input;
	const sorted = [...articles].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
	const picked: RecommendedLink[] = [];
	for (const article of sorted) {
		if (picked.length >= maxLinks) break;
		const href = toHref(article);
		const title = toTitle(article);
		if (!href || !title) continue;
		picked.push({ href, title });
	}
	return picked;
};
