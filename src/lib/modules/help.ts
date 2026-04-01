import type { HttpClient } from '../http-client';
import type {
  EntryCategory,
  EntryComment,
  HelpArticleEntry,
  HelpChatParams,
  HelpChatResponse,
  HelpChatStreamChunk,
  HelpSearchResult,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';
import type { EntriesModule } from './entries';

export interface HelpCategoriesParams extends LocaleOptions {}

export interface HelpListParams extends PaginationParams, LocaleOptions {
  category?: string;
  search?: string;
}

export interface HelpSearchParams extends LocaleOptions {
  query: string;
  limit?: number;
}

export interface HelpGetBySlugParams extends LocaleOptions {}

export interface HelpGetByIdParams extends LocaleOptions {}

export interface HelpGetCommentsParams extends PaginationParams {}

export class HelpModule {
  private readonly http: HttpClient;
  private readonly entries: EntriesModule;

  constructor(http: HttpClient, entries: EntriesModule) {
    this.http = http;
    this.entries = entries;
  }

  async categories(params?: HelpCategoriesParams): Promise<EntryCategory[]> {
    return this.entries.getCategories('help_article', params);
  }

  async list(params?: HelpListParams): Promise<PaginatedResponse<HelpArticleEntry>> {
    return this.entries.list({ type: 'help_article', ...params }) as Promise<PaginatedResponse<HelpArticleEntry>>;
  }

  async getBySlug(slug: string, params?: HelpGetBySlugParams): Promise<HelpArticleEntry> {
    return this.entries.getBySlug(slug, { type: 'help_article', ...params }) as Promise<HelpArticleEntry>;
  }

  async getById(id: string, params?: HelpGetByIdParams): Promise<HelpArticleEntry> {
    return this.entries.getById(id, params) as Promise<HelpArticleEntry>;
  }

  async search(params: HelpSearchParams): Promise<HelpSearchResult[]> {
    return this.http.get<HelpSearchResult[]>('/v1/help/search', params);
  }

  async getTranslationsById(articleId: string): Promise<Record<string, HelpArticleEntry>> {
    return this.entries.getTranslationsById(articleId) as Promise<Record<string, HelpArticleEntry>>;
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, HelpArticleEntry>> {
    return this.entries.getTranslationsBySlug(slug) as Promise<Record<string, HelpArticleEntry>>;
  }

  async getComments(entryId: string, params?: HelpGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }

  async react(articleId: string, params: ReactParams): Promise<ReactResponse> {
    return this.entries.react(articleId, params);
  }

  async chat(params: HelpChatParams): Promise<HelpChatResponse> {
    return this.http.post<HelpChatResponse>('/v1/help/chat', params);
  }

  chatStream(params: HelpChatParams): AsyncIterable<HelpChatStreamChunk> {
    return this.http.streamPost<HelpChatStreamChunk>('/v1/help/chat/stream', params);
  }
}
