import type { HttpClient } from '../http-client';
import type {
  Announcement,
  AnnouncementListItem,
  AnnouncementOrderBy,
  AnnouncementType,
  LocaleOptions,
  OrderDirection,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export interface AnnouncementListParams extends PaginationParams, LocaleOptions {
  type?: AnnouncementType;
  excludeIds?: string[];
  orderBy?: AnnouncementOrderBy;
  order?: OrderDirection;
}

export interface AnnouncementGetByIdParams extends LocaleOptions {}

export class AnnouncementModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: AnnouncementListParams): Promise<PaginatedResponse<AnnouncementListItem>> {
    const { excludeIds, ...rest } = params ?? {};
    const queryParams = excludeIds?.length ? { ...rest, excludeIds: excludeIds.join(',') } : rest;
    return this.http.get<PaginatedResponse<AnnouncementListItem>>('/v1/announcements', queryParams);
  }

  async getById(id: string, params?: AnnouncementGetByIdParams): Promise<Announcement> {
    return this.http.get<Announcement>(`/v1/announcements/${encodeURIComponent(id)}`, params);
  }

  async getTranslationsById(id: string): Promise<Record<string, Announcement>> {
    return this.http.get<Record<string, Announcement>>(
      `/v1/announcements/${encodeURIComponent(id)}/translations`
    );
  }
}
