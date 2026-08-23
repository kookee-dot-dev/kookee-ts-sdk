import type { KookeeConsentApi } from './types';

/**
 * Type-only entry for kookee.dev/consent/latest.d.ts: declares the `KookeeConsent` global
 * that consent/latest.js installs, with every referenced type inlined so the file stands alone.
 */
declare global {
  var KookeeConsent: KookeeConsentApi;
  interface Window {
    KookeeConsent: KookeeConsentApi;
  }
}

export type { KookeeConsentApi };
