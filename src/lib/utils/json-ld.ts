/**
 * Safely serialize data for embedding in a <script type="application/ld+json"> tag.
 * Escapes characters that could prematurely close the script tag or break parsing.
 */
export function serializeJsonLd(data: unknown): string {
  const json: string = JSON.stringify(data);
  // Escape characters that can break out of the script tag or be misinterpreted by HTML parsers
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
