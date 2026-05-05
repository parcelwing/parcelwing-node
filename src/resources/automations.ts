import type { HttpClient } from "../internal/http";
import type {
  AutomationEvent,
  AutomationTrackRequest,
  ResourceResponse,
} from "../types";

export class AutomationsResource {
  constructor(private readonly http: HttpClient) {}

  async track(input: AutomationTrackRequest) {
    const response = await this.http.request<
      ResourceResponse<"automation_event", AutomationEvent>
    >("/api/automations/events", {
      method: "POST",
      body: input,
    });

    return response.data;
  }
}
