import type { HttpClient } from '../http-client';
import type { BlogPost, BlogPostListItem, BlogTagWithCount, PaginatedResponse, PaginationParams } from '../types';

export interface BlogListParams extends PaginationParams {
  tags?: string[];
  search?: string;
}

export class BlogModule {
  constructor(private readonly http: HttpClient) {}

  async list(params?: BlogListParams): Promise<PaginatedResponse<BlogPostListItem>> {
    return this.http.get<PaginatedResponse<BlogPostListItem>>('/v1/blog/posts', params);
  }

  async getBySlug(slug: string): Promise<BlogPost> {
    return this.http.get<BlogPost>(`/v1/blog/posts/${encodeURIComponent(slug)}`);
  }

  async getById(id: string): Promise<BlogPost> {
    return this.http.get<BlogPost>(`/v1/blog/posts/by-id/${encodeURIComponent(id)}`);
  }

  async getTags(): Promise<BlogTagWithCount[]> {
    return this.http.get<BlogTagWithCount[]>('/v1/blog/tags');
  }
}
