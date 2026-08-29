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

export interface EntriesGetByIdParams extends LocaleOptions {}

export interface EntriesGetBySlugParams extends LocaleOptions {
  type: string;
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
      if (page >= response.totalPages) return all;
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
