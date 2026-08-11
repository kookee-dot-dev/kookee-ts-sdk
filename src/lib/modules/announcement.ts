import type {
  AnnouncementDetail,
  AnnouncementListItem,
  EntryComment,
  EntryTranslationsMap,
  GenericEntryDetail,
  GenericEntryListItem,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
} from '../types';
import type { EntriesModule } from './entries';

// Read the announcement system field with `fieldOptionKey(entry.fields, 'announcementType')`.

function toAnnouncementListItem(entry: GenericEntryListItem): AnnouncementListItem {
  return { ...entry, type: 'announcement' };
}

function toAnnouncementDetail(entry: GenericEntryDetail): AnnouncementDetail {
  return { ...entry, type: 'announcement' };
}

export interface AnnouncementListParams extends PaginationParams, LocaleOptions {}

export interface AnnouncementGetByIdParams extends LocaleOptions {}

export interface AnnouncementGetCommentsParams extends PaginationParams {}

export class AnnouncementModule {
  constructor(private readonly entries: EntriesModule) {}

  async list(params?: AnnouncementListParams): Promise<PaginatedResponse<AnnouncementListItem>> {
    const response = await this.entries.list({ type: 'announcement', ...params });
    return { ...response, data: response.data.map(toAnnouncementListItem) };
  }

  async getById(id: string, params?: AnnouncementGetByIdParams): Promise<AnnouncementDetail> {
    return toAnnouncementDetail(await this.entries.getById(id, params));
  }

  async getTranslationsById(id: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(id);
  }

  async getComments(entryId: string, params?: AnnouncementGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }
}
