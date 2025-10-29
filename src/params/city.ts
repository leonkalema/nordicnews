import type { ParamMatcher } from '@sveltejs/kit';

const CITIES = ['stockholm', 'gothenburg', 'malmo', 'oslo', 'copenhagen', 'helsinki', 'reykjavik'];

export const match: ParamMatcher = (param) => {
	return CITIES.includes(param.toLowerCase());
};
