import type { GetPath, PathEntry } from './types';

export function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function resolveUrl(baseUrl: string, getPath: GetPath, entry: PathEntry): string | null {
  const path = getPath(entry);
  return path === null ? null : joinUrl(baseUrl, path);
}

export function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });
}
