import type { HttpClient } from '../http-client';
import type {
  FeedbackComment,
  FeedbackKanbanColumn,
  FeedbackPost,
  FeedbackPostCategory,
  FeedbackPostListItem,
  FeedbackSortOption,
  FeedbackTopContributor,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export interface FeedbackListParams extends PaginationParams {
  columnId?: string;
  columnType?: 'open' | 'closed';
  category?: FeedbackPostCategory;
  search?: string;
  sort?: FeedbackSortOption;
}

export interface FeedbackTopContributorsParams {
  limit?: number;
}

export interface FeedbackGetCommentsParams extends PaginationParams {}

export class FeedbackModule {
  constructor(private readonly http: HttpClient) {}

  async getColumns(): Promise<FeedbackKanbanColumn[]> {
    return this.http.get<FeedbackKanbanColumn[]>('/v1/feedback/columns');
  }

  async list(params?: FeedbackListParams): Promise<PaginatedResponse<FeedbackPostListItem>> {
    return this.http.get<PaginatedResponse<FeedbackPostListItem>>('/v1/feedback', params);
  }

  async getById(id: string): Promise<FeedbackPost> {
    return this.http.get<FeedbackPost>(`/v1/feedback/by-id/${encodeURIComponent(id)}`);
  }

  async getComments(postId: string, params?: FeedbackGetCommentsParams): Promise<PaginatedResponse<FeedbackComment>> {
    return this.http.get<PaginatedResponse<FeedbackComment>>(
      `/v1/feedback/${encodeURIComponent(postId)}/comments`,
      params
    );
  }

  async getTopContributors(params?: FeedbackTopContributorsParams): Promise<FeedbackTopContributor[]> {
    return this.http.get<FeedbackTopContributor[]>('/v1/feedback/top-contributors', params);
  }
}
