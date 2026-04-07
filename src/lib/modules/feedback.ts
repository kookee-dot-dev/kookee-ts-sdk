import type { HttpClient } from '../http-client';
import type {
  CreateFeedbackCommentParams,
  CreateFeedbackPostParams,
  CreatedFeedbackComment,
  CreatedFeedbackPost,
  DeleteFeedbackCommentParams,
  DeleteFeedbackCommentResponse,
  DeleteFeedbackPostParams,
  DeleteFeedbackPostResponse,
  FeedbackPost,
  FeedbackPostCategory,
  FeedbackPostListItem,
  FeedbackSortOption,
  FeedbackTopContributor,
  FeedbackVoteResponse,
  KookeeUser,
  ListMyFeedbackPostsParams,
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

export interface FeedbackVoteParams {
  action: 'upvote' | 'downvote';
}

export interface FeedbackTopContributorsParams {
  limit?: number;
}

export class FeedbackModule {
  constructor(
    private readonly http: HttpClient,
    private readonly getUserContext: () => KookeeUser | null,
  ) {}

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

  async createPost(params: CreateFeedbackPostParams): Promise<CreatedFeedbackPost> {
    const externalUser = params.externalUser ?? this.getUserContext();
    if (!externalUser) {
      throw new Error('No user identified. Call kookee.identify() first or pass externalUser in params.');
    }
    return this.http.post<CreatedFeedbackPost>('/v1/feedback', { ...params, externalUser });
  }

  async createComment(postId: string, params: CreateFeedbackCommentParams): Promise<CreatedFeedbackComment> {
    const externalUser = params.externalUser ?? this.getUserContext();
    if (!externalUser) {
      throw new Error('No user identified. Call kookee.identify() first or pass externalUser in params.');
    }
    return this.http.post<CreatedFeedbackComment>(
      `/v1/feedback/${encodeURIComponent(postId)}/comments`,
      { ...params, externalUser },
    );
  }

  async listMyPosts(params?: ListMyFeedbackPostsParams): Promise<PaginatedResponse<FeedbackPostListItem>> {
    const externalId = params?.externalId ?? this.getUserContext()?.externalId;
    if (!externalId) {
      throw new Error('No user identified. Call kookee.identify() first or pass externalId in params.');
    }
    return this.http.get<PaginatedResponse<FeedbackPostListItem>>('/v1/feedback/mine', { ...params, externalId });
  }

  async deletePost(postId: string, params?: DeleteFeedbackPostParams): Promise<DeleteFeedbackPostResponse> {
    const externalId = params?.externalId ?? this.getUserContext()?.externalId;
    if (!externalId) {
      throw new Error('No user identified. Call kookee.identify() first or pass externalId in params.');
    }
    return this.http.delete<DeleteFeedbackPostResponse>(
      `/v1/feedback/${encodeURIComponent(postId)}`,
      { externalId },
    );
  }

  async deleteComment(commentId: string, params?: DeleteFeedbackCommentParams): Promise<DeleteFeedbackCommentResponse> {
    const externalId = params?.externalId ?? this.getUserContext()?.externalId;
    if (!externalId) {
      throw new Error('No user identified. Call kookee.identify() first or pass externalId in params.');
    }
    return this.http.delete<DeleteFeedbackCommentResponse>(
      `/v1/feedback/comments/${encodeURIComponent(commentId)}`,
      { externalId },
    );
  }
}
