import type {
  EntryCategory,
  FaqItem,
  FaqItemDetail,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
} from '../types';
import { getEntryOfType } from './entries';
import type { EntriesModule } from './entries';

export interface FaqListParams extends PaginationParams, LocaleOptions {
  /** A category's slug in the project's default locale. It finds the category in every locale. */
  category?: string;
}

export interface FaqGetByIdParams extends LocaleOptions {}

export interface FaqCategoriesParams extends LocaleOptions {}

export class FaqModule {
  constructor(private readonly entries: EntriesModule) {}

  async categories(params?: FaqCategoriesParams, signal?: AbortSignal): Promise<EntryCategory[]> {
    return this.entries.getCategories('faq', params, signal);
  }

  /** The items in the order the team set, each with its answer. */
  async list(params?: FaqListParams, signal?: AbortSignal): Promise<PaginatedResponse<FaqItem>> {
    return this.entries.list({ type: 'faq', ...params }, signal) as unknown as Promise<PaginatedResponse<FaqItem>>;
  }

  async getById(id: string, params?: FaqGetByIdParams, signal?: AbortSignal): Promise<FaqItemDetail> {
    return (await getEntryOfType(this.entries, 'faq', id, params, signal)) as unknown as FaqItemDetail;
  }
}
