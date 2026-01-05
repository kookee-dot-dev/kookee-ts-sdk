import type { ApiError } from './types';

const DEFAULT_BASE_URL = 'https://api.kookee.dev';
const API_KEY_HEADER = 'Kookee-API-Key';

export class KookeeApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'KookeeApiError';
  }
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl ?? DEFAULT_BASE_URL;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      [API_KEY_HEADER]: this.apiKey,
    };
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
