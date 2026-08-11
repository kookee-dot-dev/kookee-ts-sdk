import { HttpClient } from './http-client';
import { AnnouncementModule } from './modules/announcement';
import { BlogModule } from './modules/blog';
import { ChangelogModule } from './modules/changelog';
import { ConfigModule } from './modules/config';
import { EntriesModule } from './modules/entries';
import { FeedbackModule } from './modules/feedback';
import { HelpModule } from './modules/help';
import { PagesModule } from './modules/pages';
import type { KookeeConfig, HealthCheckResponse } from './types';

export class Kookee {
  private readonly http: HttpClient;

  public readonly entries: EntriesModule;

  public readonly announcements: AnnouncementModule;
  public readonly blog: BlogModule;
  public readonly changelog: ChangelogModule;
  public readonly config: ConfigModule;
  public readonly feedback: FeedbackModule;
  public readonly help: HelpModule;
  public readonly pages: PagesModule;

  constructor(config: KookeeConfig) {
    if (!config.apiKey && !config.projectId) {
      throw new Error('Either apiKey or projectId is required');
    }

    this.http = new HttpClient({ apiKey: config.apiKey, projectId: config.projectId, baseUrl: config.baseUrl });

    this.entries = new EntriesModule(this.http);

    this.announcements = new AnnouncementModule(this.entries);
    this.blog = new BlogModule(this.entries);
    this.changelog = new ChangelogModule(this.entries);
    this.config = new ConfigModule(this.http);
    this.feedback = new FeedbackModule(this.http);
    this.help = new HelpModule(this.http, this.entries);
    this.pages = new PagesModule(this.entries);
  }

  async health(): Promise<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>('/v1/health');
  }
}
