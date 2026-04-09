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

  async list(params?: PagesListParams): Promise<PaginatedResponse<PageEntryListItem>> {
    return this.entries.list({ type: 'page', ...params }) as unknown as Promise<
      PaginatedResponse<PageEntryListItem>
    >;
  }

  async getBySlug(slug: string, params?: PagesGetBySlugParams): Promise<PageEntryDetail> {
    return this.entries.getBySlug(slug, { type: 'page', ...params }) as unknown as Promise<PageEntryDetail>;
  }

  async getById(id: string, params?: PagesGetByIdParams): Promise<PageEntryDetail> {
    return this.entries.getById(id, params) as unknown as Promise<PageEntryDetail>;
  }

  async getTranslationsById(pageId: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(pageId);
  }

  async getTranslationsBySlug(slug: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug);
  }

  async getComments(entryId: string, params?: PagesGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }
}
