# Changelog

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
