import type { HttpClient } from '../http-client';
import type {
  HelpArticle,
  HelpArticleListItem,
  HelpCategory,
  HelpSearchResult,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  VoteUsefulnessResponse,
} from '../types';

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

export class HelpModule {
  constructor(private readonly http: HttpClient) {}

  async categories(params?: HelpCategoriesParams): Promise<HelpCategory[]> {
    return this.http.get<HelpCategory[]>('/v1/help/categories', params);
  }

  async list(params?: HelpListParams): Promise<PaginatedResponse<HelpArticleListItem>> {
    return this.http.get<PaginatedResponse<HelpArticleListItem>>('/v1/help/articles', params);
  }

  async getBySlug(slug: string, params?: HelpGetBySlugParams): Promise<HelpArticle> {
    return this.http.get<HelpArticle>(`/v1/help/articles/${encodeURIComponent(slug)}`, params);
  }

  async getById(id: string, params?: HelpGetByIdParams): Promise<HelpArticle> {
    return this.http.get<HelpArticle>(`/v1/help/articles/by-id/${encodeURIComponent(id)}`, params);
  }

  async search(params: HelpSearchParams): Promise<HelpSearchResult[]> {
    return this.http.get<HelpSearchResult[]>('/v1/help/search', params);
  }

  async getTranslationsById(articleId: string): Promise<Record<string, HelpArticle>> {
    return this.http.get<Record<string, HelpArticle>>(
      `/v1/help/articles/by-id/${encodeURIComponent(articleId)}/translations`
    );
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, HelpArticle>> {
    return this.http.get<Record<string, HelpArticle>>(
      `/v1/help/articles/${encodeURIComponent(slug)}/translations`
    );
  }

  async voteUsefulness(
    articleId: string,
    vote: 'yes' | 'no' | null,
    previousVote?: 'yes' | 'no' | null,
  ): Promise<VoteUsefulnessResponse> {
    return this.http.post<VoteUsefulnessResponse>(
      `/v1/help/articles/by-id/${encodeURIComponent(articleId)}/vote-usefulness`,
      { vote, previousVote }
    );
  }
}
