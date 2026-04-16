# @kookee/sdk

Official TypeScript SDK for [Kookee](https://kookee.dev) - the headless CMS for your blog, changelog, and help center.

## Features

- **Lightweight** - Small minified footprint (ESM), no bloat
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

// Get comments on a post
const comments = await kookee.blog.getComments('post-id', { page: 1, limit: 20 });

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

// Semantic search — results include a matched text snippet when available
const results = await kookee.help.search({ query: 'how to reset password', limit: 5 });
for (const result of results) {
  console.log(result.title, result.matchedChunk); // matched text snippet or null
}

// Get single article
const article = await kookee.help.getBySlug('getting-started');
const articleById = await kookee.help.getById('article-uuid');

// Get article translations
const translationsBySlug = await kookee.help.getTranslationsBySlug('getting-started');
const translationsById = await kookee.help.getTranslationsById('article-uuid');

// Get comments on an article
const comments = await kookee.help.getComments('article-id', { page: 1, limit: 20 });

// React to an article
await kookee.help.react('article-id', { reactionType: 'heart', action: 'add' });

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
```

## Changelog

```typescript
// List entries
const entries = await kookee.changelog.list({ page: 1, limit: 10 });

// Search entries
const results = await kookee.changelog.list({ search: 'authentication' });

// Filter by typeSpecific properties (e.g. changelog type)
const features = await kookee.changelog.list({ filter: { changelogType: 'feature' } });

// Get single entry
const entry = await kookee.changelog.getBySlug('v1-0-0');
const entryById = await kookee.changelog.getById('entry-uuid');

// Get translations
const translationsBySlug = await kookee.changelog.getTranslationsBySlug('v1-0-0');
const translationsById = await kookee.changelog.getTranslationsById('entry-uuid');

// Get comments on an entry
const comments = await kookee.changelog.getComments('entry-id', { page: 1, limit: 20 });

// React to an entry
await kookee.changelog.react('entry-id', { reactionType: 'fire', action: 'add' });
```

## Announcements

```typescript
// List announcements
const announcements = await kookee.announcements.list({ page: 1, limit: 10 });

// Get single announcement
const announcement = await kookee.announcements.getById('announcement-uuid');

// Get translations
const translations = await kookee.announcements.getTranslationsById('announcement-uuid');

// Get comments on an announcement
const comments = await kookee.announcements.getComments('announcement-id', { page: 1, limit: 20 });
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

// Get comments on a page
const comments = await kookee.pages.getComments('page-id', { page: 1, limit: 20 });
```

## Entries (Generic)

The `entries` module provides low-level access to all entry types through a unified API:

```typescript
// List entries by type
const blogPosts = await kookee.entries.list({ type: 'blog', page: 1, limit: 10 });
const articles = await kookee.entries.list({ type: 'help_article', category: 'getting-started' });

// Filter by typeSpecific properties
const features = await kookee.entries.list({ type: 'changelog', filter: { changelogType: 'feature' } });

// Get entry by slug or ID
const entry = await kookee.entries.getBySlug('my-post', { type: 'blog' });
const entryById = await kookee.entries.getById('entry-uuid');

// Get translations
const translationsBySlug = await kookee.entries.getTranslationsBySlug('my-post');
const translationsById = await kookee.entries.getTranslationsById('entry-uuid');

// Get comments
const comments = await kookee.entries.getComments('entry-id', { page: 1, limit: 20 });

// React to any entry
await kookee.entries.react('entry-id', { reactionType: 'heart', action: 'add' });

// Get tags or categories for a type
const tags = await kookee.entries.getTags('blog');
const categories = await kookee.entries.getCategories('help_article');
```

## Feedback

### Reading feedback

```typescript
// Get kanban columns (for roadmap rendering)
const columns = await kookee.feedback.getColumns();

// List feedback posts
const posts = await kookee.feedback.list({ page: 1, limit: 10 });

// Filter by column type: 'open' | 'closed'
const openPosts = await kookee.feedback.list({ columnType: 'open' });

// Filter by specific column
const planned = await kookee.feedback.list({ columnId: 'column-uuid' });

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

Blog posts, help articles, and changelog entries support reactions:

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

Translation endpoints return a narrow `EntryTranslationsMap` keyed by locale code. Each value is a lightweight summary (`id`, `slug`, `locale`, `title`) — **not** a full entry. To load the full body of a translation, fetch it with `getBySlug` / `getById` using the target locale:

```typescript
const translations = await kookee.blog.getTranslationsBySlug('hello-world');
// {
//   en: { id, slug, locale: 'en', title },
//   de: { id, slug, locale: 'de', title },
//   ...
// }

// To load the full German version:
const germanPost = await kookee.blog.getBySlug('hello-world', { locale: 'de' });
```

## Paginated Response

All list endpoints return a paginated response:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}
```

## Comments

Comments are **read-only** through the SDK — the public REST API exposes `GET /entries/:id/comments` only. Posting, editing, and deleting comments happens inside the Kookee dashboard / portal UI by authenticated project members; there is no public write endpoint.

`getComments()` is available across modules and returns the same shape:

```typescript
const comments = await kookee.blog.getComments('post-id', { page: 1, limit: 20 });
// or: kookee.changelog.getComments(...), kookee.help.getComments(...),
//     kookee.announcements.getComments(...), kookee.pages.getComments(...),
//     kookee.entries.getComments(...)
```

Each comment carries rich content as a Tiptap JSON document, a pre-rendered `contentHtml` string for direct injection into the DOM, optional file attachments, and an `isOfficial` flag set when the author is a project owner / admin. Top-level comments include their `replies` inline.

```typescript
interface EntryComment extends EntryCommentReply {
  replies: EntryCommentReply[];
}

