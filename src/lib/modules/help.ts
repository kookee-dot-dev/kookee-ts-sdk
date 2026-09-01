import type { HttpClient } from '../http-client';
import type {
  EntryCategory,
  EntryComment,
  EntryTranslationsMap,
  HelpArticleDetail,
  HelpArticleListItem,
  HelpChatParams,
  HelpChatContinuationParams,
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

  async categories(params?: HelpCategoriesParams, signal?: AbortSignal): Promise<EntryCategory[]> {
    return this.entries.getCategories('help_article', params, signal);
  }

  async list(params?: HelpListParams, signal?: AbortSignal): Promise<PaginatedResponse<HelpArticleListItem>> {
    return this.entries.list({ type: 'help_article', ...params }, signal) as unknown as Promise<
      PaginatedResponse<HelpArticleListItem>
    >;
  }

  async getBySlug(slug: string, params?: HelpGetBySlugParams, signal?: AbortSignal): Promise<HelpArticleDetail> {
    return this.entries.getBySlug(
      slug,
      { type: 'help_article', ...params },
      signal,
    ) as unknown as Promise<HelpArticleDetail>;
  }

  async getById(id: string, params?: HelpGetByIdParams, signal?: AbortSignal): Promise<HelpArticleDetail> {
    return this.entries.getById(id, params, signal) as unknown as Promise<HelpArticleDetail>;
  }

  async search(params: HelpSearchParams, signal?: AbortSignal): Promise<HelpSearchResult[]> {
    return this.http.get<HelpSearchResult[]>('/v1/help/search', params, signal);
  }

  async getTranslationsById(articleId: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(articleId, signal);
  }

  async getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug, signal);
  }

  async getComments(
    entryId: string,
    params?: HelpGetCommentsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params, signal);
  }

  async react(articleId: string, params: ReactParams, signal?: AbortSignal): Promise<ReactResponse> {
    return this.entries.react(articleId, params, signal);
  }

  async chat(params: HelpChatParams): Promise<HelpChatResponse> {
    return this.http.post<HelpChatResponse>('/v1/help/chat', params);
  }

  chatStream(params: HelpChatParams | HelpChatContinuationParams): AsyncIterable<HelpChatStreamChunk> {
    return this.http.streamPost<HelpChatStreamChunk>('/v1/help/chat/stream', params);
  }
}
