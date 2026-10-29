import type { FaqItem } from '../types';

/**
 * A schema.org `FAQPage` for the FAQ items a page shows, in their order: one `Question` per item,
 * named by its title, with the answer's `contentText` as its `acceptedAnswer`. An item with an
 * empty question or answer is left out. `null` when no item is left, since a `FAQPage` with no
 * question is not valid markup. Serialize it with `serializeJsonLd`.
 */
export function getFaqJsonLd(
  items: ReadonlyArray<Pick<FaqItem, 'title' | 'contentText'>>,
): Record<string, unknown> | null {
  const questions = items.flatMap((item) => {
    const name = item.title.trim();
    const text = item.contentText?.trim();
    return name && text ? [{ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }] : [];
  });
  if (questions.length === 0) return null;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions };
}
