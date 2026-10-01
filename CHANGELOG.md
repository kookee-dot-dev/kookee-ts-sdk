# Changelog

## 1.14.0

No change to this package; released alongside `@kookee/react` 1.14.0. `WidgetConfig.tabs` may
now leave out `'ask'`: it is any non-empty set of tabs.

## 1.13.0

### Added

- **`widget.sendFeedback(input)`** sends the team a message from the site widget's Feedback tab
  (`POST /v1/widget/feedback`): a category, the message, and optionally an email, the visitor's
  name and id as the site knows them, and the page's address. It waits for review on the
  dashboard's Feedback page and is public only once a team member adds it to the board. Not
  counted against the monthly API quota; limited per address and per project
  (`RATE_LIMIT_EXCEEDED`, `WIDGET_FEEDBACK_LIMIT_REACHED`).
- **`WidgetTab` gains `'feedback'`**, and the types `WidgetFeedbackInput` and
  `WidgetFeedbackReceipt`.

## 1.12.1

No change to this package; released alongside `@kookee/react` 1.12.1.

## 1.12.0

### Added

- **`WidgetBootstrap.locale`**: the project language the widget's content is in, the requested
  one when the project has it, else the default.

### Changed (server, no update needed)

- **Language tags are matched leniently** on every public read: case-insensitive, and a
  regional tag gets the project's base language, so `pt-BR` reads your `pt` content instead of
  the default language. A tag that matches nothing falls back as before.
- **Help categories fall back to the default language** where a category has no translation,
  one per category, and their counts match the article list.
- **Lists and search show one version of each entry.** With fallback on, an entry translated
  into the requested language no longer appears a second time in the default language, and a
  category's list includes its translated entries.
- **The help chat answers in the visitor's language**: the language of their latest message,
  else the requested one.

## 1.11.1

### Added

- **`WidgetConfig.homeImageUrl`**: an image the project uploaded in the dashboard for the top of
  the widget's Home, shown in place of the accent color. `WidgetBootstrap.project.logoUrl` is now
  set in the project's settings rather than the portal's.

## 1.11.0

### Added

- **`kookee.widget.get({ locale, content })`** reads `GET /v1/widget`: the project's stored chat
  widget settings (`WidgetConfig`) and the content of the widget's Home and Help tabs
  (`WidgetContent`: the newest announcement, recent changelog entries, announcements and blog
  posts, and the most viewed help articles). The request is not counted against the monthly API
  quota. New types: `WidgetBootstrap`, `WidgetConfig`, `WidgetTab`, `WidgetLink`,
  `WidgetContent`, `WidgetNewsItem`, `WidgetNewsType`, `WidgetArticleItem`.

## 1.10.2

### Added

- **`styles/content.css` styles @mentions.** A mention in `contentHtml`
  (`<span data-type="mention">@Name</span>`) renders as a pill instead of plain text. The pill
  has no avatar, since the HTML stores only the name. Theme it with `--kookee-mention-bg` and
  `--kookee-mention-fg`; the default tint comes from the text color, so it also works in a dark
  theme.

## 1.10.1

### Fixed

- **`timeoutMs` now holds when a request carries its own `AbortSignal`.** The signal used to
  replace the timeout, so every request made through the React hooks, which always pass one,
  could wait forever. Now the request stops at whichever comes first: your abort rejects with an
  `AbortError`, the deadline with a `TimeoutError`. The timeout no longer depends on
  `AbortSignal.timeout`, so it also works where that is missing. `help.chat` joins
  `help.chatStream` in never timing out.
- **Leaving a chat stream early cancels it.** A `break` out of `for await`, or an error thrown
  in the loop, now cancels the response body, so the server stops generating an answer nobody
  reads.
- **A typed `getById` no longer returns an entry of another type.** `blog`, `changelog`,
  `announcements`, `help` and `pages` reject with `ENTRY_NOT_FOUND` and status 404 when the id
  belongs to another type, the same error as for an unknown id. They used to return the entry
  and label it with their own type.
- A trailing slash in `baseUrl` no longer produces `//v1/...` and a 404, in the client or the
  consent widget.
- `KookeeApiError.message` names the server's code, for example `ENTRY_NOT_FOUND (HTTP 404)`,
  instead of "Request failed with status 404".
- `entries.export()` stops at an empty page, even when the response has no usable `totalPages`.
- `buildLlmsTxt` escapes `[` and `]` in titles and `(` and `)` in URLs, so a title like
  "Arrays [beta]" no longer breaks its link.

### Added

- `serializeJsonLd(value)` serializes JSON-LD for an inline `<script type="application/ld+json">`
  with `<` escaped. The README used to show `JSON.stringify(seo.jsonLd)` there, which lets a
  `</script>` in an entry's title close the tag and run what follows. Replace it.

### Cookie consent

