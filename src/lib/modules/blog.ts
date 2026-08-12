import type {
  BlogEntryDetail,
  BlogEntryListItem,
  EntryComment,
  EntryTagWithCount,
  EntryTranslationsMap,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';
import type { EntriesModule } from './entries';

export interface BlogListParams extends PaginationParams, LocaleOptions {
  tags?: string[];
  search?: string;
}

export interface BlogGetBySlugParams extends LocaleOptions {}

export interface BlogGetByIdParams extends LocaleOptions {}

export interface BlogGetCommentsParams extends PaginationParams {}

export class BlogModule {
  constructor(private readonly entries: EntriesModule) {}

  async list(
    params?: BlogListParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<BlogEntryListItem>> {
    return this.entries.list({ type: 'blog', ...params }, signal) as unknown as Promise<
      PaginatedResponse<BlogEntryListItem>
    >;
  }

  async getBySlug(
    slug: string,
    params?: BlogGetBySlugParams,
    signal?: AbortSignal
  ): Promise<BlogEntryDetail> {
    return this.entries.getBySlug(
      slug,
      { type: 'blog', ...params },
      signal
    ) as unknown as Promise<BlogEntryDetail>;
  }

  async getById(
    id: string,
    params?: BlogGetByIdParams,
    signal?: AbortSignal
  ): Promise<BlogEntryDetail> {
    return this.entries.getById(id, params, signal) as unknown as Promise<BlogEntryDetail>;
  }

  async getTags(signal?: AbortSignal): Promise<EntryTagWithCount[]> {
    return this.entries.getTags('blog', signal);
  }

  async getTranslationsById(postId: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(postId, signal);
  }

  async getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug, signal);
  }

  async getComments(
    entryId: string,
    params?: BlogGetCommentsParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params, signal);
  }

  async react(
    postId: string,
    params: ReactParams,
    signal?: AbortSignal
  ): Promise<ReactResponse> {
    return this.entries.react(postId, params, signal);
  }
}
