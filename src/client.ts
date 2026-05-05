import { AutomationsResource } from "./resources/automations";
import { ContactsResource } from "./resources/contacts";
import { EmailsResource } from "./resources/emails";
import { SegmentsResource } from "./resources/segments";
import { TopicsResource } from "./resources/topics";
import {
  HttpClient,
  type ParcelWingClientOptions,
} from "./internal/http";

export class ParcelWing {
  readonly emails: EmailsResource;
  readonly contacts: ContactsResource;
  readonly segments: SegmentsResource;
  readonly topics: TopicsResource;
  readonly automations: AutomationsResource;
  readonly http: HttpClient;

  constructor(options: ParcelWingClientOptions) {
    this.http = new HttpClient(options);
    this.emails = new EmailsResource(this.http);
    this.contacts = new ContactsResource(this.http);
    this.segments = new SegmentsResource(this.http);
    this.topics = new TopicsResource(this.http);
    this.automations = new AutomationsResource(this.http);
  }
}

export type { ParcelWingClientOptions } from "./internal/http";
