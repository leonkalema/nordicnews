type SeoTitleInput = {
	readonly title: string;
	readonly countryName?: string | null;
	readonly publishedAt?: string | null;
};

const MONTHS: readonly string[] = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
] as const;

const toShortDate = (publishedAt?: string | null): string | null => {
	if (!publishedAt) return null;
	const date = new Date(publishedAt);
	if (Number.isNaN(date.getTime())) return null;
	const month = MONTHS[date.getUTCMonth()] || null;
	if (!month) return null;
	return `${month} ${date.getUTCDate()}`;
};

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const removeLeadingCountryPossessive = (leftSide: string): string => {
	const match = leftSide.match(/^(?<country>[^:]+?)['’]s\s+(?<rest>.+)$/i);
	if (!match?.groups?.rest) return leftSide;
	return match.groups.rest;
};

const clamp = (value: string, maxLength: number): string => {
	if (value.length <= maxLength) return value;
	const slice = value.slice(0, maxLength);
	const lastBreak = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('—'), slice.lastIndexOf('-'));
	if (lastBreak < 30) return slice.trim();
	return slice.slice(0, lastBreak).trim();
};

export const buildSeoTitle = (input: SeoTitleInput): string => {
	const rawTitle = normalizeWhitespace(input.title);
	const hasColon = rawTitle.includes(':');
	const date = toShortDate(input.publishedAt);
	let base = rawTitle;
	if (hasColon) {
		const [left, right] = rawTitle.split(/:(.+)/).map(s => normalizeWhitespace(s));
		const leftClean = removeLeadingCountryPossessive(left);
		base = normalizeWhitespace(`${leftClean} ${right}`);
	}
	if (input.countryName && base.toLowerCase().startsWith(input.countryName.toLowerCase())) {
		base = normalizeWhitespace(base.slice(input.countryName.length));
	}
	const withDate = date ? `${base} (${date})` : base;
	const withBrand = `${withDate} | Nordics Today`;
	return clamp(withBrand, 60);
};