- **One instance per page.** `initKookeeConsent` returns the same instance on every call, and
  options passed to later calls are ignored. React StrictMode, a remount or the script included
  twice no longer show two banners or record the decision twice.
- **Gated tags run in document order.** After a blocking external script, the next tag waits
  for it to load, for at most 10 seconds. A gated inline snippet that calls the library above
  it no longer runs first and throws.
- **`on()`, `onChange` and `ready` now wait for the gated scripts.** A callback runs once the
  scripts of its category have been activated, so it can call the library they load. `ready`
  resolves once stored consent has been applied that way. `isGranted()` and `get()` still
  reflect a decision immediately.
- Gated tags keep their CSP `nonce`. Browsers hide the attribute's value after parsing, so the
  activated copy used to lose it and be blocked under a nonce-based policy.
- A listener that throws is logged and no longer stops the others.
- The consent cookie is `Secure` on https pages.
- **Banner accessibility.** The banner is a dialog labelled by its title. Each toggle is labelled
  by its category, and each policy link by its service. Keyboard focus on a toggle is visible.
  After "Customize", focus moves to the preferences instead of being lost.

## 1.10.0

No change to this package. Released so the version stays in step with `@kookee/react` 1.10.0.

## 1.9.4

No change to this package. Released so the version stays in step with `@kookee/react` 1.9.4.

## 1.9.3

No change to this package. Released so the version stays in step with `@kookee/react` 1.9.3.

## 1.9.2

### Documentation

No code changes. README corrections:

- Feedback is read-only in the SDK: posting, voting, and commenting happen in the hosted portal.
  The README used to mention anonymous voting, which the SDK has never offered.
- The comment examples render every comment, not only the first, and give each one the
  `kookee-entry-content` class that `styles/content.css` is scoped to.

## 1.9.1

### Documentation

- The README says that `projectId` authenticates only while the project's hosted portal is
  enabled; without the portal the API answers 403 `PORTAL_NOT_ENABLED`. The script-tag example
  uses an API key instead. No code changes.

## 1.9.0

No change to this package. Released so the version stays in step with `@kookee/react` 1.9.0.

## 1.8.4

### Added

- `visibility` (`'public' | 'chatbot_only'`) on every entry response: listings, help search
  results and detail reads. A request with `includeChatbotOnly: true` can now tell which hits
  are chatbot-only. Those have no page on your site, so an assistant should quote them without
  linking them. Without the flag every entry is `'public'`, as before. Requires the matching
  server release.

## 1.8.3

No change to this package. Released so the version stays in step with `@kookee/react` 1.8.3.

## 1.8.2

No change to this package. Released so the version stays in step with `@kookee/react` 1.8.2.

## 1.8.1

No change to this package. Released so the version stays in step with `@kookee/react` 1.8.1.

## 1.8.0

### Added

- `score` on help search results: the cosine similarity of the passage that matched, or `null`
  when the server fell back to text search, whose hits are ordered by publication date rather
  than relevance. A caller that ranks or thresholds results could not tell the two apart before.
- `markdown: true` on entry and help-article detail reads returns `contentMarkdown` beside
  `contentHtml`. Cheaper for a model to read than HTML, and the same rendering the export
  endpoint has always produced.
- `includeChatbotOnly: true` on help search and entry detail reads also returns articles marked
  chatbot-only. Those are unlisted, not secret — the built-in chat already reads them for any
  visitor — so this lets your own assistant read what it reads. Listings, exports, sitemaps and
  `llms.txt` are unaffected.
- `timeoutMs` on the client config aborts any request that outlives it. Node's `fetch` has no
  deadline of its own. A request given its own signal uses that instead, and chat streams are
  never timed out.
- `help.chatStream(params, signal)` and `help.chat(params, signal)` take an `AbortSignal`, like
  every read method. Aborting a stream stops the answer: the request is dropped, the server stops
  generating, and the turn is billed only for what it had already spent.
- A `truncated` chunk on the chat stream, and `truncated` on the non-streaming `HelpChatResponse`,
  carrying why an answer stopped early (`length`, `content_filter` or `tool_rounds`). The server
  used to append an English sentence to the answer itself; the reason now travels beside the text
  so you can word it yourself. Requires the matching server release.

### Fixed

- `HealthCheckResponse` was missing `projectId`, which `health()` has always returned. TypeScript
  consumers had to cast to read it.

## 1.7.0

### Added

- `HelpChatParams.visitor` — `{ id?, email?, name? }` saying who is chatting, on both
  `help.chat()` and `help.chatStream()`. It labels the conversation in the Kookee dashboard,
  where it is shown in the conversation list and matched by its search. Every field is optional
  and capped at 250 characters. The identity is asserted by the caller and never verified, so it
  must not gate anything, and it is not sent to the model — pass what the assistant should know
  in `appContext` instead. Only the streaming endpoint stores a conversation, so that is where it
  is persisted; `help.chat()` accepts and ignores it.

