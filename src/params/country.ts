import type { ParamMatcher } from '@sveltejs/kit';

const COUNTRIES = ['sweden', 'norway', 'denmark', 'finland', 'iceland'];

export const match: ParamMatcher = (param) => {
	return COUNTRIES.includes(param.toLowerCase());
};
