import type { HttpClient } from '../http-client';
import type { PublicProject } from '../types';

export class ProjectModule {
  constructor(private readonly http: HttpClient) {}

  /** The project's name, default language, hosted portal link and whether its widget is set up. */
  async get(signal?: AbortSignal): Promise<PublicProject> {
    return this.http.get<PublicProject>('/v1/project', undefined, signal);
  }
}
