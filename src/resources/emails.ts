import type { HttpClient } from "../internal/http";
import type { EmailSendRequest, ListResponse, QueuedEmail } from "../types";

export class EmailsResource {
  constructor(private readonly http: HttpClient) {}

  async send(input: EmailSendRequest) {
    const response = await this.http.request<ListResponse<QueuedEmail>>(
      "/api/emails",
      {
        method: "POST",
        body: input,
      },
    );

    return response.data;
  }
}
