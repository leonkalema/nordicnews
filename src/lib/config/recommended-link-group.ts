import type { RecommendedLink } from '$lib/config/recommended-link';

export type RecommendedLinkGroup = {
	readonly heading: string;
	readonly links: readonly RecommendedLink[];
};
