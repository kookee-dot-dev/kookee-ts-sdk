import { resolveEntryLinks, resolveEntryLinksInMarkdown } from '../entry-links';
import { KookeeApiError } from '../http-client';
import type { HttpClient } from '../http-client';
import type {
  EntryCategory,
  EntryComment,
  EntryTagWithCount,
  EntryTranslationsMap,
  GenericEntryDetail,
  GenericEntryListItem,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';
import type { EntryLinks, ExportEntry, ExportParams, GetPath } from '../seo/types';

const EXPORT_PAGE_SIZE = 200;

export interface EntriesListParams extends PaginationParams, LocaleOptions {
  type: string;
  tags?: string[];
  category?: string;
  search?: string;
  filter?: Record<string, string>;
}

export interface EntriesGetByIdParams extends LocaleOptions {
  /** Also return the body as Markdown, in `contentMarkdown`. */
  markdown?: boolean;
  /** Also return articles marked chatbot-only: unlisted in the help center, not secret. */
  includeChatbotOnly?: boolean;
}

export interface EntriesGetBySlugParams extends LocaleOptions {
  type: string;
  markdown?: boolean;
  includeChatbotOnly?: boolean;
}

export interface EntriesGetCommentsParams extends PaginationParams {}

export interface EntriesGetCategoriesParams extends LocaleOptions {}

export interface EntriesGetTranslationsBySlugParams {
  /** The entry type slug (`blog`, `help_article`, …), for a slug that several types use. */
  type?: string;
  /** The locale of the entry the slug belongs to, for a slug that entries in several locales use. */
  locale?: string;
}

interface EntryBodies {
  links?: EntryLinks;
  contentHtml?: string | null;
  excerptHtml?: string | null;
  contentMarkdown?: string | null;
  markdown?: string | null;
}

function withResolvedLinks<T extends EntryBodies>(entry: T, getPath: GetPath): T {
  const { links } = entry;
  const resolved: EntryBodies = { ...entry };
  if (typeof entry.contentHtml === 'string')
    resolved.contentHtml = resolveEntryLinks(entry.contentHtml, links, getPath);
  if (typeof entry.excerptHtml === 'string')
    resolved.excerptHtml = resolveEntryLinks(entry.excerptHtml, links, getPath);
  if (typeof entry.contentMarkdown === 'string') {
    resolved.contentMarkdown = resolveEntryLinksInMarkdown(entry.contentMarkdown, links, getPath);
  }
  if (typeof entry.markdown === 'string')
    resolved.markdown = resolveEntryLinksInMarkdown(entry.markdown, links, getPath);
  return resolved as T;
}

// Duck-typed: `instanceof AbortSignal` misses a polyfill's signal and throws where there is no global.
function isAbortSignal(value: unknown): value is AbortSignal {
  return (
    typeof value === 'object' &&
    value !== null &&
    'aborted' in value &&
    typeof (value as AbortSignal).addEventListener === 'function'
  );
}

export class EntriesModule {
  constructor(
    private readonly http: HttpClient,
    private readonly getPath?: GetPath,
  ) {}

  private resolveLinks<T extends EntryBodies>(entry: T): T {
    return this.getPath ? withResolvedLinks(entry, this.getPath) : entry;
  }

  async list(params: EntriesListParams, signal?: AbortSignal): Promise<PaginatedResponse<GenericEntryListItem>> {
    const response = await this.http.get<PaginatedResponse<GenericEntryListItem>>('/v1/entries', params, signal);
    return this.getPath ? { ...response, data: response.data.map((entry) => this.resolveLinks(entry)) } : response;
  }

  /**
   * Every published, public entry of the project as slim rows for sitemaps, feeds and
   * `llms.txt`. Follows pagination and returns the whole list.
   */
  async export(params?: ExportParams, signal?: AbortSignal): Promise<ExportEntry[]> {
    const all: ExportEntry[] = [];
    let page = 1;
    for (;;) {
      const response = await this.http.get<PaginatedResponse<ExportEntry>>(
        '/v1/entries/export',
        { ...params, page, limit: EXPORT_PAGE_SIZE },
        signal,
      );
      all.push(...response.data.map((entry) => this.resolveLinks(entry)));
      // An empty page ends it too: a missing or malformed totalPages would otherwise loop forever.
      if (response.data.length === 0 || !(page < response.totalPages)) return all;
      page += 1;
    }
  }

  async getById(id: string, params?: EntriesGetByIdParams, signal?: AbortSignal): Promise<GenericEntryDetail> {
    return this.resolveLinks(
      await this.http.get<GenericEntryDetail>(`/v1/entries/by-id/${encodeURIComponent(id)}`, params, signal),
    );
  }

  async getBySlug(slug: string, params: EntriesGetBySlugParams, signal?: AbortSignal): Promise<GenericEntryDetail> {
    return this.resolveLinks(
      await this.http.get<GenericEntryDetail>(`/v1/entries/${encodeURIComponent(slug)}`, params, signal),
    );
  }

  async getTranslationsById(id: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.http.get<EntryTranslationsMap>(
      `/v1/entries/by-id/${encodeURIComponent(id)}/translations`,
      undefined,
      signal,
    );
  }

  getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap>;
  getTranslationsBySlug(
    slug: string,
    params?: EntriesGetTranslationsBySlugParams,
    signal?: AbortSignal,
  ): Promise<EntryTranslationsMap>;
  async getTranslationsBySlug(
    slug: string,
    paramsOrSignal?: EntriesGetTranslationsBySlugParams | AbortSignal,
    signal?: AbortSignal,
  ): Promise<EntryTranslationsMap> {
    const signalFirst = isAbortSignal(paramsOrSignal);
    return this.http.get<EntryTranslationsMap>(
      `/v1/entries/${encodeURIComponent(slug)}/translations`,
      signalFirst ? undefined : paramsOrSignal,
      signalFirst ? paramsOrSignal : signal,
    );
  }

  async getComments(
    entryId: string,
    params?: EntriesGetCommentsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<EntryComment>> {
    return this.http.get<PaginatedResponse<EntryComment>>(
      `/v1/entries/${encodeURIComponent(entryId)}/comments`,
      params,
      signal,
    );
  }

  async react(entryId: string, params: ReactParams, signal?: AbortSignal): Promise<ReactResponse> {
    return this.http.post<ReactResponse>(`/v1/entries/${encodeURIComponent(entryId)}/reactions`, params, signal);
  }

  async getTags(type: string, signal?: AbortSignal): Promise<EntryTagWithCount[]> {
    return this.http.get<EntryTagWithCount[]>('/v1/tags', { type }, signal);
  }

  async getCategories(
    type: string,
    params?: EntriesGetCategoriesParams,
    signal?: AbortSignal,
  ): Promise<EntryCategory[]> {
    return this.http.get<EntryCategory[]>('/v1/categories', { type, ...params }, signal);
  }
}

/**
 * `by-id` serves every entry type, so a typed module checks what came back instead of handing
 * over another type's entry under its own name. Fails the way the server does for a missing id.
 */
export async function getEntryOfType(
  entries: EntriesModule,
  type: string,
  id: string,
  params?: EntriesGetByIdParams,
  signal?: AbortSignal,
): Promise<GenericEntryDetail> {
  const entry = await entries.getById(id, params, signal);
  if (entry.type !== type) {
    throw new KookeeApiError('ENTRY_NOT_FOUND', 'ENTRY_NOT_FOUND (HTTP 404)', 404);
  }
  return entry;
}
