import type {
  BlogEntry,
  EntryTagWithCount,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
  EntryComment,
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

  async list(params?: BlogListParams): Promise<PaginatedResponse<BlogEntry>> {
    return this.entries.list({ type: 'blog', ...params }) as Promise<PaginatedResponse<BlogEntry>>;
  }

  async getBySlug(slug: string, params?: BlogGetBySlugParams): Promise<BlogEntry> {
    return this.entries.getBySlug(slug, { type: 'blog', ...params }) as Promise<BlogEntry>;
  }

  async getById(id: string, params?: BlogGetByIdParams): Promise<BlogEntry> {
    return this.entries.getById(id, params) as Promise<BlogEntry>;
  }

  async getTags(): Promise<EntryTagWithCount[]> {
    return this.entries.getTags('blog');
  }

  async getTranslationsById(postId: string): Promise<Record<string, BlogEntry>> {
    return this.entries.getTranslationsById(postId) as Promise<Record<string, BlogEntry>>;
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, BlogEntry>> {
    return this.entries.getTranslationsBySlug(slug) as Promise<Record<string, BlogEntry>>;
  }

  async getComments(entryId: string, params?: BlogGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }

  async react(postId: string, params: ReactParams): Promise<ReactResponse> {
    return this.entries.react(postId, params);
  }
}
