import type { ExportEntry, GetPath } from './types';
import { escapeXml, joinUrl, resolveUrl } from './url';

export interface SitemapOptions {
  baseUrl: string;
  getPath: GetPath;
  /** Static pages to list first, as paths (`'/'`, `'/pricing'`). */
  extraUrls?: string[];
}

/**
 * Builds a `sitemap.xml` document from `entries.export()` rows. The sitemap protocol caps a
 * file at 50,000 URLs and 50 MB; split into a sitemap index yourself beyond that.
 */
export function buildSitemap(entries: ExportEntry[], options: SitemapOptions): string {
  const lines: string[] = [];
  for (const path of options.extraUrls ?? []) {
    lines.push(`  <url><loc>${escapeXml(joinUrl(options.baseUrl, path))}</loc></url>`);
  }
  for (const entry of entries) {
    const url = resolveUrl(options.baseUrl, options.getPath, entry);
    if (!url) continue;
    const lastmod = entry.updatedAt.slice(0, 10);
    lines.push(`  <url><loc>${escapeXml(url)}</loc><lastmod>${lastmod}</lastmod></url>`);
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...lines,
    '</urlset>',
    '',
  ].join('\n');
}
