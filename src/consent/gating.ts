import type { ConsentChoices } from './types';

/**
 * Activates gated `<script type="text/plain" data-kookee-consent="...">` tags whose
 * category the visitor consented to. Flipping the type attribute never executes a
 * script, so each tag is replaced with a freshly created equivalent element.
 */
export function activateConsentedScripts(choices: ConsentChoices): void {
  const gated = document.querySelectorAll<HTMLScriptElement>('script[type="text/plain"][data-kookee-consent]');

  gated.forEach((el) => {
    const category = el.getAttribute('data-kookee-consent');
    if (!category || !choices[category]) {
      return;
    }

    const replacement = document.createElement('script');
    for (const attr of Array.from(el.attributes)) {
      if (attr.name !== 'type') {
        replacement.setAttribute(attr.name, attr.value);
      }
    }
    replacement.type = 'text/javascript';
    if (el.src && !el.hasAttribute('async')) {
      // Dynamically inserted scripts default to async; keep document order so
      // multi-tag snippets (like gtag's two lines) run in sequence.
      replacement.async = false;
    }
    replacement.text = el.text;

    el.parentNode?.replaceChild(replacement, el);
  });
}
