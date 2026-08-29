import type { BaseEntry } from '../types';
import type { GetPath } from './types';
import { escapeXml, joinUrl, resolveUrl } from './url';

export interface FeedOptions {
  baseUrl: string;
  getPath: GetPath;
  title: string;
  description: string;
  /** Where the feed itself is served (`'/rss.xml'`); emitted as the feed's self link. */
  feedPath: string;
}

function toRfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

/** Builds an RSS 2.0 feed from list or detail entries, most recent first as given. */
export function buildFeed(entries: BaseEntry[], options: FeedOptions): string {
  const items: string[] = [];
  for (const entry of entries) {
    const url = resolveUrl(options.baseUrl, options.getPath, entry);
    if (!url) continue;
    const item = [
      '    <item>',
      `      <title>${escapeXml(entry.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    ];
    if (entry.publishedAt) item.push(`      <pubDate>${toRfc822(entry.publishedAt)}</pubDate>`);
    if (entry.excerptHtml) {
      item.push(`      <description><![CDATA[${entry.excerptHtml.replace(/]]>/g, ']]]]><![CDATA[>')}]]></description>`);
    }
    item.push('    </item>');
    items.push(item.join('\n'));
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(options.title)}</title>`,
    `    <link>${escapeXml(joinUrl(options.baseUrl, '/'))}</link>`,
    `    <description>${escapeXml(options.description)}</description>`,
    `    <atom:link href="${escapeXml(joinUrl(options.baseUrl, options.feedPath))}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