interface EntryCommentReply {
  id: string;
  content: JSONContent;        // Tiptap JSON document — use this when you need to re-render
  contentHtml: string;         // pre-rendered HTML — fastest path for display
  isOfficial: boolean;         // true when author is a project owner/admin
  attachments: EntryCommentAttachment[];
  createdAt: string;
  updatedAt: string;
  author: EntryAuthor;
}

interface EntryCommentAttachment {
  id: string;
  fileId: string;
  file: EntryCommentAttachmentFile;
  createdAt: string;
}

interface EntryCommentAttachmentFile {
  id: string;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  public: boolean;
}
```

The simplest render path is `contentHtml`:

```tsx
for (const comment of comments.data) {
  return <div dangerouslySetInnerHTML={{ __html: comment.contentHtml }} />;
}
```

Use `content` (Tiptap JSON) when you want to render with your own Tiptap pipeline, transform the document, or feed it back into an editor.

> **Per-project enable**: comments are only returned when the project owner has enabled commenting for the entry's module in their portal settings. Until then, `getComments()` returns an empty list.

## List vs. Detail Responses

Entry endpoints come in two flavours with **different shapes**:

- **List responses** (`blog.list()`, `entries.list()`, …) return `*ListItem` types — these do **not** include `contentHtml`. Use `excerptHtml` instead for previews.
- **Search responses** (`help.search()`) return `HelpSearchResult` which extends the list item with `matchedChunk: string | null` — a plain-text snippet from the best matching section of the article.
- **Detail responses** (`blog.getBySlug()`, `help.getById()`, …) return `*Detail` types — these include `contentHtml` for full content rendering.

```typescript
// List: no contentHtml, only excerptHtml
const posts = await kookee.blog.list({ limit: 10 });
for (const post of posts.data) {
  renderPreview(post.excerptHtml); // ✅ available on list
  // renderFull(post.contentHtml);  // ❌ type error — not on list
}

// Detail: contentHtml is available
const post = await kookee.blog.getBySlug('hello-world');
renderFull(post.contentHtml); // ✅ available on detail
```

## Categories on entries

Every entry response (list *and* detail) includes both `categoryId: string | null` **and** a resolved `category: EntryCategoryRef | null`. No client-side join required:

```typescript
const results = await kookee.help.search({ query: 'how to reset password' });
for (const result of results) {
  // result.category is already populated by the server
  console.log(result.title, '→', result.category?.name);
}

