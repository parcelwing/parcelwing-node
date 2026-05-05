import type { HttpClient } from "../internal/http";
import { toQueryString } from "../internal/url";
import type {
  DeletionResponse,
  ListResponse,
  ResourceResponse,
  Segment,
  SegmentCreateRequest,
  SegmentListParams,
  SegmentUpdateRequest,
} from "../types";

export class SegmentsResource {
  constructor(private readonly http: HttpClient) {}

  list(params: SegmentListParams = {}) {
    const query = {
      ...params,
      active:
        params.active === undefined ? undefined : params.active,
      include_counts:
        params.include_counts === undefined ? undefined : params.include_counts,
    };

    return this.http.request<ListResponse<Segment>>(
      `/api/segments${toQueryString(query)}`,
    );
  }

  async create(input: SegmentCreateRequest) {
    const response = await this.http.request<ResourceResponse<"segment", Segment>>(
      "/api/segments",
      {
        method: "POST",
        body: input,
      },
    );

    return response.data;
  }

  async get(id: string) {
    const response = await this.http.request<ResourceResponse<"segment", Segment>>(
      `/api/segments/${encodeURIComponent(id)}`,
    );

    return response.data;
  }

  async update(id: string, input: SegmentUpdateRequest) {
    const response = await this.http.request<ResourceResponse<"segment", Segment>>(
      `/api/segments/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: input,
      },
    );

    return response.data;
  }

  delete(id: string) {
    return this.http.request<DeletionResponse<"segment">>(
      `/api/segments/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  }
}
