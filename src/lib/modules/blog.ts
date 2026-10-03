import type {
  BlogEntryDetail,
  BlogEntryListItem,
  EntryCategory,
  EntryComment,
  EntryTagWithCount,
  EntryTranslationsMap,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';
import { getEntryOfType } from './entries';
import type { EntriesModule } from './entries';

export interface BlogCategoriesParams extends LocaleOptions {}

export interface BlogListParams extends PaginationParams, LocaleOptions {
  tags?: string[];
  /** A category slug. */
  category?: string;
  search?: string;
}

export interface BlogGetBySlugParams extends LocaleOptions {}

export interface BlogGetByIdParams extends LocaleOptions {}

export interface BlogGetCommentsParams extends PaginationParams {}

export class BlogModule {
  constructor(private readonly entries: EntriesModule) {}

  async categories(params?: BlogCategoriesParams, signal?: AbortSignal): Promise<EntryCategory[]> {
    return this.entries.getCategories('blog', params, signal);
  }

  async list(params?: BlogListParams, signal?: AbortSignal): Promise<PaginatedResponse<BlogEntryListItem>> {
    return this.entries.list({ type: 'blog', ...params }, signal) as unknown as Promise<
      PaginatedResponse<BlogEntryListItem>
    >;
  }

  async getBySlug(slug: string, params?: BlogGetBySlugParams, signal?: AbortSignal): Promise<BlogEntryDetail> {
    return this.entries.getBySlug(slug, { type: 'blog', ...params }, signal) as unknown as Promise<BlogEntryDetail>;
  }

  async getById(id: string, params?: BlogGetByIdParams, signal?: AbortSignal): Promise<BlogEntryDetail> {
    return (await getEntryOfType(this.entries, 'blog', id, params, signal)) as unknown as BlogEntryDetail;
  }

  async getTags(signal?: AbortSignal): Promise<EntryTagWithCount[]> {
    return this.entries.getTags('blog', signal);
  }

  async getTranslationsById(postId: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(postId, signal);
  }

  async getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug, { type: 'blog' }, signal);
  }

  async getComments(
    entryId: string,
    params?: BlogGetCommentsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params, signal);
  }

  async react(postId: string, params: ReactParams, signal?: AbortSignal): Promise<ReactResponse> {
    return this.entries.react(postId, params, signal);
  }
}
