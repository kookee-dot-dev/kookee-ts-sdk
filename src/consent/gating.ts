import type { ConsentChoices } from './types';

const SCRIPT_LOAD_TIMEOUT_MS = 10_000;

interface QueuedScript {
  el: HTMLScriptElement;
  placeholder: Comment;
}

/**
 * Activates gated `<script type="text/plain" data-kookee-consent="...">` tags whose
 * category the visitor consented to. Flipping the type attribute never executes a
 * script, so each tag is replaced with a freshly created equivalent element.
 *
 * Tags run in document order: after a blocking external script the next tag waits for
 * its load or error (at most 10 s), so an inline snippet can call the library above it.
 * Resolves once every granted tag has been inserted.
 */
export async function activateConsentedScripts(choices: ConsentChoices): Promise<void> {
  const gated = document.querySelectorAll<HTMLScriptElement>('script[type="text/plain"][data-kookee-consent]');

  // Claimed synchronously, so an overlapping call no longer finds these tags.
  const queue: QueuedScript[] = [];
  gated.forEach((el) => {
    const category = el.getAttribute('data-kookee-consent');
    if (!category || !choices[category]) {
      return;
    }
    const placeholder = document.createComment('kookee-consent');
    el.replaceWith(placeholder);
    queue.push({ el, placeholder });
  });

  for (const { el, placeholder } of queue) {
    const parent = placeholder.parentNode;
    if (!parent) {
      continue;
    }
    const replacement = createReplacement(el);
    // Modern browsers skip nomodule scripts without firing load or error.
    const blocking = el.hasAttribute('src') && !el.hasAttribute('async') && !el.hasAttribute('nomodule');
    const loaded = blocking ? whenLoaded(replacement) : null;
    parent.replaceChild(replacement, placeholder);
    if (loaded) {
      await loaded;
    }
  }
}

function createReplacement(el: HTMLScriptElement): HTMLScriptElement {
  const replacement = document.createElement('script');
  for (const attr of Array.from(el.attributes)) {
    if (attr.name !== 'type' && attr.name !== 'nonce') {
      replacement.setAttribute(attr.name, attr.value);
    }
  }
  // Browsers blank the nonce attribute once the tag is parsed and keep the value only in
  // the property, so copying the attribute would lose it.
  replacement.nonce = el.nonce;
  replacement.type = 'text/javascript';
  if (el.src && !el.hasAttribute('async')) {
    // Dynamically inserted scripts default to async; keep document order among external
    // scripts even when one of them outlives the load timeout.
    replacement.async = false;
  }
  replacement.text = el.text;
  return replacement;
}

function whenLoaded(script: HTMLScriptElement): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      script.removeEventListener('load', done);
      script.removeEventListener('error', done);
      resolve();
    };
    const timer = setTimeout(done, SCRIPT_LOAD_TIMEOUT_MS);
    script.addEventListener('load', done);
    script.addEventListener('error', done);
  });
}
