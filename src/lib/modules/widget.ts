import type { HttpClient } from '../http-client';
import type { WidgetBootstrap } from '../types';

export interface WidgetGetParams {
  locale?: string;
  /**
   * Ask for the Home and Help content although the project's stored tabs do not need it — for
   * a widget whose tabs are set in code. Without it, content comes only when the stored tabs
   * include Home or Help.
   */
  content?: boolean;
}

export class WidgetModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * What the chat widget needs to draw its panel: the project's stored widget settings and the
   * content of its Home and Help tabs. Not counted against the monthly API quota.
   */
  async get(params?: WidgetGetParams, signal?: AbortSignal): Promise<WidgetBootstrap> {
    // Only what changes the answer goes on the wire: the server rejects an empty `locale`, and
    // `content=false` would only split the browser cache.
    const query: { locale?: string; content?: true } = {};
    if (params?.locale) query.locale = params.locale;
    if (params?.content) query.content = true;
    return this.http.get<WidgetBootstrap>('/v1/widget', query, signal);
  }
}
