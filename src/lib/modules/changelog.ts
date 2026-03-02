import type {
  ChangelogEntry,
  EntryComment,
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

  async list(params?: ChangelogListParams): Promise<PaginatedResponse<ChangelogEntry>> {
    return this.entries.list({ type: 'changelog', ...params }) as Promise<PaginatedResponse<ChangelogEntry>>;
  }

  async getBySlug(slug: string, params?: ChangelogGetBySlugParams): Promise<ChangelogEntry> {
    return this.entries.getBySlug(slug, { type: 'changelog', ...params }) as Promise<ChangelogEntry>;
  }

  async getById(id: string, params?: ChangelogGetByIdParams): Promise<ChangelogEntry> {
    return this.entries.getById(id, params) as Promise<ChangelogEntry>;
  }

  async getTranslationsById(id: string): Promise<Record<string, ChangelogEntry>> {
    return this.entries.getTranslationsById(id) as Promise<Record<string, ChangelogEntry>>;
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, ChangelogEntry>> {
    return this.entries.getTranslationsBySlug(slug) as Promise<Record<string, ChangelogEntry>>;
  }

  async getComments(entryId: string, params?: ChangelogGetCommentsParams): Promise<PaginatedResponse<EntryComment>> {
    return this.entries.getComments(entryId, params);
  }

  async react(changelogId: string, params: ReactParams): Promise<ReactResponse> {
    return this.entries.react(changelogId, params);
  }
}
