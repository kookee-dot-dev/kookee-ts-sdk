export interface KookeeConfig {
  apiKey?: string;
  projectId?: string;
  baseUrl?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface LocaleOptions {
  locale?: string;
  fallback?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export interface BlogTag {
  name: string;
  slug: string;
}

export interface BlogTagWithCount extends BlogTag {
  count: number;
}

export interface BlogPostAuthor {
  name: string;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  coverImageUrl: string | null;
  status: BlogPostStatus;
  publishedAt: string | null;
  metadata: Record<string, NonNullable<unknown>> | null;
  createdAt: string;
  views: number;
  author: BlogPostAuthor;
  tags: BlogTag[];
  locale: string;
  translationGroupId: string;
  reactions: Record<string, number>;
}

export interface BlogPost extends BlogPostListItem {
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface PageListItem {
  id: string;
  slug: string;
  title: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  locale: string;
  translationGroupId: string;
}

export interface Page extends PageListItem {
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface HelpCategory {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  articleCount: number;
}

export interface HelpArticleAuthor {
  name: string;
}

export interface HelpArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  status: string;
  position: number;
  metadata: Record<string, NonNullable<unknown>>;
  category: { name: string; slug: string };
  author: HelpArticleAuthor;
  createdAt: string;
  views: number;
  locale: string;
  translationGroupId: string;
  usefulYesCount: number;
  usefulNoCount: number;
}

export interface HelpArticle extends HelpArticleListItem {
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export interface HelpSearchResult {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  category: { name: string; slug: string };
  locale: string;
  matchedChunk?: string;
  usefulYesCount: number;
  usefulNoCount: number;
}

export type ChangelogType = 'feature' | 'fix' | 'improvement' | 'breaking' | 'security' | 'deprecated' | 'other';

export type ChangelogOrderBy = 'createdAt' | 'publishedAt' | 'version';

export type OrderDirection = 'asc' | 'desc';

export interface ChangelogAuthor {
  name: string;
}

export interface ChangelogEntryListItem {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  type: ChangelogType;
  version: string | null;
  publishedAt: string | null;
  createdAt: string;
  locale: string;
  translationGroupId: string;
  metadata: Record<string, NonNullable<unknown>> | null;
  author: ChangelogAuthor;
  reactions: Record<string, number>;
}

export interface ChangelogEntry extends ChangelogEntryListItem {
  contentHtml: string;
  link: string | null;
  updatedAt: string;
}

export type AnnouncementType = 'info' | 'warning' | 'critical' | 'promotion' | 'maintenance' | 'newFeature';

export type AnnouncementOrderBy = 'createdAt' | 'publishedAt';

export interface AnnouncementAuthor {
  name: string;
}

export interface AnnouncementListItem {
  id: string;
  title: string;
  contentHtml: string;
  type: AnnouncementType;
  publishedAt: string | null;
  unpublishAt: string | null;
  createdAt: string;
  locale: string;
  translationGroupId: string;
  metadata: Record<string, NonNullable<unknown>> | null;
  author: AnnouncementAuthor;
}

export interface Announcement extends AnnouncementListItem {
  updatedAt: string;
}

export interface PublicConfig {
  key: string;
  value: unknown;
}

export interface HealthCheckResponse {
  status: 'ok';
  projectId: string;
  timestamp: string;
}

export interface VoteUsefulnessResponse {
  usefulYesCount: number;
  usefulNoCount: number;
}

export type ReactionType = 'fire' | 'heart' | 'rocket' | 'eyes' | 'mindblown';

export interface ReactParams {
  reactionType: ReactionType;
  action: 'add' | 'remove';
}

export interface ReactResponse {
  reactions: Record<string, number>;
}

export interface HelpChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HelpChatParams {
  messages: HelpChatMessage[];
  locale?: string;
  sessionId?: string;
}

export interface HelpChatResponse {
  message: string;
  sources: HelpChatSource[];
}

export type HelpArticleVisibility = 'public' | 'chatbot_only';

export interface HelpChatSourceCategory {
  slug: string;
  name: string;
}

export interface HelpChatSource {
  id: string;
  slug: string;
  title: string;
  visibility: HelpArticleVisibility;
  metadata: Record<string, NonNullable<unknown>> | null;
  category: HelpChatSourceCategory;
}

export type HelpChatStreamChunk =
  | { type: 'delta'; content: string }
  | { type: 'sources'; sources: HelpChatSource[] }
  | { type: 'done' }
  | { type: 'error'; message: string };

// Feedback Types

export type FeedbackPostStatus = 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';

export type FeedbackPostCategory = 'feature' | 'improvement' | 'bug' | 'other';

export type FeedbackSortOption = 'newest' | 'top' | 'trending';

export interface FeedbackAuthor {
  id: string;
  name: string;
  image: string | null;
  isTeamMember?: boolean;
  externalId?: string | null;
}

export interface FeedbackAssignee {
  id: string;
  name: string | null;
  image: string | null;
}

export interface FeedbackComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isOfficial: boolean;
  author: FeedbackAuthor;
}

export interface FeedbackPostListItem {
  id: string;
  title: string;
  contentText: string | null;
  status: FeedbackPostStatus;
  category: FeedbackPostCategory;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  author: FeedbackAuthor;
  assignee: FeedbackAssignee | null;
}

export interface FeedbackPost extends FeedbackPostListItem {
  contentHtml: string | null;
  comments: FeedbackComment[];
}

export interface FeedbackTopContributor {
  id: string;
  name: string;
  image: string | null;
  totalVotes: number;
}

export interface FeedbackVoteResponse {
  voteCount: number;
}

// External User Types

export interface ExternalUser {
  externalId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface CreateFeedbackPostParams {
  title: string;
  description?: string;
  category?: FeedbackPostCategory;
  externalUser: ExternalUser;
}

export interface CreateFeedbackCommentParams {
  content: string;
  externalUser: ExternalUser;
}

export interface CreatedFeedbackPost {
  id: string;
  title: string;
  contentHtml: string | null;
  contentText: string | null;
  status: FeedbackPostStatus;
  category: FeedbackPostCategory;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedFeedbackComment {
  id: string;
  postId: string;
  content: string;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListMyFeedbackPostsParams {
  externalId: string;
  page?: number;
  limit?: number;
  status?: FeedbackPostStatus;
  category?: FeedbackPostCategory;
  search?: string;
  sort?: FeedbackSortOption;
}

export interface DeleteFeedbackPostParams {
  externalId: string;
}

export interface DeleteFeedbackPostResponse {
  success: boolean;
}
