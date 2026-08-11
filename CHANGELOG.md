# Changelog

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
