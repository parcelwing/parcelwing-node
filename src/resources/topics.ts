import type { HttpClient } from "../internal/http";
import { toQueryString } from "../internal/url";
import type {
  DeletionResponse,
  ListResponse,
  ResourceResponse,
  Topic,
  TopicCreateRequest,
  TopicListParams,
  TopicUpdateRequest,
} from "../types";

export class TopicsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: TopicListParams = {}) {
    const query = {
      ...params,
      active:
        params.active === undefined ? undefined : params.active,
    };

    return this.http.request<ListResponse<Topic>>(
      `/api/topics${toQueryString(query)}`,
    );
  }

  async create(input: TopicCreateRequest) {
    const response = await this.http.request<ResourceResponse<"topic", Topic>>(
      "/api/topics",
      {
        method: "POST",
        body: input,
      },
    );

    return response.data;
  }

  async get(id: string) {
    const response = await this.http.request<ResourceResponse<"topic", Topic>>(
      `/api/topics/${encodeURIComponent(id)}`,
    );

    return response.data;
  }

  async update(id: string, input: TopicUpdateRequest) {
    const response = await this.http.request<ResourceResponse<"topic", Topic>>(
      `/api/topics/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: input,
      },
    );

    return response.data;
  }

  delete(id: string) {
    return this.http.request<DeletionResponse<"topic">>(
      `/api/topics/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  }
}
