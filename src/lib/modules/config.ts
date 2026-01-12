import type { HttpClient } from '../http-client';
import type { PublicConfig } from '../types';

export interface ConfigListParams {
  keys?: string[];
}

export class ConfigModule {
  constructor(private readonly http: HttpClient) {}

  async getByKey(key: string): Promise<PublicConfig> {
    return this.http.get<PublicConfig>(`/v1/config/${encodeURIComponent(key)}`);
  }

  async list(params?: ConfigListParams): Promise<PublicConfig[]> {
    return this.http.get<PublicConfig[]>('/v1/config', params);
  }
}