type EntryCategoryRef = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
};
```

When an entry has no category assigned, `category` is `null` and `categoryId` is `null` — guard accordingly.

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
  // Entry base & shared
  BaseEntry,
  EntryDetailFields,
  EntryType,
  EntryStatus,
  EntryAuthor,
  EntryTag,
  EntryTagWithCount,
  EntryCategory,
  EntryCategoryRef,
  EntryComment,
  EntryCommentReply,
  EntryCommentAttachment,
  EntryCommentAttachmentFile,
  EntryTranslationSummary,
  EntryTranslationsMap,

  // Entry variants — LIST responses (no contentHtml)
  GenericEntryListItem,
  BlogEntryListItem,
  PageEntryListItem,
  HelpArticleListItem,
  ChangelogEntryListItem,
  AnnouncementListItem,
  TypedEntryListItem,
  AnyEntryListItem,

  // Entry variants — DETAIL responses (with contentHtml)
  GenericEntryDetail,
  BlogEntryDetail,
  PageEntryDetail,
  HelpArticleDetail,
  ChangelogEntryDetail,
  AnnouncementDetail,
  TypedEntryDetail,
  AnyEntryDetail,

  // Type-specific metadata
  TypeSpecific,
  BlogTypeSpecific,
  PageTypeSpecific,
  HelpArticleTypeSpecific,
  ChangelogTypeSpecific,
  AnnouncementTypeSpecific,

  // Changelog & Announcement specific
  ChangelogType,
  AnnouncementType,

  // Help Center
  HelpSearchResult,
  HelpArticleVisibility,
  HelpChatMessage,
  HelpChatParams,
  HelpChatResponse,
  HelpChatSource,
  HelpChatSourceCategory,
  HelpChatStreamChunk,

  // Feedback
  FeedbackKanbanColumn,
  FeedbackPost,
  FeedbackPostListItem,
  FeedbackColumnType,
  FeedbackPostCategory,
  FeedbackSortOption,
  FeedbackAuthor,
  FeedbackAssignee,
  FeedbackComment,
  FeedbackTopContributor,
  FeedbackVoteResponse,
  CreateFeedbackPostParams,
  CreateFeedbackCommentParams,
  CreatedFeedbackPost,
  CreatedFeedbackComment,
  ListMyFeedbackPostsParams,
  DeleteFeedbackPostParams,
  DeleteFeedbackPostResponse,
  DeleteFeedbackCommentParams,
  DeleteFeedbackCommentResponse,

  // User & Identity
  KookeeUser,
  ExternalUser,

  // Reactions
  ReactionType,
  ReactParams,
  ReactResponse,

  // Common
  ApiError,
  PublicConfig,
  PaginatedResponse,
  PaginationParams,
  LocaleOptions,
  OrderDirection,
  KookeeConfig,
  HealthCheckResponse,

  // Rich content (Tiptap JSON)
  JSONContent,
  JSONContentNode,
  JSONContentMark,

  // Module request parameter shapes
  EntriesListParams,
  EntriesGetByIdParams,
  EntriesGetBySlugParams,
  EntriesGetCommentsParams,
  EntriesGetCategoriesParams,
  BlogListParams,
  BlogGetBySlugParams,
  BlogGetByIdParams,
  BlogGetCommentsParams,
  HelpCategoriesParams,
  HelpListParams,
  HelpSearchParams,
  HelpGetBySlugParams,
  HelpGetByIdParams,
  HelpGetCommentsParams,
  ChangelogListParams,
  ChangelogGetBySlugParams,
  ChangelogGetByIdParams,
  ChangelogGetCommentsParams,
  PagesListParams,
  PagesGetBySlugParams,
  PagesGetByIdParams,
  PagesGetCommentsParams,
  AnnouncementListParams,
  AnnouncementGetByIdParams,
  AnnouncementGetCommentsParams,
  ConfigListParams,
  FeedbackListParams,
  FeedbackVoteParams,
  FeedbackTopContributorsParams,
} from '@kookee/sdk';
```

## License

MIT
