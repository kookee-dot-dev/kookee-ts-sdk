# @kookee/sdk

Official TypeScript SDK for [Kookee](https://kookee.dev) - the headless CMS for your blog, changelog, and help center.

## Features

- **Lightweight** - Small minified footprint (ESM), no bloat
- **Zero dependencies** - Uses native `fetch`, nothing else
- **TypeScript-first** - Full type definitions out of the box
- **Tree-shakeable** - Import only what you need
- **Cancellable** - Every read method accepts an `AbortSignal`
- **Works anywhere** - ESM, CommonJS, or a plain `<script>` tag
- **Open source** - [MIT licensed](https://github.com/kookee-dot-dev/kookee-ts-sdk)

## Installation

```bash
npm install @kookee/sdk
# or
pnpm add @kookee/sdk
# or
yarn add @kookee/sdk
```

### Script tag

For a plain HTML page with no build step, load the browser bundle. `Kookee` becomes
available as a global:

```html
<script src="https://kookee.dev/sdk/latest.js"></script>
<script>
  const kookee = new Kookee({ projectId: 'your-project-id' });

  kookee.blog.list({ limit: 5 }).then((posts) => {
    console.log(posts.data);
  });
</script>
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

`sources` (on both `chat()` and the stream) lists the articles the answer actually cites, in the
order it cites them — not every article the assistant's searches turned up. An answer that cites
nothing carries an empty list. Each source carries `consulted`: `true` when the answer was built on
that article's text (a search hit or a `get_entry`), `false` when it was merely linked out of a
listing, as every entry of a "list all articles" answer is. Show a "Sources" row for the consulted
ones; keep the whole list for resolving inline citations. A missing `consulted` (servers before
1.6.2) should be read as `true`.

## Changelog

```typescript
// List entries
const entries = await kookee.changelog.list({ page: 1, limit: 10 });

// Search entries
const results = await kookee.changelog.list({ search: 'authentication' });

// Filter by system field keys (e.g. changelog type)
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

// Filter by system field keys
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

// Every published entry as slim rows (for sitemaps, feeds, llms.txt) — see "SEO"
const rows = await kookee.entries.export({ type: ['blog', 'help_article'] });
```

## SEO

Kookee content lives on **your** domain, so the SEO files live there too. The SDK gives you the
data and pure builder functions; you mount a route. Everything takes one thing you write — a
`getPath` function from an entry to its path on your site (`null` = no page):

```typescript
import type { GetPath } from '@kookee/sdk';

export const getPath: GetPath = (entry) => {
  switch (entry.type) {
    case 'blog':
      return entry.slug ? `/blog/${entry.slug}` : null;
    case 'changelog':
      return entry.slug ? `/changelog/${entry.slug}` : null;
    case 'help_article':
      return entry.slug && entry.category ? `/help/${entry.category.slug}/${entry.slug}` : null;
    default:
      return null;
  }
};
```

### Page metadata

`getEntrySeo` turns an entry into the facts a `<head>` needs. The description falls back
`metaDescription → excerptText (160 chars) → title`; `type` is `article` for blog and changelog
entries; pass the translations map to get `hreflang` alternates.

```typescript
import { getEntrySeo } from '@kookee/sdk';

const post = await kookee.blog.getBySlug(slug);
const translations = await kookee.blog.getTranslationsBySlug(slug);
const seo = getEntrySeo(post, { baseUrl: 'https://example.com', getPath, siteName: 'Example', translations });
// seo.title, seo.description, seo.canonical, seo.image, seo.type, seo.publishedAt,
// seo.updatedAt, seo.alternates ([{ hreflang, href }]), seo.jsonLd (schema.org Article)
```

Next.js `generateMetadata`:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await kookee.blog.getBySlug(params.slug);
  const seo = getEntrySeo(post, { baseUrl: SITE_URL, getPath, siteName: 'Example' });
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical ?? undefined,
      languages: Object.fromEntries(seo.alternates.map((a) => [a.hreflang, a.href])),
    },
    openGraph: {
      type: seo.type,
      title: seo.title,
      description: seo.description,
      url: seo.canonical ?? undefined,
      images: seo.image ? [seo.image] : undefined,
      publishedTime: seo.publishedAt ?? undefined,
      modifiedTime: seo.updatedAt,
    },
    twitter: { card: seo.image ? 'summary_large_image' : 'summary' },
  };
}

// In the page component:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }} />
```

### Sitemap

```typescript
import { buildSitemap } from '@kookee/sdk';

// app/sitemap.xml/route.ts (Next.js) — or any server route
export async function GET() {
  const entries = await kookee.entries.export();
  const xml = buildSitemap(entries, { baseUrl: SITE_URL, getPath, extraUrls: ['/', '/pricing'] });
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
```

`buildSitemap` emits `<loc>` and `<lastmod>` (from `updatedAt`) per entry. The sitemap protocol
caps one file at 50,000 URLs / 50 MB; split into a sitemap index yourself beyond that.

### RSS

```typescript
import { buildFeed } from '@kookee/sdk';

const posts = await kookee.blog.list({ limit: 50 });
const xml = buildFeed(posts.data, {
  baseUrl: SITE_URL,
  getPath,
  title: 'Example Blog',
  description: 'Latest posts',
  feedPath: '/rss.xml',
});
```

### llms.txt

`entries.export()` returns each entry's `markdown` body when asked, so `llms-full.txt` costs one
call:

```typescript
import { buildLlmsTxt } from '@kookee/sdk';

const entries = await kookee.entries.export({ type: ['help_article', 'blog'], markdown: true });
const index = buildLlmsTxt(entries, { baseUrl: SITE_URL, getPath, siteName: 'Example', description: 'Docs and blog' });
const full = buildLlmsTxt(entries, { baseUrl: SITE_URL, getPath, siteName: 'Example', full: true });
```

TanStack Start server route (the same shape works for every file above):

```typescript
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const entries = await kookee.entries.export({ type: ['help_article'] });
        return new Response(buildLlmsTxt(entries, { baseUrl: SITE_URL, getPath, siteName: 'Example' }), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
```

For JSON-LD in TanStack use the `{ 'script:ld+json': seo.jsonLd }` meta descriptor (the router
escapes it); `head().scripts` is injected unescaped.

## Feedback

The SDK exposes feedback in read-only form, plus anonymous voting. Creating and managing feedback happens in the hosted portal.

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

// Get single post
const post = await kookee.feedback.getById('post-uuid');

// Get comments on a post
const comments = await kookee.feedback.getComments('post-uuid', { page: 1, limit: 20 });

// Get top contributors
const contributors = await kookee.feedback.getTopContributors({ limit: 10 });
```

### Feedback comment shape

Feedback comments carry rich Tiptap content + a pre-rendered HTML string + optional file attachments.

```typescript
interface FeedbackComment {
  id: string;
  content: JSONContent; // Tiptap JSON document — use this when you need to re-render
  contentHtml: string; // pre-rendered HTML — fastest path for display
  attachments: FeedbackCommentAttachment[];
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
  author: FeedbackAuthor;
}

interface FeedbackCommentAttachment {
  id: string;
  fileId: string;
  file: EntryCommentAttachmentFile;
  createdAt: string;
}
```

The simplest render path is `contentHtml`:

```tsx
const comments = await kookee.feedback.getComments('post-id');
for (const comment of comments.data) {
  return <div dangerouslySetInnerHTML={{ __html: comment.contentHtml }} />;
}
```

## Config

```typescript
// Get a single config value
const config = await kookee.config.getByKey('feature_flags');

// Get multiple config values
const configs = await kookee.config.list({ keys: ['feature_flags', 'theme'] });
```

## Cookie Consent

The consent widget ships on its own subpath, so it is only bundled if you use it. Categories,
services, texts, appearance and Google Consent Mode are configured per project in Kookee; the
widget loads that configuration with your API key.

```typescript
import { initKookeeConsent } from '@kookee/sdk/consent';

const consent = initKookeeConsent({ apiKey: 'your-api-key' });

// Runs now if the visitor already consented, or right after they do
consent.on('analytics', () => {
  // load gtag / analytics here
});

consent.onChange((choices) => console.log(choices)); // { analytics: true, marketing: false }
consent.isGranted('marketing');
consent.show(); // reopen the preferences dialog, e.g. from a "Cookie settings" link
await consent.ready; // config loaded and any stored consent applied
```

For a plain HTML page use the `<script>` build instead. It auto-initializes from the tag's
`data-api-key` attribute and exposes the API as the `KookeeConsent` global. Tracker scripts
tagged with `type="text/plain"` and `data-kookee-consent="<category>"` are activated only
after consent:

```html
<script async src="https://kookee.dev/consent/latest.js" data-api-key="your-api-key"></script>
<script
  type="text/plain"
  data-kookee-consent="analytics"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
></script>
```

The complete embed snippet (Consent Mode defaults plus a stub that queues API calls made
before the script loads) is in your project's consent settings in Kookee.

TypeScript projects that call the `KookeeConsent` global from code declare it once, taking the
type from this package:

```typescript
import type { KookeeConsentApi } from '@kookee/sdk/consent';
declare global {
  var KookeeConsent: KookeeConsentApi;
}
```

Without the package installed, download `https://kookee.dev/consent/latest.d.ts` into your
types folder instead — it declares the same global with no imports. That copy is a snapshot: it
does not update when the script does, so prefer the package wherever you already have npm.

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

Each comment carries rich content as a Tiptap JSON document, a pre-rendered `contentHtml` string for direct injection into the DOM, optional file attachments, and an `isOfficial` flag set when the author is a project owner / admin. Comments are flat — there are no nested replies.

```typescript
interface EntryComment {
  id: string;
  content: JSONContent; // Tiptap JSON document — use this when you need to re-render
  contentHtml: string; // pre-rendered HTML — fastest path for display
  isOfficial: boolean; // true when author is a project owner/admin
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

Every entry response (list _and_ detail) includes both `categoryId: string | null` **and** a resolved `category: EntryCategoryRef | null`. No client-side join required:

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

## Fields on entries

Every entry response (list _and_ detail) carries a `fields` array holding both the built-in fields for that entry type (a changelog's type and version, say) and any custom fields configured for the project. Three helpers read it:

```typescript
import { fieldOptionKey, fieldStringValue, findField } from '@kookee/sdk';

const entry = await kookee.changelog.getBySlug('v1-0-0');

// Select fields: the stable option key, e.g. 'feature' | 'fix' | 'improvement'
fieldOptionKey(entry.fields, 'changelogType');

// Text fields: the string value, or undefined when unset
fieldStringValue(entry.fields, 'version');

// The whole row, when you also need displayValue or color
const type = findField(entry.fields, 'changelogType');
type?.displayValue; // 'New Feature' — localized, safe to render
type?.color; // '#22c55e' | null
```

Prefer `optionKeys` over `displayValue` whenever behavior depends on the choice. Keys are stable identifiers, while display values are translated per locale and change whenever someone edits a label:

```typescript
// Good — stable across renames and locales
if (fieldOptionKey(entry.fields, 'changelogType') === 'feature') {
  /* ... */
}

// Fragile — breaks under translation or a label edit
if (findField(entry.fields, 'changelogType')?.displayValue === 'New Feature') {
  /* ... */
}
```

Every helper returns `undefined` for a missing or unset field, so an entry type that has no such field needs no special-casing at the call site.

Filter a list by a field using the same slug and option key:

```typescript
const features = await kookee.changelog.list({ filter: { changelogType: 'feature' } });
```

## Cancelling Requests

Every read method takes an optional `AbortSignal` as its **last** argument, forwarded
straight to `fetch`:

```typescript
const controller = new AbortController();

const posts = kookee.blog.list({ limit: 10 }, controller.signal);

// Abandon the request — e.g. the user navigated away or typed a new search term
controller.abort();
```

The signal always comes after the method's own arguments, so its position varies:

```typescript
kookee.blog.list({ limit: 10 }, signal);
kookee.blog.getBySlug('my-post', { locale: 'en' }, signal);
kookee.blog.getTags(signal);
kookee.feedback.getById('post-uuid', signal);
```

An aborted request rejects with an `AbortError`, which is not a `KookeeApiError` — check
for it before treating a rejection as a real failure:

```typescript
try {
  await kookee.blog.list({ limit: 10 }, controller.signal);
} catch (error) {
  if (error instanceof DOMException && error.name === 'AbortError') return; // expected
  throw error;
}
```

Pass the signal as a **parameter**, never as a field on the params object — params are
serialised into the query string.

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

## Styling Entry Content

Render an entry's `contentHtml` inside an element with the class `kookee-entry-content` —
that class is the styling contract, and it works in any framework:

```html
<!-- Vanilla / Angular / Vue — add the class yourself -->
<div class="kookee-entry-content" [innerHTML]="post.contentHtml"></div>
```

```tsx
// React — <EntryContent> from @kookee/react adds the class for you
<EntryContent entry={post} />
```

The SDK ships two optional stylesheets. Every rule in both is scoped under
`.kookee-entry-content`, so importing them can never restyle anything else on your page:

- **`styles/content.css`** — content widget styling: syntax-highlighted code blocks
  (VS Code Dark+ theme), the copy button and language label, inline code, and file
  attachment chips. Everyone should import this.
- **`styles/typography.css`** — baseline text styling (headings, lists, tables, images,
  blockquotes, task lists). Import it if your app has no typography system of its own; it
  inherits your page's font and colors and only adds rhythm and hierarchy. **Tailwind
  apps should skip it** and keep using their `prose` classes.

```typescript
import '@kookee/sdk/styles/content.css';
import '@kookee/sdk/styles/typography.css'; // only without your own typography system
```

Or via CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@kookee/sdk/styles/content.css" />
<link rel="stylesheet" href="https://unpkg.com/@kookee/sdk/styles/typography.css" />
<!-- also served next to the script build: -->
<link rel="stylesheet" href="https://kookee.dev/sdk/content.css" />
```

**Tailwind v4 apps**: import content.css into a cascade layer so your `prose-code:`
utilities keep winning over the defaults:

```css
@import '@kookee/sdk/styles/content.css' layer(components);
```

The flip side of the layered import: `prose`'s own `pre` styles and `prose-code:`
utilities also reach elements _inside_ code blocks, and the layered stylesheet can't
defend against them. If you render entry content inside `prose` containers, add this
unlayered guard once:

```css
.kookee-entry-content .kookee-code-block pre {
  margin: 0;
  border-radius: 0;
}

.kookee-entry-content .kookee-code-block pre code {
  background: none;
  padding: 0;
  border: none;
  border-radius: 0;
  font-size: 0.875rem;
}
```

### Theming

content.css reads every color from a custom property with a light-theme fallback, so you
can restyle it from `:root` without touching the stylesheet:

- `--kookee-code-*` — code styling: font, block and header backgrounds, inline-code
  colors.
- `--kookee-file-chip-bg`, `--kookee-file-chip-border`, `--kookee-file-chip-fg`,
  `--kookee-file-chip-hover-bg`, `--kookee-file-chip-muted` — file attachment chip
  background, border, text color (defaults to `inherit`), hover fill, and the muted
  color used for the icon and size label.

Map them to your design system's tokens:

```css
:root {
  --kookee-code-font: var(--font-mono);
  --kookee-code-inline-bg: #eef;
  --kookee-file-chip-bg: var(--muted);
  --kookee-file-chip-border: var(--border);
  --kookee-file-chip-muted: var(--muted-foreground);
}
```

The fallbacks are light-theme values and do not react to your theme. If your app has a
dark mode, map at least `--kookee-file-chip-bg` and `--kookee-file-chip-border` to tokens
that flip with it — otherwise the chip keeps its light background while your text color
goes light, and the file name becomes unreadable.

For changes beyond colors, target the markup directly — the chip is an
`<a class="sb-file-chip">` containing `.sb-file-chip__icon`, `.sb-file-chip__name`
(truncated at 150px), and `.sb-file-chip__size`:

```css
.kookee-entry-content .sb-file-chip__name {
  max-width: 240px;
}
```

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
  EntryCommentAttachment,
  EntryCommentAttachmentFile,
  EntryTranslationSummary,
  EntryTranslationsMap,

  // SEO
  GetPath,
  PathEntry,
  ExportEntry,
  ExportParams,
  EntrySeo,
  EntrySeoOptions,
  EntrySeoAlternate,
  SitemapOptions,
  FeedOptions,
  LlmsOptions,

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
  FeedbackCommentAttachment,
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
  FeedbackGetCommentsParams,
} from '@kookee/sdk';
```

## License

MIT
