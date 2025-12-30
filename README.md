# @kookee/sdk

Official SDK for Kookee - Access your blog content via a simple API.

## Installation

```bash
npm install @kookee/sdk
# or
pnpm add @kookee/sdk
# or
yarn add @kookee/sdk
```

## Quick Start

```typescript
import { Kookee } from '@kookee/sdk';

const kookee = new Kookee({
  apiKey: 'your-api-key',
});

// Fetch blog posts
const posts = await kookee.blog.list({ limit: 10 });

// Get a single post by slug
const post = await kookee.blog.getBySlug('hello-world');
```

## Blog

```typescript
// List posts with pagination
const posts = await kookee.blog.list({ page: 1, limit: 10 });

// Filter by tag slug
const taggedPosts = await kookee.blog.list({ tag: 'news' });

// Search posts
const searchResults = await kookee.blog.list({ search: 'tutorial' });

// Get single post by slug
const post = await kookee.blog.getBySlug('my-post');

// Get single post by ID
const postById = await kookee.blog.getById('post-uuid');

// Get all tags with post counts
const tags = await kookee.blog.getTags();
```

## Response Types

### BlogPostListItem (returned by `list()`)

```typescript
interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerptHtml: string | null;
  coverImageUrl: string | null;
  status: string;
  publishedAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  author: { name: string };
  tags: Array<{ name: string; slug: string }>;
}
```

### BlogPost (returned by `getBySlug()` and `getById()`)

```typescript
interface BlogPost extends BlogPostListItem {
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}
```

## Error Handling

```typescript
import { Kookee, KookeeApiError } from '@kookee/sdk';

try {
  const post = await kookee.blog.getBySlug('non-existent');
} catch (error) {
  if (error instanceof KookeeApiError) {
    console.error(`Error ${error.code}: ${error.message}`);
    console.error(`Status: ${error.status}`);
  }
}
```

## Configuration

```typescript
const kookee = new Kookee({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.kookee.dev', // optional, defaults to production API
});
```

## TypeScript

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type { BlogPost, BlogPostListItem, BlogTag, PaginatedResponse } from '@kookee/sdk';
```

## License

MIT
