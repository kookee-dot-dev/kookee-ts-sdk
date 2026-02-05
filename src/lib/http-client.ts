import type { ApiError } from './types';

const DEFAULT_BASE_URL = 'https://api.kookee.dev';
const API_KEY_HEADER = 'Kookee-API-Key';
const PROJECT_ID_HEADER = 'Kookee-Project-Id';

export class KookeeApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'KookeeApiError';
    Object.setPrototypeOf(this, KookeeApiError.prototype);
  }
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly projectId?: string;

  constructor(options: { apiKey?: string; projectId?: string; baseUrl?: string }) {
    this.apiKey = options.apiKey;
    this.projectId = options.projectId;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
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

  async get<T>(path: string, params?: object): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const item of value) {
              url.searchParams.append(key, String(item));
            }
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async *streamPost<T>(path: string, body?: unknown): AsyncIterable<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        Accept: 'text/event-stream',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorData: ApiError | null = null;
      try {
        errorData = (await response.json()) as ApiError;
      } catch {
        // Response body is not JSON
      }
      throw new KookeeApiError(
        errorData?.code ?? 'UNKNOWN_ERROR',
        errorData?.message ?? `Request failed with status ${response.status}`,
        response.status
      );
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
      reader.releaseLock();
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError | null = null;

      try {
        errorData = (await response.json()) as ApiError;
      } catch {
        // Response body is not JSON
      }

      throw new KookeeApiError(
        errorData?.code ?? 'UNKNOWN_ERROR',
        errorData?.message ?? `Request failed with status ${response.status}`,
        response.status
      );
    }

    return response.json() as Promise<T>;
  }
}
