 type OgLocaleMap = Record<string, string>;

 type SplitContentResult = {
	before: string;
	after: string;
 };

 const ogLocaleFor = (countryCode?: string, countryName?: string): string => {
	const map: OgLocaleMap = {
		SE: 'en_SE',
		NO: 'en_NO',
		DK: 'en_DK',
		FI: 'en_FI',
		IS: 'en_IS'
	};
	const code = (countryCode || '').toUpperCase();
	if (map[code]) return map[code];
	const byName: OgLocaleMap = {
		Sweden: 'en_SE',
		Norway: 'en_NO',
		Denmark: 'en_DK',
		Finland: 'en_FI',
		Iceland: 'en_IS'
	};
	return byName[countryName || ''] || 'en_US';
 };

 const formatDate = (dateString: string | null): string => {
	if (!dateString) return 'No date';
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
 };

 const separateReadMoreLinks = (html: string): string => {
	const readMorePattern = /\s*(Read more:\s*<a[^>]*>.*?<\/a>\.?)/gi;
	const matches = html.match(readMorePattern);
	if (!matches || matches.length === 0) return html;
	let cleaned: string = html;
	for (const match of matches) {
		cleaned = cleaned.replace(match, '');
	}
	const linksHtml: string = matches
		.map((m) => `<p class="read-more-link">${m.trim()}</p>`)
		.join('\n');
	return `${cleaned}\n<hr />\n${linksHtml}`;
 };

 const splitContentForAd = (html: string): SplitContentResult => {
	const blockRegex = /<(p|h[1-6]|ul|ol|blockquote|div|table)[^>]*>[\s\S]*?<\/\1>/gi;
	const blocks = html.match(blockRegex) || [];
	if (blocks.length <= 3) return { before: html, after: '' };
	let paragraphCount = 0;
	let splitPosition = 0;
	for (const block of blocks) {
		splitPosition = html.indexOf(block, splitPosition) + block.length;
		if (block.toLowerCase().startsWith('<p')) {
			paragraphCount++;
			if (paragraphCount >= 3) break;
		}
	}
	return {
		before: html.slice(0, splitPosition),
		after: html.slice(splitPosition)
	};
 };

 export const articlePageUtils = {
	ogLocaleFor,
	formatDate,
	separateReadMoreLinks,
	splitContentForAd
 } as const;
