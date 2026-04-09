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

  async list(params?: BlogListParams): Promise<PaginatedResponse<BlogEntryListItem>> {
    return this.entries.list({ type: 'blog', ...params }) as unknown as Promise<
      PaginatedResponse<BlogEntryListItem>
    >;
  }

  async getBySlug(slug: string, params?: BlogGetBySlugParams): Promise<BlogEntryDetail> {
    return this.entries.getBySlug(slug, { type: 'blog', ...params }) as unknown as Promise<BlogEntryDetail>;
  }

  async getById(id: string, params?: BlogGetByIdParams): Promise<BlogEntryDetail> {
    return this.entries.getById(id, params) as unknown as Promise<BlogEntryDetail>;
  }

  async getTags(): Promise<EntryTagWithCount[]> {
    return this.entries.getTags('blog');
  }

  async getTranslationsById(postId: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(postId);
  }

  async getTranslationsBySlug(slug: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug);
  }

  async getComments(entryId: string, params?: BlogGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }

  async react(postId: string, params: ReactParams): Promise<ReactResponse> {
    return this.entries.react(postId, params);
  }
}
