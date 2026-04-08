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

export interface ApiError {
  code: string;
  message: string;
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

export type ReactionType = 'fire' | 'heart' | 'rocket' | 'eyes' | 'mindblown';

export interface ReactParams {
  reactionType: string;
  action: 'add' | 'remove';
}

export interface ReactResponse {
  reactions: Record<string, number>;
}

export type OrderDirection = 'asc' | 'desc';

// =====================
// Help Chat Types
// =====================

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

export interface HelpSearchResult {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  category: { name: string; slug: string };
  locale: string;
  matchedChunk?: string;
}

// =====================
// Feedback Types
// =====================

export type FeedbackColumnType = 'open' | 'closed';

export interface FeedbackKanbanColumn {
  id: string;
  name: string;
  color: string | null;
  position: number;
  type: FeedbackColumnType;
  isVisible: boolean;
}

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
  columnId: string | null;
  columnName: string | null;
  columnColor: string | null;
  columnType: FeedbackColumnType | null;
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

export interface KookeeUser {
  externalId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export type ExternalUser = KookeeUser;

export interface CreateFeedbackPostParams {
  title: string;
  description?: string;
  category?: FeedbackPostCategory;
  externalUser?: ExternalUser;
}

export interface CreateFeedbackCommentParams {
  content: string;
  externalUser?: ExternalUser;
}

export interface CreatedFeedbackPost {
  id: string;
  title: string;
  contentHtml: string | null;
  contentText: string | null;
  columnId: string | null;
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
  externalId?: string;
  page?: number;
  limit?: number;
  columnId?: string;
  columnType?: FeedbackColumnType;
  category?: FeedbackPostCategory;
  search?: string;
  sort?: FeedbackSortOption;
}

export interface DeleteFeedbackPostParams {
  externalId?: string;
}

export interface DeleteFeedbackPostResponse {
  success: boolean;
}

export interface DeleteFeedbackCommentParams {
  externalId?: string;
}

export interface DeleteFeedbackCommentResponse {
  success: boolean;
}

// =====================
// Unified Entry Types
// =====================

export type EntryType = 'blog' | 'page' | 'help_article' | 'changelog' | 'announcement';

export type EntryStatus = 'draft' | 'published' | 'archived';

export type ChangelogType = 'feature' | 'fix' | 'improvement' | 'breaking' | 'security' | 'deprecated' | 'other';

export type AnnouncementType = 'info' | 'warning' | 'critical' | 'promotion' | 'maintenance' | 'newFeature';

export interface EntryAuthor {
  name: string;
}

export interface EntryTag {
  name: string;
  slug: string;
}

export interface EntryTagWithCount extends EntryTag {
  count: number;
}

export interface EntryCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  articleCount: number;
}

export interface EntryComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: EntryAuthor;
}

export interface BaseEntry {
  id: string;
  type: string;
  slug: string | null;
  title: string;
  excerptHtml: string | null;
  contentHtml: string;
  status: EntryStatus;
  publishedAt: string | null;
  locale: string;
  translationGroupId: string;
  categoryId: string | null;
  coverImageUrl: string | null;
  position: number;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metadata: Record<string, NonNullable<unknown>> | null;
  createdAt: string;
  updatedAt: string;
  author: EntryAuthor;
  tags: EntryTag[];
  reactions: Record<string, number>;
  category: { name: string; slug: string } | null;
}

export interface BlogTypeSpecific {
  _type: 'blog';
}

export interface PageTypeSpecific {
  _type: 'page';
}

export interface HelpArticleTypeSpecific {
  _type: 'help_article';
  visibility: HelpArticleVisibility;
}

export interface ChangelogTypeSpecific {
  _type: 'changelog';
  changelogType: ChangelogType;
  version: string | null;
  link: string | null;
}

export interface AnnouncementTypeSpecific {
  _type: 'announcement';
  announcementType: AnnouncementType;
  unpublishAt: string | null;
}

export type TypeSpecific =
  | BlogTypeSpecific
  | PageTypeSpecific
  | HelpArticleTypeSpecific
  | ChangelogTypeSpecific
  | AnnouncementTypeSpecific;

export interface GenericEntry extends BaseEntry {
  typeSpecific: unknown;
}

export interface BlogEntry extends BaseEntry {
  type: 'blog';
  typeSpecific: BlogTypeSpecific;
}

export interface PageEntry extends BaseEntry {
  type: 'page';
  typeSpecific: PageTypeSpecific;
}

export interface HelpArticleEntry extends BaseEntry {
  type: 'help_article';
  typeSpecific: HelpArticleTypeSpecific;
}

export interface ChangelogEntry extends BaseEntry {
  type: 'changelog';
  typeSpecific: ChangelogTypeSpecific;
}

export interface AnnouncementEntry extends BaseEntry {
  type: 'announcement';
  typeSpecific: AnnouncementTypeSpecific;
}

export type TypedEntry = BlogEntry | PageEntry | HelpArticleEntry | ChangelogEntry | AnnouncementEntry;

export type AnyEntry = TypedEntry | GenericEntry;
