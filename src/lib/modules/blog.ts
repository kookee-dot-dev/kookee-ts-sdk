import type { HttpClient } from '../http-client';
import type {
  BlogPost,
  BlogPostListItem,
  BlogTagWithCount,
  LocaleOptions,
  PaginatedResponse,
  PaginationParams,
  ReactParams,
  ReactResponse,
} from '../types';

export interface BlogListParams extends PaginationParams, LocaleOptions {
  tags?: string[];
  search?: string;
}

export interface BlogGetBySlugParams extends LocaleOptions {}

export interface BlogGetByIdParams extends LocaleOptions {}

export class BlogModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: BlogListParams): Promise<PaginatedResponse<BlogPostListItem>> {
    return this.http.get<PaginatedResponse<BlogPostListItem>>('/v1/blog/posts', params);
  }

  async getBySlug(slug: string, params?: BlogGetBySlugParams): Promise<BlogPost> {
    return this.http.get<BlogPost>(`/v1/blog/posts/${encodeURIComponent(slug)}`, params);
  }

  async getById(id: string, params?: BlogGetByIdParams): Promise<BlogPost> {
    return this.http.get<BlogPost>(`/v1/blog/posts/by-id/${encodeURIComponent(id)}`, params);
  }

  async getTags(): Promise<BlogTagWithCount[]> {
    return this.http.get<BlogTagWithCount[]>('/v1/blog/tags');
  }

  async getTranslationsById(postId: string): Promise<Record<string, BlogPost>> {
    return this.http.get<Record<string, BlogPost>>(
      `/v1/blog/posts/by-id/${encodeURIComponent(postId)}/translations`
    );
  }

  async getTranslationsBySlug(slug: string): Promise<Record<string, BlogPost>> {
    return this.http.get<Record<string, BlogPost>>(
      `/v1/blog/posts/${encodeURIComponent(slug)}/translations`
    );
  }

  async react(postId: string, params: ReactParams): Promise<ReactResponse> {
    return this.http.post<ReactResponse>(
      `/v1/blog/posts/${encodeURIComponent(postId)}/reactions`,
      params
    );
  }
}