## 1.6.2

### Added

- `HelpChatSource.consulted` on chat `sources` (both `help.chat()` and the `sources` stream
  chunk): `true` when the answer was built on that article's text (a search hit or a
  `get_entry`), `false` when the answer merely linked it out of a listing such as "list all
  articles". The list itself still contains every article the answer links to, so inline
  citations keep resolving; the flag lets a UI decide which of them deserve a "Sources" chip.
  Optional in the type: servers older than 1.6.2 do not send it, and a missing value should be
  read as `true`.

### Changed

- Chat `sources` now lists the articles the answer actually cites, in citation order, rather
  than every article the assistant's searches returned. An answer that cites nothing carries an
  empty list. Fabricated ids the model did not receive from a tool are dropped.

## 1.6.1

### Changed

- Documentation only. The README's consent typing section now leads with the
  `@kookee/sdk/consent` type import and presents the downloadable
  `kookee.dev/consent/latest.d.ts` as the fallback, noting that a downloaded copy is a snapshot
  that does not update when the script does. No code changes.

## 1.6.0

### Added

- SEO helpers, all pure functions that take a `getPath(entry)` function mapping an entry to its
  path on your site: `getEntrySeo` (title, description, canonical, image, `article:*` dates,
  `hreflang` alternates, JSON-LD `Article`), `buildSitemap`, `buildFeed` (RSS 2.0) and
  `buildLlmsTxt` (`llms.txt` / `llms-full.txt`). See the README's "SEO" section.
- `kookee.entries.export({ markdown?, type? })` — every published, public entry of the project
  as slim rows (`GET /v1/entries/export`), optionally with the body as markdown. Follows
  pagination and returns the whole list.
- `excerptText` (plain-text excerpt) on every entry list and detail response.

## 1.5.2

### Fixed

- The consent banner no longer leaks keyboard and paste events to the host page. These events
  are composed, so typing in the banner reached host-page listeners retargeted to the banner
  host, where a "type anywhere" handler could steal the keystroke; they are now stopped at the
  shadow root.

## 1.5.1

### Changed

- Version-only release to stay in lockstep with `@kookee/react` 1.5.1, which fixes the
  `<script>` widget crashing when its `async` tag executes before `<body>` is parsed and adds
  a pre-load command queue stub (the pattern this package's consent script already uses). No
  code changes in this package.

## 1.5.0

### Added

- `HelpChatParams` accepts `page`, `appContext`, `tools`, and `conversationId`.
- `HelpChatContinuationParams` and the `client_tool_call` stream chunk: when the model calls a
  tool the host site registered, the stream ends with an opaque single-use `continuation`
  token and the calls to run; posting the results back resumes the same turn.
- Types: `HelpChatPage`, `HelpChatAppContext`, `HelpChatToolDefinition`, `HelpChatToolResult`,
  `HelpChatClientToolCall`.

### Changed

- `HelpChatStreamChunk` has a new `client_tool_call` variant — exhaustive switches over the
  union need a new case.

## 1.4.1

### Changed

- The consent script is now served at `kookee.dev/consent/latest.js` (replacing
  `consent/v1.js`), with standalone typings for the `KookeeConsent` global at
  `consent/latest.d.ts`. README updated accordingly; no runtime changes.

## 1.4.0

### Changed

- Version-only release to stay in lockstep with `@kookee/react` 1.4.0, which adds the
  `<script>` build of the chat widget. No code changes in this package.

## 1.3.0

### Changed

- Version-only release to stay in lockstep with `@kookee/react` 1.3.0, which adds
  programmatic control of the chat widget (`hideLauncher`, `open` / `onOpenChange`,
  `zIndex`, `offset`). No code changes in this package.

## 1.2.4

### Added

- `@kookee/sdk/consent` — the cookie consent widget. `initKookeeConsent({ apiKey, baseUrl? })`
  loads the project's consent configuration (categories, services, texts, appearance),
  renders the banner and preferences dialog, persists the visitor's choice, and returns a
  `KookeeConsentApi` with `on(category, cb)`, `onChange(cb)`, `isGranted(category)`, `get()`,
  `show()` and `ready` for gating scripts from code. Sends Google Consent Mode updates when
  enabled in the project config.
- `dist/consent.global.js` — the `<script>` build of the same widget, served at
  `kookee.dev/consent/v1.js`. It auto-initializes from the tag's `data-api-key` (and
  optional `data-base-url`) attributes and exposes the API as the `KookeeConsent` global.

### Changed

- Version kept in step with `@kookee/react` 1.2.4.

## 1.2.3

### Fixed

