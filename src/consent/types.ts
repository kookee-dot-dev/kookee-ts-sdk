export interface ConsentService {
  name: string;
  description?: string;
  cookies?: string[];
  policyUrl?: string;
}

export interface ConsentCategory {
  key: string;
  name: string;
  description?: string;
  required: boolean;
  services: ConsentService[];
}

export interface ConsentTexts {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  preferencesTitle: string;
}

export interface ConsentAppearance {
  position: 'bottom' | 'bottom-left' | 'bottom-right';
  theme: 'light' | 'dark' | 'auto';
  accentColor?: string;
}

export interface ConsentConfigValue {
  categories: ConsentCategory[];
  texts: ConsentTexts;
  appearance: ConsentAppearance;
  consentModeEnabled: boolean;
}

export interface PublicConsentConfig {
  configVersionId: string;
  value: ConsentConfigValue;
}

export type ConsentChoices = Record<string, boolean>;

export type ConsentAction = 'accept_all' | 'reject_all' | 'custom' | 'withdraw';

export interface KookeeConsentOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface KookeeConsentApi {
  /**
   * Runs the callback once the category is granted: immediately if the visitor already
   * consented, or right after they do. The reliable way to load gated scripts from code.
   */
  on(category: string, callback: () => void): void;
  /** Runs the callback on every consent change, including withdrawal. */
  onChange(callback: (choices: ConsentChoices) => void): void;
  /** Synchronous check of the current consent state. */
  isGranted(category: string): boolean;
  /** Current choices per category key. Empty before the visitor has decided. */
  get(): ConsentChoices;
  /** Reopens the preferences dialog (for a persistent "Cookie settings" link). */
  show(): void;
  /** Resolves once the widget has loaded its config and applied any stored consent. */
  ready: Promise<void>;
}
