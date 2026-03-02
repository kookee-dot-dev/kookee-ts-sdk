import type { HttpClient } from '../http-client';
import type {
  EntryCategory,
  EntryComment,
  EntryTagWithCount,
  GenericEntry,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';

export interface EntriesListParams extends PaginationParams, LocaleOptions {
  type: string;
  tags?: string[];
  category?: string;
  search?: string;
}

export interface EntriesGetByIdParams extends LocaleOptions {}

export interface EntriesGetBySlugParams extends LocaleOptions {
  type: string;
}

export interface EntriesGetCommentsParams extends PaginationParams {}

export interface EntriesGetCategoriesParams extends LocaleOptions {}

export class EntriesModule {
  constructor(private readonly http: HttpClient) {}

  async list(params: EntriesListParams): Promise<PaginatedResponse<GenericEntry>> {
    return this.http.get<PaginatedResponse<GenericEntry>>('/v1/entries', params);
  }

  async getById(id: string, params?: EntriesGetByIdParams): Promise<GenericEntry> {
    return this.http.get<GenericEntry>(`/v1/entries/by-id/${encodeURIComponent(id)}`, params);
  }

  async getBySlug(slug: string, params: EntriesGetBySlugParams): Promise<GenericEntry> {
    return this.http.get<GenericEntry>(`/v1/entries/${encodeURIComponent(slug)}`, params);
  }

  async getTranslationsById(id: string): Promise<Record<string, GenericEntry>> {
    return this.http.get<Record<string, GenericEntry>>(
      `/v1/entries/by-id/${encodeURIComponent(id)}/translations`
    );
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, GenericEntry>> {
    return this.http.get<Record<string, GenericEntry>>(
      `/v1/entries/${encodeURIComponent(slug)}/translations`
    );
  }

  async getComments(entryId: string, params?: EntriesGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.http.get<PaginatedResponse<EntryComment>>(
      `/v1/entries/${encodeURIComponent(entryId)}/comments`,
      params
    );
  }

  async react(entryId: string, params: ReactParams): Promise<ReactResponse> {
    return this.http.post<ReactResponse>(
      `/v1/entries/${encodeURIComponent(entryId)}/reactions`,
      params
    );
  }

  async getTags(type: string): Promise<EntryTagWithCount[]> {
    return this.http.get<EntryTagWithCount[]>('/v1/tags', { type });
  }

  async getCategories(type: string, params?: EntriesGetCategoriesParams): Promise<EntryCategory[]> {
    return this.http.get<EntryCategory[]>('/v1/categories', { type, ...params });
  }
}
