import type { HttpClient } from '../http-client';
import type { StatusIncidentDetail, StatusPage } from '../types';

export class StatusModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * The project's status page: its components with their 90-day uptime, the open incidents and
   * maintenance, and the incidents of the last 90 days. Not counted against the monthly API quota.
   */
  async get(signal?: AbortSignal): Promise<StatusPage> {
    return this.http.get<StatusPage>('/v1/status', undefined, signal);
  }

  /** One published incident or maintenance with its whole timeline. */
  async getIncident(id: string, signal?: AbortSignal): Promise<StatusIncidentDetail> {
    return this.http.get<StatusIncidentDetail>(`/v1/status/incidents/${encodeURIComponent(id)}`, undefined, signal);
  }
}
