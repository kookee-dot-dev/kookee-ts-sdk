# @kookee/sdk

Official TypeScript SDK for [Kookee](https://kookee.dev) - the headless CMS for your blog, changelog, and help center.

## Features

- **Lightweight** - Only ~6.41 KB KB minified (ESM), no bloat
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

## Configuration

```typescript
const kookee = new Kookee({
  apiKey: 'your-api-key',
});
```

## User Identification

Set user identity once and it's automatically used across all feedback operations:

```typescript
// Set user identity globally
kookee.identify({
  externalId: 'user-456',
  name: 'Jane Doe',
  email: 'jane@example.com',   // optional
  avatarUrl: 'https://...',    // optional
});

// All feedback methods now auto-use the identified user
await kookee.feedback.createPost({ title: 'Feature request', category: 'feature' });
await kookee.feedback.createComment(postId, { content: 'Great idea!' });
const myPosts = await kookee.feedback.listMyPosts();

// Check current user
const user = kookee.getUser(); // KookeeUser | null

// Clear identity on logout
kookee.reset();
```

### React usage

```typescript
useEffect(() => {
  if (user) {
    kookee.identify({ externalId: user.id, name: user.name, email: user.email });
  } else {
    kookee.reset();
  }
}, [user]);
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
const translationsBySlug = await kookee.blog.getTranslationsBySlug('my-post');
const translationsById = await kookee.blog.getTranslationsById('post-uuid');
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
const translationsBySlug = await kookee.help.getTranslationsBySlug('getting-started');
const translationsById = await kookee.help.getTranslationsById('article-uuid');

// AI-powered chat
const response = await kookee.help.chat({
  messages: [{ role: 'user', content: 'How do I reset my password?' }],
  sessionId: 'optional-session-id', // maintain conversation context across calls
});

// Streaming chat
for await (const chunk of kookee.help.chatStream({ messages })) {
  if (chunk.type === 'delta') console.log(chunk.content);
  if (chunk.type === 'sources') console.log('Sources:', chunk.sources);
  if (chunk.type === 'done') console.log('Stream finished');
  if (chunk.type === 'error') console.error(chunk.message);
}

// Vote on article usefulness
await kookee.help.voteUsefulness('article-id', 'yes');

// Change a previous vote
await kookee.help.voteUsefulness('article-id', 'no', 'yes');

// Remove a vote
await kookee.help.voteUsefulness('article-id', null, 'yes');
```

## Changelog

```typescript
// List entries
const entries = await kookee.changelog.list({ page: 1, limit: 10 });

// Filter by type: 'feature' | 'fix' | 'improvement' | 'breaking' | 'security' | 'deprecated' | 'other'
const fixes = await kookee.changelog.list({ type: 'fix' });

// Search entries
const results = await kookee.changelog.list({ search: 'authentication' });

// Order by version or date
const sorted = await kookee.changelog.list({ orderBy: 'version', order: 'desc' });

// Get single entry
const entry = await kookee.changelog.getBySlug('v1-0-0');
const entryById = await kookee.changelog.getById('entry-uuid');

// Get translations
const translationsBySlug = await kookee.changelog.getTranslationsBySlug('v1-0-0');
const translationsById = await kookee.changelog.getTranslationsById('entry-uuid');

// React to an entry
await kookee.changelog.react('entry-id', { reactionType: 'fire', action: 'add' });
```

## Announcements

```typescript
// List announcements
const announcements = await kookee.announcements.list({ page: 1, limit: 10 });

// Filter by type: 'info' | 'warning' | 'critical' | 'promotion' | 'maintenance' | 'newFeature'
const critical = await kookee.announcements.list({ type: 'critical' });

// Order announcements
const sorted = await kookee.announcements.list({ orderBy: 'publishedAt', order: 'desc' });

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
const translationsBySlug = await kookee.pages.getTranslationsBySlug('privacy-policy');
const translationsById = await kookee.pages.getTranslationsById('page-uuid');
```

## Feedback

### Reading feedback

```typescript
// List feedback posts
const posts = await kookee.feedback.list({ page: 1, limit: 10 });

// Filter by status: 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined'
const planned = await kookee.feedback.list({ status: 'planned' });

// Filter by category: 'feature' | 'improvement' | 'bug' | 'other'
const bugs = await kookee.feedback.list({ category: 'bug' });

// Sort options: 'newest' | 'top' | 'trending'
const trending = await kookee.feedback.list({ sort: 'trending' });

// Search posts
const results = await kookee.feedback.list({ search: 'dark mode' });

// Get single post with comments
const post = await kookee.feedback.getById('post-uuid');

// Vote on a post
await kookee.feedback.vote('post-id', { action: 'upvote' });

// Get top contributors
const contributors = await kookee.feedback.getTopContributors({ limit: 10 });
```

### Creating and managing feedback

These operations require user identification — either globally via `kookee.identify()` or per-call via `externalUser`/`externalId`:

```typescript
// With global identity (recommended — see User Identification section above)
kookee.identify({ externalId: 'user-123', name: 'Jane Doe' });

const newPost = await kookee.feedback.createPost({
  title: 'Add dark mode',
  description: 'It would be great to have a dark mode option.',
  category: 'feature',
});

const comment = await kookee.feedback.createComment('post-id', {
  content: 'Great idea, I would love this too!',
});

const myPosts = await kookee.feedback.listMyPosts();

await kookee.feedback.deletePost('post-id');
await kookee.feedback.deleteComment('comment-id');
```

Per-call override still works (takes precedence over global identity):

```typescript
const newPost = await kookee.feedback.createPost({
  title: 'Add dark mode',
  externalUser: { externalId: 'other-user', name: 'John' },
});

const myPosts = await kookee.feedback.listMyPosts({ externalId: 'other-user' });
await kookee.feedback.deletePost('post-id', { externalId: 'other-user' });
await kookee.feedback.deleteComment('comment-id', { externalId: 'other-user' });
```

## Config

```typescript
// Get a single config value
const config = await kookee.config.getByKey('feature_flags');

// Get multiple config values
const configs = await kookee.config.list({ keys: ['feature_flags', 'theme'] });
```

## Health Check

```typescript
const health = await kookee.health();
// { status: 'ok', projectId: '...', timestamp: '...' }
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

Translation endpoints return a `Record<string, T>` keyed by locale code:

```typescript
const translations = await kookee.blog.getTranslationsBySlug('hello-world');
// { en: BlogPost, de: BlogPost, fr: BlogPost, ... }
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

## Code Block Styles

The SDK ships an optional CSS file for styling code blocks in content HTML (VS Code Dark+ theme):

```typescript
import '@kookee/sdk/styles/code.css';
```

Or via CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@kookee/sdk/styles/code.css">
```

This provides:
- Syntax-highlighted code blocks with a dark theme
- Copy-to-clipboard button styling
- Language label display
- Inline code styling (red on pink background)

## TypeScript

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  BlogPost,
  BlogPostListItem,
  BlogTag,
  BlogTagWithCount,
  Page,
  PageListItem,
  HelpArticle,
  HelpArticleListItem,
  HelpCategory,
  HelpSearchResult,
  HelpChatResponse,
  HelpChatStreamChunk,
  ChangelogEntry,
  ChangelogEntryListItem,
  Announcement,
  AnnouncementListItem,
  FeedbackPost,
  FeedbackPostListItem,
  FeedbackComment,
  FeedbackTopContributor,
  KookeeUser,
  ExternalUser,
  PublicConfig,
  PaginatedResponse,
  KookeeConfig,
} from '@kookee/sdk';
```

## License

MIT
