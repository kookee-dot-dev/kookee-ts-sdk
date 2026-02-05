# @kookee/sdk

Official TypeScript SDK for [Kookee](https://kookee.dev) - the headless CMS for your blog, changelog, and help center.

## Features

- **Lightweight** - Only ~1.5 KB minified (ESM), no bloat
- **Zero dependencies** - Uses native `fetch`, nothing else
- **TypeScript-first** - Full type definitions out of the box
- **Tree-shakeable** - Import only what you need
- **Open source** - [MIT licensed](https://github.com/kookee-dot-dev/kookee-ts-sdk)

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

// Filter by tag slugs
const taggedPosts = await kookee.blog.list({ tags: ['news'] });

// Search posts
const searchResults = await kookee.blog.list({ search: 'tutorial' });

// Get single post by slug
const post = await kookee.blog.getBySlug('my-post');

// Get single post by ID
const postById = await kookee.blog.getById('post-uuid');

// Get all tags with post counts
const tags = await kookee.blog.getTags();

// React to a post
await kookee.blog.react('post-id', { reactionType: 'heart', action: 'add' });

// Get translations
const translations = await kookee.blog.getTranslationsBySlug('my-post');
```

## Help Center

```typescript
// List categories
const categories = await kookee.help.categories();

// List articles with pagination
const articles = await kookee.help.list({ page: 1, limit: 10 });

// Filter by category slug
const categoryArticles = await kookee.help.list({ category: 'getting-started' });

// Semantic search
const results = await kookee.help.search({ query: 'how to reset password', limit: 5 });

// Get single article
const article = await kookee.help.getBySlug('getting-started');
const articleById = await kookee.help.getById('article-uuid');

// Get article translations
const translations = await kookee.help.getTranslationsBySlug('getting-started');

// AI-powered chat
const response = await kookee.help.chat({
  messages: [{ role: 'user', content: 'How do I reset my password?' }],
});

// Streaming chat
for await (const chunk of kookee.help.chatStream({ messages })) {
  if (chunk.type === 'delta') console.log(chunk.content);
  if (chunk.type === 'sources') console.log('Sources:', chunk.sources);
}

// Vote on article usefulness
await kookee.help.voteUsefulness('article-id', 'yes');
```

## Changelog

```typescript
// List entries
const entries = await kookee.changelog.list({ page: 1, limit: 10 });

// Filter by type: 'feature' | 'fix' | 'improvement' | 'breaking' | 'security' | 'deprecated' | 'other'
const fixes = await kookee.changelog.list({ type: 'fix' });

// Order by version or date
const sorted = await kookee.changelog.list({ orderBy: 'version', order: 'desc' });

// Get single entry
const entry = await kookee.changelog.getBySlug('v1-0-0');
const entryById = await kookee.changelog.getById('entry-uuid');

// Get translations
const translations = await kookee.changelog.getTranslationsBySlug('v1-0-0');

// React to an entry
await kookee.changelog.react('entry-id', { reactionType: 'fire', action: 'add' });
```

## Announcements

```typescript
// List announcements
const announcements = await kookee.announcements.list({ page: 1, limit: 10 });

// Filter by type: 'info' | 'warning' | 'critical' | 'promotion' | 'maintenance' | 'newFeature'
const critical = await kookee.announcements.list({ type: 'critical' });

// Exclude already-seen announcements
const unseen = await kookee.announcements.list({ excludeIds: ['id1', 'id2'] });

// Get single announcement
const announcement = await kookee.announcements.getById('announcement-uuid');

// Get translations
const translations = await kookee.announcements.getTranslationsById('announcement-uuid');
```

## Pages

```typescript
// List pages
const pages = await kookee.pages.list({ page: 1, limit: 10 });

// Search pages
const results = await kookee.pages.list({ search: 'privacy' });

// Get single page
const page = await kookee.pages.getBySlug('privacy-policy');
const pageById = await kookee.pages.getById('page-uuid');

// Get translations
const translations = await kookee.pages.getTranslationsBySlug('privacy-policy');
```

## Feedback

```typescript
// List feedback posts
const posts = await kookee.feedback.list({ page: 1, limit: 10 });

// Filter by status: 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined'
const planned = await kookee.feedback.list({ status: 'planned' });

// Filter by category: 'feature' | 'improvement' | 'bug' | 'other'
const bugs = await kookee.feedback.list({ category: 'bug' });

// Sort options: 'newest' | 'top' | 'trending'
const trending = await kookee.feedback.list({ sort: 'trending' });

// Get single post with comments
const post = await kookee.feedback.getById('post-uuid');

// Vote on a post
await kookee.feedback.vote('post-id', { action: 'upvote' });

// Get top contributors
const contributors = await kookee.feedback.getTopContributors({ limit: 10 });
```

## Config

```typescript
// Get a single config value
const config = await kookee.config.getByKey('feature_flags');

// Get multiple config values
const configs = await kookee.config.list({ keys: ['feature_flags', 'theme'] });
```

## Reactions

Blog posts and changelog entries support reactions:

```typescript
// Available reaction types: 'fire' | 'heart' | 'rocket' | 'eyes' | 'mindblown'
await kookee.blog.react('post-id', { reactionType: 'heart', action: 'add' });

// Remove a reaction
await kookee.blog.react('post-id', { reactionType: 'heart', action: 'remove' });
```

## Localization

Most endpoints support locale options:

```typescript
// Specify locale
const posts = await kookee.blog.list({ locale: 'de' });

// With fallback to default locale if translation doesn't exist
const post = await kookee.blog.getBySlug('hello-world', { locale: 'de', fallback: true });
```

## Paginated Response

All list endpoints return a paginated response:

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
