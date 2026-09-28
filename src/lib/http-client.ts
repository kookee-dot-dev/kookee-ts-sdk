import type { ApiError } from './types';

const DEFAULT_BASE_URL = 'https://api.kookee.dev';
const API_KEY_HEADER = 'Kookee-API-Key';
const PROJECT_ID_HEADER = 'Kookee-Project-Id';

export class KookeeApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'KookeeApiError';
    Object.setPrototypeOf(this, KookeeApiError.prototype);
  }
}

function timeoutError(): Error {
  if (typeof DOMException === 'function') return new DOMException('The operation timed out.', 'TimeoutError');
  const error = new Error('The operation timed out.');
  error.name = 'TimeoutError';
  return error;
}

async function apiErrorFrom(response: Response): Promise<KookeeApiError> {
  let errorData: ApiError | null = null;
  try {
    errorData = (await response.json()) as ApiError;
  } catch {
    // Response body is not JSON
  }
  // The public API answers with `{ code }` alone, so the message names the code.
  const code = errorData?.code ?? 'UNKNOWN_ERROR';
  return new KookeeApiError(code, errorData?.message ?? `${code} (HTTP ${response.status})`, response.status);
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly projectId?: string;
  private readonly timeoutMs?: number;

  constructor(options: { apiKey?: string; projectId?: string; baseUrl?: string; timeoutMs?: number }) {
    this.apiKey = options.apiKey;
    this.projectId = options.projectId;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs;
  }

  /**
   * One signal that aborts on the caller's signal or at the deadline, whichever comes first.
   * Wired by hand because `AbortSignal.any` and `AbortSignal.timeout` are missing from some
   * browsers the widget still runs in. `done` must run once the body has been read.
   */
  private deadline(signal: AbortSignal | undefined, timed: boolean): { signal?: AbortSignal; done: () => void } {
    if (!timed || !this.timeoutMs) return { signal, done: () => undefined };

    const controller = new AbortController();
    const forward = () => controller.abort(signal?.reason);
    if (signal?.aborted) forward();
    else signal?.addEventListener('abort', forward, { once: true });
    const timer = setTimeout(() => controller.abort(timeoutError()), this.timeoutMs);

    return {
      signal: controller.signal,
      done: () => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', forward);
      },
    };
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers[API_KEY_HEADER] = this.apiKey;
    }
    if (this.projectId) {
      headers[PROJECT_ID_HEADER] = this.projectId;
    }
    return headers;
  }

  async get<T>(path: string, params?: object, signal?: AbortSignal): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const item of value) {
              url.searchParams.append(key, String(item));
            }
          } else if (typeof value === 'object') {
            for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
              if (nestedValue !== undefined && nestedValue !== null) {
                url.searchParams.set(`${key}[${nestedKey}]`, String(nestedValue));
              }
            }
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }

    const request = this.deadline(signal, true);
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
        signal: request.signal,
      });
      return await this.handleResponse<T>(response);
    } finally {
      request.done();
    }
  }

  /** `timeout: false` exempts a request whose answer takes as long as it takes, like a chat reply. */
  async post<T>(path: string, body?: unknown, signal?: AbortSignal, options?: { timeout?: boolean }): Promise<T> {
    const request = this.deadline(signal, options?.timeout ?? true);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: request.signal,
      });
      return await this.handleResponse<T>(response);
    } finally {
      request.done();
    }
  }

  async delete<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async *streamPost<T>(path: string, body?: unknown, signal?: AbortSignal): AsyncIterable<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        Accept: 'text/event-stream',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      throw await apiErrorFrom(response);
    }

    if (!response.body) {
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') return;
            yield JSON.parse(data) as T;
          }
        }
      }
    } finally {
      // A consumer that stops early (a `break`, a throw) must not leave the connection open:
      // the server would keep generating, and billing, an answer nobody reads. A no-op once done.
      await reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw await apiErrorFrom(response);
    }

    return response.json() as Promise<T>;
  }
}
