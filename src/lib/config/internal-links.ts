import type { RecommendedLinkGroup } from '$lib/config/recommended-link-group';

export const internalLinkGroups: Readonly<Record<string, RecommendedLinkGroup>> = {
	home: {
		heading: 'Recommended reads',
		links: []
	},
	'country:sweden': {
		heading: 'Recommended Sweden reads',
		links: []
	},
	'country:norway': {
		heading: 'Recommended Norway reads',
		links: []
	},
	'country:denmark': {
		heading: 'Recommended Denmark reads',
		links: []
	},
	'country:finland': {
		heading: 'Recommended Finland reads',
		links: []
	},
	'country:iceland': {
		heading: 'Recommended Iceland reads',
		links: []
	},
	'category:tech': {
		heading: 'Recommended Tech reads',
		links: []
	},
	'category:business': {
		heading: 'Recommended Business reads',
		links: []
	},
	'category:politics': {
		heading: 'Recommended Politics reads',
		links: []
	},
	'category:society': {
		heading: 'Recommended Society reads',
		links: []
	},
	'category:guide': {
		heading: 'Recommended Guides',
		links: []
	}
} as const;
