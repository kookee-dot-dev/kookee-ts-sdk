export interface KookeeConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
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
  metadata: Record<string, unknown> | null;
  createdAt: string;
  author: BlogPostAuthor;
  tags: BlogTag[];
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