- `styles/content.css` now includes the structural task-list styles
  (`ul[data-type="taskList"]`): checkbox and text on one flex row, list bullets
  suppressed, paragraph margins reset inside items. Previously these rules lived only in
  `styles/typography.css`, so apps following the recommended setup — `content.css` plus
  their own typography system such as Tailwind `prose` — rendered task lists as bulleted
  lines with the checkbox stacked above the text. Loading both stylesheets remains
  harmless.

## 1.2.2

### Changed

- `styles/content.css` now styles file attachment chips (`.sb-file-chip`) rendered in
  `contentHtml`: a pill with a file icon, truncated name, and size label. Themeable via
  the new `--kookee-file-chip-bg`, `--kookee-file-chip-border`, `--kookee-file-chip-fg`,
  `--kookee-file-chip-hover-bg`, and `--kookee-file-chip-muted` custom properties.
  Requires a Kookee backend that emits the chip markup (icon + name + size spans);
  older `contentHtml` renders as a plain chip without icon and size until re-saved.

## 1.2.1

### Changed

- README: the Tailwind section now documents the unlayered code-block guard. `prose`'s
  own `pre` styles and `prose-code:` utilities reach elements inside `.kookee-code-block`
  through the utilities layer, which `layer(components)` cannot defend against — apps
  rendering entry content inside `prose` containers should copy the documented two-rule
  guard. Docs only, no code changes.

## 1.2.0

Entry content styling is now a scoped, framework-agnostic contract: render `contentHtml`
inside an element with the `kookee-entry-content` class and import the stylesheets below.
Nothing outside that class is ever styled.

### Breaking changes

- Removed `styles/code.css` and its `@kookee/sdk/styles/code.css` export. It styled every
  `<code>` element on the page with `!important` rules; its scoped replacement is
  `styles/content.css`. Update the import and make sure the rendered container carries the
  `kookee-entry-content` class (`<EntryContent>` from `@kookee/react` 1.2.0 adds it
  automatically).

  ```diff
  - import '@kookee/sdk/styles/code.css';
  + import '@kookee/sdk/styles/content.css';
  ```

### Added

- `styles/content.css` — code blocks (VS Code Dark+), copy button, language label and
  inline code, scoped under `.kookee-entry-content`, with no `!important`. Themeable via
  `--kookee-code-*` custom properties on `:root` (font, block/header backgrounds,
  inline-code colors). Tailwind v4 apps should import it into a layer so `prose-code:`
  utilities keep winning: `@import '@kookee/sdk/styles/content.css' layer(components);`
- `styles/typography.css` — baseline text styling (headings, lists, task lists, tables,
  images, blockquotes) for apps without their own typography system. Inherits the page's
  font and colors. Tailwind apps keep their `prose` classes and skip this file.
- Both stylesheets are also served next to the script build:
  `https://kookee.dev/sdk/content.css` and `https://kookee.dev/sdk/typography.css`.

## 1.1.0

### Added

- Every read method now accepts an optional `AbortSignal` as its last argument, forwarded to
  `fetch`. Requests can be cancelled when a component unmounts or its inputs change:

  ```ts
  const controller = new AbortController();
  const posts = await kookee.blog.list({ limit: 10 }, controller.signal);
  controller.abort();
  ```

  The signal is a positional parameter, never a field on the params object — params are
  serialized into the query string, so a signal placed there would be sent to the server.

  `help.chat()` and `help.chatStream()` are unchanged; the stream is cancelled by breaking
  out of its iterator.

Fully backward compatible — the parameter is optional everywhere.

## 1.0.0

### Breaking changes

- Removed user identification: `kookee.identify()`, `kookee.reset()`, `kookee.getUser()`, and the `KookeeUser` / `ExternalUser` types. The public API no longer accepts client-asserted identities.
- Removed feedback write methods: `feedback.createPost()`, `feedback.createComment()`, `feedback.listMyPosts()`, `feedback.deletePost()`, `feedback.deleteComment()`, together with their parameter and response types. Feedback authoring now happens in the hosted portal.
- Removed `externalId` from `FeedbackAuthor`.
- Removed `typeSpecific` from changelog and announcement entries, along with the
  `ChangelogTypeSpecific` / `AnnouncementTypeSpecific` types. Entries now carry a
  data-driven `fields` array instead, which also covers user-defined fields.

  Read system fields with the new `fieldOptionKey` / `fieldStringValue` helpers:

  ```ts
  import { fieldOptionKey, fieldStringValue } from '@kookee/sdk';

  // before: entry.typeSpecific.changelogType / .version
  fieldOptionKey(entry.fields, 'changelogType'); // 'feature' | 'fix' | ...
  fieldStringValue(entry.fields, 'version');
  ```

  Option keys are stable across label edits and locales, so prefer them over
  `displayValue` whenever behavior depends on the choice.

All read methods and entry reactions are otherwise unchanged.

## 0.0.47

Last release with public feedback write methods.
