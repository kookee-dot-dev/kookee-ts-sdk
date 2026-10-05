import type { EntryLinkTarget, EntryLinks, GetPath } from './seo/types';

interface Edit {
  start: number;
  end: number;
  text: string;
}

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
// An `<a>` start tag, whose quoted attribute values may hold a `>`, or an `</a>` end tag.
const ANCHOR_TAG = /<a\s(?:[^>"']|"[^"]*"|'[^']*')*>|<\/a\s*>/gi;
const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const ENTRY_ID = new RegExp(`^${UUID}$`, 'i');
const ENTRY_DESTINATION = new RegExp(`\\]\\(entry:(${UUID})\\)`, 'gi');

function entryLinkPath(target: EntryLinkTarget | undefined, getPath: GetPath): string | null {
  if (!target) return null;
  return getPath(target) ?? (target.fallback ? getPath(target.fallback) : null);
}

const escapeAttribute = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// `text` is where tags are found; `source`, the same line before code spans were blanked, is where
// their attributes are read.
function anchorEdits(text: string, links: EntryLinks | undefined, getPath: GetPath, source = text): Edit[] {
  const edits: Edit[] = [];
  let openSpan = false;
  for (const match of text.matchAll(ANCHOR_TAG)) {
    const tag = match[0];
    const start = match.index;
    if (tag[1] === '/') {
      if (openSpan) edits.push({ start, end: start + tag.length, text: '</span>' });
      openSpan = false;
      continue;
    }
    openSpan = false;
    const attributes = source.slice(start + 2, start + tag.length - 1);
    let id: string | null = null;
    let hasHref = false;
    for (const [, name = '', double, single, bare] of attributes.matchAll(ATTRIBUTE)) {
      const key = name.toLowerCase();
      if (key === 'href') hasHref = true;
      if (key === 'data-entry-id') id = double ?? single ?? bare ?? null;
    }
    if (hasHref || id === null || !ENTRY_ID.test(id)) continue;
    id = id.toLowerCase();
    const path = entryLinkPath(links?.[id], getPath);
    if (path === null) {
      edits.push({ start, end: start + tag.length, text: `<span data-entry-id="${id}">` });
      openSpan = true;
    } else {
      edits.push({ start, end: start + tag.length, text: `<a href="${escapeAttribute(path)}"${attributes}>` });
    }
  }
  return edits;
}

function applyEdits(text: string, edits: Edit[]): string {
  if (edits.length === 0) return text;
  let out = '';
  let last = 0;
  for (const edit of edits.sort((a, b) => a.start - b.start)) {
    out += text.slice(last, edit.start) + edit.text;
    last = edit.end;
  }
  return out + text.slice(last);
}

/**
 * Gives each entry link in `html` (`<a data-entry-id>` with no `href`) the path of its target
 * in `links`, through `getPath`, or through the target's default-locale `fallback` when
 * `getPath` returns `null`; `data-entry-id` and the other attributes stay. A link with no path
 * becomes `<span data-entry-id>` around the same content. An anchor that has an `href` is left
 * alone, so resolving twice changes nothing.
 *
 * The SDK does this itself for a client created with `getPath`; this is for HTML from elsewhere.
 */
export function resolveEntryLinks(html: string, links: EntryLinks | undefined, getPath: GetPath): string {
  if (!html.includes('data-entry-id')) return html;
  return applyEdits(html, anchorEdits(html, links, getPath));
}

const isEscaped = (text: string, index: number): boolean => {
  let backslashes = 0;
  while (text[index - 1 - backslashes] === '\\') backslashes += 1;
  return backslashes % 2 === 1;
};

const backtickRun = (text: string, index: number): number => {
  let run = 0;
  while (text[index + run] === '`') run += 1;
  return run;
};

// Code spans blanked out, so the patterns below see only text; positions stay the same.
function maskCodeSpans(line: string): string {
  let masked = '';
  let index = 0;
  while (index < line.length) {
    const char = line[index] ?? '';
    if (char !== '`' || isEscaped(line, index)) {
      masked += char;
      index += 1;
      continue;
    }
    const run = backtickRun(line, index);
    let close = index + run;
    while (close < line.length && backtickRun(line, close) !== run) {
      close += Math.max(1, backtickRun(line, close));
    }
    const end = close < line.length ? close + run : index + run;
    masked += close < line.length ? ' '.repeat(end - index) : line.slice(index, end);
    index = end;
  }
  return masked;
}

function markdownLinkEdits(masked: string, links: EntryLinks | undefined, getPath: GetPath): Edit[] {
  const edits: Edit[] = [];
  for (const match of masked.matchAll(ENTRY_DESTINATION)) {
    const close = match.index;
    if (isEscaped(masked, close)) continue;
    const end = close + match[0].length;
    const path = entryLinkPath(links?.[(match[1] ?? '').toLowerCase()], getPath);
    if (path !== null) {
      edits.push({ start: close, end, text: `](<${path.replace(/[\\<>]/g, '\\$&')}>)` });
      continue;
    }
    let depth = 0;
    for (let index = close - 1; index >= 0; index -= 1) {
      const char = masked[index];
      if ((char !== '[' && char !== ']') || isEscaped(masked, index)) continue;
      if (char === ']') depth += 1;
      else if (depth > 0) depth -= 1;
      else {
        edits.push({ start: index, end: index + 1, text: '' }, { start: close, end, text: '' });
        break;
      }
    }
  }
  return edits;
}

// A line of structural HTML the markdown carries for a block it cannot express. Markdown syntax
// is text there, and so are backticks. A paragraph may start with a button's `<a>` or a `<br>`.
function isHtmlBlock(line: string): boolean {
  const name = /^ {0,3}<\/?([a-z][a-z0-9-]*)/i.exec(line)?.[1]?.toLowerCase();
  return name !== undefined && name !== 'a' && name !== 'br';
}

/**
 * `resolveEntryLinks` for markdown: `[text](entry:<id>)` gets the path of its target as its
 * destination, or is reduced to `text` when it has none, and the `<a data-entry-id>` anchors of
 * button lines and of HTML blocks are resolved as in HTML. Fenced code and code spans are left
 * alone.
 */
export function resolveEntryLinksInMarkdown(markdown: string, links: EntryLinks | undefined, getPath: GetPath): string {
  if (!markdown.includes('entry:') && !markdown.includes('data-entry-id')) return markdown;
  let fence: { char: string; length: number } | null = null;
  return markdown
    .split('\n')
    .map((line) => {
      // Fences inside callouts and list items carry the container's `>` and indent.
      const marker = /^[ >]*(`{3,}|~{3,})(.*)$/.exec(line);
      if (fence) {
        const run = marker?.[1];
        if (run?.[0] === fence.char && run.length >= fence.length && /^\s*$/.test(marker?.[2] ?? '')) fence = null;
        return line;
      }
      if (marker?.[1] && !(marker[1][0] === '`' && marker[2]?.includes('`'))) {
        fence = { char: marker[1][0] ?? '`', length: marker[1].length };
        return line;
      }
      if (isHtmlBlock(line)) return resolveEntryLinks(line, links, getPath);
      const masked = maskCodeSpans(line);
      return applyEdits(line, [
        ...anchorEdits(masked, links, getPath, line),
        ...markdownLinkEdits(masked, links, getPath),
      ]);
    })
    .join('\n');
}
