/**
 * JSON-LD for an inline `<script type="application/ld+json">`. Plain `JSON.stringify` lets a
 * `</script>` in a title close the element and run what follows; `\u003c` is the same
 * character to a JSON parser and inert to the HTML one.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
