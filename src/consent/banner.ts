import type { ConsentChoices, ConsentConfigValue } from './types';

export interface BannerCallbacks {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (choices: ConsentChoices) => void;
}

const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; margin: 0; padding: 0; }
.root {
  position: fixed;
  z-index: 2147483000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  --kc-bg: #ffffff;
  --kc-fg: #17181c;
  --kc-muted: #61646b;
  --kc-border: #e4e5e9;
  --kc-accent: #17181c;
  --kc-accent-fg: #ffffff;
}
.root[data-theme='dark'] {
  --kc-bg: #1d1e22;
  --kc-fg: #f4f4f5;
  --kc-muted: #9b9ea6;
  --kc-border: #34353b;
  --kc-accent: #f4f4f5;
  --kc-accent-fg: #17181c;
}
@media (prefers-color-scheme: dark) {
  .root[data-theme='auto'] {
    --kc-bg: #1d1e22;
    --kc-fg: #f4f4f5;
    --kc-muted: #9b9ea6;
    --kc-border: #34353b;
    --kc-accent: #f4f4f5;
    --kc-accent-fg: #17181c;
  }
}
.root[data-position='bottom'] { left: 16px; right: 16px; bottom: 16px; display: flex; justify-content: center; }
.root[data-position='bottom-left'] { left: 16px; bottom: 16px; }
.root[data-position='bottom-right'] { right: 16px; bottom: 16px; }
.card {
  background: var(--kc-bg);
  color: var(--kc-fg);
  border: 1px solid var(--kc-border);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  padding: 20px;
  width: 380px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}
