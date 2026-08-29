/**
 * The fields a path function may need. Both `BaseEntry` (list/detail responses) and
 * `ExportEntry` (`entries.export()`) satisfy it.
 */
export interface PathEntry {
  type: string;
  id: string;
  slug: string | null;
  locale: string;
  category: { slug: string } | null;
}

/**
 * Maps an entry to its path on your site (`/blog/my-post`), or `null` when the entry has no
 * page. Every SEO builder takes one; entries that resolve to `null` are skipped.
 */
export type GetPath = (entry: PathEntry) => string | null;

/** One row of `GET /v1/entries/export`. */
export interface ExportEntry {
  type: string;
  typeName: string;
  id: string;
  slug: string | null;
  locale: string;
  title: string;
  description: string | null;
  category: { slug: string; name: string } | null;
  publishedAt: string;
  updatedAt: string;
  markdown: string | null;
}

export interface ExportParams {
  /** Include each entry's body as markdown (needed for `llms-full.txt`). */
  markdown?: boolean;
  /** Restrict to these entry type slugs; all types when omitted. */
  type?: string[];
}
