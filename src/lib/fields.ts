import type { EntryFieldValue } from './types';

/**
 * The minimum shape these helpers need. Declared structurally rather than as
 * `EntryFieldValue` so callers holding a narrower row — the admin tRPC field
 * shape, for instance — can pass it without a cast.
 */
export interface EntryFieldReadItem {
  slug: string;
  value: string | number | boolean | string[];
  optionKeys: string[];
}

/**
 * Stable key of a select field's first chosen option, e.g. `'feature'` for a
 * changelog type. Keys survive label edits and locale changes; read these
 * rather than `displayValue` whenever behavior depends on the choice.
 */
export function fieldOptionKey(
  fields: EntryFieldReadItem[] | null | undefined,
  slug: string,
): string | undefined {
  return fields?.find((field) => field.slug === slug)?.optionKeys[0];
}

/** Text-ish field value, or undefined when unset or of another type. */
export function fieldStringValue(
  fields: EntryFieldReadItem[] | null | undefined,
  slug: string,
): string | undefined {
  const value = fields?.find((field) => field.slug === slug)?.value;
  return typeof value === 'string' && value !== '' ? value : undefined;
}

/** Full field row by slug, when `displayValue` or `color` is needed too. */
export function findField(
  fields: EntryFieldValue[] | null | undefined,
  slug: string,
): EntryFieldValue | undefined {
  return fields?.find((field) => field.slug === slug);
}
