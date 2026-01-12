import type { HttpClient } from '../http-client';
import type { LocaleOptions, Page, PageListItem, PaginatedResponse, PaginationParams } from '../types';

export interface PagesListParams extends PaginationParams, LocaleOptions {
  search?: string;
}

export interface PagesGetBySlugParams extends LocaleOptions {}

export interface PagesGetByIdParams extends LocaleOptions {}

export class PagesModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: PagesListParams): Promise<PaginatedResponse<PageListItem>> {
    return this.http.get<PaginatedResponse<PageListItem>>('/v1/pages', params);
  }

  async getBySlug(slug: string, params?: PagesGetBySlugParams): Promise<Page> {
    return this.http.get<Page>(`/v1/pages/${encodeURIComponent(slug)}`, params);
  }

  async getById(id: string, params?: PagesGetByIdParams): Promise<Page> {
    return this.http.get<Page>(`/v1/pages/by-id/${encodeURIComponent(id)}`, params);
  }

  async getTranslationsById(pageId: string): Promise<Record<string, Page>> {
    return this.http.get<Record<string, Page>>(
      `/v1/pages/by-id/${encodeURIComponent(pageId)}/translations`
    );
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, Page>> {
    return this.http.get<Record<string, Page>>(
      `/v1/pages/${encodeURIComponent(slug)}/translations`
    );
  }
}
