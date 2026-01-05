import type { HttpClient } from '../http-client';
import type { Page, PageListItem, PaginatedResponse, PaginationParams } from '../types';

export interface PagesListParams extends PaginationParams {
  search?: string;
}

export class PagesModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: PagesListParams): Promise<PaginatedResponse<PageListItem>> {
    return this.http.get<PaginatedResponse<PageListItem>>('/v1/pages', params);
  }

  async getBySlug(slug: string): Promise<Page> {
    return this.http.get<Page>(`/v1/pages/${encodeURIComponent(slug)}`);
  }

  async getById(id: string): Promise<Page> {
    return this.http.get<Page>(`/v1/pages/by-id/${encodeURIComponent(id)}`);
  }
}
