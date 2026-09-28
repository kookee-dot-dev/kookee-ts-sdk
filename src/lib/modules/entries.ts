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
import type { ExportEntry, ExportParams } from '../seo/types';

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

export class EntriesModule {
  constructor(private readonly http: HttpClient) {}

  async list(params: EntriesListParams, signal?: AbortSignal): Promise<PaginatedResponse<GenericEntryListItem>> {
    return this.http.get<PaginatedResponse<GenericEntryListItem>>('/v1/entries', params, signal);
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
      all.push(...response.data);
      // An empty page ends it too: a missing or malformed totalPages would otherwise loop forever.
      if (response.data.length === 0 || !(page < response.totalPages)) return all;
      page += 1;
    }
  }

  async getById(id: string, params?: EntriesGetByIdParams, signal?: AbortSignal): Promise<GenericEntryDetail> {
    return this.http.get<GenericEntryDetail>(`/v1/entries/by-id/${encodeURIComponent(id)}`, params, signal);
  }

  async getBySlug(slug: string, params: EntriesGetBySlugParams, signal?: AbortSignal): Promise<GenericEntryDetail> {
    return this.http.get<GenericEntryDetail>(`/v1/entries/${encodeURIComponent(slug)}`, params, signal);
  }

  async getTranslationsById(id: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.http.get<EntryTranslationsMap>(
      `/v1/entries/by-id/${encodeURIComponent(id)}/translations`,
      undefined,
      signal,
    );
  }

  async getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.http.get<EntryTranslationsMap>(
      `/v1/entries/${encodeURIComponent(slug)}/translations`,
      undefined,
      signal,
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
