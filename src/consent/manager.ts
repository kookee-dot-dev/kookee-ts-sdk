import { ConsentBanner } from './banner';
import { readStoredConsent, writeStoredConsent } from './cookie';
import { fireConsentModeUpdate } from './consent-mode';
import { activateConsentedScripts } from './gating';
import type {
  ConsentAction,
  ConsentChoices,
  KookeeConsentApi,
  KookeeConsentOptions,
  PublicConsentConfig,
} from './types';

const DEFAULT_BASE_URL = 'https://api.kookee.dev';
const API_KEY_HEADER = 'Kookee-API-Key';

// crypto.randomUUID is unavailable on non-secure origins (plain-HTTP sites).
function generateVisitorId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function whenDomReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
}

export class ConsentManager implements KookeeConsentApi {
  readonly ready: Promise<void>;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private config: PublicConsentConfig | null = null;
  private banner: ConsentBanner | null = null;
  private choices: ConsentChoices = {};
  private decided = false;
  private visitorId = '';
  private grantListeners = new Map<string, Array<() => void>>();
  private changeListeners: Array<(choices: ConsentChoices) => void> = [];

  constructor(options: KookeeConsentOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.ready = new Promise((resolve) => {
      whenDomReady(() => {
        void this.init().finally(resolve);
      });
    });
  }

  on(category: string, callback: () => void): void {
    if (this.decided && this.choices[category]) {
      callback();
      return;
    }
    const listeners = this.grantListeners.get(category) ?? [];
    listeners.push(callback);
    this.grantListeners.set(category, listeners);
  }

  onChange(callback: (choices: ConsentChoices) => void): void {
    this.changeListeners.push(callback);
  }

  isGranted(category: string): boolean {
    return this.decided && Boolean(this.choices[category]);
  }

  get(): ConsentChoices {
    return { ...this.choices };
  }

  show(): void {
    void this.ready.then(() => {
      if (this.config) {
        this.getBanner().showPreferences(this.choices);
      }
    });
  }

  private async init(): Promise<void> {
    const config = await this.fetchConfig();
    if (!config) {
      return;
    }
    this.config = config;

    const { categories } = config.value;
    const onlyRequired = categories.every((category) => category.required);
    if (onlyRequired) {
      // Nothing to consent to: no banner, no cookie, no event.
      this.applyChoices(Object.fromEntries(categories.map((c) => [c.key, true])));
      return;
    }

    const stored = readStoredConsent();
    if (stored && stored.configVersionId === config.configVersionId) {
      this.visitorId = stored.visitorId;
      this.applyChoices(this.normalizeChoices(stored.choices));
      return;
    }

    // First visit, or the published config changed since the stored consent: re-ask.
    this.visitorId = stored?.visitorId ?? generateVisitorId();
    this.getBanner().showBanner();
  }

  private async fetchConfig(): Promise<PublicConsentConfig | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/consent/config`, {
        headers: { [API_KEY_HEADER]: this.apiKey },
      });
      if (!response.ok) {
        return null;
      }
      return (await response.json()) as PublicConsentConfig;
    } catch {
      return null;
    }
  }

  private getBanner(): ConsentBanner {
    if (!this.banner) {
      this.banner = new ConsentBanner(this.config!.value, {
        onAcceptAll: () => this.decide('accept_all', this.choicesWithAll(true)),
        onRejectAll: () => this.decide('reject_all', this.choicesWithAll(false)),
        onSave: (choices) => this.decide('custom', this.normalizeChoices(choices)),
      });
    }
    return this.banner;
  }

  private choicesWithAll(granted: boolean): ConsentChoices {
    const choices: ConsentChoices = {};
    for (const category of this.config!.value.categories) {
      choices[category.key] = category.required || granted;
    }
    return choices;
  }

  private normalizeChoices(choices: ConsentChoices): ConsentChoices {
    const normalized: ConsentChoices = {};
    for (const category of this.config!.value.categories) {
      normalized[category.key] = category.required || Boolean(choices[category.key]);
    }
    return normalized;
  }

  private decide(action: ConsentAction, choices: ConsentChoices): void {
    const config = this.config!;
    const previous = this.decided ? this.choices : null;
    const downgraded = previous ? Object.keys(previous).some((key) => previous[key] && !choices[key]) : false;

    writeStoredConsent({
      v: 1,
      configVersionId: config.configVersionId,
      choices,
      visitorId: this.visitorId,
      ts: Date.now(),
    });

    void this.recordEvent(downgraded ? 'withdraw' : action, choices);

    this.banner?.hide();
    this.banner = null;

    if (downgraded) {
      if (config.value.consentModeEnabled) {
        fireConsentModeUpdate(choices);
      }
      // Already-executed scripts cannot be unloaded; a clean page load is the only
      // honest way to stop them.
      window.location.reload();
      return;
    }

    this.applyChoices(choices);
  }

  private applyChoices(choices: ConsentChoices): void {
    this.choices = choices;
    this.decided = true;

    // Fired here, not in decide(): returning visitors take the stored-cookie path
    // straight to applyChoices, and the snippet's inline "default denied" would
    // otherwise stay in force on every page after the one where they consented.
    if (this.config?.value.consentModeEnabled) {
      fireConsentModeUpdate(choices);
    }

    activateConsentedScripts(choices);

    for (const [category, listeners] of this.grantListeners) {
      if (choices[category]) {
        this.grantListeners.delete(category);
        listeners.forEach((listener) => listener());
      }
    }
    this.changeListeners.forEach((listener) => listener({ ...choices }));
  }

  private async recordEvent(action: ConsentAction, choices: ConsentChoices): Promise<void> {
    const body = JSON.stringify({
      configVersionId: this.config!.configVersionId,
      visitorId: this.visitorId,
      action,
      choices,
    });

    const post = () =>
      fetch(`${this.baseUrl}/v1/consent/events`, {
        method: 'POST',
        headers: { [API_KEY_HEADER]: this.apiKey, 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      });

    try {
      const response = await post();
      if (!response.ok && response.status >= 500) {
        await post();
      }
    } catch {
      try {
        await post();
      } catch {
        // Losing a single consent record must never break the host page.
      }
    }
  }
}

export function initKookeeConsent(options: KookeeConsentOptions): KookeeConsentApi {
  return new ConsentManager(options);
}
