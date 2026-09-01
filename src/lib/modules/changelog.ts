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

  async list(params?: ChangelogListParams, signal?: AbortSignal): Promise<PaginatedResponse<ChangelogEntryListItem>> {
    const response = await this.entries.list({ type: 'changelog', ...params }, signal);
    return { ...response, data: response.data.map(toChangelogListItem) };
  }

  async getBySlug(
    slug: string,
    params?: ChangelogGetBySlugParams,
    signal?: AbortSignal,
  ): Promise<ChangelogEntryDetail> {
    return toChangelogDetail(await this.entries.getBySlug(slug, { type: 'changelog', ...params }, signal));
  }

  async getById(id: string, params?: ChangelogGetByIdParams, signal?: AbortSignal): Promise<ChangelogEntryDetail> {
    return toChangelogDetail(await this.entries.getById(id, params, signal));
  }

  async getTranslationsById(id: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsById(id, signal);
  }

  async getTranslationsBySlug(slug: string, signal?: AbortSignal): Promise<EntryTranslationsMap> {
    return this.entries.getTranslationsBySlug(slug, signal);
  }

  async getComments(
    entryId: string,
    params?: ChangelogGetCommentsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params, signal);
  }

  async react(changelogId: string, params: ReactParams, signal?: AbortSignal): Promise<ReactResponse> {
    return this.entries.react(changelogId, params, signal);
  }
}
