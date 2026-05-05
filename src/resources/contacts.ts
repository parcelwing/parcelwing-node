import type { HttpClient } from "../internal/http";
import { toQueryString } from "../internal/url";
import type {
  BatchCreateContactsResult,
  Contact,
  ContactCreateRequest,
  ContactListParams,
  ContactUpdateRequest,
  DeletionResponse,
  ListResponse,
  ResourceResponse,
} from "../types";

export class ContactsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: ContactListParams = {}) {
    return this.http.request<ListResponse<Contact>>(
      `/api/contacts${toQueryString(params)}`,
    );
  }

  create(input: ContactCreateRequest): Promise<Contact>;
  create(input: ContactCreateRequest[]): Promise<BatchCreateContactsResult["data"]>;
  async create(input: ContactCreateRequest | ContactCreateRequest[]) {
    if (Array.isArray(input)) {
      const response = await this.http.request<BatchCreateContactsResult>(
        "/api/contacts",
        {
          method: "POST",
          body: input,
        },
      );

      return response.data;
    }

    const response = await this.http.request<ResourceResponse<"contact", Contact>>(
      "/api/contacts",
      {
        method: "POST",
        body: input,
      },
    );

    return response.data;
  }

  async get(id: string) {
    const response = await this.http.request<ResourceResponse<"contact", Contact>>(
      `/api/contacts/${encodeURIComponent(id)}`,
    );

    return response.data;
  }

  async update(id: string, input: ContactUpdateRequest) {
    const response = await this.http.request<ResourceResponse<"contact", Contact>>(
      `/api/contacts/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: input,
      },
    );

    return response.data;
  }

  delete(id: string) {
    return this.http.request<DeletionResponse<"contact">>(
      `/api/contacts/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  }
}
