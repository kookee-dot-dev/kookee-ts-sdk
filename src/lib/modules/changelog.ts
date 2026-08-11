import type {
  ChangelogEntryDetail,
  ChangelogEntryListItem,
  EntryComment,
  EntryTranslationsMap,
  GenericEntryDetail,
  GenericEntryListItem,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';
import type { EntriesModule } from './entries';

// Read the changelog system fields with `fieldOptionKey(entry.fields, 'changelogType')` and
// `fieldStringValue(entry.fields, 'version' | 'link')`.

function toChangelogListItem(entry: GenericEntryListItem): ChangelogEntryListItem {
  return { ...entry, type: 'changelog' };
}

function toChangelogDetail(entry: GenericEntryDetail): ChangelogEntryDetail {
  return { ...entry, type: 'changelog' };
}

export interface ChangelogListParams extends PaginationParams, LocaleOptions {
  search?: string;
  filter?: Record<string, string>;
}

export interface ChangelogGetBySlugParams extends LocaleOptions {}

export interface ChangelogGetByIdParams extends LocaleOptions {}

export interface ChangelogGetCommentsParams extends PaginationParams {}

export class ChangelogModule {
  constructor(private readonly entries: EntriesModule) {}

  async list(params?: ChangelogListParams): Promise<PaginatedResponse<ChangelogEntryListItem>> {
    const response = await this.entries.list({ type: 'changelog', ...params });
    return { ...response, data: response.data.map(toChangelogListItem) };
  }

  async getBySlug(slug: string, params?: ChangelogGetBySlugParams): Promise<ChangelogEntryDetail> {
    return toChangelogDetail(await this.entries.getBySlug(slug, { type: 'changelog', ...params }));
  }

  async getById(id: string, params?: ChangelogGetByIdParams): Promise<ChangelogEntryDetail> {
    return toChangelogDetail(await this.entries.getById(id, params));
  }

  async getTranslationsById(id: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(id);
  }

  async getTranslationsBySlug(slug: string): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug);
  }

  async getComments(entryId: string, params?: ChangelogGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }

  async react(changelogId: string, params: ReactParams): Promise<ReactResponse> {
    return this.entries.react(changelogId, params);
  }
}
