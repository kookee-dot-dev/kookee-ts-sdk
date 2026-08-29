import type { BaseEntry, EntryTranslationsMap } from '../types';
import type { GetPath } from './types';
import { joinUrl, resolveUrl } from './url';

const DESCRIPTION_MAX_LENGTH = 160;
const ARTICLE_TYPES = new Set(['blog', 'changelog']);

export interface EntrySeoOptions {
  /** Origin of your site, e.g. `https://example.com`. */
  baseUrl: string;
  getPath: GetPath;
  /** Used as the JSON-LD publisher. */
  siteName?: string;
  /** Appended to the entry title when it has no `metaTitle`, e.g. `' | Blog'`. */
  titleSuffix?: string;
  /** From `getTranslationsBySlug()` / `getTranslationsById()`; enables `alternates`. */
  translations?: EntryTranslationsMap;
}

export interface EntrySeoAlternate {
  hreflang: string;
  href: string;
}

export interface EntrySeo {
  title: string;
  description: string;
  path: string | null;
  canonical: string | null;
  image: string | null;
  type: 'article' | 'website';
  publishedAt: string | null;
  updatedAt: string;
  /** Every locale of the entry including itself, or empty when there are no translations. */
  alternates: EntrySeoAlternate[];
  /** A schema.org `Article`, or `null` when the entry has no page. */
  jsonLd: Record<string, unknown> | null;
}

export function truncateDescription(text: string, maxLength = DESCRIPTION_MAX_LENGTH): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const cut = normalized.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function getEntrySeo(entry: BaseEntry, options: EntrySeoOptions): EntrySeo {
  const title = entry.metaTitle || `${entry.title}${options.titleSuffix ?? ''}`;
  const description =
    entry.metaDescription || (entry.excerptText ? truncateDescription(entry.excerptText) : '') || entry.title;
  const path = options.getPath(entry);
  const canonical = path === null ? null : joinUrl(options.baseUrl, path);
  const type = ARTICLE_TYPES.has(entry.type) ? 'article' : 'website';

  const alternates: EntrySeoAlternate[] = [];
  if (options.translations && canonical) {
    for (const [locale, translation] of Object.entries(options.translations)) {
      if (locale === entry.locale) continue;
      const href = resolveUrl(options.baseUrl, options.getPath, {
        type: entry.type,
        id: translation.id,
        slug: translation.slug,
        locale,
        category: entry.category,
      });
      if (href) alternates.push({ hreflang: locale, href });
    }
    if (alternates.length > 0) alternates.unshift({ hreflang: entry.locale, href: canonical });
  }

  const jsonLd: Record<string, unknown> | null = canonical
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: entry.title,
        description,
        ...(entry.coverImageUrl ? { image: entry.coverImageUrl } : {}),
        ...(entry.publishedAt ? { datePublished: entry.publishedAt } : {}),
        dateModified: entry.updatedAt,
        ...(entry.author.name ? { author: { '@type': 'Person', name: entry.author.name } } : {}),
        ...(options.siteName ? { publisher: { '@type': 'Organization', name: options.siteName } } : {}),
        mainEntityOfPage: canonical,
      }
    : null;

  return {
    title,
    description,
    path,
    canonical,
    image: entry.coverImageUrl,
    type,
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    alternates,
    jsonLd,
  };
}
