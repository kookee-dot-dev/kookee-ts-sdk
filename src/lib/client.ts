import { HttpClient } from './http-client';
import { BlogModule } from './modules/blog';
import { PagesModule } from './modules/pages';
import type { KookeeConfig } from './types';

export class Kookee {
  private readonly http: HttpClient;

  public readonly blog: BlogModule;
  public readonly pages: PagesModule;

  constructor(config: KookeeConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }

    this.http = new HttpClient(config.apiKey, config.baseUrl);

    this.blog = new BlogModule(this.http);
    this.pages = new PagesModule(this.http);
  }
}
