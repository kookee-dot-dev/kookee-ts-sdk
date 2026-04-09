import type {
  ChangelogEntryDetail,
  ChangelogEntryListItem,
  EntryComment,
  EntryTranslationsMap,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';
import type { EntriesModule } from './entries';

export interface ChangelogListParams extends PaginationParams, LocaleOptions {
  search?: string;
}

export interface ChangelogGetBySlugParams extends LocaleOptions {}

export interface ChangelogGetByIdParams extends LocaleOptions {}

export interface ChangelogGetCommentsParams extends PaginationParams {}

export class ChangelogModule {
  constructor(private readonly entries: EntriesModule) {}

  async list(params?: ChangelogListParams): Promise<PaginatedResponse<ChangelogEntryListItem>> {
    return this.entries.list({ type: 'changelog', ...params }) as unknown as Promise<
      PaginatedResponse<ChangelogEntryListItem>
    >;
  }

  async getBySlug(slug: string, params?: ChangelogGetBySlugParams): Promise<ChangelogEntryDetail> {
    return this.entries.getBySlug(slug, { type: 'changelog', ...params }) as unknown as Promise<ChangelogEntryDetail>;
  }

  async getById(id: string, params?: ChangelogGetByIdParams): Promise<ChangelogEntryDetail> {
    return this.entries.getById(id, params) as unknown as Promise<ChangelogEntryDetail>;
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
