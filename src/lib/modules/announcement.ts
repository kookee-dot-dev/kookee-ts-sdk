import type {
  AnnouncementDetail,
  AnnouncementListItem,
  EntryComment,
  EntryTranslationsMap,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
} from '../types';
import type { EntriesModule } from './entries';

export interface AnnouncementListParams extends PaginationParams, LocaleOptions {}

export interface AnnouncementGetByIdParams extends LocaleOptions {}

export interface AnnouncementGetCommentsParams extends PaginationParams {}

export class AnnouncementModule {
  constructor(private readonly entries: EntriesModule) {}

  async list(params?: AnnouncementListParams): Promise<PaginatedResponse<AnnouncementListItem>> {
    return this.entries.list({ type: 'announcement', ...params }) as unknown as Promise<
      PaginatedResponse<AnnouncementListItem>
    >;
  }

  async getById(id: string, params?: AnnouncementGetByIdParams): Promise<AnnouncementDetail> {
    return this.entries.getById(id, params) as unknown as Promise<AnnouncementDetail>;
  }

  async getTranslationsById(id: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(id);
  }

  async getComments(entryId: string, params?: AnnouncementGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }
}
