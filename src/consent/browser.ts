import { initKookeeConsent } from './manager';
import type { KookeeConsentApi } from './types';

/**
 * Entry point for the `<script>` build served at kookee.dev/consent/v1.js.
 *
 * Single default export, deliberately (see ../browser.ts): tsup makes the default export
 * the IIFE global, so `KookeeConsent` on the page IS the initialized API object.
 * Auto-initializes from the script tag's data attributes and replays calls queued by the
 * embed snippet's stub before the bundle loaded.
 */

interface ConsentStub {
  _q?: Array<[string, unknown[]]>;
}

function createInertApi(): KookeeConsentApi {
  return {
    on: () => undefined,
    onChange: () => undefined,
    isGranted: () => false,
    get: () => ({}),
    show: () => undefined,
    ready: Promise.resolve(),
  };
}

function autoInit(): KookeeConsentApi {
  const script = document.currentScript;
  const apiKey = script instanceof HTMLElement ? script.dataset.apiKey : undefined;
  if (!apiKey) {
    console.warn('[kookee-consent] Missing data-api-key attribute on the script tag');
    return createInertApi();
  }
  const baseUrl = script instanceof HTMLElement ? script.dataset.baseUrl : undefined;
  return initKookeeConsent({ apiKey, baseUrl });
}

const api = autoInit();

const stub = (window as Window & { KookeeConsent?: ConsentStub }).KookeeConsent;
if (stub && Array.isArray(stub._q)) {
  for (const [method, args] of stub._q) {
    const fn = (api as unknown as Record<string, unknown>)[method];
    if (typeof fn === 'function') {
      (fn as (...fnArgs: unknown[]) => void).apply(api, args);
    }
  }
}

export default api;
