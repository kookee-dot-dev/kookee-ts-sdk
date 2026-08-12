import type {
  EntryComment,
  EntryTranslationsMap,
  LocaleOptions,
  PageEntryDetail,
  PageEntryListItem,
  PaginatedResponse,
  PaginationParams,
} from '../types';
import type { EntriesModule } from './entries';

export interface PagesListParams extends PaginationParams, LocaleOptions {
  search?: string;
}

export interface PagesGetBySlugParams extends LocaleOptions {}

export interface PagesGetByIdParams extends LocaleOptions {}

export interface PagesGetCommentsParams extends PaginationParams {}

export class PagesModule {
  constructor(private readonly entries: EntriesModule) {}

  async list(
    params?: PagesListParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<PageEntryListItem>> {
    return this.entries.list({ type: 'page', ...params }, signal) as unknown as Promise<
      PaginatedResponse<PageEntryListItem>
    >;
  }

  async getBySlug(
    slug: string,
    params?: PagesGetBySlugParams,
    signal?: AbortSignal
  ): Promise<PageEntryDetail> {
    return this.entries.getBySlug(
      slug,
      { type: 'page', ...params },
      signal
    ) as unknown as Promise<PageEntryDetail>;
  }

  async getById(
    id: string,
    params?: PagesGetByIdParams,
    signal?: AbortSignal
  ): Promise<PageEntryDetail> {
    return this.entries.getById(id, params, signal) as unknown as Promise<PageEntryDetail>;
  }

  async getTranslationsById(pageId: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(pageId, signal);
  }

  async getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug, signal);
  }

  async getComments(
    entryId: string,
    params?: PagesGetCommentsParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params, signal);
  }
}
