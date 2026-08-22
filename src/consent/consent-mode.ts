import type { ConsentChoices } from './types';

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Fires a Google Consent Mode v2 `update`. The embed snippet is responsible for the
 * inline "default denied" call — an async widget cannot reliably run before gtag.js.
 * Fixed mapping: the `analytics` category drives analytics_storage, `marketing` drives
 * the ad signals.
 */
export function fireConsentModeUpdate(choices: ConsentChoices): void {
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== 'function') {
    w.gtag = function gtag() {
      // gtag.js reads the raw arguments object off the dataLayer; rest args break it.
      w.dataLayer!.push(arguments);
    };
  }

  const state = (granted: boolean) => (granted ? 'granted' : 'denied');

  w.gtag('consent', 'update', {
    analytics_storage: state(Boolean(choices.analytics)),
    ad_storage: state(Boolean(choices.marketing)),
    ad_user_data: state(Boolean(choices.marketing)),
    ad_personalization: state(Boolean(choices.marketing)),
  });
}
