import type { HttpClient } from '../http-client';
import type {
  FeedbackPost,
  FeedbackPostCategory,
  FeedbackPostListItem,
  FeedbackPostStatus,
  FeedbackSortOption,
  FeedbackTopContributor,
  FeedbackVoteResponse,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export interface FeedbackListParams extends PaginationParams {
  status?: FeedbackPostStatus;
  category?: FeedbackPostCategory;
  search?: string;
  sort?: FeedbackSortOption;
}

export interface FeedbackVoteParams {
  action: 'upvote' | 'downvote';
}

export interface FeedbackTopContributorsParams {
  limit?: number;
}

export class FeedbackModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: FeedbackListParams): Promise<PaginatedResponse<FeedbackPostListItem>> {
    return this.http.get<PaginatedResponse<FeedbackPostListItem>>('/v1/feedback', params);
  }

  async getById(id: string): Promise<FeedbackPost> {
    return this.http.get<FeedbackPost>(`/v1/feedback/by-id/${encodeURIComponent(id)}`);
  }

  async vote(postId: string, params: FeedbackVoteParams): Promise<FeedbackVoteResponse> {
    return this.http.post<FeedbackVoteResponse>(
      `/v1/feedback/${encodeURIComponent(postId)}/vote`,
      params
    );
  }

  async getTopContributors(params?: FeedbackTopContributorsParams): Promise<FeedbackTopContributor[]> {
    return this.http.get<FeedbackTopContributor[]>('/v1/feedback/top-contributors', params);
  }
}