.root[data-position='bottom'] .card { width: 720px; }
.title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.description { color: var(--kc-muted); margin-bottom: 16px; white-space: pre-line; }
.buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.btn {
  flex: 1 1 auto;
  min-width: 100px;
  border: 1px solid var(--kc-border);
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background: var(--kc-bg);
  color: var(--kc-fg);
}
.btn:hover { filter: brightness(0.96); }
.btn-primary {
  background: var(--kc-accent);
  border-color: var(--kc-accent);
  color: var(--kc-accent-fg);
}
.category { border-top: 1px solid var(--kc-border); padding: 12px 0; }
.category-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.category-name { font-weight: 600; }
.category-description { color: var(--kc-muted); margin-top: 4px; }
.services { margin-top: 8px; }
.service { color: var(--kc-muted); font-size: 13px; margin-top: 4px; }
.service a { color: inherit; }
.switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  inset: 0;
  background: var(--kc-border);
  border-radius: 22px;
  cursor: pointer;
  transition: background 0.15s;
}
.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  background: var(--kc-bg);
  transition: transform 0.15s;
}
.switch input:checked + .slider { background: var(--kc-accent); }
.switch input:checked + .slider::before { transform: translateX(18px); }
.switch input:disabled + .slider { opacity: 0.5; cursor: not-allowed; }
`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CONTAINED_EVENTS = ['keydown', 'keypress', 'keyup', 'paste'] as const;

/**
 * Keyboard and paste events are composed: they cross the shadow boundary and reach the host
 * page retargeted to the banner host, so a host-page "type anywhere" handler reads typing in
 * the banner as typing with nothing focused and steals the keystroke. Stop them at the shadow
 * root. Capture-phase listeners on the host page still run; a shadow tree cannot prevent that.
 */
function containKeyboardEvents(root: ShadowRoot): void {
  for (const type of CONTAINED_EVENTS) {
    root.addEventListener(type, (e) => e.stopPropagation());
  }
}

export class ConsentBanner {
  private host: HTMLDivElement | null = null;
  private shadow: ShadowRoot | null = null;

  constructor(
    private readonly config: ConsentConfigValue,
    private readonly callbacks: BannerCallbacks,
  ) {}

  showBanner(): void {
    this.render(this.renderBannerView());
  }

  showPreferences(currentChoices: ConsentChoices): void {
    this.render(this.renderPreferencesView(currentChoices));
  }

  hide(): void {
    this.host?.remove();
    this.host = null;
    this.shadow = null;
  }

  private ensureHost(): ShadowRoot {
    if (this.shadow) {
      return this.shadow;
    }
    this.host = document.createElement('div');
    this.host.setAttribute('data-kookee-consent-banner', '');
    this.shadow = this.host.attachShadow({ mode: 'open' });
    containKeyboardEvents(this.shadow);
    document.body.appendChild(this.host);
    return this.shadow;
  }

  private render(bodyHtml: string): void {
    const shadow = this.ensureHost();
    const { appearance } = this.config;
    // Re-validated here even though the server enforces the same shape: escapeHtml does
    // not neutralize CSS-context injection, so the hex format is the actual defense.
    const accent =
      appearance.accentColor && /^#[0-9a-fA-F]{6}$/.test(appearance.accentColor)
        ? `.root { --kc-accent: ${appearance.accentColor}; --kc-accent-fg: #ffffff; }`
        : '';

    shadow.innerHTML = `
      <style>${STYLES}${accent}</style>
      <div class="root" data-theme="${appearance.theme}" data-position="${appearance.position}">
        <div class="card">${bodyHtml}</div>
      </div>
    `;
    this.bindEvents(shadow);
  }

  private renderBannerView(): string {
    const { texts } = this.config;
    return `
      <div class="title">${escapeHtml(texts.title)}</div>
      <div class="description">${escapeHtml(texts.description)}</div>
      <div class="buttons">
        <button type="button" class="btn btn-primary" data-action="reject">${escapeHtml(texts.rejectAll)}</button>
        <button type="button" class="btn" data-action="customize">${escapeHtml(texts.customize)}</button>
        <button type="button" class="btn btn-primary" data-action="accept">${escapeHtml(texts.acceptAll)}</button>
      </div>
    `;
  }

  private renderPreferencesView(currentChoices: ConsentChoices): string {
    const { texts, categories } = this.config;

    const categoriesHtml = categories
      .map((category) => {
        const checked = category.required || Boolean(currentChoices[category.key]);
        const servicesHtml = category.services
          .map((service) => {
            const cookies = service.cookies?.length ? ` (${service.cookies.map(escapeHtml).join(', ')})` : '';
            // http(s) only: escapeHtml keeps the value inside the attribute, but a
            // javascript: URL would still execute on click.
            const link =
              service.policyUrl && /^https?:\/\//i.test(service.policyUrl)
                ? ` <a href="${escapeHtml(service.policyUrl)}" target="_blank" rel="noopener noreferrer">↗</a>`
                : '';
            const description = service.description ? ` — ${escapeHtml(service.description)}` : '';
            return `<div class="service">${escapeHtml(service.name)}${description}${cookies}${link}</div>`;
          })
          .join('');

        return `
          <div class="category">
            <div class="category-header">
              <span class="category-name">${escapeHtml(category.name)}</span>
              <label class="switch">
                <input type="checkbox" data-category="${escapeHtml(category.key)}"
                  ${checked ? 'checked' : ''} ${category.required ? 'disabled' : ''} />
                <span class="slider"></span>
              </label>
            </div>
            ${category.description ? `<div class="category-description">${escapeHtml(category.description)}</div>` : ''}
            ${servicesHtml ? `<div class="services">${servicesHtml}</div>` : ''}
          </div>
        `;
      })
      .join('');

    return `
      <div class="title">${escapeHtml(texts.preferencesTitle)}</div>
      ${categoriesHtml}
      <div class="buttons" style="margin-top: 16px;">
        <button type="button" class="btn btn-primary" data-action="reject">${escapeHtml(texts.rejectAll)}</button>
        <button type="button" class="btn btn-primary" data-action="save">${escapeHtml(texts.save)}</button>
        <button type="button" class="btn btn-primary" data-action="accept">${escapeHtml(texts.acceptAll)}</button>
      </div>
    `;
  }

  private bindEvents(shadow: ShadowRoot): void {
    shadow.querySelector('[data-action="accept"]')?.addEventListener('click', () => this.callbacks.onAcceptAll());
    shadow.querySelector('[data-action="reject"]')?.addEventListener('click', () => this.callbacks.onRejectAll());
    shadow
      .querySelector('[data-action="customize"]')
      ?.addEventListener('click', () => this.showPreferences(this.collectChoices(shadow)));
    shadow
      .querySelector('[data-action="save"]')
      ?.addEventListener('click', () => this.callbacks.onSave(this.collectChoices(shadow)));
  }

  private collectChoices(shadow: ShadowRoot): ConsentChoices {
    const choices: ConsentChoices = {};
    for (const category of this.config.categories) {
      const input = shadow.querySelector<HTMLInputElement>(`input[data-category="${category.key}"]`);
      choices[category.key] = category.required || Boolean(input?.checked);
    }
    return choices;
  }
}
