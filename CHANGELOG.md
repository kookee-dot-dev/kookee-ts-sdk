# Changelog

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
