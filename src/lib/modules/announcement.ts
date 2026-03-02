import type {
  AnnouncementEntry,
  EntryComment,
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

  async list(params?: AnnouncementListParams): Promise<PaginatedResponse<AnnouncementEntry>> {
    return this.entries.list({ type: 'announcement', ...params }) as Promise<PaginatedResponse<AnnouncementEntry>>;
  }

  async getById(id: string, params?: AnnouncementGetByIdParams): Promise<AnnouncementEntry> {
    return this.entries.getById(id, params) as Promise<AnnouncementEntry>;
  }

  async getTranslationsById(id: string): Promise<Record<string, AnnouncementEntry>> {
    return this.entries.getTranslationsById(id) as Promise<Record<string, AnnouncementEntry>>;
  }

  async getComments(entryId: string, params?: AnnouncementGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }
}
