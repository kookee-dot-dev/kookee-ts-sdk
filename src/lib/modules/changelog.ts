import type { HttpClient } from '../http-client';
import type {
  ChangelogEntry,
  ChangelogEntryListItem,
  ChangelogOrderBy,
  LocaleOptions,
  OrderDirection,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';

export interface ChangelogListParams extends PaginationParams, LocaleOptions {
  type?: string;
  search?: string;
  orderBy?: ChangelogOrderBy;
  order?: OrderDirection;
}

export interface ChangelogGetBySlugParams extends LocaleOptions {}

export interface ChangelogGetByIdParams extends LocaleOptions {}

export class ChangelogModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: ChangelogListParams): Promise<PaginatedResponse<ChangelogEntryListItem>> {
    return this.http.get<PaginatedResponse<ChangelogEntryListItem>>('/v1/changelog', params);
  }

  async getBySlug(slug: string, params?: ChangelogGetBySlugParams): Promise<ChangelogEntry> {
    return this.http.get<ChangelogEntry>(`/v1/changelog/${encodeURIComponent(slug)}`, params);
  }

  async getById(id: string, params?: ChangelogGetByIdParams): Promise<ChangelogEntry> {
    return this.http.get<ChangelogEntry>(`/v1/changelog/by-id/${encodeURIComponent(id)}`, params);
  }

  async getTranslationsById(id: string): Promise<Record<string, ChangelogEntry>> {
    return this.http.get<Record<string, ChangelogEntry>>(
      `/v1/changelog/by-id/${encodeURIComponent(id)}/translations`
    );
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, ChangelogEntry>> {
    return this.http.get<Record<string, ChangelogEntry>>(
      `/v1/changelog/${encodeURIComponent(slug)}/translations`
    );
  }

  async react(changelogId: string, params: ReactParams): Promise<ReactResponse> {
    return this.http.post<ReactResponse>(
      `/v1/changelog/${encodeURIComponent(changelogId)}/reactions`,
      params
    );
  }
}
