# Changelog

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
