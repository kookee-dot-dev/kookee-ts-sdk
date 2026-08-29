import type { ExportEntry, GetPath } from './types';
import { resolveUrl } from './url';

export interface LlmsOptions {
  baseUrl: string;
  getPath: GetPath;
  /** The `# H1` of the file. */
  siteName: string;
  /** The `> blockquote` under the heading. */
  description?: string;
  /** Append every entry's markdown body (`llms-full.txt`); needs `entries.export({ markdown: true })`. */
  full?: boolean;
}

/**
 * Builds an `llms.txt` index (https://llmstxt.org): one `##` section per entry type, one
 * `- [title](url): description` line per entry. With `full`, each entry's markdown follows.
 */
export function buildLlmsTxt(entries: ExportEntry[], options: LlmsOptions): string {
  const resolved = entries
    .map((entry) => ({ entry, url: resolveUrl(options.baseUrl, options.getPath, entry) }))
    .filter((item): item is { entry: ExportEntry; url: string } => item.url !== null);

  const sections = new Map<string, string[]>();
  for (const { entry, url } of resolved) {
    const lines = sections.get(entry.typeName) ?? [];
    const description = entry.description ? `: ${entry.description.replace(/\s+/g, ' ').trim()}` : '';
    lines.push(`- [${entry.title}](${url})${description}`);
    sections.set(entry.typeName, lines);
  }

  const out: string[] = [`# ${options.siteName}`];
  if (options.description) out.push('', `> ${options.description}`);
  for (const [typeName, lines] of sections) {
    out.push('', `## ${typeName}`, '', ...lines);
  }

  if (options.full) {
    for (const { entry, url } of resolved) {
      if (!entry.markdown) continue;
      out.push('', '---', '', `## ${entry.title}`, '', `Source: ${url}`, '', entry.markdown.trim());
    }
  }

  out.push('');
  return out.join('\n');
}
