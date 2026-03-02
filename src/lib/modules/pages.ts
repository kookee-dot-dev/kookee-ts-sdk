import type {
  EntryComment,
  LocaleOptions,
  PageEntry,
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

  async list(params?: PagesListParams): Promise<PaginatedResponse<PageEntry>> {
    return this.entries.list({ type: 'page', ...params }) as Promise<PaginatedResponse<PageEntry>>;
  }

  async getBySlug(slug: string, params?: PagesGetBySlugParams): Promise<PageEntry> {
    return this.entries.getBySlug(slug, { type: 'page', ...params }) as Promise<PageEntry>;
  }

  async getById(id: string, params?: PagesGetByIdParams): Promise<PageEntry> {
    return this.entries.getById(id, params) as Promise<PageEntry>;
  }

  async getTranslationsById(pageId: string): Promise<Record<string, PageEntry>> {
    return this.entries.getTranslationsById(pageId) as Promise<Record<string, PageEntry>>;
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, PageEntry>> {
    return this.entries.getTranslationsBySlug(slug) as Promise<Record<string, PageEntry>>;
  }

  async getComments(entryId: string, params?: PagesGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }
}
