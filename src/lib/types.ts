export interface KookeeConfig {
  apiKey: string;
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

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  coverImageUrl: string | null;
  status: string;
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
  createdAt: string;
  updatedAt: string;
  locale: string;
  translationGroupId: string;
}

export interface Page extends PageListItem {
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  views: number;
}

export interface HelpCategory {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  articleCount: number;
}

export interface HelpArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  category: { name: string; slug: string };
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
  contentHtml: string;
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
