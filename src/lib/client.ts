import { HttpClient } from './http-client';
import { AnnouncementModule } from './modules/announcement';
import { BlogModule } from './modules/blog';
import { ChangelogModule } from './modules/changelog';
import { ConfigModule } from './modules/config';
import { HelpModule } from './modules/help';
import { PagesModule } from './modules/pages';
import type { KookeeConfig, HealthCheckResponse } from './types';

export class Kookee {
  private readonly http: HttpClient;

  public readonly announcements: AnnouncementModule;
  public readonly blog: BlogModule;
  public readonly changelog: ChangelogModule;
  public readonly config: ConfigModule;
  public readonly help: HelpModule;
  public readonly pages: PagesModule;

  constructor(config: KookeeConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }

    this.http = new HttpClient(config.apiKey, config.baseUrl);

    this.announcements = new AnnouncementModule(this.http);
    this.blog = new BlogModule(this.http);
    this.changelog = new ChangelogModule(this.http);
    this.config = new ConfigModule(this.http);
    this.help = new HelpModule(this.http);
    this.pages = new PagesModule(this.http);
  }

  async health(): Promise<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>('/v1/health');
  }
}
