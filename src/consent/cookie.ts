import type { ConsentChoices } from './types';

const COOKIE_NAME = 'kk_consent';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export interface StoredConsent {
  v: 1;
  configVersionId: string;
  choices: ConsentChoices;
  visitorId: string;
  ts: number;
}

export function readStoredConsent(): StoredConsent | null {
  const match = document.cookie.split('; ').find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1))) as StoredConsent;
    if (
      parsed.v !== 1 ||
      typeof parsed.configVersionId !== 'string' ||
      typeof parsed.visitorId !== 'string' ||
      typeof parsed.choices !== 'object' ||
      parsed.choices === null
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(consent: StoredConsent): void {
  const value = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
}
