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
  slug: string | null;
  title: string;
  visibility: string | null;
  metadata: Record<string, NonNullable<unknown>> | null;
  category: HelpChatSourceCategory | null;
}

export type HelpChatStreamChunk =
  | { type: 'delta'; content: string }
  | { type: 'sources'; sources: HelpChatSource[] }
  | { type: 'done' }
  | { type: 'error'; message: string };

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
  name: string | null;
  image: string | null;
  isTeamMember?: boolean;
  externalId?: string | null;
}

export interface FeedbackAssignee {
  id: string;
  name: string | null;
  image: string | null;
}

export interface FeedbackCommentAttachment {
  id: string;
  fileId: string;
  file: EntryCommentAttachmentFile;
  createdAt: string;
}

export interface FeedbackComment {
  id: string;
  content: JSONContent;
  contentHtml: string;
  attachments: FeedbackCommentAttachment[];
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
  kanbanPosition: number;
  category: FeedbackPostCategory;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  author: FeedbackAuthor;
  assignee: FeedbackAssignee | null;
}

export interface FeedbackPost extends FeedbackPostListItem {
  contentHtml: string | null;
}

export interface FeedbackTopContributor {
  id: string;
  name: string | null;
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

/**
 * Author shape returned on public entry responses.
 *
 * NOTE: `name` and `image` can be `null` on the server side. `isTeamMember`
 * is only populated on comment responses (where the server can tell whether
 * the commenter is a project member) — it is not set on entry author fields.
 */
export interface EntryAuthor {
  id: string;
  name: string | null;
  image: string | null;
  isTeamMember?: boolean;
}

export interface EntryTag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
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

/**
 * JSON-serializable value. Mirrors what can survive `JSON.stringify` /
 * `JSON.parse` round-trips and — importantly — satisfies framework type
 * constraints (e.g. TanStack Router's loader return type) that reject the
 * looser `unknown`. Tiptap attrs are always JSON, so this is the correct
 * runtime shape.
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface JSONContentMark {
  type: string;
  attrs?: Record<string, JSONValue>;
}

export interface JSONContentNode {
  type: string;
  attrs?: Record<string, JSONValue>;
  content?: JSONContentNode[];
  marks?: JSONContentMark[];
  text?: string;
}

export interface JSONContent {
  type: 'doc';
  content?: JSONContentNode[];
}

export interface EntryCommentAttachmentFile {
  id: string;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  public: boolean;
}

export interface EntryCommentAttachment {
  id: string;
  fileId: string;
  file: EntryCommentAttachmentFile;
  createdAt: string;
}

export interface EntryComment {
  id: string;
  content: JSONContent;
  contentHtml: string;
  isOfficial: boolean;
  attachments: EntryCommentAttachment[];
  createdAt: string;
  updatedAt: string;
  author: EntryAuthor;
}

// =====================
// Entry variants
// =====================
//
// IMPORTANT: Public entry responses come in two flavours — list responses
// (from e.g. `GET /v1/entries`, `GET /v1/help/search`) and detail responses
// (from e.g. `GET /v1/entries/:slug`, `GET /v1/entries/by-id/:id`).
//
// The *only* difference is `contentHtml`: the server NEVER returns
// `contentHtml` on list responses — only on detail responses. Reading
// `entry.contentHtml` on a list item was the root cause of several crashes
// in SDK <= 0.0.36, where the single `BaseEntry` shape lied about this.
//
// Both list and detail responses include `categoryId` AND a resolved
// nested `category` object (since SDK 0.0.38) so consumers don't need
// to join categories client-side. When an entry has no category assigned
// `category` is `null`.

/**
 * Resolved category attached to a public entry response.
 *
 * This is the server's `EntryCategory` row projected down to the fields
 * that are safe/useful to expose publicly.
 */
export interface EntryCategoryRef {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
}

/**
 * Fields that appear on BOTH list and detail entry responses.
 */
export interface BaseEntry {
  id: string;
  type: string;
  slug: string | null;
  title: string;
  excerptHtml: string | null;
  publishedAt: string | null;
  locale: string;
  translationGroupId: string;
  categoryId: string | null;
  category: EntryCategoryRef | null;
  coverImageUrl: string | null;
  position: number;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metadata: Record<string, NonNullable<unknown>> | null;
  reactions: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  author: EntryAuthor;
  tags: EntryTag[];
}

/**
 * Fields added on entry DETAIL responses only.
 *
 * `contentHtml` is NOT returned on list endpoints.
 */
export interface EntryDetailFields {
  contentHtml: string;
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

// ---- Generic (untyped typeSpecific) ----

export interface GenericEntryListItem extends BaseEntry {
  typeSpecific: unknown;
}

export interface GenericEntryDetail extends BaseEntry, EntryDetailFields {
  typeSpecific: unknown;
}

// ---- Blog ----

export interface BlogEntryListItem extends BaseEntry {
  type: 'blog';
  typeSpecific: BlogTypeSpecific;
}

export interface BlogEntryDetail extends BaseEntry, EntryDetailFields {
  type: 'blog';
  typeSpecific: BlogTypeSpecific;
}

// ---- Page ----

export interface PageEntryListItem extends BaseEntry {
  type: 'page';
  typeSpecific: PageTypeSpecific;
}

export interface PageEntryDetail extends BaseEntry, EntryDetailFields {
  type: 'page';
  typeSpecific: PageTypeSpecific;
}

// ---- Help article ----

export interface HelpArticleListItem extends BaseEntry {
  type: 'help_article';
  typeSpecific: HelpArticleTypeSpecific;
}

export interface HelpArticleDetail extends BaseEntry, EntryDetailFields {
  type: 'help_article';
  typeSpecific: HelpArticleTypeSpecific;
}

// ---- Changelog ----

export interface ChangelogEntryListItem extends BaseEntry {
  type: 'changelog';
  typeSpecific: ChangelogTypeSpecific;
}

export interface ChangelogEntryDetail extends BaseEntry, EntryDetailFields {
  type: 'changelog';
  typeSpecific: ChangelogTypeSpecific;
}

// ---- Announcement ----

export interface AnnouncementListItem extends BaseEntry {
  type: 'announcement';
  typeSpecific: AnnouncementTypeSpecific;
}

export interface AnnouncementDetail extends BaseEntry, EntryDetailFields {
  type: 'announcement';
  typeSpecific: AnnouncementTypeSpecific;
}

// ---- Unions ----

export type TypedEntryListItem =
  | BlogEntryListItem
  | PageEntryListItem
  | HelpArticleListItem
  | ChangelogEntryListItem
  | AnnouncementListItem;

export type TypedEntryDetail =
  | BlogEntryDetail
  | PageEntryDetail
  | HelpArticleDetail
  | ChangelogEntryDetail
  | AnnouncementDetail;

export type AnyEntryListItem = TypedEntryListItem | GenericEntryListItem;
export type AnyEntryDetail = TypedEntryDetail | GenericEntryDetail;

/**
 * Help search result — returned by `GET /v1/help/search`.
 *
 * Extends `HelpArticleListItem` with `matchedChunk` — a plain-text snippet
 * from the article that best matched the search query (via embedding similarity).
 * When the server falls back to text search, `matchedChunk` is `null`.
 */
export interface HelpSearchResult extends HelpArticleListItem {
  matchedChunk: string | null;
}

/**
 * Translation summary returned by the translations endpoints.
 *
 * The server returns a narrow { id, slug, locale, title } shape keyed by
 * locale — NOT a full entry. Consumers that need the full body should
 * fetch each translation individually via getBySlug / getById.
 */
export interface EntryTranslationSummary {
  id: string;
  slug: string | null;
  locale: string;
  title: string;
}

export type EntryTranslationsMap = Record<string, EntryTranslationSummary>;
