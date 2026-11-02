import type { HttpClient } from '../http-client';
import type {
  FeedbackComment,
  FeedbackKanbanColumn,
  FeedbackPost,
  FeedbackPostCategory,
  FeedbackPostListItem,
  FeedbackSortOption,
  FeedbackTopContributor,
  FeedbackVisitorVotes,
  FeedbackVoteInput,
  FeedbackVoteResult,
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

  async getColumns(signal?: AbortSignal): Promise<FeedbackKanbanColumn[]> {
    return this.http.get<FeedbackKanbanColumn[]>('/v1/feedback/columns', undefined, signal);
  }

  async list(params?: FeedbackListParams, signal?: AbortSignal): Promise<PaginatedResponse<FeedbackPostListItem>> {
    return this.http.get<PaginatedResponse<FeedbackPostListItem>>('/v1/feedback', params, signal);
  }

  async getById(id: string, signal?: AbortSignal): Promise<FeedbackPost> {
    return this.http.get<FeedbackPost>(`/v1/feedback/by-id/${encodeURIComponent(id)}`, undefined, signal);
  }

  async getComments(
    postId: string,
    params?: FeedbackGetCommentsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<FeedbackComment>> {
    return this.http.get<PaginatedResponse<FeedbackComment>>(
      `/v1/feedback/${encodeURIComponent(postId)}/comments`,
      params,
      signal,
    );
  }

  async getTopContributors(
    params?: FeedbackTopContributorsParams,
    signal?: AbortSignal,
  ): Promise<FeedbackTopContributor[]> {
    return this.http.get<FeedbackTopContributor[]>('/v1/feedback/top-contributors', params, signal);
  }

  /** Casts or withdraws a visitor's vote, with no sign-in. Only published posts take votes. */
  async vote(postId: string, input: FeedbackVoteInput): Promise<FeedbackVoteResult> {
    return this.http.post<FeedbackVoteResult>(`/v1/feedback/${encodeURIComponent(postId)}/vote`, input);
  }

  /** The posts a visitor voted for. */
  async getVisitorVotes(visitorId: string, signal?: AbortSignal): Promise<FeedbackVisitorVotes> {
    return this.http.get<FeedbackVisitorVotes>('/v1/feedback/votes', { visitorId }, signal);
  }
}
